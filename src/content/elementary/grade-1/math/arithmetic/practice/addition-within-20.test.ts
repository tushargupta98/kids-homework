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

  it('missing-number questions hide exactly one number and the answer fills it', () => {
    for (const q of round('missing')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const [, a, b, total] = /^(\d+|\?) \+ (\d+|\?) = (\d+)$/.exec(q.prompt)!;
      expect([a, b].filter((x) => x === '?')).toHaveLength(1);
      const filled = [a, b].map((x) => (x === '?' ? Number(q.answer) : Number(x)));
      expect(filled[0] + filled[1]).toBe(Number(total));
      expect(Number(total)).toBeLessThanOrEqual(20);
    }
  });

  it('story problems add the two numbers in the story', () => {
    for (const q of round('stories')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const nums = q.prompt.match(/\d+/g)!.map(Number);
      expect(nums, q.prompt).toHaveLength(2);
      expect(nums[0] + nums[1]).toBe(q.answer);
      expect(q.answer).toBeLessThanOrEqual(20);
    }
  });
});
