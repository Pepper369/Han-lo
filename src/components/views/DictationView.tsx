import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  DICTATION_SENTENCES,
  DictationSentence,
  diffChars,
  diffPinyin,
  DiffResult
} from '../../data/dictation';
import { speak } from '../../utils/tts';

interface DictationViewProps {
  audioEnabled: boolean;
}

export const DictationView: React.FC<DictationViewProps> = ({ audioEnabled }) => {
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');
  const [inputMode, setInputMode] = useState<'hanzi' | 'pinyin'>('hanzi');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(0.85);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Filter sentences by level
  const sentences = useMemo(() => {
    if (levelFilter === 'all') return DICTATION_SENTENCES;
    return DICTATION_SENTENCES.filter((s) => s.level === levelFilter);
  }, [levelFilter]);

  // Safe index within filtered sentences
  const currentSentence: DictationSentence | undefined = sentences[currentIndex] || sentences[0];

  // Auto focus input when switching sentences
  useEffect(() => {
    setInputVal('');
    setShowHint(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, levelFilter]);

  // Compute live diff
  const diffResult: DiffResult = useMemo(() => {
    if (!currentSentence) {
      return { tokens: [], isPerfect: false, score: 0, correctCount: 0, totalCount: 0 };
    }
    if (inputMode === 'hanzi') {
      return diffChars(inputVal, currentSentence.h);
    } else {
      return diffPinyin(inputVal, currentSentence.p);
    }
  }, [inputVal, currentSentence, inputMode]);

  // Audio speech playback
  const playAudio = useCallback((rate?: number) => {
    if (!currentSentence) return;
    const r = rate || playbackRate;
    speak(currentSentence.h, r, audioEnabled);
  }, [currentSentence, playbackRate, audioEnabled]);

  // Play audio automatically when moving to a new sentence
  useEffect(() => {
    if (currentSentence) {
      const timer = setTimeout(() => {
        playAudio(playbackRate);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, levelFilter]);

  // Handle next sentence
  const handleNext = () => {
    if (diffResult.isPerfect) {
      setStreak((s) => s + 1);
      setCompletedCount((c) => c + 1);
    }
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  // Keyboard shortcut: Enter to submit/advance when perfect
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (diffResult.isPerfect || inputVal.trim().length > 0) {
        handleNext();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setShowHint((h) => !h);
    }
  };

  if (!currentSentence) {
    return (
      <main className="view" style={{ textAlign: 'center', padding: '40px 16px' }}>
        <p className="muted">Không có câu nào trong cấp độ này.</p>
      </main>
    );
  }

  return (
    <main className="view" style={{ maxWidth: 760, margin: '0 auto', padding: '16px' }}>
      {/* Header & Controls */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🎧</span> Nghe Chép Chính Tả
            </h2>
            <p className="muted small" style={{ margin: '4px 0 0' }}>
              Luyện phản xạ nghe chữ Hán & Bính âm theo phương pháp Dictation Master
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="badge s-mastered" title="Chuỗi nghe chép đúng">
              🔥 Chuỗi: <b>{streak}</b>
            </span>
            <span className="badge s-learning">
              Đã xong: <b>{completedCount}</b>
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid var(--border)'
          }}
        >
          {/* Level Filter */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span className="muted small" style={{ marginRight: 4 }}>Cấp độ:</span>
            {(['all', 1, 2, 3] as const).map((lvl) => (
              <button
                key={lvl}
                className={`btn small ${levelFilter === lvl ? 'primary' : 'ghost'}`}
                onClick={() => {
                  setLevelFilter(lvl);
                  setCurrentIndex(0);
                }}
              >
                {lvl === 'all' ? 'Tất cả' : `HSK ${lvl}`}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }}></div>

          {/* Input Mode Toggle */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span className="muted small" style={{ marginRight: 4 }}>Gõ:</span>
            <button
              className={`btn small ${inputMode === 'hanzi' ? 'primary' : 'ghost'}`}
              onClick={() => setInputMode('hanzi')}
            >
              Chữ Hán
            </button>
            <button
              className={`btn small ${inputMode === 'pinyin' ? 'primary' : 'ghost'}`}
              onClick={() => setInputMode('pinyin')}
            >
              Pinyin
            </button>
          </div>
        </div>
      </div>

      {/* Main Dictation Interactive Arena */}
      <section className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
        {/* Progress Tracker */}
        <div className="row-between" style={{ marginBottom: 16 }}>
          <span className="muted small">
            Câu <b>{currentIndex + 1}</b> / {sentences.length} (HSK {currentSentence.level})
          </span>
          <span className="muted small">
            Độ chính xác: <b>{diffResult.score}%</b>
          </span>
        </div>

        {/* Big Audio Player Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          <button
            className="btn primary"
            onClick={() => playAudio(0.9)}
            style={{ minWidth: 140, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <span style={{ fontSize: 18 }}>🔊</span> Nghe chuẩn (1.0x)
          </button>
          <button
            className="btn ghost"
            onClick={() => playAudio(0.65)}
            style={{ minWidth: 130, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <span>🐢</span> Nghe chậm (0.7x)
          </button>
        </div>

        {/* Live Diff Characters Display */}
        <div
          style={{
            minHeight: 88,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            padding: '16px 12px',
            backgroundColor: 'var(--bg-subtle, rgba(0,0,0,0.03))',
            borderRadius: 12,
            marginBottom: 20
          }}
        >
          {diffResult.tokens.map((token, idx) => {
            let bg = 'rgba(0,0,0,0.05)';
            let color = 'var(--muted)';
            let border = '1px solid transparent';

            if (token.status === 'correct') {
              bg = 'rgba(47, 111, 94, 0.15)';
              color = '#2f6f5e';
              border = '1px solid #2f6f5e';
            } else if (token.status === 'wrong') {
              bg = 'rgba(217, 83, 79, 0.15)';
              color = '#d9534f';
              border = '1px solid #d9534f';
            } else if (token.status === 'extra') {
              bg = 'rgba(230, 162, 60, 0.2)';
              color = '#b97a12';
              border = '1px dashed #b97a12';
            } else if (token.status === 'pending') {
              border = '1px dashed var(--border)';
            }

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: inputMode === 'hanzi' ? 44 : 52,
                  padding: '6px 8px',
                  borderRadius: 8,
                  backgroundColor: bg,
                  border: border,
                  transition: 'all 0.15s ease'
                }}
              >
                <span
                  style={{
                    fontSize: inputMode === 'hanzi' ? 28 : 18,
                    fontWeight: 600,
                    fontFamily: inputMode === 'hanzi' ? 'var(--serif)' : 'inherit',
                    color: color
                  }}
                >
                  {token.status === 'pending'
                    ? '·'
                    : token.got}
                </span>
                {/* Expected hint below if wrong or revealed */}
                {(token.status === 'wrong' || showHint) && (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--muted)',
                      marginTop: 2,
                      fontFamily: 'var(--serif)'
                    }}
                  >
                    {token.char}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Text Box */}
        <div style={{ maxWidth: 520, margin: '0 auto 16px' }}>
          <input
            ref={inputRef}
            type="text"
            className="input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              inputMode === 'hanzi'
                ? 'Gõ chữ Hán nghe được... (Ví dụ: 你好)'
                : 'Gõ Pinyin không dấu... (Ví dụ: ni hao)'
            }
            style={{
              fontSize: 18,
              textAlign: 'center',
              padding: '12px 16px',
              borderRadius: 10,
              width: '100%',
              boxSizing: 'border-box'
            }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>

        {/* Perfect Completion Banner */}
        {diffResult.isPerfect && (
          <div
            style={{
              padding: '10px 16px',
              marginBottom: 16,
              backgroundColor: 'rgba(47, 111, 94, 0.12)',
              borderRadius: 8,
              color: '#2f6f5e',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>🎉</span> Xuất sắc! Bạn đã nghe chép chuẩn xác 100%!
          </div>
        )}

        {/* Hint Accordion */}
        <div style={{ marginBottom: 20 }}>
          <button
            className="btn ghost small"
            onClick={() => setShowHint((h) => !h)}
            style={{ color: 'var(--muted)' }}
          >
            {showHint ? 'Ẩn gợi ý' : '💡 Xem gợi ý & dịch nghĩa'}
          </button>

          {showHint && (
            <div
              style={{
                marginTop: 12,
                padding: '12px 16px',
                backgroundColor: 'var(--card-bg, #fff)',
                border: '1px dashed var(--border)',
                borderRadius: 8,
                textAlign: 'left',
                maxWidth: 480,
                margin: '12px auto 0'
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 600, color: '#2f6f5e', marginBottom: 4 }}>
                {currentSentence.h}
              </div>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 4 }}>
                Pinyin: <b>{currentSentence.p}</b> · Hán-Việt: <b>{currentSentence.hv}</b>
              </div>
              <div style={{ fontSize: 15, color: 'var(--ink)' }}>
                Dịch nghĩa: <i>{currentSentence.vi}</i>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button
            className="btn ghost"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{ minWidth: 100 }}
          >
            ← Câu trước
          </button>
          <button
            className="btn primary"
            onClick={handleNext}
            style={{ minWidth: 120 }}
          >
            {diffResult.isPerfect ? 'Tiếp tục →' : 'Bỏ qua / Tiếp →'}
          </button>
        </div>
      </section>

      {/* Pro Tips Box */}
      <div
        className="card"
        style={{
          marginTop: 16,
          backgroundColor: 'var(--bg-subtle, rgba(0,0,0,0.02))',
          border: '1px solid var(--border)'
        }}
      >
        <h4 style={{ margin: '0 0 8px', fontSize: 15 }}>💡 Mẹo luyện tai nghe chép chính tả:</h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
          <li>Lần 1: Nghe tốc độ 1.0x để nắm ý nghĩa toàn câu.</li>
          <li>Lần 2: Nghe tốc độ chậm 0.7x để bắt chính xác từng âm thanh mẫu, vận mẫu và thanh điệu.</li>
          <li>Gõ phím <b>Enter</b> để nộp bài hoặc chuyển câu tiếp theo, gõ phím <b>Tab</b> để xem gợi ý.</li>
        </ul>
      </div>
    </main>
  );
};
