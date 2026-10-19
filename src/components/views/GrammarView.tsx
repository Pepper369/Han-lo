import React from 'react';
import { GRAMMAR_DATA } from '../../data/grammar';
import { speak } from '../../utils/tts';
import { SoundFX } from '../../utils/audioFx';

interface GrammarViewProps {
  audioEnabled: boolean;
}

export const GrammarView: React.FC<GrammarViewProps> = ({ audioEnabled }) => {
  const { nuances, structures } = GRAMMAR_DATA;

  function handleSpeak(text: string) {
    SoundFX.tap();
    speak(text, 0.82, audioEnabled);
  }

  return (
    <main id="view-grammar" className="view">
      {/* Intro */}
      <section className="card">
        <div className="eyebrow">HSK 1 – 2 · Ngữ Pháp Thực Chiến</div>
        <h2>Phân Biệt Sắc Thái &amp; Từ Dễ Nhầm</h2>
        <p className="muted small">
          So sánh các cặp từ kinh điển mà người học tiếng Trung hay mắc lỗi nhất, kèm công thức cấu trúc câu chuẩn.
        </p>
      </section>

      {/* Nuance comparisons */}
      {nuances.map((n) => (
        <section key={n.id} className="card nuance-card">
          <div className="row-between">
            <h3 style={{ margin: '0 0 4px', fontSize: 18, color: 'var(--ink)' }}>{n.title}</h3>
            <span className="badge s-learning">{n.category}</span>
          </div>
          <p className="muted small" style={{ margin: '4px 0 12px' }}>{n.summary}</p>

          <div style={{ display: 'grid', gap: 12 }}>
            {n.items.map((item, iIdx) => (
              <div key={iIdx} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 12 }}>
                <div className="row-between">
                  <b style={{ fontSize: 16, color: 'var(--red)', fontFamily: 'var(--serif)' }}>{item.word}</b>
                  <code style={{ fontSize: 12, background: 'var(--paper-2)', padding: '2px 8px', borderRadius: 6 }}>
                    {item.formula}
                  </code>
                </div>
                <p className="small muted" style={{ margin: '6px 0 8px' }}>{item.role}</p>

                <div className="examples-list" style={{ display: 'grid', gap: 6 }}>
                  {item.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--card)',
                        padding: '6px 10px',
                        borderRadius: 8,
                        border: '1px solid var(--line)'
                      }}
                    >
                      <div>
                        <b style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>{ex.hz}</b>{' '}
                        <span className="muted small">[{ex.py}]</span>
                        <div className="small" style={{ color: 'var(--muted)', marginTop: 2 }}>
                          ➔ {ex.vi}
                        </div>
                      </div>
                      <button
                        className="icon-btn small"
                        onClick={() => handleSpeak(ex.hz)}
                        title="Nghe câu ví dụ"
                        style={{ width: 30, height: 30 }}
                      >
                        🔊
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'var(--jade-soft)',
              color: 'var(--jade)',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            💡 <b>Mẹo nhớ nhanh:</b> {n.quickTip}
          </div>
        </section>
      ))}

      {/* Basic Structures */}
      <section className="card">
        <div className="row-between">
          <h3>Cấu Trúc Câu Nền Tảng</h3>
          <span className="muted small">Xương sống ngữ pháp</span>
        </div>
        <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          {structures.map((st, idx) => (
            <div key={idx} style={{ background: 'var(--paper-2)', padding: '12px 14px', borderRadius: 12 }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, color: 'var(--ink)' }}>{st.title}</h4>
              <p className="small muted" style={{ margin: '0 0 6px' }}>{st.rule}</p>
              <div style={{ background: 'var(--card)', padding: '6px 10px', borderRadius: 8, fontFamily: 'monospace', fontSize: 12.5, margin: '6px 0' }}>
                {st.formula}
              </div>
              <div className="small" style={{ color: 'var(--jade)', marginTop: 4 }}>
                <b>Ví dụ:</b> {st.example}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
