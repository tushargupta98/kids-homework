import type { ColumnOp, FillInQuestion, Question, QuestionBank } from '../types/practice';
import { shuffle } from './random';

/** A practice set where every question comes from one maker, so a round is a single kind of question. */
export const setOf = (conceptSlug: string, set: string, title: string, emoji: string, maker: () => Question): QuestionBank => ({
  conceptSlug,
  set,
  title,
  emoji,
  generate: (count) => Array.from({ length: count }, maker),
});

const solve: Record<ColumnOp, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => a / b,
};

/**
 * A fill-in drawn in notebook columns, e.g. 27 over "+ 5".
 * The prompt stays on one line ("27 + 5 = ?") for read-aloud and screen readers.
 */
export function columnQuestion(op: ColumnOp, operands: number[], hint?: string): FillInQuestion {
  return {
    type: 'fill-in',
    prompt: `${operands.join(` ${op} `)} = ?`,
    answer: operands.reduce((acc, n) => solve[op](acc, n)),
    hint,
    column: { op, operands },
  };
}

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
