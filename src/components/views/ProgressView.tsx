import React from 'react';
import { Word, Card, HistoryRecord, ExamHistoryItem } from '../../types';
import { stage, isDue, dayKey, DAY } from '../../utils/core';

interface ProgressViewProps {
  words: Word[];
  cards: Record<number, Card>;
  history: Record<string, HistoryRecord>;
  examHistory: ExamHistoryItem[];
  streakCount: number;
  onExportBackup: () => void;
  onImportBackup: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  words,
  cards,
  history,
  examHistory,
  streakCount,
  onExportBackup,
  onImportBackup
}) => {
  const now = Date.now();
  const st = { learned: 0, mastered: 0, learning: 0, review: 0 };

  words.forEach((w) => {
    const s = stage(cards[w.id], now);
    if (s === "new") return;
    st.learned++;
    if (s === "mastered") st.mastered++;
    else if (s === "learning") st.learning++;
    else st.review++;
  });

  const dueCount = words.filter((w) => isDue(cards[w.id], now)).length;

  // 7-day accuracy
  let n7 = 0;
  let c7 = 0;
  for (let i = 0; i < 7; i++) {
    const h = history[dayKey(now - i * DAY)];
    if (h) {
      n7 += h.n;
      c7 += h.c;
    }
  }
  const acc7 = n7 ? Math.round((c7 / n7) * 100) : 0;

  // 14-day bar chart
  let maxN = 1;
  const days14: { key: string; n: number; label: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const t = now - i * DAY;
    const k = dayKey(t);
    const h = history[k] || { n: 0, c: 0 };
    days14.push({ key: k, n: h.n, label: new Date(t).getDate() });
    if (h.n > maxN) maxN = h.n;
  }

  // 52-week heatmap (364 days)
  const heatCells: { key: string; count: number; level: number }[] = [];
  for (let i = 363; i >= 0; i--) {
    const dTime = now - i * DAY;
    const dKey = dayKey(dTime);
    const rec = history[dKey];
    const cnt = rec ? rec.n : 0;
    const lvl = cnt === 0 ? 0 : cnt <= 5 ? 1 : cnt <= 15 ? 2 : cnt <= 30 ? 3 : 4;
    heatCells.push({ key: dKey, count: cnt, level: lvl });
  }

  // Memory Matrix (4 intervals)
  let m1 = 0, m2 = 0, m3 = 0, m4 = 0;
  Object.keys(cards).forEach((k) => {
    const c = cards[Number(k)];
    if (!c) return;
    const iv = c.interval || 0;
    if (iv <= 1) m1++;
    else if (iv <= 6) m2++;
    else if (iv <= 20) m3++;
    else m4++;
  });

  const total = words.length || 1;

  return (
    <main id="view-progress" className="view">
      {/* 4 Overview stats */}
      <section className="card">
        <div className="eyebrow">Thống Kê Tổng Quan</div>
        <h2>Trí Nhớ &amp; Độ Thuộc Từ</h2>

        <div className="summary-stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, margin: '14px 0' }}>
          <div>
            <b style={{ color: 'var(--jade)' }}>{st.mastered}</b>
            <span>Đã thuộc</span>
          </div>
          <div>
            <b style={{ color: 'var(--blue)' }}>{st.learning + st.review}</b>
            <span>Đang học</span>
          </div>
          <div>
            <b style={{ color: 'var(--amber)' }}>{dueCount}</b>
            <span>Đến hạn</span>
          </div>
          <div>
            <b style={{ color: 'var(--gray)' }}>{words.length - st.learned}</b>
            <span>Chưa học</span>
          </div>
        </div>

        <div className="seg-bar" style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', background: 'var(--paper-2)', margin: '12px 0 8px' }}>
          <i className="mastered" style={{ width: `${(st.mastered / total) * 100}%`, background: 'var(--jade)', display: 'block' }}></i>
          <i className="learning" style={{ width: `${((st.learning + st.review) / total) * 100}%`, background: 'var(--blue)', display: 'block' }}></i>
          <i className="new" style={{ width: `${((words.length - st.learned) / total) * 100}%`, background: 'var(--line)', display: 'block' }}></i>
        </div>
        <div className="legend">
          <span><i className="dot mastered"></i>Đã thuộc ({Math.round((st.mastered / total) * 100)}%)</span>
          <span><i className="dot learning"></i>Đang học ({Math.round(((st.learning + st.review) / total) * 100)}%)</span>
          <span><i className="dot new"></i>Chưa học ({Math.round(((words.length - st.learned) / total) * 100)}%)</span>
        </div>
      </section>

      {/* 14-day Activity chart */}
      <section className="card">
        <div className="row-between">
          <h3>Tần Suất Ôn Tập 14 Ngày Qua</h3>
          <span className="muted small">Độ chính xác 7 ngày: <b style={{ color: 'var(--jade)' }}>{acc7}%</b></span>
        </div>
        <div className="bar-chart" style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, marginTop: 14 }}>
          {days14.map((d, idx) => {
            const h = Math.max(4, Math.round((d.n / maxN) * 100));
            return (
              <div
                key={idx}
                className={`day ${d.n ? '' : 'zero'}`}
                title={`${d.key}: ${d.n} lượt ôn`}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}
              >
                <i
                  style={{
                    height: `${h}%`,
                    width: '100%',
                    background: d.n ? 'var(--jade)' : 'var(--line)',
                    borderRadius: 4,
                    display: 'block'
                  }}
                />
                <span className="small muted" style={{ marginTop: 4, fontSize: 10 }}>{d.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Memory Matrix */}
      <section className="card">
        <div className="row-between">
          <h3>Ma Trận Củng Cố Trí Nhớ (SM-2)</h3>
          <span className="muted small">Spaced Repetition</span>
        </div>
        <p className="muted small">
          Theo thuật toán SM-2, từ càng được ôn đúng nhiều lần thì khoảng cách ôn (interval) càng dài ra, chuyển dịch dần vào trí nhớ vĩnh viễn.
        </p>

        <div className="memory-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 12 }}>
          <div className="memory-card" style={{ background: 'var(--paper-2)', padding: '12px 14px', borderRadius: 12 }}>
            <div className="row-between">
              <span className="small">Giai đoạn 1 (≤ 1 ngày)</span>
              <b style={{ color: 'var(--red)' }}>{m1}</b>
            </div>
            <p className="muted small" style={{ margin: '4px 0 0' }}>Trí nhớ ngắn hạn, cần lặp lại nhanh</p>
          </div>
          <div className="memory-card" style={{ background: 'var(--paper-2)', padding: '12px 14px', borderRadius: 12 }}>
            <div className="row-between">
              <span className="small">Giai đoạn 2 (2 – 6 ngày)</span>
              <b style={{ color: 'var(--amber)' }}>{m2}</b>
            </div>
            <p className="muted small" style={{ margin: '4px 0 0' }}>Bắt đầu hình thành liên kết vỏ não</p>
          </div>
          <div className="memory-card" style={{ background: 'var(--paper-2)', padding: '12px 14px', borderRadius: 12 }}>
            <div className="row-between">
              <span className="small">Giai đoạn 3 (7 – 20 ngày)</span>
              <b style={{ color: 'var(--blue)' }}>{m3}</b>
            </div>
            <p className="muted small" style={{ margin: '4px 0 0' }}>Trí nhớ trung hạn, phản xạ tự nhiên</p>
          </div>
          <div className="memory-card" style={{ background: 'var(--paper-2)', padding: '12px 14px', borderRadius: 12 }}>
            <div className="row-between">
              <span className="small">Giai đoạn 4 (&gt; 20 ngày)</span>
              <b style={{ color: 'var(--jade)' }}>{m4}</b>
            </div>
            <p className="muted small" style={{ margin: '4px 0 0' }}>Đã thuộc sâu vào trí nhớ dài hạn</p>
          </div>
        </div>
      </section>

      {/* 52-week heatmap */}
      <section className="card">
        <div className="row-between">
          <h3>Bản Đồ Học Tập 52 Tuần</h3>
          <span className="muted small">🔥 {streakCount} ngày liên tiếp</span>
        </div>
        <p className="muted small">Theo dõi độ kiên trì học tiếng Trung mỗi ngày trong năm.</p>
        <div
          className="heat-grid"
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridTemplateRows: 'repeat(7, 10px)',
            gap: 3,
            overflowX: 'auto',
            padding: '8px 0'
          }}
        >
          {heatCells.map((c, idx) => (
            <div
              key={idx}
              className={`heat-cell heat-${c.level}`}
              title={`${c.key}: ${c.count} lượt ôn`}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background:
                  c.level === 0
                    ? 'var(--paper-2)'
                    : c.level === 1
                    ? 'rgba(47, 111, 94, 0.3)'
                    : c.level === 2
                    ? 'rgba(47, 111, 94, 0.55)'
                    : c.level === 3
                    ? 'rgba(47, 111, 94, 0.8)'
                    : 'var(--jade)'
              }}
            />
          ))}
        </div>
      </section>

      {/* Backup and restore */}
      <section className="card">
        <h3>Sao Lưu &amp; Bảo Vệ Dữ Liệu</h3>
        <p className="muted small">
          Toàn bộ tiến độ học được bảo quản an toàn cục bộ trên trình duyệt. Bạn có thể xuất bản sao lưu dạng file JSON để chuyển sang máy khác.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button className="btn ghost" onClick={onExportBackup} style={{ flex: 1 }}>
            💾 Xuất bản sao lưu (.json)
          </button>
          <button className="btn ghost" onClick={onImportBackup} style={{ flex: 1 }}>
            📂 Khôi phục tiến độ
          </button>
        </div>
      </section>
    </main>
  );
};
