/* Pinyin Annotator — Công Cụ Thêm Pinyin Tự Động Vào Đoạn Văn Tiếng Trung (Ruby Text).
   Hoạt động 100% Offline, sử dụng thuật toán Khớp Từ Dài Nhất (Longest Match First)
   kết hợp từ điển HSK 1-3 và bảng âm tiết chuẩn. Hỗ trợ hiển thị Pinyin, Hán-Việt và tra cứu tức thì. */

(function (global) {
  "use strict";

  var PinyinAnnotator = {
    _dict: {},
    _maxLen: 4,

    /**
     * Khởi tạo từ điển từ danh sách từ HSK
     */
    initDict: function (words) {
      this._dict = {};
      this._maxLen = 1;
      var self = this;
      if (!Array.isArray(words)) return;

      words.forEach(function (w) {
        if (!w || !w.h) return;
        var h = String(w.h).trim();
        if (h.length > self._maxLen) self._maxLen = h.length;
        self._dict[h] = {
          h: h,
          p: w.p || "",
          hv: w.hv || "",
          vi: w.vi || ""
        };
      });
    },

    /**
     * Bóc tách văn bản tiếng Trung thành danh sách các token kèm Pinyin
     */
    tokenize: function (text) {
      if (!text) return [];
      var s = String(text);
      var tokens = [];
      var i = 0;
      var n = s.length;

      while (i < n) {
        var ch = s[i];

        // Nếu là khoảng trắng hoặc dấu ngắt câu hoặc ký tự không phải chữ Hán
        if (!/[\u4e00-\u9fa5]/.test(ch)) {
          // Gom cụm các ký tự liên tiếp không phải chữ Hán
          var start = i;
          while (i < n && !/[\u4e00-\u9fa5]/.test(s[i])) {
            i++;
          }
          tokens.push({
            type: "text",
            raw: s.substring(start, i)
          });
          continue;
        }

        // Là chữ Hán: Khớp từ dài nhất có trong từ điển
        var matched = null;
        var maxLen = Math.min(this._maxLen, n - i);

        for (var len = maxLen; len >= 1; len--) {
          var sub = s.substr(i, len);
          if (this._dict[sub]) {
            matched = this._dict[sub];
            i += len;
            break;
          }
        }

        if (matched) {
          tokens.push({
            type: "hanzi",
            h: matched.h,
            p: matched.p,
            hv: matched.hv,
            vi: matched.vi
          });
        } else {
          // Chữ Hán chưa có trong từ điển, tách chữ đơn
          tokens.push({
            type: "hanzi",
            h: ch,
            p: "",
            hv: "",
            vi: ""
          });
          i++;
        }
      }

      return tokens;
    },

    /**
     * Chuyển danh sách token thành HTML thẻ <ruby>
     */
    toRubyHtml: function (tokens, displayMode) {
      displayMode = displayMode || "pinyin"; // 'pinyin', 'hv', 'both', 'hanzi'
      var out = [];

      tokens.forEach(function (tok) {
        if (tok.type === "text") {
          // Xử lý xuống dòng
          var safe = tok.raw
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>");
          out.push('<span class="ruby-plain">' + safe + '</span>');
        } else {
          var annotation = "";
          if (displayMode === "pinyin") annotation = tok.p;
          else if (displayMode === "hv") annotation = tok.hv;
          else if (displayMode === "both") annotation = tok.p + (tok.hv ? ' / ' + tok.hv : '');

          var dataAttrs = ' data-h="' + tok.h + '"' +
                          (tok.p ? ' data-p="' + tok.p + '"' : '') +
                          (tok.hv ? ' data-hv="' + tok.hv + '"' : '') +
                          (tok.vi ? ' data-vi="' + tok.vi.replace(/"/g, '&quot;') + '"' : '');

          if (displayMode === "hanzi" || !annotation) {
            out.push('<span class="ruby-token lookup-trigger"' + dataAttrs + '>' + tok.h + '</span>');
          } else {
            out.push(
              '<ruby class="ruby-token lookup-trigger"' + dataAttrs + '>' +
                '<rb>' + tok.h + '</rb>' +
                '<rt>' + annotation + '</rt>' +
              '</ruby>'
            );
          }
        }
      });

      return out.join("");
    },

    /**
     * Xuất ra dạng Plain Text kèm Pinyin trong ngoặc đơn
     */
    toPlainText: function (tokens) {
      var out = [];
      tokens.forEach(function (tok) {
        if (tok.type === "text") {
          out.push(tok.raw);
        } else {
          out.push(tok.h + (tok.p ? ' (' + tok.p + ')' : ''));
        }
      });
      return out.join("");
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = PinyinAnnotator;
  }
  if (typeof global !== "undefined") {
    global.PinyinAnnotator = PinyinAnnotator;
  }
})(typeof window !== "undefined" ? window : global);
