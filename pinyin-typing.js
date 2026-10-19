/* Pinyin Typing Master — Luyện Gõ Pinyin Ra Chữ Hán Đo Tốc Độ CPM & Độ Chuẩn Xác.
   Hoạt động 100% Offline, hỗ trợ bộ từ HSK 1-3, đối chiếu Pinyin không dấu / có dấu,
   đo lường Characters Per Minute (CPM), WPM, Accuracy, Streak và âm thanh phản hồi. */

(function (global) {
  "use strict";

  var PinyinTyping = {
    TONE_MAP: {
      'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
      'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
      'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
      'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
      'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
      'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v', 'ü': 'v'
    },

    /**
     * Chuẩn hóa pinyin có dấu thanh điệu thành pinyin chữ thường không dấu (để so khớp phím gõ)
     * Ví dụ: "nǐhǎo" -> "nihao", "zhōngguó" -> "zhongguo", "lǚ" -> "lv" hoặc "lu"
     */
    normalizePinyin: function (pinyin) {
      if (!pinyin) return "";
      var s = String(pinyin).toLowerCase().trim();
      var out = "";
      for (var i = 0; i < s.length; i++) {
        var ch = s[i];
        out += this.TONE_MAP[ch] !== undefined ? this.TONE_MAP[ch] : ch;
      }
      // Bỏ toàn bộ khoảng trắng và dấu câu
      return out.replace(/[^a-z0-9]/g, "");
    },

    /**
     * Tạo một phiên luyện gõ mới
     */
    createSession: function (wordList, options) {
      options = Object.assign({
        mode: "timed_60s", // 'timed_60s', 'sprint_20', 'endless'
        timeLimit: 60,
        wordLimit: 20
      }, options || {});

      var pool = (wordList && wordList.length) ? wordList.slice() : [];
      // Xáo trộn ngẫu nhiên
      for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = pool[i];
        pool[i] = pool[j];
        pool[j] = temp;
      }

      return {
        mode: options.mode,
        timeLimit: options.timeLimit,
        wordLimit: options.wordLimit,
        words: pool,
        currentIndex: 0,
        startTime: null,
        endTime: null,
        elapsedSeconds: 0,
        timerId: null,
        totalCharsTyped: 0,
        correctWords: 0,
        wrongWords: 0,
        streak: 0,
        maxStreak: 0,
        history: [], // danh sách từ đã gõ và kết quả
        isFinished: false
      };
    },

    /**
     * Kiểm tra từ người dùng vừa gõ so với từ hiện tại
     */
    checkInput: function (session, typedText) {
      if (!session || session.isFinished || session.currentIndex >= session.words.length) {
        return { isCorrect: false, finished: true };
      }

      if (!session.startTime) {
        session.startTime = Date.now();
      }

      var currentWord = session.words[session.currentIndex];
      var targetNorm = this.normalizePinyin(currentWord.p);
      var typedNorm = this.normalizePinyin(typedText);

      // Cho phép linh hoạt 'v' hoặc 'u' cho chữ có ü
      var isMatch = (typedNorm === targetNorm) ||
                    (typedNorm === targetNorm.replace(/v/g, "u")) ||
                    (typedNorm.replace(/v/g, "u") === targetNorm);

      var wordResult = {
        word: currentWord,
        typed: typedText,
        expected: targetNorm,
        isCorrect: isMatch,
        timestamp: Date.now()
      };

      session.history.push(wordResult);

      if (isMatch) {
        session.correctWords++;
        session.totalCharsTyped += (currentWord.h || "").length;
        session.streak++;
        if (session.streak > session.maxStreak) session.maxStreak = session.streak;
      } else {
        session.wrongWords++;
        session.streak = 0;
      }

      session.currentIndex++;

      // Kiểm tra điều kiện kết thúc theo mode sprint_20
      if (session.mode === "sprint_20" && session.currentIndex >= session.wordLimit) {
        session.isFinished = true;
        session.endTime = Date.now();
      } else if (session.currentIndex >= session.words.length) {
        session.isFinished = true;
        session.endTime = Date.now();
      }

      return {
        isCorrect: isMatch,
        streak: session.streak,
        stats: this.getStats(session),
        finished: session.isFinished
      };
    },

    /**
     * Tính toán các chỉ số thống kê
     */
    getStats: function (session) {
      if (!session) return { cpm: 0, wpm: 0, accuracy: 100, streak: 0 };
      var now = session.endTime || Date.now();
      var elapsed = session.startTime ? Math.max(1, (now - session.startTime) / 1000) : 1;
      var minutes = elapsed / 60;

      var totalAttempted = session.correctWords + session.wrongWords;
      var accuracy = totalAttempted > 0 ? Math.round((session.correctWords / totalAttempted) * 100) : 100;
      var cpm = Math.round(session.totalCharsTyped / minutes);
      var wpm = Math.round(session.correctWords / minutes);

      return {
        cpm: cpm,
        wpm: wpm,
        accuracy: accuracy,
        correctWords: session.correctWords,
        wrongWords: session.wrongWords,
        totalChars: session.totalCharsTyped,
        streak: session.streak,
        maxStreak: session.maxStreak,
        elapsedSeconds: Math.round(elapsed)
      };
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = PinyinTyping;
  }
  if (typeof global !== "undefined") {
    global.PinyinTyping = PinyinTyping;
  }
})(typeof window !== "undefined" ? window : global);
