import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Word, Card, StrokeRule } from '../../types';

interface WriteViewProps {
  words: Word[];
  cards: Record<number, Card>;
  onOpenWriter: (char: string) => void;
}

const STROKE_RULES: StrokeRule[] = [
  { title: "Ngang trước sổ sau", zh: "先横后竖", example: "十, 木, 丰", desc: "Nét ngang viết trước, nét sổ dọc cắt qua viết sau." },
  { title: "Phẩy trước mác sau", zh: "先撇后捺", example: "八, 人, 大", desc: "Nét xiên trái (phẩy) viết trước, nét xiên phải (mác) viết sau." },
  { title: "Trên trước dưới sau", zh: "从上到下", example: "三, 言, 京", desc: "Viết các nét hoặc bộ phận ở phía trên trước rồi xuống dưới." },
  { title: "Trái trước phải sau", zh: "从左到右", example: "你, 好, 喝", desc: "Viết bộ thủ hoặc kết cấu bên trái trước, bên phải sau." },
  { title: "Ngoài trước trong sau", zh: "从外到内", example: "月, 同, 问", desc: "Viết khung bao bọc bên ngoài trước rồi viết phần bên trong." },
  { title: "Vào trước đóng sau", zh: "先进入后关门", example: "日, 回, 国", desc: "Mở khung ngoài, viết các nét bên trong rồi mới viết nét đáy đóng lại." },
  { title: "Giữa trước hai bên sau", zh: "先中间后两边", example: "小, 水, 办", desc: "Nét sổ hoặc móc ở giữa viết trước, các nét phẩy/chấm hai bên viết sau." },
  { title: "Đáy ngang viết sau cùng", zh: "底横后写", example: "土, 堂, 坚", desc: "Nét ngang đỡ toàn bộ chữ ở đáy luôn được viết sau cùng." }
];

interface Point {
  x: number;
  y: number;
  t: number;
  w: number;
}

interface Stroke {
  color: string;
  points: Point[];
}

