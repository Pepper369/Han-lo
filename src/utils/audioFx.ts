/* =========================================================
   Hán Lộ — Web Audio Synthesizer (Hiệu Ứng Âm Thanh Phương Đông)
   Tự tổng hợp sóng âm bằng Web Audio API thuần (OscillatorNode).
   0 byte file mp3 · Không cần mạng · Âm sắc khánh ngọc & chuông cổ.
   ========================================================= */

let ctx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      ctx = new AudioContextClass();
    }
  }
  if (ctx && ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

export const SoundFX = {
  enabled: true,

  // Gõ phách gỗ nhẹ nhàng khi chạm nút
  tap: function () {
    if (!this.enabled) return;
    const c = getAudioCtx();
    if (!c) return;

    try {
      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(480, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, c.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start();
      osc.stop(c.currentTime + 0.045);
    } catch (e) {
      // AudioContext may be blocked before interaction
    }
  },

  // Khánh ngọc ngân vang khi trả lời đúng (Jade bell resonance)
  correct: function () {
    if (!this.enabled) return;
    const c = getAudioCtx();
    if (!c) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Hợp âm Ngũ Cung)
      notes.forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, c.currentTime + i * 0.04);

        gain.gain.setValueAtTime(0.08, c.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + i * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(c.currentTime + i * 0.04);
        osc.stop(c.currentTime + i * 0.04 + 0.36);
      });
    } catch (e) {}
  },

  // Alias for correct
  bell: function () {
    this.correct();
  },

  // Âm trầm đục nhẹ nhàng khi chưa chính xác
  wrong: function () {
    if (!this.enabled) return;
    const c = getAudioCtx();
    if (!c) return;

    try {
      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, c.currentTime + 0.18);

      gain.gain.setValueAtTime(0.15, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start();
      osc.stop(c.currentTime + 0.19);
    } catch (e) {}
  },

  // Chuông thiền sâu lắng khi hoàn thành bài học / nộp bài thi
  zenBell: function () {
    if (!this.enabled) return;
    const c = getAudioCtx();
    if (!c) return;

    try {
      const baseFreq = 440; // A4
      const partials = [1, 2.76, 5.4, 8.9];
      partials.forEach((p, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq * p, c.currentTime);

        const vol = 0.12 / (idx + 1);
        gain.gain.setValueAtTime(vol, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, c.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start();
        osc.stop(c.currentTime + 1.25);
      });
    } catch (e) {}
  },

  // Chiêng đồng báo giờ vào phòng thi
  gong: function () {
    if (!this.enabled) return;
    const c = getAudioCtx();
    if (!c) return;

    try {
      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(220, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(196, c.currentTime + 0.8);

      gain.gain.setValueAtTime(0.18, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.85);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start();
      osc.stop(c.currentTime + 0.9);
    } catch (e) {}
  }
};
