import { describe, expect, it } from 'vitest';
import { buildRound } from '../../../../../../lib/questions';
import sets from './addition-within-20';

const round = (set: string) => buildRound(sets.find((b) => b.set === set)!, 200);

describe('addition within 20 practice sets', () => {
  it('keeps every fill-in sum within 20 and correct', () => {
    for (const q of round('sums')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const [, a, b] = /^(\d+) \+ (\d+) = \?$/.exec(q.prompt)!;
      expect(Number(a) + Number(b)).toBe(q.answer);
      expect(q.answer).toBeLessThanOrEqual(20);
    }
  });

  it('true/false answers match the math', () => {
    for (const q of round('true-false')) {
      if (q.type !== 'true-false') throw new Error(`unexpected ${q.type}`);
      const [, a, b, c] = /^(\d+) \+ (\d+) = (\d+)$/.exec(q.prompt)!.map(Number);
      expect(a + b === c).toBe(q.answer);
    }
  });
});
