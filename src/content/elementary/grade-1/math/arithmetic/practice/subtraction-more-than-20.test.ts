import { describe, expect, it } from 'vitest';
import { buildRound } from '../../../../../../lib/questions';
import sets from './subtraction-more-than-20';

const round = (set: string) => buildRound(sets.find((b) => b.set === set)!, 200);
const val = (v: string, answer: string | number) => (v === '?' ? Number(answer) : Number(v));

describe('subtraction of more than 20 practice sets', () => {
  it('column differences are correct, from numbers 21 to 99', () => {
    for (const q of round('sums')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const [, a, b] = /^(\d+) - (\d+) = \?$/.exec(q.prompt)!.map(Number);
      expect(a - b).toBe(q.answer);
      expect(a).toBeGreaterThan(20);
      expect(a).toBeLessThan(100);
      expect(q.answer).toBeGreaterThan(0);
      expect(q.column).toEqual({ op: '-', operands: [a, b] });
    }
  });

  it('missing-number questions hide exactly one number and the answer fills it', () => {
    for (const q of round('missing')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const [, a, b, diff] = /^(\d+|\?) - (\d+|\?) = (\d+)$/.exec(q.prompt)!;
      expect([a, b].filter((x) => x === '?')).toHaveLength(1);
      expect(val(a, q.answer) - val(b, q.answer)).toBe(Number(diff));
    }
  });

  it('story problems take the second number from the first', () => {
    for (const q of round('stories')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const nums = q.prompt.match(/\d+/g)!.map(Number);
      expect(nums, q.prompt).toHaveLength(2);
      expect(nums[0] - nums[1]).toBe(q.answer);
    }
  });

  it('break-a-ten and break-a-hundred blanks keep the number the same', () => {
    const kinds = new Set<string>();
    for (const q of round('break-apart')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      expect(q.prompt.split('?')).toHaveLength(2);
      const ten = /^Break a ten: (\d+) = (\d+|\?) tens? and (\d+|\?) ones\.$/.exec(q.prompt);
      const hundred = /^Break a hundred: (\d{3}) = (\d+|\?) hundreds?, (\d+|\?) tens and (\d+) ones?\.$/.exec(q.prompt);
      if (ten) {
        kinds.add('ten');
        const [, n, t, o] = ten;
        expect(val(t, q.answer) * 10 + val(o, q.answer)).toBe(Number(n));
        expect(val(o, q.answer)).toBeGreaterThanOrEqual(10);
      } else if (hundred) {
        kinds.add('hundred');
        const [, n, h, t, o] = hundred;
        expect(val(h, q.answer) * 100 + val(t, q.answer) * 10 + Number(o)).toBe(Number(n));
        expect(val(t, q.answer)).toBeGreaterThanOrEqual(10);
      } else {
        throw new Error(`unexpected prompt: ${q.prompt}`);
      }
    }
    expect(kinds).toEqual(new Set(['ten', 'hundred']));
  });

  it('"do I need to borrow" answers match the ones digits', () => {
    for (const q of round('need-borrow')) {
      if (q.type !== 'true-false') throw new Error(`unexpected ${q.type}`);
      const [, a, b] = /^Do you need to borrow for (\d+) - (\d+)\?$/.exec(q.prompt)!.map(Number);
      expect(a % 10 < b % 10).toBe(q.answer);
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
