import React, { useState } from 'react';
import { Word } from '../../types';
import { HanLoSpeech, SpeechMatchResult } from '../../utils/speech';
import { speak } from '../../utils/tts';
import { SoundFX } from '../../utils/audioFx';

interface SpeechViewProps {
  words: Word[];
  allWords: Word[];
  audioEnabled: boolean;
}

export const SpeechView: React.FC<SpeechViewProps> = ({ words, allWords, audioEnabled }) => {
  const [wordIdx, setWordIdx] = useState<number>(0);
  const [result, setResult] = useState<SpeechMatchResult | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const list = words.length > 0 ? words : allWords;
  const word = list[wordIdx % list.length] || allWords[0];

  function handleSpeakTarget() {
    SoundFX.tap();
    speak(word.h, 0.8, audioEnabled);
  }

  function handleToggleMic() {
    if (!HanLoSpeech.isSupported) {
      setStatusMsg("Trình duyệt không hỗ trợ Web Speech API (Hãy dùng Chrome hoặc Edge)");
      return;
    }

    if (isListening) {
      HanLoSpeech.stopListening();
      setIsListening(false);
      setStatusMsg('');
      return;
    }

    setResult(null);
    setStatusMsg('🔴 Đang lắng nghe giọng nói... Hãy đọc to chữ Hán!');
    setIsListening(true);
    SoundFX.tap();

    HanLoSpeech.startListening(
      word.h,
      (res) => {
        setResult(res);
        setIsListening(false);
        setStatusMsg('');
        if (res.score >= 80) SoundFX.bell();
        else if (res.score >= 50) SoundFX.tap();
        else SoundFX.wrong();
      },
      (err) => {
        setIsListening(false);
        setStatusMsg(`Nhận diện âm thanh: ${err}`);
      },
      () => {
        setIsListening(true);
      },
      () => {
        setIsListening(false);
      }
    );
  }

  function handlePrev() {
    if (wordIdx > 0) setWordIdx(wordIdx - 1);
    setResult(null);
    setStatusMsg('');
  }

  function handleNext() {
    setWordIdx(wordIdx + 1);
    setResult(null);
    setStatusMsg('');
  }

  return (
    <main id="view-speech" className="view">
      <section className="card speech-intro-card">
        <div className="eyebrow">Web Speech API · zh-CN</div>
        <h2>Luyện Phát Âm Trực Tiếp</h2>
        <p className="muted small">
          Hệ thống nhận diện giọng nói tiếng Trung phổ thông chuẩn và chấm điểm tức thì trên thiết bị của bạn.
        </p>

        <div className="speech-word-box" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 18, padding: 24, textAlign: 'center', margin: '16px 0' }}>
          <div className="speech-hz" style={{ fontSize: 64, fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--ink)' }}>
            {word.h}
          </div>
          <div className="speech-py" style={{ fontSize: 20, color: 'var(--blue)', fontWeight: 600, margin: '6px 0' }}>
            [{word.p}]
          </div>
          <div className="speech-mean" style={{ color: 'var(--muted)', fontSize: 15 }}>
            <b>{word.hv}</b> · {word.vi}
          </div>

          <div style={{ marginTop: 14 }}>
            <button
              className="btn ghost small"
              onClick={handleSpeakTarget}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              🔊 Nghe mẫu chuẩn
            </button>
          </div>
        </div>

        {/* Mic control */}
        <div className="speech-action-box" style={{ textAlign: 'center', margin: '20px 0' }}>
          <button
            className={`speech-mic-btn ${isListening ? 'listening' : ''}`}
            onClick={handleToggleMic}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: 'none',
              background: isListening ? 'var(--red)' : 'var(--ink)',
              color: '#fff',
              fontSize: 28,
              cursor: 'pointer',
              boxShadow: isListening ? '0 0 0 10px rgba(178, 58, 47, 0.25)' : 'var(--shadow)',
              transition: 'all 0.2s ease'
            }}
            title={isListening ? 'Bấm để dừng' : 'Bấm để nói'}
          >
            {isListening ? '⏹️' : '🎙️'}
          </button>
          <div className="speech-mic-hint muted small" style={{ marginTop: 8 }}>
            {isListening ? 'Đang lắng nghe... Hãy nói ngay!' : 'Bấm vào micro để đọc'}
          </div>
          {statusMsg && (
            <div className="small" style={{ color: 'var(--red)', marginTop: 6 }}>
              {statusMsg}
            </div>
          )}
        </div>

        {/* Results banner */}
        {result && (
          <div
            className={`speech-result-box ${result.score >= 80 ? 'ok' : result.score >= 50 ? 'warning' : 'bad'}`}
            style={{
              background: result.score >= 80 ? 'var(--jade-soft)' : result.score >= 50 ? 'var(--amber-soft)' : 'var(--red-soft)',
              padding: 16,
              borderRadius: 14,
              textAlign: 'center',
              margin: '16px 0'
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: result.score >= 80 ? 'var(--jade)' : result.score >= 50 ? 'var(--amber)' : 'var(--red)' }}>
              {result.score}%
            </div>
            <h4 style={{ margin: '4px 0', fontSize: 16 }}>{result.grade}</h4>
            <div className="small muted">
              Chuỗi nghe được: <b>"{result.text || '(không rõ)'}"</b>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="speech-nav-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <button className="btn ghost" onClick={handlePrev} disabled={wordIdx === 0} style={{ opacity: wordIdx === 0 ? 0.5 : 1 }}>
            ← Từ trước
          </button>
          <span className="muted small">
            Từ {(wordIdx % list.length) + 1} / {list.length}
          </span>
          <button className="btn primary" onClick={handleNext}>
            Từ tiếp theo →
          </button>
        </div>
      </section>
    </main>
  );
};
