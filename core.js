/* Logic thuần (không phụ thuộc DOM): thanh điệu + lịch ôn SM-2.
   Dùng được ở browser (window.Core) và Node (require) để test: node check.cjs */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Core = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DAY = 86400000; // shortcut: ngày = 24h cố định; nâng cấp nếu cần chính xác theo múi giờ/DST
  const TONE_CHARS = {
    "ā": 1, "á": 2, "ǎ": 3, "à": 4,
    "ē": 1, "é": 2, "ě": 3, "è": 4,
    "ī": 1, "í": 2, "ǐ": 3, "ì": 4,
    "ō": 1, "ó": 2, "ǒ": 3, "ò": 4,
    "ū": 1, "ú": 2, "ǔ": 3, "ù": 4,
    "ǖ": 1, "ǘ": 2, "ǚ": 3, "ǜ": 4,
    "ń": 2, "ň": 3, "ǹ": 4
  };

  // 1..4 = thanh 1..4, 0 = thanh nhẹ
  function toneOf(syllable) {
    for (const ch of syllable) if (TONE_CHARS[ch]) return TONE_CHARS[ch];
    return 0;
  }

  function syllables(pinyin) {
    return String(pinyin).split(/\s+/).filter(Boolean);
  }

  function dayKey(ts) {
    const d = new Date(ts == null ? Date.now() : ts);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function prevDayKey(ts) {
    return dayKey((ts == null ? Date.now() : ts) - DAY);
  }

  function newCard() {
    return { reps: 0, lapses: 0, ease: 2.5, interval: 0, due: 0, seen: 0 };
  }

  // SM-2: q 0..5 (2 = quên, 4 = được, 5 = dễ). Trả về card mới, không sửa card cũ.
  function grade(card, q, now) {
    const ts = now == null ? Date.now() : now;
    const c = Object.assign({}, newCard(), card);
    if (q < 3) {
      c.reps = 0;
      c.lapses += 1;
      c.interval = 0;
      c.ease = Math.max(1.3, c.ease - 0.2);
      c.due = ts + 10 * 60 * 1000; // học lại sau 10 phút
    } else {
      c.reps += 1;
      c.interval = c.reps === 1 ? 1 : c.reps === 2 ? 3 : Math.round(c.interval * c.ease);
      c.ease = Math.min(3, Math.max(1.3, c.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))));
      c.due = ts + c.interval * DAY;
    }
    c.seen += 1;
    return c;
  }

  function stage(card, now) {
    if (!card) return "new";
    if (card.interval >= 21) return "mastered";
    if (!card.interval) return "learning";
    return "review";
  }

  function isDue(card, now) {
    const ts = now == null ? Date.now() : now;
    return !!card && card.due <= ts;
  }

  // Chấm điểm bài thi thử HSK
  function scoreExam(exam, userAnswers) {
    const questions = exam.questions || [];
    let listeningCorrect = 0;
    let readingCorrect = 0;
    const details = [];

    for (const q of questions) {
      const uAns = userAnswers[q.id];
      const isCorrect = uAns !== undefined && uAns === q.correct;
      if (isCorrect) {
        if (q.section === "listening") listeningCorrect++;
        else readingCorrect++;
      }
      details.push({
        id: q.id,
        section: q.section,
        part: q.part,
        isCorrect: isCorrect,
        userAnswer: uAns,
        correctAnswer: q.correct,
        explanation: q.explanation
      });
    }

    const lTotal = exam.listeningCount || 20;
    const rTotal = exam.readingCount || 20;
    const listeningScore = Math.round((listeningCorrect / (lTotal || 1)) * 100);
    const readingScore = Math.round((readingCorrect / (rTotal || 1)) * 100);
    const totalScore = listeningScore + readingScore; // 200đ
    const passingScore = exam.passingScore || 120;
    const passed = totalScore >= passingScore;
    const totalCorrect = listeningCorrect + readingCorrect;
    const accuracy = Math.round((totalCorrect / questions.length) * 100);

    return {
      totalQuestions: questions.length,
      totalCorrect,
      listeningCorrect,
      readingCorrect,
      listeningScore,
      readingScore,
      totalScore,
      passingScore,
      passed,
      accuracy,
      details
    };
  }

  return { DAY, toneOf, syllables, dayKey, prevDayKey, newCard, grade, stage, isDue, scoreExam };
});
