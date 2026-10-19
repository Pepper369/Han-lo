/* Virtual Stroke Canvas — Bảng Luyện Viết Chữ Hán Thuần HTML5 Canvas.
   Hoạt động 100% Offline, hỗ trợ lưới Mễ (米), lưới Điền (田), nét mực bút lông
   và cẩm nang 8 quy tắc bút thuận vàng. */

(function (global) {
  "use strict";

  function StrokeCanvas(containerId, options) {
    this.container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
    if (!this.container) return;

    this.opts = Object.assign({
      size: 320,
      inkColor: "#1c1917",
      gridType: "mi", // 'mi' (lưới Mễ 米) hoặc 'tian' (lưới Điền 田)
      watermarkChar: "",
      watermarkColor: "rgba(180, 160, 140, 0.28)",
      lineWidth: 8
    }, options);

    this.strokes = []; // Lưu các nét để Undo
    this.currentStroke = [];
    this.isDrawing = false;
    this.lastTime = 0;
    this.lastVelocity = 0;

    this.init();
  }

  StrokeCanvas.prototype.init = function () {
    this.container.innerHTML = "";
    this.canvas = document.createElement("canvas");
    this.canvas.className = "stroke-canvas-element";
    this.canvas.width = this.opts.size * window.devicePixelRatio || this.opts.size;
    this.canvas.height = this.opts.size * window.devicePixelRatio || this.opts.size;
    this.canvas.style.width = this.opts.size + "px";
    this.canvas.style.height = this.opts.size + "px";
    this.canvas.style.touchAction = "none";
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    this.bindEvents();
    this.redraw();
  };

  StrokeCanvas.prototype.drawGrid = function () {
    const ctx = this.ctx;
    const s = this.opts.size;

    ctx.save();
    // Nền giấy tuyên chỉ phương Đông
    ctx.fillStyle = "#faf7f2";
    ctx.fillRect(0, 0, s, s);

    // Khung viền ngoài
    ctx.strokeStyle = "#c8b39b";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, s - 2, s - 2);

    // Đường kẻ lưới
    ctx.strokeStyle = "rgba(195, 74, 54, 0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Trục chữ thập (lưới Điền)
    ctx.beginPath();
    ctx.moveTo(s / 2, 0); ctx.lineTo(s / 2, s);
    ctx.moveTo(0, s / 2); ctx.lineTo(s, s / 2);
    ctx.stroke();

    // Hai đường chéo (lưới Mễ)
    if (this.opts.gridType === "mi") {
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(s, s);
      ctx.moveTo(s, 0); ctx.lineTo(0, s);
      ctx.stroke();
    }

    // Chữ mẫu chìm (watermark)
    if (this.opts.watermarkChar) {
      ctx.setLineDash([]);
      ctx.font = Math.round(s * 0.75) + "px 'Noto Serif SC', 'Songti SC', 'SimSun', serif";
      ctx.fillStyle = this.opts.watermarkColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.opts.watermarkChar, s / 2, s / 2 + s * 0.05);
    }

    ctx.restore();
  };

  StrokeCanvas.prototype.redraw = function () {
    this.drawGrid();
    const ctx = this.ctx;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    this.strokes.forEach(stroke => {
      if (!stroke.points || stroke.points.length < 2) return;
      ctx.strokeStyle = stroke.color || this.opts.inkColor;
      for (let i = 1; i < stroke.points.length; i++) {
        const p1 = stroke.points[i - 1];
        const p2 = stroke.points[i];
        ctx.lineWidth = p2.w || this.opts.lineWidth;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });

    ctx.restore();
  };

  StrokeCanvas.prototype.getPos = function (e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      t: Date.now()
    };
  };

  StrokeCanvas.prototype.bindEvents = function () {
    const self = this;

    function start(e) {
      e.preventDefault();
      self.isDrawing = true;
      const pos = self.getPos(e);
      pos.w = self.opts.lineWidth;
      self.currentStroke = { color: self.opts.inkColor, points: [pos] };
      self.lastTime = pos.t;
    }

    function move(e) {
      if (!self.isDrawing) return;
      e.preventDefault();
      const pos = self.getPos(e);
      const points = self.currentStroke.points;
      const lastP = points[points.length - 1];

      const dist = Math.hypot(pos.x - lastP.x, pos.y - lastP.y);
      const dt = Math.max(pos.t - lastP.t, 1);
      const speed = dist / dt;

      // Nét bút lông: Viết nhanh nét thanh mảnh, viết chậm nét đậm sâu
      const targetW = Math.max(self.opts.lineWidth * 0.45, Math.min(self.opts.lineWidth * 1.4, self.opts.lineWidth - speed * 1.5));
      pos.w = lastP.w * 0.6 + targetW * 0.4;

      points.push(pos);

      // Vẽ ngay đoạn nét
      const ctx = self.ctx;
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = self.currentStroke.color;
      ctx.lineWidth = pos.w;
      ctx.beginPath();
      ctx.moveTo(lastP.x, lastP.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.restore();
    }

    function end() {
      if (!self.isDrawing) return;
      self.isDrawing = false;
      if (self.currentStroke.points.length > 1) {
        self.strokes.push(self.currentStroke);
      }
      self.currentStroke = null;
    }

    this.canvas.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);

    this.canvas.addEventListener("touchstart", start, { passive: false });
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
  };

  StrokeCanvas.prototype.clear = function () {
    this.strokes = [];
    this.redraw();
  };

  StrokeCanvas.prototype.undo = function () {
    this.strokes.pop();
    this.redraw();
  };

  StrokeCanvas.prototype.setWatermark = function (char) {
    this.opts.watermarkChar = char || "";
    this.redraw();
  };

  StrokeCanvas.prototype.setInkColor = function (color) {
    this.opts.inkColor = color;
  };

  StrokeCanvas.prototype.setGridType = function (type) {
    this.opts.gridType = type;
    this.redraw();
  };

  StrokeCanvas.prototype.toDataURL = function () {
    return this.canvas.toDataURL("image/png");
  };

  global.StrokeCanvas = StrokeCanvas;

  // 8 Quy tắc bút thuận vàng chuẩn quốc tế
  global.STROKE_RULES = [
    { title: "Ngang trước sổ sau", zh: "先横后竖", example: "十, 木, 丰", desc: "Nét ngang viết trước, nét sổ dọc cắt qua viết sau." },
    { title: "Phẩy trước mác sau", zh: "先撇后捺", example: "八, 人, 大", desc: "Nét xiên trái (phẩy) viết trước, nét xiên phải (mác) viết sau." },
    { title: "Trên trước dưới sau", zh: "从上到下", example: "三, 言, 京", desc: "Viết các nét hoặc bộ phận ở phía trên trước rồi xuống dưới." },
    { title: "Trái trước phải sau", zh: "从左到右", example: "你, 好, 喝", desc: "Viết bộ thủ hoặc kết cấu bên trái trước, bên phải sau." },
    { title: "Ngoài trước trong sau", zh: "从外到内", example: "月, 同, 问", desc: "Viết khung bao bọc bên ngoài trước rồi viết phần bên trong." },
    { title: "Vào trước đóng sau", zh: "先进入后关门", example: "日, 回, 国", desc: "Mở khung ngoài, viết các nét bên trong rồi mới viết nét đáy đóng lại." },
    { title: "Giữa trước hai bên sau", zh: "先中间后两边", example: "小, 水, 办", desc: "Nét sổ hoặc móc ở giữa viết trước, các nét phẩy/chấm hai bên viết sau." },
    { title: "Đáy ngang viết sau cùng", zh: "底横后写", example: "土, 堂, 坚", desc: "Nét ngang đỡ toàn bộ chữ ở đáy luôn được viết sau cùng." }
  ];

})(typeof window !== "undefined" ? window : global);