export const WriteView: React.FC<WriteViewProps> = ({ words, cards, onOpenWriter }) => {
  const [filter, setFilter] = useState<'learned' | 'all'>('learned');
  const [inkColor, setInkColor] = useState<string>('#1c1917');
  const [gridType, setGridType] = useState<'mi' | 'tian'>('mi');
  const [watermark, setWatermark] = useState<string>('永');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Extract unique characters from words
  const { allChars, learnedChars } = React.useMemo(() => {
    const seen: Record<string, boolean> = {};
    const all: string[] = [];
    const learnedSet: Record<string, boolean> = {};

    words.forEach((w) => {
      const isWordLearned = !!cards[w.id];
      Array.from(w.h).forEach((ch) => {
        if (!seen[ch]) {
          seen[ch] = true;
          all.push(ch);
        }
        if (isWordLearned) {
          learnedSet[ch] = true;
        }
      });
    });

    return { allChars: all, learnedChars: learnedSet };
  }, [words, cards]);

  const displayChars = filter === 'all' ? allChars : allChars.filter((ch) => learnedChars[ch]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const s = 300;
    const dpr = window.devicePixelRatio || 1;

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    // Draw background
    ctx.save();
    ctx.fillStyle = '#faf7f2';
    ctx.fillRect(0, 0, s, s);

    // Border
    ctx.strokeStyle = '#c8b39b';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, s - 2, s - 2);

    // Grid lines
    ctx.strokeStyle = 'rgba(195, 74, 54, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Cross axes (Tian grid)
    ctx.beginPath();
    ctx.moveTo(s / 2, 0); ctx.lineTo(s / 2, s);
    ctx.moveTo(0, s / 2); ctx.lineTo(s, s / 2);
    ctx.stroke();

    // Diagonals (Mi grid)
    if (gridType === 'mi') {
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(s, s);
      ctx.moveTo(s, 0); ctx.lineTo(0, s);
      ctx.stroke();
    }

    // Watermark
    if (watermark) {
      ctx.setLineDash([]);
      ctx.font = `${Math.round(s * 0.72)}px "Noto Serif SC", "Songti SC", "SimSun", serif`;
      ctx.fillStyle = 'rgba(180, 160, 140, 0.28)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(watermark, s / 2, s / 2 + s * 0.05);
    }
    ctx.restore();

    // Draw user strokes
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokesRef.current.forEach((stroke) => {
      if (!stroke.points || stroke.points.length < 2) return;
      ctx.strokeStyle = stroke.color;
      for (let i = 1; i < stroke.points.length; i++) {
        const p1 = stroke.points[i - 1];
        const p2 = stroke.points[i];
        ctx.lineWidth = p2.w;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });

    ctx.restore();
  }, [gridType, watermark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = 300;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = s * dpr;
    canvas.height = s * dpr;
    canvas.style.width = `${s}px`;
    canvas.style.height = `${s}px`;
    redrawCanvas();
  }, [redrawCanvas]);

  function getPos(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): { x: number; y: number } {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function handleStart(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    isDrawingRef.current = true;
    const { x, y } = getPos(e);
    const p: Point = { x, y, t: Date.now(), w: 8 };
    currentStrokeRef.current = { color: inkColor, points: [p] };
  }

  function handleMove(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    const { x, y } = getPos(e);
    const pts = currentStrokeRef.current.points;
    const lastP = pts[pts.length - 1];

    const dist = Math.hypot(x - lastP.x, y - lastP.y);
    const dt = Math.max(Date.now() - lastP.t, 1);
    const speed = dist / dt;

    // Ink brush dynamics: fast = thin, slow = thick
    const baseWidth = 8;
    const targetW = Math.max(baseWidth * 0.45, Math.min(baseWidth * 1.4, baseWidth - speed * 1.5));
    const w = lastP.w * 0.6 + targetW * 0.4;

    const newP: Point = { x, y, t: Date.now(), w };
    pts.push(newP);

    // Render segment immediately
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentStrokeRef.current.color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(lastP.x, lastP.y);
    ctx.lineTo(newP.x, newP.y);
    ctx.stroke();
    ctx.restore();
  }

  function handleEnd() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 1) {
      strokesRef.current.push(currentStrokeRef.current);
    }
    currentStrokeRef.current = null;
  }

  function handleUndo() {
    strokesRef.current.pop();
    redrawCanvas();
  }

  function handleClear() {
    strokesRef.current = [];
    redrawCanvas();
  }

  return (
    <main id="view-write" className="view">
      <div className="write-head">
        <h2>Tập viết chữ Hán</h2>
        <p className="muted small">
          Chạm vào chữ để xem bút thuận và luyện viết. Bên dưới có bảng thư pháp tự do không cần mạng.
        </p>
        <div className="chips" role="group" aria-label="Lọc chữ">
          <button
            className={`chip ${filter === 'learned' ? 'active' : ''}`}
            onClick={() => setFilter('learned')}
          >
            Chữ đã gặp ({Object.keys(learnedChars).length})
          </button>
          <button
            className={`chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả ({allChars.length})
          </button>
        </div>
      </div>

      <div className="char-grid">
        {displayChars.length === 0 ? (
          <p className="muted empty">Chưa có chữ nào. Hãy học vài từ trước nhé.</p>
        ) : (
          displayChars.map((ch) => (
            <button
              key={ch}
              className={`char-btn ${learnedChars[ch] ? 'learned' : ''}`}
              onClick={() => {
                setWatermark(ch);
                onOpenWriter(ch);
              }}
              aria-label={`Tập viết ${ch}`}
            >
              {ch}
            </button>
          ))
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <section className="card">
          <div className="row-between">
            <div>
              <p className="eyebrow">Offline-First · HTML5 Canvas</p>
              <h3 style={{ margin: '2px 0' }}>Bảng Viết Thư Pháp Tự Do</h3>
            </div>
            <button
              className="badge s-mastered"
              onClick={() => setGridType((g) => (g === 'mi' ? 'tian' : 'mi'))}
              style={{ cursor: 'pointer', border: 'none', background: 'var(--jade-soft)', color: 'var(--jade)' }}
            >
              {gridType === 'mi' ? 'Lưới Mễ (米)' : 'Lưới Điền (田)'}
            </button>
          </div>
          <p className="muted small">
            Luyện viết tự do với mực thư pháp biến thiên nét thanh nét đậm, mẫu chữ chìm <b>{watermark}</b>.
          </p>

          <div className="canvas-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12 }}>
            <canvas
              ref={canvasRef}
              className="stroke-canvas-element"
              style={{ touchAction: 'none', borderRadius: 8, boxShadow: 'var(--shadow)', cursor: 'crosshair' }}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            />

            <div className="canvas-tools-row" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className={`color-dot ${inkColor === '#1c1917' ? 'active' : ''}`}
                onClick={() => setInkColor('#1c1917')}
                style={{ background: '#1c1917' }}
                title="Mực tàu đen"
              />
              <button
                className={`color-dot ${inkColor === '#b91c1c' ? 'active' : ''}`}
                onClick={() => setInkColor('#b91c1c')}
                style={{ background: '#b91c1c' }}
                title="Son đỏ hoàng triều"
              />
              <button
                className={`color-dot ${inkColor === '#0f766e' ? 'active' : ''}`}
                onClick={() => setInkColor('#0f766e')}
                style={{ background: '#0f766e' }}
                title="Ngọc bích"
              />
              <button className="btn ghost small" onClick={handleUndo}>
                ↩ Hoàn tác
              </button>
              <button className="btn ghost small" onClick={handleClear}>
                🗑️ Xóa hết
              </button>
            </div>
          </div>
        </section>

        <section className="card stroke-rules-card" style={{ marginTop: 14 }}>
          <div className="row-between">
            <h3>8 Quy Tắc Bút Thuận Vàng</h3>
            <span className="muted small">Quy tắc viết chữ Hán</span>
          </div>
          <div style={{ marginTop: 12 }}>
            {STROKE_RULES.map((r, idx) => (
              <div key={idx} className="rule-item">
                <span className="rule-num">{idx + 1}</span>
                <div style={{ flex: 1 }}>
                  <div>
                    <b>{r.title}</b> <span className="muted">({r.zh})</span>
                  </div>
                  <div className="small muted">
                    {r.desc} · Ví dụ: <b style={{ color: 'var(--jade)' }}>{r.example}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
