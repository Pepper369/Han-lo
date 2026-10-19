/* Speech Recognition & Pronunciation Scoring Engine for Chinese (zh-CN)
   Tích hợp Web Speech API thuần trên trình duyệt, không tốn tài nguyên server. */

(function (global) {
  "use strict";

  const SpeechRecognition = (global && (global.SpeechRecognition || global.webkitSpeechRecognition)) || (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) || null;

  const HanLoSpeech = {
    isSupported: !!SpeechRecognition,
    recognition: null,
    isListening: false,

    init: function () {
      if (!this.isSupported) return false;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "zh-CN"; // Tiếng Trung phổ thông chuẩn
      rec.maxAlternatives = 3;
      this.recognition = rec;
      return true;
    },

    // So khớp chuỗi nói với chữ Hán mục tiêu, tính điểm độ chính xác (0 - 100%)
    evaluateMatch: function (spokenText, targetWord) {
      if (!spokenText) return { score: 0, text: "", passed: false };
      const cleanSpoken = spokenText.replace(/[.,?!，。？！\s]/g, "").trim();
      const cleanTarget = targetWord.replace(/[.,?!，。？！\s]/g, "").trim();

      if (cleanSpoken === cleanTarget) {
        return { score: 100, text: cleanSpoken, passed: true, grade: "Tuyệt hảo (太棒了!)" };
      }
      if (cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken)) {
        return { score: 85, text: cleanSpoken, passed: true, grade: "Rất tốt (很好!)" };
      }

      // So khớp từng ký tự
      let matchedChars = 0;
      for (let ch of cleanTarget) {
        if (cleanSpoken.includes(ch)) matchedChars++;
      }
      const charRatio = matchedChars / cleanTarget.length;
      if (charRatio >= 0.5) {
        return { score: Math.round(charRatio * 75), text: cleanSpoken, passed: false, grade: "Khá ổn (不错, cần rõ hơn)" };
      }

      return { score: Math.round(charRatio * 50), text: cleanSpoken, passed: false, grade: "Cần luyện thêm (继续加油)" };
    },

    // Bắt đầu lắng nghe
    startListening: function (targetWord, onResult, onError, onStart, onEnd) {
      if (!this.isSupported) {
        if (onError) onError("Trình duyệt không hỗ trợ Web Speech API (Hãy dùng Chrome hoặc Edge)");
        return;
      }
      if (!this.recognition) this.init();

      const self = this;
      this.recognition.onstart = function () {
        self.isListening = true;
        if (onStart) onStart();
      };

      this.recognition.onresult = function (event) {
        self.isListening = false;
        let spoken = "";
        if (event.results && event.results[0] && event.results[0][0]) {
          spoken = event.results[0][0].transcript;
        }
        const evalResult = self.evaluateMatch(spoken, targetWord);
        if (onResult) onResult(evalResult);
      };

      this.recognition.onerror = function (event) {
        self.isListening = false;
        if (onError) onError(event.error);
      };

      this.recognition.onend = function () {
        self.isListening = false;
        if (onEnd) onEnd();
      };

      try {
        this.recognition.start();
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    },

    stopListening: function () {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      }
    }
  };

  global.HanLoSpeech = HanLoSpeech;
})(typeof window !== "undefined" ? window : global);
