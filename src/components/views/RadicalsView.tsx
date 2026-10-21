import React, { useState, useMemo } from 'react';
import {
  RADICALS_DATA,
  Radical,
  searchRadicals,
  getRadicalByStrokes,
  DECOMPOSITIONS,
  getDecomposition
} from '../../data/radicals';
import { speak } from '../../utils/tts';

interface RadicalsViewProps {
  audioEnabled: boolean;
  onOpenWriter: (char: string) => void;
}

export const RadicalsView: React.FC<RadicalsViewProps> = ({ audioEnabled, onOpenWriter }) => {
  const [activeSubTab, setActiveSubTab] = useState<'radicals' | 'decomposition'>('radicals');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStrokes, setSelectedStrokes] = useState<string>('all');
  const [selectedRadical, setSelectedRadical] = useState<Radical | null>(null);

  // Decomposition custom lookup input
  const [decompQuery, setDecompQuery] = useState<string>('休');

  // Filter radicals by search query & stroke count
  const filteredRadicals = useMemo(() => {
    let list: Radical[] = [];
    if (selectedStrokes === 'all') {
      list = searchRadicals(searchQuery);
    } else {
      const strokeList = getRadicalByStrokes(selectedStrokes);
      if (!searchQuery) {
        list = strokeList;
      } else {
        const q = searchQuery.toLowerCase().trim();
        list = strokeList.filter(
          (r) =>
            r.r.includes(q) ||
            r.hv.toLowerCase().includes(q) ||
            r.p.toLowerCase().includes(q) ||
            r.m.toLowerCase().includes(q) ||
            r.ex.includes(q) ||
            (r.v && r.v.some((v) => v.includes(q)))
        );
      }
    }
    return list;
  }, [searchQuery, selectedStrokes]);

  // Decomposition items list
  const decompositionEntries = useMemo(() => {
    return Object.entries(DECOMPOSITIONS).map(([char, data]) => ({
      char,
      ...data
    }));
  }, []);

  // Current queried decomposition
  const currentDecomp = useMemo(() => {
    return getDecomposition(decompQuery);
  }, [decompQuery]);

  return (
    <main className="view" style={{ maxWidth: 880, margin: '0 auto', padding: '16px' }}>
      {/* Top Header Card */}
      <section className="card" style={{ marginBottom: 16 }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🧩</span> 214 Bộ Thủ & Chiết Tự
            </h2>
            <p className="muted small" style={{ margin: '4px 0 0' }}>
              Nền tảng vàng cấu tạo chữ Hán: Nắm bộ thủ nhớ chữ nhanh gấp 3 lần
            </p>
          </div>

          {/* Sub Tab Switcher */}
          <div style={{ display: 'flex', gap: 6, backgroundColor: 'var(--bg-subtle, rgba(0,0,0,0.04))', padding: 4, borderRadius: 8 }}>
            <button
              className={`btn small ${activeSubTab === 'radicals' ? 'primary' : 'ghost'}`}
              onClick={() => setActiveSubTab('radicals')}
            >
              214 Bộ Thủ Khang Hy
            </button>
            <button
              className={`btn small ${activeSubTab === 'decomposition' ? 'primary' : 'ghost'}`}
              onClick={() => setActiveSubTab('decomposition')}
            >
              Chiết Tự & Mẹo Nhớ
            </button>
          </div>
        </div>

        {/* Filters if in Radicals Tab */}
        {activeSubTab === 'radicals' && (
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            {/* Search Input */}
            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                className="input"
                placeholder="🔍 Tìm bộ thủ theo chữ Hán, biến thể (亻, 氵), Pinyin, Hán-Việt (Nhân, Thủy) hay ý nghĩa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', fontSize: 14 }}
              />
            </div>

            {/* Stroke Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <span className="muted small" style={{ marginRight: 6 }}>Số nét:</span>
              {(['all', '1', '2', '3', '4', '5', '6', '7', '8+'] as const).map((stroke) => (
                <button
                  key={stroke}
                  className={`btn small ${selectedStrokes === stroke ? 'primary' : 'ghost'}`}
                  onClick={() => setSelectedStrokes(stroke)}
                  style={{ minWidth: 36, padding: '4px 8px', fontSize: 12 }}
                >
                  {stroke === 'all' ? 'Tất cả' : `${stroke} nét`}
                </button>
              ))}
              <span className="muted small" style={{ marginLeft: 'auto' }}>
                Tìm thấy: <b>{filteredRadicals.length}</b> bộ
              </span>
            </div>
          </div>
        )}
      </section>

      {/* SUBTAB 1: 214 RADICALS GRID */}
      {activeSubTab === 'radicals' && (
        <section>
          {filteredRadicals.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '36px 16px' }}>
              <p className="muted">Không tìm thấy bộ thủ nào phù hợp với từ khóa.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 12
              }}
            >
              {filteredRadicals.map((rad) => (
                <div
                  key={rad.id}
                  className="card"
                  style={{
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    border: '1px solid var(--border)'
                  }}
                  onClick={() => setSelectedRadical(rad)}
                >
                  <div>
                    {/* Header: Radical ID + Stroke Badge */}
                    <div className="row-between" style={{ marginBottom: 8 }}>
                      <span className="muted small">#{rad.id}</span>
                      <span className="badge s-mastered" style={{ fontSize: 11 }}>
                        {rad.s} nét
                      </span>
                    </div>

                    {/* Big Radical Char + Pinyin + HV */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 38,
                          fontFamily: 'var(--serif)',
                          fontWeight: 700,
                          color: '#2f6f5e',
                          lineHeight: 1
                        }}
                      >
                        {rad.r}
                      </span>
                      {rad.v && rad.v.length > 0 && (
                        <span className="muted" style={{ fontSize: 18, fontFamily: 'var(--serif)' }}>
                          ({rad.v.join(', ')})
                        </span>
                      )}
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                          {rad.hv}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                          {rad.p}
                        </div>
                      </div>
                    </div>

                    {/* Meaning */}
                    <p style={{ margin: '4px 0 8px', fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>
                      {rad.m}
                    </p>

                    {/* Examples */}
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      Ví dụ: <span style={{ fontFamily: 'var(--serif)', color: '#2f6f5e', fontWeight: 600 }}>{rad.ex}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      marginTop: 12,
                      paddingTop: 8,
                      borderTop: '1px dashed var(--border)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn ghost small"
                      onClick={() => speak(rad.r, 0.85, audioEnabled)}
                      style={{ flex: 1, padding: '4px 8px', fontSize: 12 }}
                      title="Phát âm"
                    >
                      🔊 Nghe
                    </button>
                    <button
                      className="btn ghost small"
                      onClick={() => onOpenWriter(rad.r)}
                      style={{ flex: 1, padding: '4px 8px', fontSize: 12 }}
                      title="Tập viết theo thứ tự nét"
                    >
                      ✍️ Viết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SUBTAB 2: CHARACTER DECOMPOSITION & MNEMONICS */}
      {activeSubTab === 'decomposition' && (
        <section>
          {/* Interactive Character Lookup Formula */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>🔍 Tra Công Thức Chiết Tự</h3>
            <p className="muted small" style={{ margin: '0 0 12px' }}>
              Nhập một chữ Hán để xem công thức ghép bộ thủ & câu chuyện hình ảnh ghi nhớ sâu:
            </p>

            <div style={{ display: 'flex', gap: 8, maxWidth: 360, marginBottom: 16 }}>
              <input
                type="text"
                className="input"
                maxLength={4}
                value={decompQuery}
                onChange={(e) => setDecompQuery(e.target.value)}
                placeholder="Ví dụ: 休, 明, 好, 安, 男..."
                style={{ fontSize: 16, textAlign: 'center' }}
              />
              <button
                className="btn primary"
                onClick={() => {
                  if (currentDecomp) speak(currentDecomp.char || decompQuery, 0.85, audioEnabled);
                }}
              >
                Tra cứu
              </button>
            </div>

            {/* Queried Result Card */}
            {currentDecomp ? (
              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  backgroundColor: 'rgba(47, 111, 94, 0.08)',
                  border: '1px solid rgba(47, 111, 94, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: 52,
                      fontFamily: 'var(--serif)',
                      fontWeight: 700,
                      color: '#2f6f5e'
                    }}
                  >
                    {currentDecomp.char}
                  </span>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 4 }}>
                      Công thức cấu tạo:
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {currentDecomp.parts.map((p, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <span style={{ fontWeight: 700, color: '#2f6f5e' }}>+</span>}
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: 6,
                              backgroundColor: '#fff',
                              border: '1px solid var(--border)',
                              fontSize: 14,
                              fontWeight: 600
                            }}
                          >
                            {p}
                          </span>
                        </React.Fragment>
                      ))}
                      <span style={{ fontWeight: 700, color: '#2f6f5e' }}>=</span>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          backgroundColor: '#2f6f5e',
                          color: '#fff',
                          fontSize: 14,
                          fontWeight: 700
                        }}
                      >
                        {currentDecomp.char}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn ghost small"
                      onClick={() => speak(currentDecomp.char || decompQuery, 0.85, audioEnabled)}
                    >
                      🔊 Phát âm
                    </button>
                    <button
                      className="btn primary small"
                      onClick={() => onOpenWriter(currentDecomp.char || decompQuery)}
                    >
                      ✍️ Tập viết
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: '1px dashed rgba(47, 111, 94, 0.3)',
                    fontSize: 14,
                    color: 'var(--ink)',
                    lineHeight: 1.6
                  }}
                >
                  <b>💡 Mẹo nhớ hình tượng:</b> {currentDecomp.story}
                </div>
              </div>
            ) : (
              <p className="muted small" style={{ margin: 0 }}>
                Chưa có dữ liệu chiết tự chi tiết cho chữ này. Hãy thử các chữ gợi ý bên dưới!
              </p>
            )}
          </div>

          {/* List of 40+ Core Decompositions */}
          <h3 style={{ margin: '20px 0 12px', fontSize: 16 }}>
            📚 Tuyển Tập 40+ Chữ Hán Chiết Tự Tiêu Biểu Nhất
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: 12
            }}
          >
            {decompositionEntries.map((item) => (
              <div
                key={item.char}
                className="card"
                style={{
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: 36,
                        fontFamily: 'var(--serif)',
                        fontWeight: 700,
                        color: '#2f6f5e'
                      }}
                    >
                      {item.char}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Cấu thành từ:</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                        {item.parts.join(' + ')}
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: '6px 0', fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>
                    {item.story}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: '1px dashed var(--border)'
                  }}
                >
                  <button
                    className="btn ghost small"
                    onClick={() => speak(item.char, 0.85, audioEnabled)}
                    style={{ flex: 1, padding: '3px 6px', fontSize: 12 }}
                  >
                    🔊 Nghe
                  </button>
                  <button
                    className="btn ghost small"
                    onClick={() => onOpenWriter(item.char)}
                    style={{ flex: 1, padding: '3px 6px', fontSize: 12 }}
                  >
                    ✍️ Viết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Radical Detail Modal */}
      {selectedRadical && (
        <div
          className="sheet center-sheet"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRadical(null);
          }}
        >
          <div className="sheet-card write-card" style={{ maxWidth: 460 }}>
            <div className="row-between">
              <span className="badge s-mastered">Bộ thủ #{selectedRadical.id}</span>
              <button className="icon-btn" onClick={() => setSelectedRadical(null)} aria-label="Đóng">
                ✕
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
              <div
                style={{
                  fontSize: 64,
                  fontFamily: 'var(--serif)',
                  fontWeight: 700,
                  color: '#2f6f5e',
                  lineHeight: 1
                }}
              >
                {selectedRadical.r}
              </div>

              {selectedRadical.v && selectedRadical.v.length > 0 && (
                <div style={{ fontSize: 20, color: 'var(--muted)', marginTop: 4 }}>
                  Biến thể: <b>{selectedRadical.v.join(', ')}</b>
                </div>
              )}

              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, color: 'var(--ink)' }}>
                {selectedRadical.hv} · {selectedRadical.p}
              </div>

              <div className="badge s-learning" style={{ marginTop: 6 }}>
                Số nét: {selectedRadical.s}
              </div>

              <p style={{ margin: '16px 0 8px', fontSize: 15, color: 'var(--ink)', lineHeight: 1.5 }}>
                {selectedRadical.m}
              </p>

              <div
                style={{
                  margin: '12px 0 16px',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-subtle, rgba(0,0,0,0.03))',
                  borderRadius: 8,
                  fontSize: 14,
                  textAlign: 'left'
                }}
              >
                <span className="muted">Các chữ ví dụ tiêu biểu:</span>
                <div
                  style={{
                    fontSize: 20,
                    fontFamily: 'var(--serif)',
                    color: '#2f6f5e',
                    fontWeight: 600,
                    marginTop: 4
                  }}
                >
                  {selectedRadical.ex}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  className="btn ghost"
                  onClick={() => speak(selectedRadical.r, 0.85, audioEnabled)}
                  style={{ flex: 1 }}
                >
                  🔊 Nghe phát âm
                </button>
                <button
                  className="btn primary"
                  onClick={() => {
                    const char = selectedRadical.r;
                    setSelectedRadical(null);
                    onOpenWriter(char);
                  }}
                  style={{ flex: 1 }}
                >
                  ✍️ Tập viết nét
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
