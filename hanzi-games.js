/* Hanzi Games — Trò Chơi Học Chữ Hán & Thành Ngữ 4 Chữ (成语消消乐).
   Hoạt động 100% Offline, hỗ trợ 2 phân hệ game:
   1. Ghép Thành Ngữ 4 Chữ (成语 - Chéngyǔ Master): Điền chữ còn thiếu, học điển tích và nghĩa.
   2. Ghép Bộ Thủ Cấu Thành (Radical Fusion): Ghép các bộ phận/bộ thủ thành chữ Hán có nghĩa. */

(function (global) {
  "use strict";

  var HanziGames = {
    // 50 Thành ngữ 4 chữ (成语) tinh hoa trong HSK & văn hóa Trung Hoa
    IDIOMS: [
      { c: "一心一意", p: "yì xīn yí yì", hv: "NHẤT TÂM NHẤT Ý", m: "Toàn tâm toàn ý, một lòng một dạ, không phân tâm", s: "Biểu thị sự tập trung cao độ và chân thành tuyệt đối." },
      { c: "画蛇添足", p: "huà shé tiān zú", hv: "HỌA XÀ THIÊM TÚC", m: "Vẽ rắn thêm chân, làm việc thừa thãi chỉ tổ hỏng việc", s: "Điển tích người thi vẽ rắn xong trước, rảnh tay vẽ thêm chân nên bị thua." },
      { c: "守株待兔", p: "shǒu zhū dài tù", hv: "THỦ CHU ĐÃI THỐ", m: "Ôm cây đợi thỏ, mong chờ may mắn mà không chịu nỗ lực", s: "Người nông dân thấy thỏ va gốc cây chết liền bỏ cày ngày ngày ngồi đợi thỏ khác." },
      { c: "井底之蛙", p: "jǐng dǐ zhī wā", hv: "TỈNH ĐỂ CHI OA", m: "Ếch ngồi đáy giếng, tầm nhìn hạn hẹp mà tưởng mình biết hết", s: "Con ếch sống dưới đáy giếng nghĩ trời chỉ tròn như miệng giếng." },
      { c: "自相矛盾", p: "zì xiāng máo dùn", hv: "TỰ TƯƠNG MÂU THUẪN", m: "Tiền hậu bất nhất, lời nói và hành động tự đối chọi nhau", s: "Người bán mâu khen mâu gì cũng đâm thủng, lại khen khiên không gì đâm thủng." },
      { c: "马到成功", p: "mǎ dào chéng gōng", hv: "MÃ ĐÁO THÀNH CÔNG", m: "Vừa ra quân là chiến thắng, công việc thuận buồm xuôi gió", s: "Thời xưa dùng ngựa ra trận, ngựa phi đến đâu thắng lợi tới đó." },
      { c: "半途而废", p: "bàn tú ér fèi", hv: "BÁN ĐỒ NHI PHẾ", m: "Bỏ cuộc giữa chừng, thiếu kiên trì tới đích", s: "Đi được nửa đường thì bỏ dở, công sức trước đó đều uổng phí." },
      { c: "入乡随俗", p: "rù xiāng suí sú", hv: "NHẬP HƯƠNG TÙY TỤC", m: "Đến đâu theo phong tục ở đó, nhập gia tùy tục", s: "Tôn trọng và hòa nhập với lối sống của người dân địa phương." },
      { c: "乱七八糟", p: "luàn qī bā zāo", hv: "LOẠN THẤT BÁT TAO", m: "Bừa bãi, lộn xộn, rối như tơ vò", s: "Dùng để miêu tả phòng ốc bừa bộn hoặc tình huống hỗn loạn." },
      { c: "兴高采烈", p: "xìng gāo cǎi liè", hv: "HƯNG CAO THẢI LIỆT", m: "Hứng khởi ngút trời, vui tươi hớn hở phấn khởi", s: "Tâm trạng vô cùng phấn chấn, rạng rỡ khi đón nhận tin vui." },
      { c: "无微不至", p: "wú wēi bú zhì", hv: "VÔ VI BẤT CHÍ", m: "Chu đáo tận tình đến từng chi tiết nhỏ nhặt nhất", s: "Thường dùng để khen ngợi sự chăm sóc ân cần của cha mẹ, thầy cô." },
      { c: "十全十美", p: "shí quán shí měi", hv: "THẬP TOÀN THẬP MỸ", m: "Hoàn hảo mọi bề, không có tì vết nào", s: "Đạt đến độ trọn vẹn cả mười phân vẹn mười." },
      { c: "丰富多彩", p: "fēng fù duō cǎi", hv: "PHONG PHÚ ĐA THẢI", m: "Phong phú đa dạng, nhiều màu sắc sinh động", s: "Thường nói về cuộc sống, hoạt động ngoại khóa, văn hóa." },
      { c: "日新月异", p: "rì xīn yuè yì", hv: "NHẬT TÂN NGUYỆT DỊ", m: "Mỗi ngày một mới, phát triển và thay đổi chóng mặt", s: "Miêu tả sự tiến bộ vượt bậc của khoa học kỹ thuật và xã hội." },
      { c: "全力以赴", p: "quán lì yǐ fù", hv: "TOÀN LỰC DĨ PHÓ", m: "Dốc hết toàn bộ sức lực để hoàn thành mục tiêu", s: "Không tiếc công sức, đặt 100% năng lượng vào công việc." },
      { c: "不可思议", p: "bù kě sī yì", hv: "BẤT KHẢ TƯ NGHỊ", m: "Kỳ diệu đến mức không thể tưởng tượng hay giải thích nổi", s: "Những điều kỳ bí, phi thường trong tự nhiên và cuộc sống." },
      { c: "千方百计", p: "qiān fāng bǎi jì", hv: "THIÊN PHƯƠNG BÁCH KẾ", m: "Tìm đủ mọi cách, trăm phương nghìn kế để làm bằng được", s: "Vận dụng mọi mưu mẹo, phương pháp để đạt được mục đích." },
      { c: "名落孙山", p: "míng luò sūn shān", hv: "DANH LẠC TÔN SƠN", m: "Thi trượt, tên nằm dưới cả người cuối cùng đậu bảng là Tôn Sơn", s: "Điển tích sĩ tử thi trượt trong kỳ thi khoa cử xưa." },
      { c: "拔苗助长", p: "bá miáo zhù zhǎng", hv: "BẠT MIÊU TRỢ TRƯỞNG", m: "Kéo mạ lên để giúp cây mau lớn, dục tốc bất đạt", s: "Người nôn nóng kéo mạ non lên làm mạ đứt rễ héo chết hết." },
      { c: "雪中送炭", p: "xuě zhōng sòng tàn", hv: "TUYẾT TRUNG TỐNG THÁN", m: "Đưa than sưởi ấm trong tuyết lạnh, giúp đỡ đúng lúc nguy cấp", s: "Sự hỗ trợ kịp thời và vô cùng quý giá khi người khác gặp nạn." }
    ],

    // Dữ liệu Ghép Bộ Thủ (Radical Fusion)
    RADICAL_PAIRS: [
      { parts: ["木", "木"], result: "林", p: "lín", hv: "LÂM", vi: "Rừng cây" },
      { parts: ["木", "木", "木"], result: "森", p: "sēn", hv: "SÂM", vi: "Rừng rậm rạp" },
      { parts: ["日", "月"], result: "明", p: "míng", hv: "MINH", vi: "Sáng sủa, thông minh" },
      { parts: ["亻", "木"], result: "休", p: "xiū", hv: "HƯU", vi: "Nghỉ ngơi (người tựa gốc cây)" },
      { parts: ["女", "子"], result: "好", p: "hǎo", hv: "HẢO", vi: "Tốt đẹp (mẹ và con)" },
      { parts: ["口", "十"], result: "叶", p: "yè", hv: "DIỆP", vi: "Lá cây" },
      { parts: ["田", "力"], result: "男", p: "nán", hv: "NAM", vi: "Người đàn ông (dùng sức làm ruộng)" },
      { parts: ["人", "人"], result: "从", p: "cóng", hv: "TÙNG", vi: "Đi theo, từ đâu" },
      { parts: ["手", "目"], result: "看", p: "kàn", hv: "KHÁN", vi: "Nhìn, xem (tay che mắt nhìn xa)" },
      { parts: ["氵", "目"], result: "泪", p: "lèi", hv: "LỆ", vi: "Nước mắt (nước từ mắt chảy ra)" },
      { parts: ["门", "口"], result: "问", p: "wèn", hv: "VẤN", vi: "Hỏi (mở miệng ở cửa để hỏi)" },
      { parts: ["门", "日"], result: "间", p: "jiān", hv: "GIAN", vi: "Khoảng giữa, phòng gian" },
      { parts: ["口", "鸟"], result: "鸣", p: "míng", hv: "MINH", vi: "Chim hót (miệng chim kêu)" },
      { parts: ["火", "火"], result: "炎", p: "yán", hv: "VIÊM", vi: "Nóng bỏng, viêm nhiệt" }
    ],

    /**
     * Tạo một câu hỏi Ghép Thành Ngữ (Idiom Quiz)
     */
    createIdiomQuestion: function () {
      var idx = Math.floor(Math.random() * this.IDIOMS.length);
      var idiom = this.IDIOMS[idx];
      var chars = Array.from(idiom.c);

      // Chọn ngẫu nhiên 1 vị trí để ẩn (0, 1, 2, 3)
      var blankPos = Math.floor(Math.random() * 4);
      var correctChar = chars[blankPos];

      // Tạo các chữ gây nhiễu từ các thành ngữ khác
      var distractors = [];
      var allChars = [];
      this.IDIOMS.forEach(function (idm) {
        Array.from(idm.c).forEach(function (ch) {
          if (ch !== correctChar && allChars.indexOf(ch) === -1) allChars.push(ch);
        });
      });

      // Lấy 3 chữ ngẫu nhiên
      while (distractors.length < 3 && allChars.length > 0) {
        var r = Math.floor(Math.random() * allChars.length);
        distractors.push(allChars.splice(r, 1)[0]);
      }

      var choices = distractors.concat([correctChar]);
      // Xáo trộn đáp án
      choices.sort(function () { return Math.random() - 0.5; });

      var displayChars = chars.slice();
      displayChars[blankPos] = null; // vị trí trống

      return {
        type: "idiom",
        idiom: idiom,
        blankPos: blankPos,
        correctChar: correctChar,
        displayChars: displayChars,
        choices: choices
      };
    },

    /**
     * Tạo một câu hỏi Ghép Bộ Thủ (Radical Fusion Quiz)
     */
    createRadicalQuestion: function () {
      var idx = Math.floor(Math.random() * this.RADICAL_PAIRS.length);
      var item = this.RADICAL_PAIRS[idx];
      var correctResult = item.result;

      var distractors = [];
      var pool = this.RADICAL_PAIRS.filter(function (x) { return x.result !== correctResult; }).map(function (x) { return x.result; });
      while (distractors.length < 3 && pool.length > 0) {
        var r = Math.floor(Math.random() * pool.length);
        distractors.push(pool.splice(r, 1)[0]);
      }

      var choices = distractors.concat([correctResult]);
      choices.sort(function () { return Math.random() - 0.5; });

      return {
        type: "radical",
        item: item,
        parts: item.parts,
        correctResult: correctResult,
        choices: choices
      };
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = HanziGames;
  }
  if (typeof global !== "undefined") {
    global.HanziGames = HanziGames;
  }
})(typeof window !== "undefined" ? window : global);
