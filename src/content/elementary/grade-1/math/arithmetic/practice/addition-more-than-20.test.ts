import { describe, expect, it } from 'vitest';
import { buildRound } from '../../../../../../lib/questions';
import sets from './addition-more-than-20';

const round = (set: string) => buildRound(sets.find((b) => b.set === set)!, 200);

describe('addition of more than 20 practice sets', () => {
  it('keeps every fill-in sum between 21 and 99 and correct', () => {
    for (const q of round('sums')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const [, a, b] = /^(\d+) \+ (\d+) = \?$/.exec(q.prompt)!;
      expect(Number(a) + Number(b)).toBe(q.answer);
      expect(q.answer).toBeGreaterThan(20);
      expect(q.answer).toBeLessThan(100);
      expect(q.column).toEqual({ op: '+', operands: [Number(a), Number(b)] });
    }
  });

  it('true/false sums match the math', () => {
    for (const q of round('true-false')) {
      if (q.type !== 'true-false') throw new Error(`unexpected ${q.type}`);
      const [, a, b, c] = /^(\d+) \+ (\d+) = (\d+)$/.exec(q.prompt)!.map(Number);
      expect(a + b === c).toBe(q.answer);
    }
  });

  it('"do I need to carry" answers match the ones digits', () => {
    for (const q of round('need-carry')) {
      if (q.type !== 'true-false') throw new Error(`unexpected ${q.type}`);
      const [, a, b] = /^Do you need to carry for (\d+) \+ (\d+)\?$/.exec(q.prompt)!.map(Number);
      expect((a % 10) + (b % 10) >= 10).toBe(q.answer);
    }
  });

  it('tens-and-ones choices have the leftover ones as the answer', () => {
    for (const q of round('make-a-ten')) {
      if (q.type !== 'multiple-choice') throw new Error(`unexpected ${q.type}`);
      const [, x, y] = /^(\d+) \+ (\d+) =/.exec(q.prompt)!.map(Number);
      expect(q.answer).toBe(String(x + y - 10));
    }
  });
});
