import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CONVERSATION_SCENARIOS,
  ConversationScenario,
  DialogueTurn
} from '../../data/conversations';
import { speak } from '../../utils/tts';

interface DialogueViewProps {
  audioEnabled: boolean;
}

export const DialogueView: React.FC<DialogueViewProps> = ({ audioEnabled }) => {
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario>(
    CONVERSATION_SCENARIOS[0]
  );
  const [userRole, setUserRole] = useState<'A' | 'B' | 'both'>('A');
  const [currentTurnIdx, setCurrentTurnIdx] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [speechFeedback, setSpeechFeedback] = useState<{ score: number; msg: string } | null>(
    null
  );
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  // Filter scenarios by level
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');

  const recognitionRef = useRef<any>(null);

  const filteredScenarios = CONVERSATION_SCENARIOS.filter((sc) =>
    levelFilter === 'all' ? true : sc.level === levelFilter
  );

  const currentTurn: DialogueTurn | undefined = selectedScenario.turns[currentTurnIdx];
  const isUserTurn = userRole === 'both' ? false : currentTurn?.speaker === userRole;

  // Init SpeechRecognition if available in browser
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechFeedback(null);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSpokenText(text);
        evaluateSpeech(text);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentTurn]);

  // Evaluate speech similarity with expected Hanzi
  const evaluateSpeech = (spoken: string) => {
    if (!currentTurn) return;
    const cleanSpoken = spoken.replace(/[^\u4e00-\u9fa5]/g, '');
    const cleanTarget = currentTurn.h.replace(/[^\u4e00-\u9fa5]/g, '');

    let matches = 0;
    for (const ch of cleanSpoken) {
      if (cleanTarget.includes(ch)) matches++;
    }

    const maxLen = Math.max(cleanTarget.length, cleanSpoken.length, 1);
    const score = Math.min(100, Math.round((matches / maxLen) * 100));

    let msg = 'Phát âm rất tốt!';
    if (score >= 80) msg = '🌟 Xuất sắc! Phát âm chuẩn âm điệu chuẩn Bắc Kinh!';
    else if (score >= 50) msg = '👍 Tốt! Cần chú ý thêm thanh điệu và bật hơi!';
    else msg = '🔄 Hãy nghe lại câu mẫu và nói lại rõ ràng hơn nhé!';

    setSpeechFeedback({ score, msg });
  };

  // Play audio for a turn
  const playTurnAudio = useCallback(
    (turn: DialogueTurn, rate = 0.85) => {
      speak(turn.h, rate, audioEnabled);
    },
    [audioEnabled]
  );

  // Auto-play next opponent turn
  useEffect(() => {
    setSpokenText('');
    setSpeechFeedback(null);

    if (currentTurn) {
      // If opponent turn, auto speak
      if (!isUserTurn) {
        const timer = setTimeout(() => {
          playTurnAudio(currentTurn);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentTurnIdx, selectedScenario, userRole, isUserTurn, playTurnAudio]);

  // Start microphone speech recognition
  const handleStartMic = () => {
    if (recognitionRef.current) {
      try {
        setSpokenText('');
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    } else {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận dạng giọng nói zh-CN trực tiếp. Hãy sử dụng Chrome hoặc Edge!');
    }
  };

  const handleNextTurn = () => {
    if (currentTurnIdx < selectedScenario.turns.length - 1) {
      setCurrentTurnIdx((i) => i + 1);
    }
  };

  const handlePrevTurn = () => {
    if (currentTurnIdx > 0) {
      setCurrentTurnIdx((i) => i - 1);
    }
  };

  return (
    <main className="view" style={{ maxWidth: 860, margin: '0 auto', padding: '16px' }}>
      {/* Top Header Card */}
      <section className="card" style={{ marginBottom: 16 }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>💬</span> Phòng Luyện Giao Tiếp AI (Talk Room)
            </h2>
            <p className="muted small" style={{ margin: '4px 0 0' }}>
              Thực hành hội thoại nhập vai theo kịch bản đời sống thực tế với AI chấm điểm giọng nói
            </p>
          </div>

          {/* Level Filter */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span className="muted small" style={{ marginRight: 4 }}>Cấp độ:</span>
            {(['all', 1, 2, 3] as const).map((lvl) => (
              <button
                key={lvl}
                className={`btn small ${levelFilter === lvl ? 'primary' : 'ghost'}`}
                onClick={() => setLevelFilter(lvl)}
              >
                {lvl === 'all' ? 'Tất cả' : `HSK ${lvl}`}
              </button>
            ))}
          </div>
        </div>

        {/* Scenarios Horizontal Carousel */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            padding: '14px 0 6px',
            marginTop: 10,
            scrollbarWidth: 'thin'
          }}
        >
          {filteredScenarios.map((sc) => {
            const isSelected = sc.id === selectedScenario.id;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  setSelectedScenario(sc);
                  setCurrentTurnIdx(0);
                }}
                style={{
                  minWidth: 190,
                  maxWidth: 220,
                  padding: '10px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #2f6f5e' : '1px solid var(--border)',
                  backgroundColor: isSelected ? 'rgba(47, 111, 94, 0.08)' : 'var(--card-bg, #fff)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{sc.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: isSelected ? '#2f6f5e' : 'var(--ink)' }}>
                  {sc.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  HSK {sc.level} · {sc.turns.length} lượt thoại
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role Selection Toolbar */}
      <div
        className="card"
        style={{
          marginBottom: 16,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="muted small">Vai của bạn:</span>
          <button
            className={`btn small ${userRole === 'A' ? 'primary' : 'ghost'}`}
            onClick={() => setUserRole('A')}
          >
            👤 Vai A ({selectedScenario.roleA})
          </button>
          <button
            className={`btn small ${userRole === 'B' ? 'primary' : 'ghost'}`}
            onClick={() => setUserRole('B')}
          >
            👥 Vai B ({selectedScenario.roleB})
          </button>
          <button
            className={`btn small ${userRole === 'both' ? 'primary' : 'ghost'}`}
            onClick={() => setUserRole('both')}
          >
            🎧 Nghe tự động
          </button>
        </div>

        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          Lượt <b>{currentTurnIdx + 1}</b> / {selectedScenario.turns.length}
        </div>
      </div>

      {/* Main Dialogue Conversation Area */}
      <section className="card" style={{ padding: '24px 20px', minHeight: 400 }}>
        {/* Scenario Header Info */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: '1px dashed var(--border)'
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, color: '#2f6f5e' }}>
            {selectedScenario.icon} {selectedScenario.title}
          </h3>
          <p className="muted small" style={{ margin: '4px 0 0' }}>
            {selectedScenario.description}
          </p>
        </div>

        {/* Chat History Flow up to current turn */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {selectedScenario.turns.slice(0, currentTurnIdx + 1).map((turn, idx) => {
            const isTurnUser = userRole !== 'both' && turn.speaker === userRole;
            const isCurrent = idx === currentTurnIdx;
            const speakerName = turn.speaker === 'A' ? selectedScenario.roleA : selectedScenario.roleB;

            return (
              <div
                key={turn.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isTurnUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignSelf: isTurnUser ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Speaker Label */}
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4, padding: '0 4px' }}>
                  {isTurnUser ? `Bạn (${speakerName})` : speakerName}
                </div>

                {/* Bubble Container */}
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: 16,
                    borderTopRightRadius: isTurnUser ? 4 : 16,
                    borderTopLeftRadius: !isTurnUser ? 4 : 16,
                    backgroundColor: isTurnUser ? '#2f6f5e' : 'var(--bg-subtle, rgba(0,0,0,0.04))',
                    color: isTurnUser ? '#fff' : 'var(--ink)',
                    boxShadow: isCurrent ? '0 3px 10px rgba(0,0,0,0.08)' : 'none',
                    border: isCurrent && !isTurnUser ? '1px solid #2f6f5e' : 'none'
                  }}
                >
                  {/* Hanzi */}
                  <div
                    style={{
                      fontSize: 22,
                      fontFamily: 'var(--serif)',
                      fontWeight: 700,
                      lineHeight: 1.3,
                      marginBottom: 4
                    }}
                  >
                    {turn.h}
                  </div>

                  {/* Pinyin */}
                  <div
                    style={{
                      fontSize: 14,
                      opacity: isTurnUser ? 0.9 : 0.8,
                      marginBottom: 4,
                      fontWeight: 500
                    }}
                  >
                    {turn.p}
                  </div>

                  {/* Vietnamese Meaning */}
                  <div
                    style={{
                      fontSize: 13,
                      opacity: isTurnUser ? 0.85 : 0.75,
                      fontStyle: 'italic'
                    }}
                  >
                    {turn.vi}
                  </div>
                </div>

                {/* Play Audio Button for this turn */}
                <button
                  className="btn ghost small"
                  onClick={() => playTurnAudio(turn)}
                  style={{ marginTop: 4, padding: '2px 8px', fontSize: 11 }}
                >
                  🔊 Nghe lại
                </button>
              </div>
            );
          })}
        </div>

        {/* Current Active Interactive Zone (If it is user's turn) */}
        {currentTurn && isUserTurn && (
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: 'rgba(47, 111, 94, 0.08)',
              border: '1px solid rgba(47, 111, 94, 0.25)',
              textAlign: 'center',
              marginTop: 16
            }}
          >
            <div style={{ fontWeight: 600, color: '#2f6f5e', marginBottom: 8, fontSize: 14 }}>
              🎙️ Đến lượt bạn luyện nói:
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center' }}>
              {/* Mic Record Button */}
              <button
                className={`btn ${isRecording ? 'danger' : 'primary'}`}
                onClick={handleStartMic}
                style={{
                  minWidth: 150,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <span>{isRecording ? '🔴 Đang lắng nghe...' : '🎙️ Nhấn & Đọc thử'}</span>
              </button>

              <button className="btn ghost" onClick={() => playTurnAudio(currentTurn, 0.7)}>
                🐢 Nghe mẫu chậm
              </button>
            </div>

            {/* Live Spoken Text & Feedback */}
            {spokenText && (
              <div style={{ marginTop: 12, fontSize: 14 }}>
                <span className="muted">Hệ thống nhận diện được: </span>
                <b style={{ fontFamily: 'var(--serif)', fontSize: 16, color: '#2f6f5e' }}>
                  {spokenText}
                </b>
              </div>
            )}

            {speechFeedback && (
              <div
                style={{
                  marginTop: 10,
                  padding: '8px 12px',
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  display: 'inline-block',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 700, color: '#2f6f5e' }}>
                  Điểm phát âm: {speechFeedback.score}%
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 2 }}>
                  {speechFeedback.msg}
                </div>
              </div>
            )}

            {/* Suggested alternative replies */}
            {currentTurn.suggestedAnswers && currentTurn.suggestedAnswers.length > 0 && (
              <div style={{ marginTop: 14, textAlign: 'left', fontSize: 13 }}>
                <span className="muted">💡 Các cách trả lời khác có thể áp dụng:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {currentTurn.suggestedAnswers.map((ans, aIdx) => (
                    <span
                      key={aIdx}
                      style={{
                        padding: '3px 8px',
                        backgroundColor: '#fff',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                        color: 'var(--ink)'
                      }}
                    >
                      {ans}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Turn Step Navigation Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            marginTop: 24,
            paddingTop: 16,
            borderTop: '1px solid var(--border)'
          }}
        >
          <button className="btn ghost" onClick={handlePrevTurn} disabled={currentTurnIdx === 0}>
            ← Lượt trước
          </button>

          {currentTurnIdx < selectedScenario.turns.length - 1 ? (
            <button className="btn primary" onClick={handleNextTurn}>
              Lượt tiếp theo →
            </button>
          ) : (
            <button
              className="btn primary"
              onClick={() => {
                setCurrentTurnIdx(0);
                alert('Chúc mừng bạn đã hoàn thành trọn vẹn kịch bản hội thoại này!');
              }}
            >
              🎉 Hoàn thành &amp; Bắt đầu lại
            </button>
          )}
        </div>
      </section>
    </main>
  );
};
