import React, { useState, useMemo } from 'react';
import { ALL_WORDS } from '../../data/words';
import { Word } from '../../types';
import {
  GridType,
  GeneratedQuiz,
  GeneratedQuizQuestion,
  generateQuiz
} from '../../data/worksheets';
import { speak } from '../../utils/tts';

interface WorksheetViewProps {
  audioEnabled: boolean;
}

export const WorksheetView: React.FC<WorksheetViewProps> = ({ audioEnabled }) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'quiz'>('grid');

  // --- WORKSHEET GRID STATE ---
  const [levelFilter, setLevelFilter] = useState<number>(1);
  const [lessonFilter, setLessonFilter] = useState<number>(1);
  const [customChars, setCustomChars] = useState<string>('');
  const [gridType, setGridType] = useState<GridType>('mizige');
  const [rowsPerChar, setRowsPerChar] = useState<number>(1);
  const [tracingCells, setTracingCells] = useState<number>(3); // How many faded characters to trace
  const [showPinyinHeader, setShowPinyinHeader] = useState<boolean>(true);

  // --- QUIZ GENERATOR STATE ---
  const [quizLevel, setQuizLevel] = useState<number | 'mixed'>(1);
  const [quizCount, setQuizCount] = useState<number>(15);
  const [quiz, setQuiz] = useState<GeneratedQuiz>(() => generateQuiz(1, 15));
  const [quizMode, setQuizMode] = useState<'interactive' | 'print'>('interactive');
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Words selected for worksheet
  const selectedWords: Word[] = useMemo(() => {
    if (customChars.trim().length > 0) {
      const chars = Array.from(new Set(Array.from(customChars.replace(/\s+/g, ''))));
      return chars.map((ch, idx) => {
        const found = ALL_WORDS.find((w) => w.h.includes(ch));
        return (
          found || {
            id: 9990 + idx,
            level: 1,
            h: ch,
            p: '',
            hv: '',
            vi: ''
          }
        );
      });
    }

    const lvlWords = ALL_WORDS.filter((w) => w.level === levelFilter);
    const startIdx = (lessonFilter - 1) * 10;
    return lvlWords.slice(startIdx, startIdx + 8);
  }, [customChars, levelFilter, lessonFilter]);

  // Generate a new quiz
  const handleRegenerateQuiz = () => {
    const newQ = generateQuiz(quizLevel, quizCount);
    setQuiz(newQ);
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  // Submit interactive quiz
  const handleAnswerSelect = (questionId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    });
    return {
      correct,
      total: quiz.questions.length,
      pct: Math.round((correct / quiz.questions.length) * 100)
    };
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="view worksheet-container" style={{ maxWidth: 900, margin: '0 auto', padding: '16px' }}>
      {/* Top Header & Mode Switcher (Hidden in Print) */}
      <section className="card no-print" style={{ marginBottom: 16 }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📄</span> Trình Tạo Đề Thi &amp; Phiếu Bài Tập In Ấn
            </h2>
            <p className="muted small" style={{ margin: '4px 0 0' }}>
              Xuất file PDF / In khổ A4 chuẩn: Phiếu luyện viết Mễ Tự Cách &amp; Đề thi trắc nghiệm từ vựng
            </p>
          </div>

          <div style={{ display: 'flex', gap: 6, backgroundColor: 'var(--bg-subtle, rgba(0,0,0,0.04))', padding: 4, borderRadius: 8 }}>
            <button
              className={`btn small ${activeTab === 'grid' ? 'primary' : 'ghost'}`}
              onClick={() => setActiveTab('grid')}
            >
              ✍️ Phiếu Tập Viết Ô Mễ
            </button>
            <button
              className={`btn small ${activeTab === 'quiz' ? 'primary' : 'ghost'}`}
              onClick={() => setActiveTab('quiz')}
            >
              📝 Tạo Đề Kiểm Tra A4
            </button>
          </div>
        </div>

        {/* Tab 1 Controls: Worksheet Grid */}
        {activeTab === 'grid' && (
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              {/* Level & Lesson Selector */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="muted small">Cấp độ:</span>
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    className={`btn small ${levelFilter === lvl && !customChars ? 'primary' : 'ghost'}`}
                    onClick={() => {
                      setLevelFilter(lvl);
                      setCustomChars('');
                    }}
                  >
                    HSK {lvl}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="muted small">Bài:</span>
                <select
                  className="input"
                  value={lessonFilter}
                  onChange={(e) => {
                    setLessonFilter(Number(e.target.value));
                    setCustomChars('');
                  }}
                  style={{ padding: '4px 8px', fontSize: 13 }}
                >
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      Bài {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid Type Selector */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="muted small">Lưới:</span>
                <button
                  className={`btn small ${gridType === 'mizige' ? 'primary' : 'ghost'}`}
                  onClick={() => setGridType('mizige')}
                >
                  Ô Mễ (米)
                </button>
                <button
                  className={`btn small ${gridType === 'tianzige' ? 'primary' : 'ghost'}`}
                  onClick={() => setGridType('tianzige')}
                >
                  Ô Điền (田)
                </button>
              </div>

              {/* Tracing Options */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="muted small">Ô tô nét:</span>
                <select
                  className="input"
                  value={tracingCells}
                  onChange={(e) => setTracingCells(Number(e.target.value))}
                  style={{ padding: '4px 8px', fontSize: 13 }}
                >
                  <option value={1}>1 ô</option>
                  <option value={2}>2 ô</option>
                  <option value={3}>3 ô</option>
                  <option value={4}>4 ô</option>
                  <option value={0}>Không tô</option>
                </select>
              </div>

              {/* Action Button: Print */}
              <button
                className="btn primary"
                onClick={handlePrint}
                style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>🖨️</span> In Phiếu / Xuất PDF A4
              </button>
            </div>

            {/* Custom Input Option */}
            <div style={{ marginTop: 12 }}>
              <input
                type="text"
                className="input"
                placeholder="Hoặc tự gõ danh sách chữ Hán cần in (Ví dụ: 你好朋友中国学)..."
                value={customChars}
                onChange={(e) => setCustomChars(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', fontSize: 13 }}
              />
            </div>
          </div>
        )}

        {/* Tab 2 Controls: Quiz Generator */}
        {activeTab === 'quiz' && (
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="muted small">Cấp độ:</span>
                {([1, 2, 3, 'mixed'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    className={`btn small ${quizLevel === lvl ? 'primary' : 'ghost'}`}
                    onClick={() => setQuizLevel(lvl)}
                  >
                    {lvl === 'mixed' ? 'Tổng hợp 1-3' : `HSK ${lvl}`}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="muted small">Số câu:</span>
                {[10, 15, 20, 30].map((c) => (
                  <button
                    key={c}
                    className={`btn small ${quizCount === c ? 'primary' : 'ghost'}`}
                    onClick={() => setQuizCount(c)}
                  >
                    {c} câu
                  </button>
                ))}
              </div>

              <button className="btn ghost small" onClick={handleRegenerateQuiz}>
                🔄 Đổi bộ câu hỏi
              </button>

              <div style={{ flex: 1 }}></div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className={`btn small ${quizMode === 'interactive' ? 'primary' : 'ghost'}`}
                  onClick={() => setQuizMode('interactive')}
                >
                  Làm trực tuyến
                </button>
                <button
                  className={`btn small ${quizMode === 'print' ? 'primary' : 'ghost'}`}
                  onClick={() => setQuizMode('print')}
                >
                  Xem bản in A4
                </button>
                <button className="btn primary" onClick={handlePrint}>
                  🖨️ In Đề Thi A4
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* SECTION 1: PRINTABLE WORKSHEET GRID (Mizige / Tianzige) */}
      {/* ======================================================== */}
      {activeTab === 'grid' && (
        <div className="printable-sheet card" style={{ padding: '24px 28px', backgroundColor: '#fff', color: '#111' }}>
          {/* Printable Header Info */}
          <div
            className="sheet-header"
            style={{
              borderBottom: '2px solid #2f6f5e',
              paddingBottom: 12,
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#2f6f5e', letterSpacing: 1 }}>
                HÁN LỘ · 汉路 · PHIẾU LUYỆN VIẾT CHỮ HÁN
              </div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 3 }}>
                Tiêu chuẩn ô Mễ Tự Cách (米字格) · Bút thuận &amp; Cân đối hình khối chữ
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: 13, color: '#333' }}>
              <div>Họ tên: ______________________ Lớp: ________</div>
              <div style={{ marginTop: 4 }}>
                Cấp độ: <b>{customChars ? 'Tùy chọn' : `HSK ${levelFilter} - Bài ${lessonFilter}`}</b> · Ngày: ____/____/202__
              </div>
            </div>
          </div>

          {/* Grid Rows for Each Word */}
          <div className="sheet-body">
            {selectedWords.map((word) => {
              const charList = Array.from(word.h);
              return (
                <div key={word.id} className="worksheet-word-block" style={{ marginBottom: 20, pageBreakInside: 'avoid' }}>
                  {/* Word Header Info */}
                  {showPinyinHeader && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 12,
                        marginBottom: 6,
                        fontSize: 13,
                        color: '#333'
                      }}
                    >
                      <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--serif)', color: '#2f6f5e' }}>
                        {word.h}
                      </span>
                      <span>
                        Pinyin: <b>{word.p}</b>
                      </span>
                      {word.hv && (
                        <span>
                          Hán–Việt: <b>{word.hv}</b>
                        </span>
                      )}
                      {word.vi && (
                        <span style={{ color: '#555' }}>
                          Nghĩa: <i>{word.vi}</i>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Character Writing Rows */}
                  {charList.map((ch, chIdx) => (
                    <div
                      key={chIdx}
                      className="mizige-row"
                      style={{
                        display: 'flex',
                        gap: 0,
                        border: '1px solid #c48a80',
                        marginBottom: rowsPerChar > 1 ? 4 : 8,
                        backgroundColor: '#fff'
                      }}
                    >
                      {/* Cell 1: Master sample */}
                      <div
                        className="mizige-cell master"
                        style={{
                          width: 52,
                          height: 52,
                          position: 'relative',
                          borderRight: '1px solid #c48a80',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(196, 138, 128, 0.08)'
                        }}
                      >
                        {/* Inner SVG lines */}
                        <svg
                          viewBox="0 0 100 100"
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        >
                          {gridType === 'mizige' && (
                            <>
                              <line x1="0" y1="0" x2="100" y2="100" stroke="#e8b4ad" strokeDasharray="3 3" />
                              <line x1="100" y1="0" x2="0" y2="100" stroke="#e8b4ad" strokeDasharray="3 3" />
                            </>
                          )}
                          <line x1="50" y1="0" x2="50" y2="100" stroke="#e8b4ad" strokeDasharray="3 3" />
                          <line x1="0" y1="50" x2="100" y2="50" stroke="#e8b4ad" strokeDasharray="3 3" />
                        </svg>
                        <span
                          style={{
                            position: 'relative',
                            zIndex: 2,
                            fontSize: 34,
                            fontFamily: 'var(--serif)',
                            fontWeight: 700,
                            color: '#111'
                          }}
                        >
                          {ch}
                        </span>
                      </div>

                      {/* Remaining 9 Cells in row */}
                      {Array.from({ length: 9 }, (_, cellIdx) => {
                        const isTrace = cellIdx < tracingCells;
                        return (
                          <div
                            key={cellIdx}
                            className="mizige-cell"
                            style={{
                              flex: 1,
                              height: 52,
                              position: 'relative',
                              borderRight: cellIdx === 8 ? 'none' : '1px solid #c48a80',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <svg
                              viewBox="0 0 100 100"
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            >
                              {gridType === 'mizige' && (
                                <>
                                  <line x1="0" y1="0" x2="100" y2="100" stroke="#f0cbc5" strokeDasharray="3 3" />
                                  <line x1="100" y1="0" x2="0" y2="100" stroke="#f0cbc5" strokeDasharray="3 3" />
                                </>
                              )}
                              <line x1="50" y1="0" x2="50" y2="100" stroke="#f0cbc5" strokeDasharray="3 3" />
                              <line x1="0" y1="50" x2="100" y2="50" stroke="#f0cbc5" strokeDasharray="3 3" />
                            </svg>

                            {isTrace && (
                              <span
                                style={{
                                  position: 'relative',
                                  zIndex: 2,
                                  fontSize: 34,
                                  fontFamily: 'var(--serif)',
                                  color: 'rgba(0, 0, 0, 0.16)',
                                  userSelect: 'none'
                                }}
                              >
                                {ch}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Printable Sheet Footer */}
          <div
            className="sheet-footer"
            style={{
              marginTop: 24,
              paddingTop: 8,
              borderTop: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              color: '#888'
            }}
          >
            <span>Hán Lộ EdTech · han-lo.pages.dev · Học tiếng Trung chuẩn mực</span>
            <span>Khổ in tiêu chuẩn A4 · Tianzige &amp; Mizige</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: PRINTABLE QUIZ & TEST GENERATOR */}
      {/* ======================================================== */}
      {activeTab === 'quiz' && (
        <div>
          {/* Printable Exam Paper */}
          <div className="printable-sheet card" style={{ padding: '24px 28px', backgroundColor: '#fff', color: '#111' }}>
            {/* Exam Header */}
            <div
              style={{
                borderBottom: '2px solid #2f6f5e',
                paddingBottom: 14,
                marginBottom: 20
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 20, color: '#2f6f5e', letterSpacing: 0.5 }}>
                  {quiz.title.toUpperCase()}
                </h2>
                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
                  Thời gian làm bài: <b>{Math.round(quiz.questions.length * 1.5)} phút</b> · Tổng số câu: <b>{quiz.questions.length} câu</b>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  marginTop: 8,
                  padding: '6px 12px',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderRadius: 6
                }}
              >
                <div>Họ và tên: ___________________________</div>
                <div>Lớp/Mã HV: ____________</div>
                <div>Điểm số: ______ / 100</div>
              </div>
            </div>

            {/* Questions List */}
            <div className="exam-questions-list">
              {quiz.questions.map((q, idx) => {
                const userChoice = userAnswers[q.id];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    style={{
                      marginBottom: 18,
                      pageBreakInside: 'avoid',
                      padding: quizMode === 'interactive' ? '12px 14px' : '6px 0',
                      borderRadius: 8,
                      backgroundColor:
                        quizMode === 'interactive' && quizSubmitted
                          ? isCorrect
                            ? 'rgba(47, 111, 94, 0.06)'
                            : 'rgba(217, 83, 79, 0.06)'
                          : 'transparent',
                      border:
                        quizMode === 'interactive' && quizSubmitted
                          ? isCorrect
                            ? '1px solid rgba(47, 111, 94, 0.2)'
                            : '1px solid rgba(217, 83, 79, 0.2)'
                          : 'none'
                    }}
                  >
                    {/* Question Prompt */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#2f6f5e' }}>
                        Câu {q.id}:
                      </span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{q.prompt}</span>
                        {q.subPrompt && (
                          <span style={{ fontSize: 13, color: '#666', marginLeft: 8 }}>
                            ({q.subPrompt})
                          </span>
                        )}
                        {/* Audio speaker in interactive mode */}
                        {quizMode === 'interactive' && (
                          <button
                            className="icon-btn small no-print"
                            onClick={() => speak(q.targetWord.h, 0.85, audioEnabled)}
                            style={{ marginLeft: 6, verticalAlign: 'middle' }}
                            title="Nghe phát âm"
                          >
                            🔊
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Options (A, B, C, D) */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: 8,
                        paddingLeft: 16
                      }}
                    >
                      {q.options.map((opt, optIdx) => {
                        const letter = ['A', 'B', 'C', 'D'][optIdx];
                        const isSelected = userChoice === optIdx;
                        const isThisCorrect = optIdx === q.correctAnswer;

                        let optBg = '#fff';
                        let optBorder = '1px solid #ddd';
                        if (quizMode === 'interactive') {
                          if (isSelected) {
                            optBg = 'rgba(47, 111, 94, 0.1)';
                            optBorder = '1px solid #2f6f5e';
                          }
                          if (quizSubmitted) {
                            if (isThisCorrect) {
                              optBg = 'rgba(47, 111, 94, 0.2)';
                              optBorder = '2px solid #2f6f5e';
                            } else if (isSelected && !isThisCorrect) {
                              optBg = 'rgba(217, 83, 79, 0.15)';
                              optBorder = '2px solid #d9534f';
                            }
                          }
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 6,
                              backgroundColor: optBg,
                              border: optBorder,
                              cursor: quizMode === 'interactive' && !quizSubmitted ? 'pointer' : 'default',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              fontSize: 14,
                              fontFamily: q.type === 'pinyin_to_hanzi' ? 'var(--serif)' : 'inherit'
                            }}
                          >
                            <span style={{ fontWeight: 700, color: '#555', minWidth: 20 }}>
                              {letter}.
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation after submission in interactive mode */}
                    {quizMode === 'interactive' && quizSubmitted && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: '6px 12px',
                          fontSize: 13,
                          color: isCorrect ? '#2f6f5e' : '#d9534f',
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          borderRadius: 6
                        }}
                      >
                        <b>{isCorrect ? '✓ Đúng:' : '✗ Sai:'}</b> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Answer Key for Print Mode (At bottom of paper) */}
            {quizMode === 'print' && (
              <div
                className="print-answer-key"
                style={{
                  marginTop: 32,
                  paddingTop: 16,
                  borderTop: '2px dashed #aaa',
                  pageBreakInside: 'avoid'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: '#2f6f5e' }}>
                  BẢNG ĐÁP ÁN THAM KHẢO &amp; GIẢI THÍCH (DÀNH CHO GIÁO VIÊN / TỰ CHẤM):
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: 6,
                    fontSize: 12
                  }}
                >
                  {quiz.questions.map((q) => (
                    <div key={q.id} style={{ padding: '3px 6px', border: '1px solid #eee', borderRadius: 4 }}>
                      <b>Câu {q.id}:</b> {['A', 'B', 'C', 'D'][q.correctAnswer]}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Score Panel & Submit Button (Hidden in Print) */}
          {quizMode === 'interactive' && (
            <div className="card no-print" style={{ marginTop: 16, textAlign: 'center' }}>
              {!quizSubmitted ? (
                <div>
                  <p className="muted small" style={{ marginBottom: 12 }}>
                    Đã trả lời: <b>{Object.keys(userAnswers).length}</b> / {quiz.questions.length} câu
                  </p>
                  <button
                    className="btn primary"
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(userAnswers).length === 0}
                    style={{ minWidth: 160 }}
                  >
                    Nộp bài &amp; Chấm điểm
                  </button>
                </div>
              ) : (
                <div>
                  {(() => {
                    const score = calculateScore();
                    return (
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#2f6f5e', marginBottom: 4 }}>
                          Điểm số: {score.correct} / {score.total} ({score.pct}%)
                        </div>
                        <p className="muted small" style={{ marginBottom: 16 }}>
                          {score.pct >= 80 ? '🎉 Xuất sắc! Bạn đã nắm rất vững từ vựng!' : 'Cố gắng ôn tập lại các câu sai nhé!'}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                          <button className="btn ghost" onClick={handleRegenerateQuiz}>
                            Làm đề mới khác
                          </button>
                          <button
                            className="btn primary"
                            onClick={() => {
                              setUserAnswers({});
                              setQuizSubmitted(false);
                            }}
                          >
                            Làm lại đề này
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
};
