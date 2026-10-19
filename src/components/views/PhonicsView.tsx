import React from 'react';
import { PINYIN_DATA } from '../../data/phonics';
import { speak } from '../../utils/tts';
import { SoundFX } from '../../utils/audioFx';

interface PhonicsViewProps {
  audioEnabled: boolean;
  onOpenWriter?: (char: string) => void;
}

export const PhonicsView: React.FC<PhonicsViewProps> = ({ audioEnabled, onOpenWriter }) => {
  const { tones, initials, finals, rules, basicStrokes } = PINYIN_DATA;

  function handlePlay(text: string) {
    SoundFX.tap();
    speak(text, 0.82, audioEnabled);
  }

  return (
    <main id="view-phonics" className="view">
      {/* 4 Tones */}
      <section className="card">
        <div className="eyebrow">Ngữ Âm Căn Bản · 4 Thanh Điệu</div>
        <h2>Hệ Thống Thanh Điệu (Tones)</h2>
        <p className="muted small">
          Tiếng Trung có 4 thanh điệu chính và 1 thanh nhẹ. Thanh điệu quyết định hoàn toàn ý nghĩa của từ.
        </p>

        <div className="tones-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 14 }}>
          {tones.map((t) => (
            <div key={t.tone} className="tone-card" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14, padding: 14 }}>
              <div className="tone-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tone-mark" style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--serif)' }}>{t.mark}</span>
                <span className="tone-pitch-badge" style={{ fontSize: 11.5, background: 'var(--paper-2)', padding: '2px 8px', borderRadius: 999 }}>{t.pitch}</span>
              </div>
              <h4 style={{ margin: '6px 0 4px', fontSize: 15 }}>{t.name}</h4>
              <div className="tone-curve-wrap" style={{ height: 48, margin: '6px 0' }}>
                <svg className="tone-curve-svg" viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path
                    className="tone-curve-path"
                    d={t.curvePath}
                    fill="none"
                    stroke="var(--jade)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="muted small" style={{ margin: '4px 0 6px' }}>{t.desc}</p>
              <div className="muted small" style={{ color: 'var(--jade)', fontSize: 12 }}>
                <b>Mẹo Việt:</b> {t.tipViet}
              </div>
              <div className="tone-ex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                <div>
                  <b style={{ fontSize: 18, fontFamily: 'var(--serif)' }}>{t.exampleHz}</b>{' '}
                  <span className="muted small">[{t.examplePy} · {t.exampleVi}]</span>
                </div>
                <button
                  className="icon-btn"
                  onClick={() => handlePlay(t.exampleHz)}
                  title="Nghe phát âm"
                  style={{ width: 32, height: 32 }}
                >
                  🔊
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tone Sandhi Rules */}
      <section className="card">
        <div className="row-between">
          <h3>Quy Tắc Biến Điệu Cần Nhớ</h3>
          <span className="muted small">Ngữ âm thực chiến</span>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {rules.map((r, idx) => (
            <div key={idx} className="rule-box" style={{ background: 'var(--paper-2)', padding: '12px 14px', borderRadius: 12 }}>
              <b style={{ color: 'var(--ink)' }}>{r.title}</b>
              <p className="small muted" style={{ margin: '4px 0 6px' }}>{r.rule}</p>
              <div className="small" style={{ color: 'var(--jade)' }}>
                <b>Ví dụ:</b> {r.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 23 Initials */}
      <section className="card">
        <div className="row-between">
          <h3>23 Thanh Mẫu (Phụ Âm Đầu)</h3>
          <span className="muted small">Shengmu</span>
        </div>
        <p className="muted small">Chạm vào biểu tượng loa để nghe chuẩn khẩu hình.</p>
        <div className="phonics-table" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10, marginTop: 12 }}>
          {initials.map((init) => (
            <div key={init.py} className="phonics-item" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 10 }}>
              <div className="row-between">
                <div>
                  <b style={{ fontSize: 18, color: 'var(--red)', fontFamily: 'var(--serif)' }}>{init.py}</b>{' '}
                  <span className="muted small">{init.ipa}</span>
                </div>
                <button
                  className="icon-btn"
                  onClick={() => handlePlay(init.ex.split(' ')[0])}
                  style={{ width: 30, height: 30 }}
                  title={`Nghe ${init.ex}`}
                >
                  🔊
                </button>
              </div>
              <p className="small muted" style={{ margin: '4px 0 2px' }}>{init.tip}</p>
              <div className="small" style={{ color: 'var(--jade)' }}>{init.ex}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 36 Finals */}
      <section className="card">
        <div className="row-between">
          <h3>36 Vận Mẫu (Nguyên Âm &amp; Âm Mũi)</h3>
          <span className="muted small">Yunmu</span>
        </div>
        <div className="phonics-table" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10, marginTop: 12 }}>
          {finals.map((fin) => (
            <div key={fin.py} className="phonics-item" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 10 }}>
              <div className="row-between">
                <b style={{ fontSize: 17, color: 'var(--blue)', fontFamily: 'var(--serif)' }}>{fin.py}</b>
                <button
                  className="icon-btn"
                  onClick={() => handlePlay(fin.ex.split(' ')[0])}
                  style={{ width: 30, height: 30 }}
                  title={`Nghe ${fin.ex}`}
                >
                  🔊
                </button>
              </div>
              <p className="small muted" style={{ margin: '4px 0 2px' }}>{fin.tip}</p>
              <div className="small" style={{ color: 'var(--jade)' }}>{fin.ex}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 8 Basic Strokes */}
      <section className="card">
        <div className="row-between">
          <h3>8 Nét Chữ Hán Cơ Bản (Vĩnh Tự Bát Pháp)</h3>
          <span className="muted small">Vĩnh: 永</span>
        </div>
        <p className="muted small">Mọi chữ Hán trong tiếng Trung đều được cấu tạo từ 8 nét cơ bản này.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 12 }}>
          {basicStrokes.map((s, idx) => (
            <div key={idx} className="stroke-card" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14, padding: 12 }}>
              <div className="stroke-card-header">
                <span className="stroke-symbol">{s.symbol}</span>
                <div className="stroke-card-info">
                  <h4>{s.name}</h4>
                  <span>{s.zh}</span>
                </div>
              </div>
              <div className="stroke-card-dir">{s.direction}</div>
              <div className="small muted"><b>Mẹo:</b> {s.tip}</div>
              <div className="stroke-card-footer">
                <span className="stroke-ex-tag">
                  Ví dụ:{' '}
                  {s.examples.map((ex, eIdx) => (
                    <span
                      key={eIdx}
                      style={{ cursor: onOpenWriter ? 'pointer' : 'default', margin: '0 3px' }}
                      onClick={() => onOpenWriter && onOpenWriter(ex)}
                      title="Bấm để tập viết chữ này"
                    >
                      <b>{ex}</b>
                    </span>
                  ))}
                </span>
                {onOpenWriter && (
                  <button
                    className="btn ghost small"
                    onClick={() => onOpenWriter(s.strokeChar)}
                    style={{ padding: '2px 8px', fontSize: 11 }}
                  >
                    Tập viết
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
