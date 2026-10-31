import type { Question, QuestionBank } from '../types/practice';
import { shuffle } from './random';

/** Build a round of questions from a bank's generator and/or fixed list. */
export function buildRound(bank: QuestionBank, count: number): Question[] {
  if (bank.generate) return bank.generate(count);
  const fixed = bank.questions ?? [];
  const out: Question[] = [];
  while (out.length < count && fixed.length > 0) out.push(...shuffle(fixed));
  return out.slice(0, count);
}

export function checkAnswer(q: Question, given: string | boolean): boolean {
  switch (q.type) {
    case 'true-false':
      return given === q.answer;
    case 'multiple-choice':
      return given === q.answer;
    case 'fill-in':
      return String(given).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
  }
}

export const answerLabel = (q: Question) =>
  q.type === 'true-false' ? (q.answer ? 'True' : 'False') : String(q.answer);
