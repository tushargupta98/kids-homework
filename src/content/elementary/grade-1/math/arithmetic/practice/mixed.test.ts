import { describe, expect, it } from 'vitest';
import { buildRound } from '../../../../../../lib/questions';
import sets from './mixed';

const round = (set: string) => buildRound(sets.find((b) => b.set === set)!, 300);
const text = (q: { prompt: string; visual?: string }) => `${q.visual ?? ''} ${q.prompt}`;
const hasPlus = (s: string) => / \+ /.test(s);
const hasMinus = (s: string) => / - /.test(s) || /borrow|Take away|Break a/.test(s);

describe('mixed practice sets', () => {
  it('random addition has no subtraction', () => {
    for (const q of round('addition')) expect(hasMinus(text(q)), q.prompt).toBe(false);
  });

  it('random subtraction has no addition', () => {
    for (const q of round('subtraction')) expect(hasPlus(text(q)), q.prompt).toBe(false);
  });

  it('each mix really mixes question types', () => {
    for (const set of ['addition', 'subtraction', 'both']) {
      expect(new Set(round(set).map((q) => q.type)).size, set).toBeGreaterThan(1);
    }
  });

  it('addition & subtraction includes both', () => {
    const qs = round('both').map(text);
    expect(qs.some(hasPlus)).toBe(true);
    expect(qs.some(hasMinus)).toBe(true);
  });
});
