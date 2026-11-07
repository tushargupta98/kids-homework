import { describe, expect, it } from 'vitest';
import type { MultipleChoiceQuestion } from '../types/practice';
import { FRY_SETS, POS_HELP, fryGap, fryPartOfSpeech, fryGappable, frySets, fryWhatMeans, fryWhichWord } from './fry';
import { hasPrintable } from './questions';
import { wholeWord } from './vocabulary';

const RANGES: Record<number, [number, number]> = { 1: [1, 4], 2: [5, 8], 3: [9, 12], 4: [13, 24], 5: [25, 40] };

describe('Fry sight words', () => {
  it('has 40 sets of up to 25 words, in the right grades, with no repeats', () => {
    expect(FRY_SETS.map((s) => s.set)).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
    for (const s of FRY_SETS) {
      const [lo, hi] = RANGES[s.grade];
      expect(s.set >= lo && s.set <= hi).toBe(true);
      expect(s.words.length).toBeGreaterThanOrEqual(20);
      expect(s.words.length).toBeLessThanOrEqual(25);
    }
    const all = FRY_SETS.flatMap((s) => s.words.map((w) => w.word.toLowerCase()));
    expect(new Set(all).size).toBe(all.length);
  });

  it('every sentence uses its word once, and no meaning gives the word away', () => {
    for (const w of FRY_SETS.flatMap((s) => s.words)) {
      expect(fryGappable([w]).length || w.word.length < 2, w.word).toBeTruthy();
      if (w.word.length > 1) expect(wholeWord(w.word).test(w.meaning), w.word).toBe(false);
    }
  });

  it('questions have the right answer and unique, fair choices', () => {
    for (const s of FRY_SETS) {
      for (let i = 0; i < 20; i++) {
        const m = fryWhatMeans(s.words) as MultipleChoiceQuestion;
        expect(s.words.find((w) => m.prompt.includes(`"${w.word}"`))?.meaning).toBe(m.answer);
        expect(new Set(m.choices).size).toBe(4);
        const w = fryWhichWord(s.words) as MultipleChoiceQuestion;
        expect(s.words.find((x) => x.word === w.answer)?.meaning).toBe(w.prompt.replace('Which word means: ', ''));
        expect(new Set(w.choices).size).toBe(4);
        const g = fryGap(s.words);
        expect(s.words.some((x) => x.sentence === g.prompt.replace(/(^|\s)\?/, `$1${g.answer}`))).toBe(true);
      }
    }
  });

  it('every set prints worksheets and never asks to type in Practice', () => {
    for (const s of FRY_SETS) {
      const banks = frySets(s.set);
      expect(banks.filter(hasPrintable).length).toBeGreaterThanOrEqual(4);
      expect(banks.every((b) => b.noTyping)).toBe(true);
    }
  });

  it('parts of speech: every word has help text, cards flip to its part, choices are fair', () => {
    for (const s of FRY_SETS) {
      for (const w of s.words) expect(POS_HELP[w.pos], w.word).toBeTruthy();
      const deck = frySets(s.set).find((b) => b.set === 'pos')!;
      expect(deck.cardMode).toBe('answer');
      for (const c of deck.cards!) expect(c.back).toBe(s.words.find((w) => w.word === c.word)!.pos);
      for (let i = 0; i < 20; i++) {
        const q = fryPartOfSpeech(s.words) as MultipleChoiceQuestion;
        expect(q.choices).toContain(q.answer);
        expect(new Set(q.choices).size).toBe(4);
      }
    }
  });
});
