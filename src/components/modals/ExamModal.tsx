import React, { useState, useEffect } from 'react';
import { Exam, ExamHistoryItem } from '../../types';
import { scoreExam, ExamScoreResult, dayKey } from '../../utils/core';
import { speak } from '../../utils/tts';
import { SoundFX } from '../../utils/audioFx';

interface ExamModalProps {
  exam: Exam;
  audioEnabled: boolean;
  onSaveResult: (result: ExamHistoryItem) => void;
  onClose: () => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  exam,
  audioEnabled,
  onSaveResult,
  onClose
}) => {
  const [qIndex, setQIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, boolean | number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(exam.durationMinutes * 60);
  const [result, setResult] = useState<ExamScoreResult | null>(null);

  // Gong on exam start
  useEffect(() => {
    SoundFX.gong();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [result]);

  const currentQ = exam.questions[qIndex];
  const totalQ = exam.questions.length;
  const currentAns = currentQ ? answers[currentQ.id] : undefined;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  function handleJudge(val: boolean) {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
    SoundFX.tap();
  }

  function handleChoice(optIdx: number) {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
    SoundFX.tap();
  }

  function handleSubmit() {
    const res = scoreExam(exam, answers);
    setResult(res);

    if (res.passed) {
      SoundFX.zenBell();
    } else {
      SoundFX.wrong();
    }

    const histItem: ExamHistoryItem = {
      date: dayKey(),
      score: res.totalScore,
      lScore: res.listeningScore,
      rScore: res.readingScore,
      passed: res.passed,
      accuracy: res.accuracy
    };
    onSaveResult(histItem);
  }

  function handleRetake() {
    setQIndex(0);
    setAnswers({});
    setTimeLeft(exam.durationMinutes * 60);
    setResult(null);
    SoundFX.gong();
  }

  if (result) {
    const passClass = result.passed ? 'score-pass' : 'score-fail';
    const passTitle = result.passed ? 'CHÚC MỪNG: BẠN ĐÃ ĐỖ (合格)!' : 'CẦN CỐ GẮNG THÊM (不合格)';
    const passNote = result.passed
      ? 'Bạn đã hoàn thành xuất sắc bài thi thử HSK theo chuẩn mới.'
      : 'Điểm chuẩn đỗ là 120/200 điểm. Hãy ôn tập lại các từ chưa thuộc và làm lại nhé.';

    return (
      <section id="exam-session" className="session exam-session" aria-live="polite">
        <div className="exam-result-view">
          <div className="exam-score-banner">
            <div className="eyebrow">Kết quả {exam.title}</div>
            <h2 className={passClass} style={{ margin: '6px 0 10px' }}>
              {passTitle}
            </h2>
            <div className={`exam-score-num ${passClass}`}>
              {result.totalScore}{' '}
              <span style={{ fontSize: 20, fontWeight: 'normal', color: 'var(--muted)' }}>
                / 200 điểm
              </span>
            </div>
            <div className="muted small">{passNote}</div>
            <div className="exam-score-breakdown">
              <div>
                <span>Phần Nghe</span>
                <b>{result.listeningScore}/100</b>
              </div>
              <div>
                <span>Phần Đọc</span>
                <b>{result.readingScore}/100</b>
              </div>
              <div>
                <span>Độ chính xác</span>
                <b>{result.accuracy}%</b>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
              <button className="btn primary" onClick={handleRetake}>
                Thi lại bài này
              </button>
              <button className="btn ghost" onClick={onClose}>
                Đóng &amp; Về trang chủ
              </button>
            </div>
          </div>

          <h3 style={{ textAlign: 'left', margin: '24px 0 14px' }}>
            Chi tiết đáp án &amp; Giải thích ({totalQ} câu)
          </h3>

          <div style={{ display: 'grid', gap: 12 }}>
            {result.details.map((d, i) => {
              const q = exam.questions[i];
              const statusIcon = d.isCorrect ? '✅ Đúng' : '❌ Sai';
              const statusCls = d.isCorrect ? 'correct' : 'wrong';

              const yourAnsText =
                d.userAnswer === undefined
                  ? 'Chưa trả lời'
                  : q.type === 'judge'
                  ? d.userAnswer
                    ? 'Đúng'
                    : 'Sai'
                  : q.options ? q.options[d.userAnswer as number] : '';

              const correctAnsText =
                q.type === 'judge'
                  ? q.correct
                    ? 'Đúng'
                    : 'Sai'
                  : q.options ? q.options[q.correct as number] : '';

              return (
                <div key={i} className={`exam-review-item ${statusCls}`}>
                  <div className="row-between">
                    <b>
                      Câu {d.id} ({d.section === 'listening' ? 'Nghe' : 'Đọc'})
                    </b>
                    <span className="small" style={{ fontWeight: 600 }}>
                      {statusIcon}
                    </span>
                  </div>
                  <div className="small" style={{ margin: '6px 0' }}>
                    Đáp án của bạn: <span style={{ fontWeight: 500 }}>{yourAnsText}</span> · Đáp án đúng:{' '}
                    <b style={{ color: 'var(--jade)' }}>{correctAnsText}</b>
                  </div>
                  <div className="small muted" style={{ lineHeight: 1.45 }}>
                    {d.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20 }}>
            <button className="btn primary wide" onClick={onClose}>
              Đóng &amp; Quay lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  const secName = currentQ?.section === 'listening' ? 'Phần 1: Nghe hiểu (听力)' : 'Phần 2: Đọc hiểu (阅读)';

  return (
    <section id="exam-session" className="session exam-session" aria-live="polite">
      {/* Top bar with timer */}
      <div className="exam-topbar">
        <button
          className="icon-btn"
          onClick={() => {
            if (confirm('Bạn có chắc muốn thoát phòng thi? Tiến độ bài thi này sẽ không được lưu.')) {
              onClose();
            }
          }}
          aria-label="Thoát bài thi"
        >
          ✕
        </button>
        <div className={`exam-timer ${timeLeft <= 300 ? 'danger' : ''}`}>
          ⏱️ <span>{timeStr}</span>
        </div>
        <button
          className="btn primary"
          onClick={handleSubmit}
          style={{ padding: '6px 14px', fontSize: 13 }}
        >
          Nộp bài
        </button>
      </div>

      {/* 1..N Question Jump Palette */}
      <div className="exam-palette">
        {exam.questions.map((itemQ, idx) => {
          const isAns = answers[itemQ.id] !== undefined;
          const isAct = idx === qIndex;
          return (
            <button
              key={itemQ.id}
              className={`exam-p-item ${isAns ? 'answered' : ''} ${isAct ? 'active' : ''}`}
              onClick={() => setQIndex(idx)}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main question box */}
      <div className="exam-container">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <span className="exam-section-badge">{secName}</span>
          <span className="exam-progress-num">
            Câu {qIndex + 1} / {totalQ}
          </span>
        </div>

        {currentQ && (
          <div className="exam-q-box">
            {currentQ.audio && (
              <button
                className="exam-audio-btn"
                onClick={() => speak(currentQ.audio!, 0.85, audioEnabled)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9v6h4l5 4V5L8 9z"/>
                  <path d="M17 8a5 5 0 0 1 0 8"/>
                </svg>
                <span>🔊 Bấm để nghe phát âm (zh-CN)</span>
              </button>
            )}

            {currentQ.type === 'judge' ? (
              <>
                <div className="center" style={{ margin: '10px 0 20px' }}>
                  <div style={{ fontSize: 32, fontFamily: 'var(--serif)', fontWeight: 600, marginBottom: 6 }}>
                    {currentQ.prompt}
                  </div>
                  {currentQ.pinyin && <div className="muted small" style={{ marginBottom: 4 }}>[{currentQ.pinyin}]</div>}
                  {currentQ.meaningPrompt && (
                    <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>
                      Nghĩa: {currentQ.meaningPrompt}
                    </div>
                  )}
                </div>
                <div className="judge-opts">
                  <button
                    className={`judge-btn true ${currentAns === true ? 'selected' : ''}`}
                    onClick={() => handleJudge(true)}
                  >
                    ✓ Đúng
                  </button>
                  <button
                    className={`judge-btn false ${currentAns === false ? 'selected' : ''}`}
                    onClick={() => handleJudge(false)}
                  >
                    ✗ Sai
                  </button>
                </div>
              </>
            ) : (
              <>
                {currentQ.question && <div className="exam-q-text">{currentQ.question}</div>}
                <div className="exam-options-list">
                  {currentQ.options?.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      className={`exam-opt ${currentAns === optIdx ? 'selected' : ''}`}
                      onClick={() => handleChoice(optIdx)}
                    >
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Navigation bottom bar */}
        <div className="exam-nav-bar">
          <button
            className="btn ghost"
            onClick={() => setQIndex((i) => Math.max(0, i - 1))}
            disabled={qIndex === 0}
            style={{ opacity: qIndex === 0 ? 0.4 : 1 }}
          >
            ← Câu trước
          </button>
          {qIndex < totalQ - 1 ? (
            <button className="btn primary" onClick={() => setQIndex((i) => i + 1)}>
              Câu sau →
            </button>
          ) : (
            <button className="btn primary" onClick={handleSubmit}>
              Hoàn tất &amp; Nộp bài
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
