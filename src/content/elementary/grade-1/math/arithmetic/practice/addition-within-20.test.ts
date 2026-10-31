import { describe, expect, it } from 'vitest';
import { generate } from './addition-within-20';

describe('addition within 20 generator', () => {
  it('keeps every fill-in sum within 20 and correct', () => {
    for (const q of generate(200)) {
      if (q.type !== 'fill-in') continue;
      const [, a, b] = /^(\d+) \+ (\d+) = \?$/.exec(q.prompt)!;
      expect(Number(a) + Number(b)).toBe(q.answer);
      expect(q.answer).toBeLessThanOrEqual(20);
    }
  });

  it('true/false answers match the math', () => {
    for (const q of generate(200)) {
      if (q.type !== 'true-false') continue;
      const [, a, b, c] = /^(\d+) \+ (\d+) = (\d+)$/.exec(q.prompt)!.map(Number);
      expect(a + b === c).toBe(q.answer);
    }
  });
});
