import React, { useState } from 'react';
import { READER_DATA } from '../../data/readers';
import { ReaderToken } from '../../types';
import { speak } from '../../utils/tts';
import { SoundFX } from '../../utils/audioFx';

interface ReaderViewProps {
  audioEnabled: boolean;
  onOpenLookupToken: (token: ReaderToken) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ audioEnabled, onOpenLookupToken }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showPinyin, setShowPinyin] = useState<boolean>(true);

  const article = READER_DATA[currentIdx] || READER_DATA[0];

  function handleSpeak(text: string) {
    SoundFX.tap();
    speak(text, 0.8, audioEnabled);
  }

  return (
    <main id="view-reader" className="view">
      <div className="reader-head">
        <h2>Bài Đọc Tương Tác HSK</h2>
        <p className="muted small">
          Luyện phản xạ đọc hiểu theo đoạn văn chuẩn chủ đề. Chạm vào bất kỳ từ vựng nào để tra cứu tức thì.
        </p>
        <div className="article-tabs" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 0 10px' }}>
          {READER_DATA.map((art, idx) => (
            <button
              key={art.id}
              className={`chip ${idx === currentIdx ? 'active' : ''}`}
              onClick={() => setCurrentIdx(idx)}
            >
              {art.level} · {art.title}
            </button>
          ))}
        </div>
      </div>

      {article && (
        <section className="card reader-card" style={{ marginTop: 10 }}>
          <div className="reader-article-header" style={{ marginBottom: 16 }}>
            <div className="row-between">
              <span className="badge s-mastered">{article.level}</span>
              <button
                className="btn ghost small"
                onClick={() => setShowPinyin((p) => !p)}
              >
                {showPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin'}
              </button>
            </div>
            <h3 style={{ margin: '8px 0 2px', fontSize: 20, fontFamily: 'var(--serif)' }}>{article.title}</h3>
            {showPinyin && <div className="muted small">{article.titlePy}</div>}
            <div className="small" style={{ color: 'var(--jade)', marginTop: 2 }}>
              ➔ {article.titleVi}
            </div>
            <p className="muted small" style={{ marginTop: 6, fontStyle: 'italic' }}>{article.desc}</p>
          </div>

          <div className="reader-body" style={{ display: 'grid', gap: 16 }}>
            {article.paragraphs.map((p, pIdx) => (
              <div key={pIdx} className="reader-paragraph-box" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
                  <button
                    className="icon-btn small"
                    onClick={() => handleSpeak(p.audioText)}
                    title="Nghe đoạn văn này"
                    style={{ width: 32, height: 32 }}
                  >
                    🔊
                  </button>
                </div>
                <div className="reader-sentences" style={{ lineHeight: 2.2 }}>
                  {p.sentences.map((sent, sIdx) => (
                    <span key={sIdx}>
                      {sent.tokens.map((tok, tIdx) => {
                        if (tok.isPunc) {
                          return <span key={tIdx} className="reader-punc" style={{ margin: '0 2px', color: 'var(--ink)' }}>{tok.h}</span>;
                        }
                        return (
                          <span
                            key={tIdx}
                            className="reader-token"
                            onClick={() => onOpenLookupToken(tok)}
                            title={tok.vi ? `${tok.p || ''} · ${tok.vi}` : ''}
                            style={{
                              display: 'inline-flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              margin: '0 3px',
                              cursor: 'pointer',
                              padding: '2px 4px',
                              borderRadius: 6,
                              verticalAlign: 'bottom'
                            }}
                          >
                            {showPinyin && tok.p && (
                              <span className="token-py" style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1 }}>
                                {tok.p}
                              </span>
                            )}
                            <span className="token-hz" style={{ fontSize: 18, fontFamily: 'var(--serif)', fontWeight: 600, color: 'var(--ink)' }}>
                              {tok.h}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
