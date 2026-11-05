import { describe, expect, it } from 'vitest';
import { numberToWords } from '../../../../../../lib/numberWords';
import { buildRound } from '../../../../../../lib/questions';
import type { QuestionBank } from '../../../../../../types/practice';
import beforeAfter from './before-after-between';
import countOnBack from './count-on-and-back';
import countingObjects from './counting-objects';
import hundredChart from './hundred-chart';
import numberWords from './number-words';
import skipCounting from './skip-counting';

const round = (sets: QuestionBank[], set: string) => buildRound(sets.find((b) => b.set === set)!, 300);

/** "Count by 10s: 7, 17, ?, 37, 47" → the full list with the answer filled in. */
const filled = (prompt: string, answer: string | number) =>
  prompt.split(':')[1].split(',').map((s) => (s.trim() === '?' ? Number(answer) : Number(s)));

describe('counting practice sets', () => {
  it('sequences step evenly and stay between 1 and 120', () => {
    const cases: [QuestionBank[], string, number][] = [
      [countOnBack, 'count-on', 1],
      [countOnBack, 'count-back', -1],
      [skipCounting, 'by-10s', 10],
      [skipCounting, 'by-5s', 5],
      [skipCounting, 'by-2s', 2],
    ];
    for (const [sets, set, step] of cases) {
      for (const q of round(sets, set)) {
        expect(q.prompt.split('?')).toHaveLength(2);
        const nums = filled(q.prompt, String(q.type === 'fill-in' ? q.answer : ''));
        nums.slice(1).forEach((n, i) => expect(n - nums[i], q.prompt).toBe(step));
        for (const n of nums) {
          expect(n).toBeGreaterThanOrEqual(1);
          expect(n).toBeLessThanOrEqual(120);
        }
      }
    }
  });

  it('before, after and between are 1 apart', () => {
    for (const q of round(beforeAfter, 'after')) expect(q.answer).toBe(Number(/after (\d+)/.exec(q.prompt)![1]) + 1);
    for (const q of round(beforeAfter, 'before')) expect(q.answer).toBe(Number(/before (\d+)/.exec(q.prompt)![1]) - 1);
    for (const q of round(beforeAfter, 'between')) {
      const [, a, b] = /between (\d+) and (\d+)/.exec(q.prompt)!.map(Number);
      expect(q.answer).toBe((a + b) / 2);
    }
  });

  it('counting pictures match the answer', () => {
    for (const q of round(countingObjects, 'how-many')) expect([...q.visual!.replace(/ /g, '')].length).toBe(q.answer);
    for (const q of round(countingObjects, 'bundles')) {
      const boxes = [...q.visual!].filter((c) => c === '📦').length;
      const pencils = q.visual!.split('✏️').length - 1;
      expect(boxes * 10 + pencils).toBe(q.answer);
    }
    for (const q of round(countingObjects, 'how-many-more')) {
      const [big, small] = q.visual!.split('|').map((s) => [...s.trim()].length);
      expect(big - small).toBe(q.answer);
    }
  });

  it('number words match their numbers', () => {
    for (const q of round(numberWords, 'words-to-numbers')) {
      expect(numberToWords(Number(q.answer))).toBe(q.prompt.replace('Write the number: ', ''));
    }
    for (const q of round(numberWords, 'numbers-to-words')) {
      expect(q.answer).toBe(numberToWords(Number(/is (\d+)/.exec(q.prompt)![1])));
    }
  });

  it('hundred chart neighbours follow the rows of 10', () => {
    const moves = { below: 10, above: -10, left: -1, right: 1 };
    for (const q of round(hundredChart, 'chart')) {
      const [, dir, n] = /(below|above|left|right)(?: of)? (\d+)\?$/.exec(q.prompt)!;
      expect(q.answer).toBe(Number(n) + moves[dir as keyof typeof moves]);
    }
    for (const q of round(hundredChart, 'hops')) {
      const [, start, count, size, way] = /^Start at (\d+)\. Make (\d+) hops of (\d+) (forward|back)/.exec(q.prompt)!;
      expect(q.answer).toBe(Number(start) + (way === 'forward' ? 1 : -1) * Number(count) * Number(size));
    }
  });
});

import comparing from './comparing-numbers';

describe('comparing numbers', () => {
  const sign = (a: number, b: number) => (a > b ? '>' : a < b ? '<' : '=');

  it('pick-the-sign and compare-sums answers match the numbers', () => {
    for (const q of round(comparing, 'pick-sign')) {
      const [, a, b] = /^(\d+) ◯ (\d+)$/.exec(q.prompt)!.map(Number);
      expect(q.answer).toBe(sign(a, b));
    }
    for (const q of round(comparing, 'compare-sums')) {
      const [left, right] = q.prompt.split(' ◯ ').map((side) => side.split(' + ').reduce((t, n) => t + Number(n), 0));
      expect(q.answer).toBe(sign(left, right));
    }
  });

  it('order answers are sorted the right way', () => {
    for (const q of round(comparing, 'order')) {
      const nums = String(q.answer).split(', ').map(Number);
      const up = [...nums].sort((x, y) => x - y);
      expect(nums).toEqual(q.prompt.includes('least to greatest') ? up : up.reverse());
    }
  });

  it('make-it-true accepts every number that works, and only those', () => {
    for (const q of round(comparing, 'fill-number')) {
      if (q.type !== 'fill-in') throw new Error(`unexpected ${q.type}`);
      const [, left, s, right] = /: (\d+|\?) ([<>]) (\d+|\?)$/.exec(q.prompt)!;
      for (let g = 0; g <= 120; g++) {
        const [a, b] = [left, right].map((v) => (v === '?' ? g : Number(v)));
        expect(q.accepts!(String(g)), `${q.prompt} with ${g}`).toBe(s === '>' ? a > b : a < b);
      }
      expect(q.accepts!('abc')).toBe(false);
    }
  });
});
