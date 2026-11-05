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

  it('hundreds, tens and ones blanks make the sentence true', () => {
    const val = (v: string, answer: string | number) => (v === '?' ? Number(answer) : Number(v));
    const kinds = new Set<string>();
    for (const q of round('make-a-ten')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      expect(q.prompt.split('?')).toHaveLength(2);
      const carry = /^(\d+)(?: tens)? \+ (\d+)(?: tens)? = (\d+) (ones|tens)\. That makes (\d+|\?) (?:ten|hundred) and (\d+|\?) (?:ones|tens)\.$/.exec(q.prompt);
      const place = /^(\d{3}) = (\d+|\?) hundreds?, (\d+|\?) tens? and (\d+|\?) ones?\.$/.exec(q.prompt);
      if (carry) {
        const [, x, y, total, small, big, rest] = carry;
        kinds.add(small);
        expect(Number(x) + Number(y)).toBe(Number(total));
        expect(val(big, q.answer) * 10 + val(rest, q.answer)).toBe(Number(total));
      } else if (place) {
        const [, n, h, t, o] = place;
        kinds.add('place');
        expect(val(h, q.answer) * 100 + val(t, q.answer) * 10 + val(o, q.answer)).toBe(Number(n));
      } else {
        throw new Error(`unexpected prompt: ${q.prompt}`);
      }
    }
    expect(kinds).toEqual(new Set(['ones', 'tens', 'place']));
  });

  it('missing-number questions hide exactly one number and the answer fills it', () => {
    for (const q of round('missing')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const [, a, b, total] = /^(\d+|\?) \+ (\d+|\?) = (\d+)$/.exec(q.prompt)!;
      expect([a, b].filter((x) => x === '?')).toHaveLength(1);
      const filled = [a, b].map((x) => (x === '?' ? Number(q.answer) : Number(x)));
      expect(filled[0] + filled[1]).toBe(Number(total));
      expect(Number(total)).toBeGreaterThan(20);
      expect(Number(total)).toBeLessThan(100);
    }
  });

  it('story problems add the two numbers in the story', () => {
    for (const q of round('stories')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const nums = q.prompt.match(/\d+/g)!.map(Number);
      expect(nums, q.prompt).toHaveLength(2);
      expect(nums[0] + nums[1]).toBe(q.answer);
      expect(q.answer).toBeGreaterThan(20);
      expect(q.answer).toBeLessThan(100);
    }
  });
});
