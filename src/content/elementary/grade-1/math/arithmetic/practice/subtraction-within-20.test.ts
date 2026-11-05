import { describe, expect, it } from 'vitest';
import { buildRound } from '../../../../../../lib/questions';
import sets from './subtraction-within-20';

const round = (set: string) => buildRound(sets.find((b) => b.set === set)!, 200);

describe('subtraction within 20 practice sets', () => {
  it('fill-in differences are correct, from numbers up to 20', () => {
    for (const q of round('sums')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const [, a, b] = /^(\d+) - (\d+) = \?$/.exec(q.prompt)!.map(Number);
      expect(a - b).toBe(q.answer);
      expect(a).toBeLessThanOrEqual(20);
      expect(q.answer).toBeGreaterThan(0);
    }
  });

  it('missing-number questions hide exactly one number and the answer fills it', () => {
    for (const q of round('missing')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const [, a, b, diff] = /^(\d+|\?) - (\d+|\?) = (\d+)$/.exec(q.prompt)!;
      expect([a, b].filter((x) => x === '?')).toHaveLength(1);
      const [x, y] = [a, b].map((v) => (v === '?' ? Number(q.answer) : Number(v)));
      expect(x - y).toBe(Number(diff));
      expect(x).toBeLessThanOrEqual(20);
    }
  });

  it('story problems take the second number from the first', () => {
    for (const q of round('stories')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const nums = q.prompt.match(/\d+/g)!.map(Number);
      expect(nums, q.prompt).toHaveLength(2);
      expect(nums[0] - nums[1]).toBe(q.answer);
      expect(q.answer).toBeGreaterThan(0);
    }
  });

  it('take-away pictures leave the right number', () => {
    for (const q of round('pictures')) {
      if (q.type !== 'multiple-choice') throw new Error(`unexpected ${q.type}`);
      const shown = [...q.visual!].length / [...'🍎'].length;
      const [, b] = /^Take away (\d+)\./.exec(q.prompt)!.map(Number);
      expect(String(shown - b)).toBe(q.answer);
    }
  });

  it('true/false answers match the math', () => {
    for (const q of round('true-false')) {
      if (q.type !== 'true-false') throw new Error(`unexpected ${q.type}`);
      const [, a, b, c] = /^(\d+) - (\d+) = (\d+)$/.exec(q.prompt)!.map(Number);
      expect(a - b === c).toBe(q.answer);
    }
  });
});
