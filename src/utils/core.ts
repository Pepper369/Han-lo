import { Card, Exam } from "../types";

export const DAY = 86400000;

export const TONE_CHARS: Record<string, number> = {
  "ā": 1, "á": 2, "ǎ": 3, "à": 4,
  "ē": 1, "é": 2, "ě": 3, "è": 4,
  "ī": 1, "í": 2, "ǐ": 3, "ì": 4,
  "ō": 1, "ó": 2, "ǒ": 3, "ò": 4,
  "ū": 1, "ú": 2, "ǔ": 3, "ù": 4,
  "ǖ": 1, "ǘ": 2, "ǚ": 3, "ǜ": 4,
  "ń": 2, "ň": 3, "ǹ": 4
};

export function toneOf(syllable: string): number {
  for (const ch of syllable) {
    if (TONE_CHARS[ch]) return TONE_CHARS[ch];
  }
  return 0;
}

export function syllables(pinyin: string): string[] {
  return String(pinyin).split(/\s+/).filter(Boolean);
}

export function dayKey(ts?: number): string {
  const d = new Date(ts == null ? Date.now() : ts);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export function prevDayKey(ts?: number): string {
  return dayKey((ts == null ? Date.now() : ts) - DAY);
}

export function newCard(): Card {
  return { reps: 0, lapses: 0, ease: 2.5, interval: 0, due: 0, seen: 0 };
}

// SM-2: q 0..5 (2 = quên, 4 = được, 5 = dễ)
export function grade(card: Partial<Card> | undefined, q: number, now?: number): Card {
  const ts = now == null ? Date.now() : now;
  const c: Card = Object.assign({}, newCard(), card);
  if (q < 3) {
    c.reps = 0;
    c.lapses += 1;
    c.interval = 0;
    c.ease = Math.max(1.3, c.ease - 0.2);
    c.due = ts + 10 * 60 * 1000; // 10 phút sau
  } else {
    c.reps += 1;
    c.interval = c.reps === 1 ? 1 : c.reps === 2 ? 3 : Math.round(c.interval * c.ease);
    c.ease = Math.min(3, Math.max(1.3, c.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))));
    c.due = ts + c.interval * DAY;
  }
  c.seen += 1;
  return c;
}

export function stage(card?: Card, now?: number): 'new' | 'learning' | 'review' | 'mastered' {
  if (!card) return "new";
  if (card.interval >= 21) return "mastered";
  if (!card.interval) return "learning";
  return "review";
}

export function isDue(card?: Card, now?: number): boolean {
  const ts = now == null ? Date.now() : now;
  return !!card && card.due <= ts;
}

export interface ExamScoreDetail {
  id: number;
  section: string;
  part: number;
  isCorrect: boolean;
  userAnswer?: boolean | number;
  correctAnswer: boolean | number;
  explanation: string;
}

export interface ExamScoreResult {
  totalQuestions: number;
  totalCorrect: number;
  listeningCorrect: number;
  readingCorrect: number;
  listeningScore: number;
  readingScore: number;
  totalScore: number;
  passingScore: number;
  passed: boolean;
  accuracy: number;
  details: ExamScoreDetail[];
}

export function scoreExam(exam: Exam, userAnswers: Record<number, boolean | number>): ExamScoreResult {
  const questions = exam.questions || [];
  let listeningCorrect = 0;
  let readingCorrect = 0;
  const details: ExamScoreDetail[] = [];

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
      isCorrect,
      userAnswer: uAns,
      correctAnswer: q.correct,
      explanation: q.explanation
    });
  }

  const lTotal = exam.listeningCount || 20;
  const rTotal = exam.readingCount || 20;
  const listeningScore = Math.round((listeningCorrect / (lTotal || 1)) * 100);
  const readingScore = Math.round((readingCorrect / (rTotal || 1)) * 100);
  const totalScore = listeningScore + readingScore; // 200 điểm
  const passingScore = exam.passingScore || 120;
  const passed = totalScore >= passingScore;
  const totalCorrect = listeningCorrect + readingCorrect;
  const accuracy = Math.round((totalCorrect / (questions.length || 1)) * 100);

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

export function norm(s: string): string {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
