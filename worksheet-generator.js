/* Worksheet Generator — Trình Tạo Vở Tập Viết Chữ Hán Chuẩn Khổ A4.
   Hoạt động 100% Offline, hỗ trợ Ô Mễ (米字格), Ô Điền (田字格), Ô Hồi Cung (回宫格),
   chế độ nét mờ tập tô (tracing), pinyin, Hán-Việt và xuất in ấn / PDF trình duyệt. */

(function (global) {
  "use strict";

  var WorksheetGenerator = {
    GRID_TYPES: {
      mizi: { name: "Ô Mễ (米字格)", desc: "Trục chữ thập + 2 đường chéo nét đứt" },
      tianzi: { name: "Ô Điền (田字格)", desc: "Trục chữ thập nét đứt" },
      huigong: { name: "Ô Hồi Cung (回宫格)", desc: "Khung chữ nhật trung tâm định hình tỷ lệ" }
    },

    FADE_MODES: {
      standard: { name: "Chuẩn (Đậm → Mờ dần → Trống)", desc: "Ô 1 đậm, ô 2-3 nét mờ, còn lại trống" },
      trace_all: { name: "Tô nét toàn bộ (Tập đồ chữ)", desc: "Tất cả các ô đều có nét mờ để tô theo" },
      blank: { name: "Thử thách (Chỉ mẫu ô đầu)", desc: "Chỉ ô 1 có mẫu, còn lại tự nhớ viết" }
    },

    GRID_COLORS: {
      cinnabar: { name: "Đỏ chu sa (朱砂)", border: "#c84a32", grid: "rgba(200, 74, 50, 0.45)" },
      jade: { name: "Xanh ngọc Hán Lộ", border: "#2f6f5e", grid: "rgba(47, 111, 94, 0.42)" },
      charcoal: { name: "Mực nho truyền thống", border: "#57534e", grid: "rgba(87, 83, 78, 0.4)" }
    },

    defaultOptions: function () {
      return {
        title: "HÁN LỘ · VỞ TẬP VIẾT CHỮ HÁN",
        subtitle: "Chuẩn đề cương HSK 3.0 · Khổ A4",
        gridType: "mizi",
        fadeMode: "standard",
        colorTheme: "cinnabar",
        cellsPerRow: 10,
        showMeta: true,
        words: []
      };
    },

    /**
     * Tạo chuỗi SVG cho một ô lưới duy nhất (chuẩn vector sắc nét khi in)
     */
    generateCellSvg: function (char, opacity, gridType, colorTheme, size) {
      size = size || 50;
      gridType = gridType || "mizi";
      var theme = this.GRID_COLORS[colorTheme] || this.GRID_COLORS.cinnabar;
      var s = size;
      var half = s / 2;

      var svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + s + ' ' + s + '" width="' + s + '" height="' + s + '" class="ws-cell-svg">'];

      // Khung viền ngoài
      svg.push('<rect x="0.5" y="0.5" width="' + (s - 1) + '" height="' + (s - 1) + '" fill="#fff" stroke="' + theme.border + '" stroke-width="1.2"/>');

      // Đường kẻ bên trong
      if (gridType === "mizi") {
        // Lưới Mễ: Chữ thập + chéo
        svg.push('<line x1="0" y1="0" x2="' + s + '" y2="' + s + '" stroke="' + theme.grid + '" stroke-width="0.8" stroke-dasharray="3,3"/>');
        svg.push('<line x1="' + s + '" y1="0" x2="0" y2="' + s + '" stroke="' + theme.grid + '" stroke-width="0.8" stroke-dasharray="3,3"/>');
        svg.push('<line x1="' + half + '" y1="0" x2="' + half + '" y2="' + s + '" stroke="' + theme.grid + '" stroke-width="0.8" stroke-dasharray="3,3"/>');
        svg.push('<line x1="0" y1="' + half + '" x2="' + s + '" y2="' + half + '" stroke="' + theme.grid + '" stroke-width="0.8" stroke-dasharray="3,3"/>');
      } else if (gridType === "tianzi") {
        // Lưới Điền: Chữ thập
        svg.push('<line x1="' + half + '" y1="0" x2="' + half + '" y2="' + s + '" stroke="' + theme.grid + '" stroke-width="0.8" stroke-dasharray="3,3"/>');
        svg.push('<line x1="0" y1="' + half + '" x2="' + s + '" y2="' + half + '" stroke="' + theme.grid + '" stroke-width="0.8" stroke-dasharray="3,3"/>');
      } else if (gridType === "huigong") {
        // Lưới Hồi Cung: Khung chữ nhật trung tâm
        var inset = s * 0.22;
        var inW = s - inset * 2;
        svg.push('<rect x="' + inset + '" y="' + inset + '" width="' + inW + '" height="' + inW + '" fill="none" stroke="' + theme.grid + '" stroke-width="0.8" stroke-dasharray="3,3"/>');
        svg.push('<line x1="' + half + '" y1="0" x2="' + half + '" y2="' + s + '" stroke="' + theme.grid + '" stroke-width="0.6" stroke-dasharray="2,2"/>');
        svg.push('<line x1="0" y1="' + half + '" x2="' + s + '" y2="' + half + '" stroke="' + theme.grid + '" stroke-width="0.6" stroke-dasharray="2,2"/>');
      }

      // Ký tự mẫu (nếu có opacity > 0)
      if (char && opacity > 0) {
        var fontSize = Math.round(s * 0.76);
        var fill = opacity >= 0.9 ? "#111" : "rgba(30, 30, 30, " + opacity + ")";
        svg.push('<text x="' + half + '" y="' + (half + s * 0.04) + '" font-family="\'Noto Serif SC\', \'Songti SC\', \'SimSun\', \'KaiTi\', serif" font-size="' + fontSize + '" font-weight="' + (opacity >= 0.9 ? 'bold' : 'normal') + '" fill="' + fill + '" text-anchor="middle" dominant-baseline="central">' + char + '</text>');
      }

      svg.push('</svg>');
      return svg.join("");
    },

    /**
     * Xác định độ mờ nét cho từng vị trí ô dựa trên fadeMode
     */
    getCellOpacity: function (cellIndex, fadeMode) {
      if (fadeMode === "trace_all") {
        return cellIndex === 0 ? 1 : 0.35;
      }
      if (fadeMode === "blank") {
        return cellIndex === 0 ? 1 : 0;
      }
      // Standard: 0 -> Đậm (1.0), 1 -> 0.4, 2 -> 0.2, 3+ -> 0 (trống)
      if (cellIndex === 0) return 1.0;
      if (cellIndex === 1) return 0.42;
      if (cellIndex === 2) return 0.22;
      return 0;
    },

    /**
     * Tạo mã HTML hoàn chỉnh để xem trước hoặc in khổ A4
     */
    generatePrintHTML: function (userOpts) {
      var opts = Object.assign(this.defaultOptions(), userOpts || {});
      var words = opts.words || [];
      var gridType = opts.gridType || "mizi";
      var fadeMode = opts.fadeMode || "standard";
      var colorTheme = opts.colorTheme || "cinnabar";
      var cellsPerRow = Math.max(6, Math.min(14, opts.cellsPerRow || 10));
      var self = this;

      var rowsHtml = [];

      words.forEach(function (w, wIdx) {
        // Tách từng ký tự Hán trong từ nếu là từ ghép
        var chars = Array.from(w.h || "");
        chars.forEach(function (char, cIdx) {
          var rowMeta = '';
          if (opts.showMeta) {
            var label = (cIdx === 0 ? (w.p ? '<div class="ws-pinyin">' + w.p + '</div>' : '') +
              '<div class="ws-meta-hv">' + (w.hv || '') + '</div>' +
              '<div class="ws-meta-vi">' + (w.vi || '') + '</div>' : '<div class="ws-char-note">Nét chữ [' + (cIdx + 1) + ']</div>');
            rowMeta = '<div class="ws-row-meta">' + label + '</div>';
          }

          var cells = [];
          for (var i = 0; i < cellsPerRow; i++) {
            var opacity = self.getCellOpacity(i, fadeMode);
            cells.push('<div class="ws-cell">' + self.generateCellSvg(char, opacity, gridType, colorTheme, 46) + '</div>');
          }

          rowsHtml.push(
            '<div class="ws-row">' +
              rowMeta +
              '<div class="ws-row-cells">' + cells.join("") + '</div>' +
            '</div>'
          );
        });
      });

      var dateStr = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

      return '<!doctype html>' +
'<html lang="vi">' +
'<head>' +
'<meta charset="utf-8">' +
'<title>' + (opts.title || "Vở tập viết Hán Lộ") + '</title>' +
'<style>' +
'  @page { size: A4 portrait; margin: 10mm 12mm 10mm 12mm; }' +
'  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }' +
'  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 10px; color: #1c1917; background: #fff; }' +
'  .ws-page { max-width: 800px; margin: 0 auto; }' +
'  .ws-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #2f6f5e; padding-bottom: 8px; margin-bottom: 12px; }' +
'  .ws-title-box h1 { margin: 0; font-size: 19px; color: #2f6f5e; letter-spacing: 0.5px; }' +
'  .ws-title-box p { margin: 3px 0 0; font-size: 11px; color: #78716c; }' +
'  .ws-student-box { font-size: 11px; color: #44403c; line-height: 1.6; text-align: right; }' +
'  .ws-row { display: flex; align-items: center; margin-bottom: 6px; page-break-inside: avoid; }' +
'  .ws-row-meta { width: 130px; flex-shrink: 0; padding-right: 10px; text-align: right; font-size: 11px; }' +
'  .ws-pinyin { font-weight: bold; color: #2f6f5e; font-size: 12px; }' +
'  .ws-meta-hv { font-weight: 600; color: #1c1917; text-transform: uppercase; font-size: 10px; }' +
'  .ws-meta-vi { color: #57534e; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 125px; }' +
'  .ws-char-note { color: #a8a29e; font-size: 9px; }' +
'  .ws-row-cells { display: flex; gap: 4px; flex-wrap: nowrap; }' +
'  .ws-cell { width: 46px; height: 46px; flex-shrink: 0; }' +
'  .ws-cell-svg { display: block; width: 100%; height: 100%; }' +
'  .ws-footer { margin-top: 14px; padding-top: 6px; border-top: 1px dashed #d6d3d1; display: flex; justify-content: space-between; font-size: 10px; color: #a8a29e; }' +
'  @media print {' +
'    body { padding: 0; }' +
'    .no-print { display: none !important; }' +
'  }' +
'</style>' +
'</head>' +
'<body>' +
'  <div class="ws-page">' +
'    <div class="ws-header">' +
'      <div class="ws-title-box">' +
'        <h1>' + opts.title + '</h1>' +
'        <p>' + opts.subtitle + ' · Lưới: ' + self.GRID_TYPES[gridType].name + ' · Chế độ: ' + self.FADE_MODES[fadeMode].name + '</p>' +
'      </div>' +
'      <div class="ws-student-box">' +
'        <div>Họ và tên: _________________________</div>' +
'        <div>Ngày: ' + dateStr + '</div>' +
'      </div>' +
'    </div>' +
'    <div class="ws-content">' +
      rowsHtml.join("") +
'    </div>' +
'    <div class="ws-footer">' +
'      <span>Hán Lộ (汉路) — Nền tảng học tiếng Trung từ con số 0 đến HSK 3</span>' +
'      <span>Trang 1</span>' +
'    </div>' +
'  </div>' +
'</body>' +
'</html>';
    },

    /**
     * Mở cửa sổ in trực tiếp hoặc xuất PDF
     */
    printWorksheet: function (options) {
      var html = this.generatePrintHTML(options);
      var printWin = window.open("", "_blank");
      if (!printWin) {
        alert("Vui lòng cho phép popup để mở trang in / xuất PDF!");
        return;
      }
      printWin.document.open();
      printWin.document.write(html);
      printWin.document.close();
      printWin.focus();
      setTimeout(function () {
        printWin.print();
      }, 350);
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = WorksheetGenerator;
  }
  if (typeof global !== "undefined") {
    global.WorksheetGenerator = WorksheetGenerator;
  }
})(typeof window !== "undefined" ? window : global);
