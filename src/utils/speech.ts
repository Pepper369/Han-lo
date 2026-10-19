/* Speech Recognition & Pronunciation Scoring Engine for Chinese (zh-CN)
   Tích hợp Web Speech API thuần trên trình duyệt, không tốn tài nguyên server. */

export interface SpeechMatchResult {
  score: number;
  text: string;
  passed: boolean;
  grade: string;
}

// Check window.SpeechRecognition or window.webkitSpeechRecognition
type SpeechRecognitionType = any;

export const HanLoSpeech = {
  isSupported:
    typeof window !== "undefined" &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
  recognition: null as SpeechRecognitionType,
  isListening: false,

  init: function () {
    if (!this.isSupported) return false;
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return false;

    const rec = new SpeechRecognitionClass();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "zh-CN";
    rec.maxAlternatives = 3;
    this.recognition = rec;
    return true;
  },

  // So khớp chuỗi nói với chữ Hán mục tiêu, tính điểm độ chính xác (0 - 100%)
  evaluateMatch: function (spokenText: string, targetWord: string): SpeechMatchResult {
    if (!spokenText) return { score: 0, text: "", passed: false, grade: "Chưa nghe rõ" };
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
    for (const ch of cleanTarget) {
      if (cleanSpoken.includes(ch)) matchedChars++;
    }
    const charRatio = matchedChars / (cleanTarget.length || 1);
    if (charRatio >= 0.5) {
      return {
        score: Math.round(charRatio * 75),
        text: cleanSpoken,
        passed: false,
        grade: "Khá ổn (不错, cần rõ hơn)"
      };
    }

    return {
      score: Math.round(charRatio * 50),
      text: cleanSpoken,
      passed: false,
      grade: "Cần luyện thêm (继续加油)"
    };
  },

  startListening: function (
    targetWord: string,
    onResult?: (res: SpeechMatchResult) => void,
    onError?: (err: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!this.isSupported) {
      if (onError) onError("Trình duyệt không hỗ trợ Web Speech API (Hãy dùng Chrome hoặc Edge)");
      return;
    }
    if (!this.recognition) this.init();
    if (!this.recognition) {
      if (onError) onError("Không thể khởi động bộ thu âm");
      return;
    }

    const self = this;
    this.recognition.onstart = function () {
      self.isListening = true;
      if (onStart) onStart();
    };

    this.recognition.onresult = function (event: any) {
      self.isListening = false;
      let spoken = "";
      if (event.results && event.results[0] && event.results[0][0]) {
        spoken = event.results[0][0].transcript;
      }
      const evalResult = self.evaluateMatch(spoken, targetWord);
      if (onResult) onResult(evalResult);
    };

    this.recognition.onerror = function (event: any) {
      self.isListening = false;
      if (onError) onError(event.error || "Lỗi thu âm");
    };

    this.recognition.onend = function () {
      self.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      self.isListening = false;
      if (onEnd) onEnd();
    }
  },

  stopListening: function () {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }
};
