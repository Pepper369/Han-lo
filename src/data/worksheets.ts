import { ALL_WORDS } from './words';
import { Word } from '../types';

export type GridType = 'mizige' | 'tianzige' | 'empty';

export interface GeneratedQuizQuestion {
  id: number;
  type: 'hanzi_to_meaning' | 'pinyin_to_hanzi' | 'hanzi_to_hv' | 'hanzi_to_pinyin';
  prompt: string;
  subPrompt?: string;
  options: string[];
  correctAnswer: number;
  targetWord: Word;
  explanation: string;
}

export interface GeneratedQuiz {
  id: string;
  title: string;
  level: number | 'mixed';
  createdAt: string;
  questions: GeneratedQuizQuestion[];
}

/**
 * Shuffle array utility (Fisher-Yates)
 */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a randomized quiz test based on level and question count
 */
export function generateQuiz(
  level: number | 'mixed' = 1,
  count: number = 20
): GeneratedQuiz {
  let pool = ALL_WORDS;
  if (level !== 'mixed') {
    pool = ALL_WORDS.filter((w) => w.level === level);
  }
  if (pool.length < 10) pool = ALL_WORDS;

  const shuffledPool = shuffle(pool);
  const selectedWords = shuffledPool.slice(0, Math.min(count, pool.length));

  const questions: GeneratedQuizQuestion[] = selectedWords.map((word, index) => {
    // Choose randomly among 4 question formats
    const types: GeneratedQuizQuestion['type'][] = [
      'hanzi_to_meaning',
      'pinyin_to_hanzi',
      'hanzi_to_hv',
      'hanzi_to_pinyin'
    ];
    const qType = types[index % types.length];

    // Pick 3 distractor words from the same level pool
    const otherWords = shuffle(pool.filter((w) => w.id !== word.id)).slice(0, 3);
    const candidateWords = shuffle([word, ...otherWords]);
    const correctIdx = candidateWords.findIndex((w) => w.id === word.id);

    let prompt = '';
    let subPrompt = '';
    let options: string[] = [];
    let explanation = '';

    switch (qType) {
      case 'hanzi_to_meaning':
        prompt = `Chọn nghĩa đúng của chữ Hán: 「 ${word.h} 」`;
        subPrompt = `Pinyin: ${word.p} · Hán-Việt: ${word.hv}`;
        options = candidateWords.map((w) => w.vi);
        explanation = `「${word.h}」 có âm Hán-Việt là "${word.hv}", pinyin là "${word.p}", nghĩa tiếng Việt: "${word.vi}".`;
        break;

      case 'pinyin_to_hanzi':
        prompt = `Chọn chữ Hán tương ứng với phiên âm: 「 ${word.p} 」`;
        subPrompt = `Nghĩa: ${word.vi}`;
        options = candidateWords.map((w) => w.h);
        explanation = `Phiên âm "${word.p}" biểu thị chữ Hán 「${word.h}」 (${word.hv}: ${word.vi}).`;
        break;

      case 'hanzi_to_hv':
        prompt = `Chọn âm Hán–Việt chính xác của chữ Hán: 「 ${word.h} 」`;
        subPrompt = `Nghĩa: ${word.vi}`;
        options = candidateWords.map((w) => w.hv);
        explanation = `Chữ 「${word.h}」 phát âm là "${word.p}", âm Hán–Việt là "${word.hv}".`;
        break;

      case 'hanzi_to_pinyin':
      default:
        prompt = `Chọn phiên âm Pinyin đúng của chữ Hán: 「 ${word.h} 」`;
        subPrompt = `Hán-Việt: ${word.hv} · Nghĩa: ${word.vi}`;
        options = candidateWords.map((w) => w.p);
        explanation = `Chữ 「${word.h}」 có pinyin chính xác là "${word.p}".`;
        break;
    }

    return {
      id: index + 1,
      type: qType,
      prompt,
      subPrompt,
      options,
      correctAnswer: correctIdx,
      targetWord: word,
      explanation
    };
  });

  const levelName = level === 'mixed' ? 'HSK Tổng Hợp (1–3)' : `HSK ${level}`;

  return {
    id: `quiz_${Date.now()}`,
    title: `Đề Kiểm Tra Trắc Nghiệm Từ Vựng ${levelName}`,
    level,
    createdAt: new Date().toLocaleDateString('vi-VN'),
    questions
  };
}
