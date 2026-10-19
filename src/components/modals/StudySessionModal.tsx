import React, { useState, useEffect } from 'react';
import { Word, Card } from '../../types';
import { grade, syllables, toneOf, newCard } from '../../utils/core';
import { speak } from '../../utils/tts';
import { SoundFX } from '../../utils/audioFx';
import { HanLoSpeech } from '../../utils/speech';
import { renderPinyinElements } from '../views/DictView';

interface StudySessionModalProps {
  mode: 'learn' | 'review';
  words: Word[];
  allWords: Word[];
  cards: Record<number, Card>;
  showPinyin: boolean;
  audioEnabled: boolean;
  onUpdateCard: (wordId: number, newCardData: Card, correct: boolean) => void;
  onClose: () => void;
  onOpenWriter: (char: string) => void;
}

interface QuizData {
  type: 'vi' | 'hz' | 'py' | 'audio';
  field: 'vi' | 'h' | 'p';
  options: Word[];
  answer: number;
}

export const StudySessionModal: React.FC<StudySessionModalProps> = ({
  mode,
  words,
  allWords,
  cards,
  showPinyin,
  audioEnabled,
  onUpdateCard,
  onClose,
  onOpenWriter
}) => {
  const [index, setIndex] = useState<number>(0);
  const [step, setStep] = useState<'intro' | 'quiz' | 'summary'>(mode === 'learn' ? 'intro' : 'quiz');
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [picked, setPicked] = useState<number>(-1);
  const [answered, setAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [micStatus, setMicStatus] = useState<string>('');

  const currentWord = words[index];

  // Generate quiz options
  const generateQuiz = (w: Word, forcedType?: 'vi' | 'hz' | 'py' | 'audio'): QuizData => {
    const types: ('vi' | 'hz' | 'py' | 'audio')[] = showPinyin
      ? ['vi', 'hz', 'py', 'audio']
      : ['vi', 'hz', 'audio'];
    const type = forcedType || types[Math.floor(Math.random() * types.length)];
    const field: 'vi' | 'h' | 'p' = type === 'vi' ? 'vi' : type === 'py' ? 'p' : 'h';

    const pool = allWords.filter((item) => item.id !== w.id && item[field] !== w[field]);
    // Shuffle pool
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const options = [w, ...shuffledPool.slice(0, 3)].sort(() => 0.5 - Math.random());
    const answer = options.findIndex((item) => item.id === w.id);

    return { type, field, options, answer };
  };

  useEffect(() => {
    if (index >= words.length) {
      setStep('summary');
      SoundFX.zenBell();
      return;
    }

    if (mode === 'learn') {
      setStep('intro');
      setAnswered(false);
      setPicked(-1);
      setQuiz(null);
      setMicStatus('');
      // Auto play TTS on word intro
      speak(words[index].h, 0.82, audioEnabled);
    } else {
      setStep('quiz');
      setAnswered(false);
      setPicked(-1);
      setMicStatus('');
      const q = generateQuiz(words[index]);
      setQuiz(q);
      if (q.type === 'audio') {
        speak(words[index].h, 0.82, audioEnabled);
      }
    }
  }, [index, mode]);

  function handleIntroContinue() {
    setStep('quiz');
    const q = generateQuiz(currentWord, Math.random() < 0.5 ? 'vi' : 'hz');
    setQuiz(q);
    if (q.type === 'audio') {
      speak(currentWord.h, 0.82, audioEnabled);
    }
  }

  function handleAnswer(choiceIdx: number) {
    if (answered || !quiz) return;
    const isCorrect = choiceIdx === quiz.answer;
    setPicked(choiceIdx);
    setAnswered(true);

    const oldCard = cards[currentWord.id] || newCard();
    const qRating = mode === 'learn' ? (isCorrect ? 4 : 2) : (isCorrect ? 5 : 2);
    const updatedCard = grade(oldCard, qRating, Date.now());

    onUpdateCard(currentWord.id, updatedCard, isCorrect);

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      SoundFX.correct();
    } else {
      SoundFX.wrong();
    }

    speak(currentWord.h, 0.82, audioEnabled);
  }

  function handleNext() {
    setIndex((prev) => prev + 1);
  }

  function handleMicTest() {
    if (!HanLoSpeech.isSupported) {
      setMicStatus('Trình duyệt không hỗ trợ Web Speech API.');
      return;
    }
    setMicStatus('🔴 Đang lắng nghe... Hãy đọc chữ Hán!');
    SoundFX.tap();
    HanLoSpeech.startListening(
      currentWord.h,
      (res) => {
        const color = res.score >= 80 ? 'var(--jade)' : res.score >= 50 ? 'var(--amber)' : 'var(--red)';
        setMicStatus(`Bạn đọc: ${res.text || '(chưa rõ)'} · Điểm: ${res.score}% (${res.grade})`);
        if (res.score >= 80) SoundFX.bell();
        else if (res.score >= 50) SoundFX.tap();
        else SoundFX.wrong();
      },
      (err) => {
        setMicStatus(`Nhận diện: ${err}`);
      }
    );
  }

  const progressPct = words.length ? (index / words.length) * 100 : 0;

  return (
    <section id="session" className="session" aria-live="polite">
      {/* Session Top Bar */}
      {step !== 'summary' && (
        <div className="session-top">
          <button className="icon-btn" onClick={onClose} aria-label="Thoát">
            ✕
          </button>
          <div className="bar slim">
            <i style={{ width: `${progressPct}%` }}></i>
          </div>
          <span>
            {index + 1}/{words.length}
          </span>
        </div>
      )}

      {/* Step 1: Intro Card (Learn mode) */}
      {step === 'intro' && currentWord && (
        <div className="card study">
          <p className="eyebrow">
            {currentWord.lesson ? `Bài ${currentWord.lesson} · ` : ''}Từ mới
          </p>
          <div className="hanzi">{currentWord.h}</div>
          {showPinyin && (
            <div className="pinyin-line">{renderPinyinElements(currentWord.p)}</div>
          )}
          <p className="hv-line">
            Hán–Việt: <b>{currentWord.hv}</b>
          </p>
          <p className="meaning">{currentWord.vi}</p>

          {/* Character breakdown for multi-char words */}
          {Array.from(currentWord.h).length > 0 && (
            <div className="card-breakdown-box" style={{ marginTop: 12 }}>
              <div className="row-between" style={{ marginBottom: 6 }}>
                <b className="small" style={{ color: 'var(--ink)' }}>
                  Đi nét &amp; Âm tiết từng chữ:
                </b>
                <span className="muted small">
                  {Array.from(currentWord.h).length} chữ Hán
                </span>
              </div>
              <div className="char-breakdown-grid">
                {Array.from(currentWord.h).map((ch, cIdx) => {
                  const syls = syllables(currentWord.p);
                  const s = syls[cIdx] || '';
                  const t = s ? toneOf(s) : 0;
                  const tName = t === 0 ? 'Thanh nhẹ' : `Thanh ${t}`;
                  return (
                    <div key={cIdx} className="char-breakdown-item">
                      <div className="cbi-top">
                        <span className="cbi-char">{ch}</span>
                        <div className="cbi-meta">
                          {s && <span className={`cbi-py t${t}`}>{s}</span>}
                          <span className="cbi-tone-badge">{tName}</span>
                        </div>
                      </div>
                      <div className="cbi-actions">
                        <button
                          className="btn ghost small cbi-stroke-btn"
                          onClick={() => onOpenWriter(ch)}
                        >
                          ✍️ Đi nét
                        </button>
                        <button
                          className="icon-btn small"
                          onClick={() => speak(ch, 0.82, audioEnabled)}
                          title={`Nghe âm chữ ${ch}`}
                        >
                          🔊
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button
              className="btn ghost say-btn"
              onClick={() => speak(currentWord.h, 0.82, audioEnabled)}
              style={{ flex: 1 }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9v6h4l5 4V5L8 9z"/>
                <path d="M17 8a5 5 0 0 1 0 8"/>
              </svg>{' '}
              Nghe phát âm
            </button>
            <button
              className="btn ghost say-btn"
              onClick={handleMicTest}
              style={{ flex: 1 }}
            >
              🎙️ Luyện nói AI
            </button>
          </div>
          {micStatus && (
            <div className="small center muted" style={{ marginTop: 8 }}>
              {micStatus}
            </div>
          )}

          <button
            className="btn primary wide"
            onClick={handleIntroContinue}
            style={{ marginTop: 14 }}
          >
            Đã hiểu → Kiểm tra
          </button>
        </div>
      )}

      {/* Step 2: Quiz Card */}
      {step === 'quiz' && quiz && currentWord && (
        <>
          <div className="card quiz-card">
            <p className="eyebrow">
              {mode === 'learn' ? 'Kiểm tra nhanh' : 'Ôn tập'}
            </p>

            {quiz.type === 'vi' ? (
              <div className="hanzi">{currentWord.h}</div>
            ) : quiz.type === 'py' ? (
              <>
                <div className="hanzi">{currentWord.h}</div>
                <p className="muted small center">Chọn pinyin đúng</p>
              </>
            ) : quiz.type === 'hz' ? (
              <>
                <p className="eyebrow">Nghĩa</p>
                <div className="meaning big">{currentWord.vi}</div>
              </>
            ) : (
              <>
                <p className="eyebrow">Nghe và chọn chữ Hán</p>
                <button
                  className="audio-big"
                  onClick={() => speak(currentWord.h, 0.82, audioEnabled)}
                  aria-label="Nghe lại"
                >
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 9v6h4l5 4V5L8 9z"/>
                    <path d="M17 8a5 5 0 0 1 0 8"/>
                    <path d="M20 5a9 9 0 0 1 0 14"/>
                  </svg>
                </button>
              </>
            )}

            <div className="options">
              {quiz.options.map((opt, i) => {
                let cls = 'option';
                if (answered) {
                  if (i === quiz.answer) cls += ' correct';
                  else if (i === picked) cls += ' wrong';
                }

                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                  >
                    {quiz.field === 'h' ? (
                      <span className="opt-hz">{opt.h}</span>
                    ) : quiz.field === 'p' ? (
                      renderPinyinElements(opt.p)
                    ) : (
                      opt.vi
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback banner */}
          {answered && (
            <div className={`feedback ${picked === quiz.answer ? 'ok' : 'bad'}`}>
              <p className="fb-title">
                {picked === quiz.answer ? 'Chính xác' : 'Chưa đúng'}
              </p>
              <div className="fb-word">
                <span className="hanzi-sm">{currentWord.h}</span>
                <span className="fb-py">{renderPinyinElements(currentWord.p)}</span>
              </div>
              <p className="fb-vi">
                <b>{currentWord.hv}</b> · {currentWord.vi}
              </p>
              <button className="btn primary wide" onClick={handleNext}>
                Tiếp tục
              </button>
            </div>
          )}
        </>
      )}

      {/* Step 3: Summary Completion */}
      {step === 'summary' && (
        <div className="summary">
          <div className="summary-badge">
            {words.length && Math.round((correctCount / words.length) * 100) >= 80 ? '🎉' : '💪'}
          </div>
          <h2>
            {mode === 'learn'
              ? `Học xong ${words.length} từ`
              : `Ôn xong ${words.length} từ`}
          </h2>
          <p className="muted">
            {words.length && Math.round((correctCount / words.length) * 100) >= 80
              ? 'Rất tốt, giữ nhịp này nhé.'
              : 'Không sao, từ khó sẽ quay lại sớm theo chu kỳ SM-2.'}
          </p>

          <div className="summary-stats">
            <div>
              <b>
                {correctCount}/{words.length}
              </b>
              <span>đúng</span>
            </div>
            <div>
              <b>
                {words.length ? Math.round((correctCount / words.length) * 100) : 0}%
              </b>
              <span>chính xác</span>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button className="btn primary wide" onClick={onClose}>
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
