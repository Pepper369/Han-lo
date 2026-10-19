export interface Word {
  id: number;
  level: number;
  h: string;
  p: string;
  hv: string;
  vi: string;
  lesson?: number;
}

export interface Card {
  reps: number;
  lapses: number;
  ease: number;
  interval: number;
  due: number;
  seen: number;
}

export interface Settings {
  pinyin: boolean;
  audio: boolean;
  sfx: boolean;
  goal: number;
  onboarded: boolean;
  goalType: string;
  level: string;
}

export interface Streak {
  count: number;
  last: string;
}

export interface Daily {
  date: string;
  new: number;
}

export interface HistoryRecord {
  n: number;
  c: number;
}

export interface ExamQuestion {
  id: number;
  section: 'listening' | 'reading';
  part: number;
  type: 'judge' | 'choice';
  audio?: string;
  prompt?: string;
  pinyin?: string;
  meaningPrompt?: string;
  question?: string;
  options?: string[];
  correct: boolean | number;
  explanation: string;
}

export interface Exam {
  id: string;
  title: string;
  durationMinutes: number;
  passingScore: number;
  totalScore: number;
  listeningCount: number;
  readingCount: number;
  questions: ExamQuestion[];
}

export interface ExamHistoryItem {
  date: string;
  score: number;
  lScore: number;
  rScore: number;
  passed: boolean;
  accuracy: number;
}

export interface AppState {
  v: number;
  cards: Record<number, Card>;
  settings: Settings;
  streak: Streak;
  history: Record<string, HistoryRecord>;
  daily: Daily;
  examHistory: ExamHistoryItem[];
}

export interface ToneItem {
  tone: number;
  name: string;
  mark: string;
  pitch: string;
  desc: string;
  tipViet: string;
  exampleHz: string;
  examplePy: string;
  exampleVi: string;
  curvePath: string;
}

export interface InitialItem {
  py: string;
  ipa: string;
  tip: string;
  ex: string;
}

export interface FinalItem {
  py: string;
  tip: string;
  ex: string;
}

export interface PhonicsRule {
  title: string;
  rule: string;
  example: string;
}

export interface BasicStroke {
  name: string;
  zh: string;
  symbol: string;
  direction: string;
  tip: string;
  examples: string[];
  strokeChar: string;
}

export interface GrammarNuance {
  id: string;
  title: string;
  category: string;
  summary: string;
  items: {
    word: string;
    role: string;
    formula: string;
    examples: { hz: string; py: string; vi: string }[];
  }[];
  quickTip: string;
}

export interface GrammarStructure {
  title: string;
  rule: string;
  formula: string;
  example: string;
}

export interface ReaderToken {
  h: string;
  p?: string;
  hv?: string;
  vi?: string;
  isPunc?: boolean;
}

export interface ReaderStory {
  id: string;
  level: string;
  title: string;
  titlePy: string;
  titleVi: string;
  desc: string;
  paragraphs: {
    audioText: string;
    sentences: {
      tokens: ReaderToken[];
    }[];
  }[];
}

export interface StrokeRule {
  title: string;
  zh: string;
  example: string;
  desc: string;
}
