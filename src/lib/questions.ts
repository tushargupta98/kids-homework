import type { ColumnOp, FillInQuestion, Question, QuestionBank } from '../types/practice';
import { pick, shuffle } from './random';

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

/**
 * A one-line fill-in with one of the numbers left out, e.g. "? + 5 = 10" or "34 + ? = 49".
 * `missing` is the index of the operand to hide; the answer is that operand.
 */
export function missingNumberQuestion(op: ColumnOp, operands: number[], missing: number, hint?: string): FillInQuestion {
  const result = operands.reduce((acc, n) => solve[op](acc, n));
  const shown = operands.map((n, i) => (i === missing ? '?' : String(n)));
  return { type: 'fill-in', prompt: `${shown.join(` ${op} `)} = ${result}`, answer: operands[missing], hint };
}

/**
 * Split a prompt at its write-in blank: a "?" standing on its own, as in "8 + 5 = ?", "? + 5 = 10" or "47, ?, 49",
 * or a missing first letter, as in "?et".
 * A question mark ending a sentence ("How many now?") isn't a blank. Returns undefined when there's none.
 */
export function splitBlank(prompt: string): [string, string] | undefined {
  const m = /(^|\s)\?(?=[\s,.?!]|[a-z]+\b|$)/.exec(prompt);
  if (!m) return undefined;
  const at = m.index + m[1].length;
  return [prompt.slice(0, at), prompt.slice(at + 1)];
}

/** A review set: each question comes from a randomly picked source set, so kinds are mixed. */
export const mixOf = (conceptSlug: string, set: string, title: string, emoji: string, all: QuestionBank[]): QuestionBank => {
  // Card-only decks have no questions to mix in.
  const sources = all.filter((b) => b.generate || b.questions?.length);
  return {
  conceptSlug,
  set,
  title,
  emoji,
  mixed: true,
  generate: (count) => Array.from({ length: count }, () => buildRound(pick(sources), 1)[0]),
  };
};

/**
 * A number pattern with one number left out, e.g. "Count by 10s: 20, 30, ?, 50".
 * `step` can be negative to count back. `hide` is the index of the missing number.
 */
export function sequenceQuestion(intro: string, start: number, step: number, length: number, hide: number, hint?: string): FillInQuestion {
  const nums = Array.from({ length }, (_, i) => start + i * step);
  const shown = nums.map((n, i) => (i === hide ? '?' : String(n)));
  return { type: 'fill-in', prompt: `${intro} ${shown.join(', ')}`, answer: nums[hide], hint };
}

/** Build a round of questions from a bank's generator and/or fixed list. */
export function buildRound(bank: QuestionBank, count: number): Question[] {
  if (bank.generate) return bank.generate(count);
  const fixed = bank.questions ?? [];
  const out: Question[] = [];
  while (out.length < count && fixed.length > 0) out.push(...shuffle(fixed));
  return out.slice(0, count);
}

/**
 * Can this question be done on paper? Listening questions need their 🔊, unless a picture shows the
 * word instead (picture spelling, or a missing sound under a picture).
 */
export const isPrintable = (q: Question) => !q.say || Boolean(q.visual);

/**
 * What makes two questions "the same" on one sheet: the same prompt, or, for spelling questions, the
 * same word to write (twig from its meaning and twig from a sentence are still a repeat).
 */
const sameKeys = (q: Question) => [`prompt:${q.prompt}|${q.visual ?? ''}`, ...(q.inWordBank ? [`word:${String(q.answer).toLowerCase()}`] : [])];

/**
 * A worksheet's worth of printable questions with no repeats. It can be shorter than `count`
 * when a set has fewer different questions than that (e.g. a lesson with only 6 pictures).
 */
export function buildPrintableRound(bank: QuestionBank, count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  for (let tries = 0; out.length < count && tries < 30; tries++) {
    for (const q of buildRound(bank, count)) {
      const keys = sameKeys(q);
      if (out.length >= count || !isPrintable(q) || keys.some((k) => seen.has(k))) continue;
      keys.forEach((k) => seen.add(k));
      out.push(q);
    }
  }
  return out;
}

/** Sets that can make a worksheet: ones with printable questions (card-only decks and listening-only sets can't). */
export const hasPrintable = (bank: QuestionBank) => buildRound(bank, 30).some(isPrintable);

export function checkAnswer(q: Question, given: string | boolean): boolean {
  switch (q.type) {
    case 'true-false':
      return given === q.answer;
    case 'multiple-choice':
      return given === q.answer;
    case 'fill-in':
      if (q.accepts) return q.accepts(String(given).trim());
      return String(given).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
  }
}

export const answerLabel = (q: Question) =>
  q.type === 'true-false' ? (q.answer ? 'True' : 'False') : q.type === 'fill-in' && q.accepts ? `${q.answer} (or any answer that works)` : String(q.answer);
