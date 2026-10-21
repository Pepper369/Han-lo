import React from 'react';
import { Word, ReaderToken } from '../../types';
import { speak } from '../../utils/tts';
import { renderPinyinElements } from '../views/DictView';
import { getDecomposition } from '../../data/radicals';

interface LookupModalProps {
  data: Word | ReaderToken;
  audioEnabled: boolean;
  onClose: () => void;
  onOpenWriter: (char: string) => void;
}

export const LookupModal: React.FC<LookupModalProps> = ({
  data,
  audioEnabled,
  onClose,
  onOpenWriter
}) => {
  const hanzi = data.h;
  const pinyin = data.p || '';
  const hv = data.hv || '';
  const vi = data.vi || '';

  const decomp = getDecomposition(hanzi);

  return (
    <div
      id="lookupSheet"
      className="sheet center-sheet"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet-card write-card">
        <div className="row-between">
          <span className="badge s-mastered">Tra từ tức thì</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div id="lookup-body" style={{ padding: '16px 0 6px', textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--ink)' }}>
            {hanzi}
          </div>
          {pinyin && (
            <div className="w-py" style={{ fontSize: 20, margin: '8px 0', fontWeight: 600 }}>
              {renderPinyinElements(pinyin)}
            </div>
          )}
          {hv && (
            <p className="hv-line" style={{ margin: '4px 0', fontSize: 15 }}>
              Hán–Việt: <b>{hv}</b>
            </p>
          )}
          {vi && (
            <p className="meaning" style={{ fontSize: 16, color: 'var(--ink)', margin: '6px 0 12px' }}>
              {vi}
            </p>
          )}

          {decomp && (
            <div
              style={{
                margin: '10px 0 14px',
                padding: '10px 12px',
                backgroundColor: 'rgba(47, 111, 94, 0.08)',
                borderRadius: 8,
                border: '1px solid rgba(47, 111, 94, 0.2)',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#2f6f5e', marginBottom: 2 }}>
                🧩 Chiết tự: {decomp.parts.join(' + ')} = {decomp.char}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>
                💡 <i>{decomp.story}</i>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              className="btn ghost"
              onClick={() => speak(hanzi, 0.82, audioEnabled)}
              style={{ flex: 1 }}
            >
              🔊 Nghe phát âm
            </button>
            {Array.from(hanzi).length > 0 && (
              <button
                className="btn primary"
                onClick={() => {
                  onClose();
                  onOpenWriter(Array.from(hanzi)[0]);
                }}
                style={{ flex: 1 }}
              >
                ✍️ Tập viết
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
