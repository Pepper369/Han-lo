/* Web SpeechSynthesis TTS for Chinese (zh-CN) */

let ttsVoice: SpeechSynthesisVoice | null = null;
let ttsInitialized = false;

export function initTTS(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (ttsInitialized) return;
  ttsInitialized = true;

  const loadVoices = () => {
    try {
      const vs = window.speechSynthesis.getVoices() || [];
      ttsVoice =
        vs.find((v) => /^zh([-_](cn|hans|sg))?$/i.test(v.lang)) ||
        vs.find((v) => /^zh/i.test(v.lang)) ||
        vs.find((v) => /chinese|cmn|putonghua/i.test(v.name)) ||
        null;
    } catch (e) {}
  };

  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function hasTTS(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, rate: number = 0.82, enabled: boolean = true): void {
  if (!enabled || !hasTTS() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = rate;
    if (ttsVoice) u.voice = ttsVoice;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}
