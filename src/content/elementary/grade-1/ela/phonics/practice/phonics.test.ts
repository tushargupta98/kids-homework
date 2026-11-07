import { describe, expect, it } from 'vitest';
import { familyOf, WORD_FAMILIES } from '../../../../../../lib/phonics';
import { buildRound, checkAnswer, splitBlank } from '../../../../../../lib/questions';
import mixed from './mixed';
import wordFamilies from './word-families';

const round = (set: string) => buildRound(wordFamilies.find((b) => b.set === set)!, 300);

describe('word families', () => {
  it('every word is a first sound plus its family ending, listed once', () => {
    const all = WORD_FAMILIES.flatMap((f) => f.words.map((w) => w.word));
    expect(new Set(all).size).toBe(all.length);
    for (const f of WORD_FAMILIES) for (const w of f.words) {
      expect(w.word.endsWith(f.rime), w.word).toBe(true);
      expect(w.word.length, w.word).toBeGreaterThan(f.rime.length);
    }
  });

  it('has one card deck per family, and decks stay out of the mix', () => {
    const decks = wordFamilies.filter((b) => b.cards && (b.set.startsWith('cards-') || b.set.startsWith('read-')));
    expect(decks.map((d) => d.set)).toEqual([
      ...WORD_FAMILIES.map((f) => `cards-${f.rime}`),
      'cards-random',
      ...WORD_FAMILIES.map((f) => `read-${f.rime}`),
      'read-random',
    ]);
    for (const d of decks) expect(d.cardMode === 'read').toBe(d.set.startsWith('read-'));
    for (const q of buildRound(mixed[0], 300)) expect(q.prompt).toBeTruthy();
  });

  it('the first-letter blank shows as a blank and makes a real word', () => {
    for (const q of round('missing-letter')) {
      const [, after] = splitBlank(q.prompt)!;
      expect(familyOf(String(q.answer) + after)).toBeDefined();
      expect(checkAnswer(q, String(q.answer).toUpperCase())).toBe(true);
    }
  });

  it('make a family word accepts every family word and nothing else', () => {
    for (const q of round('build-word')) {
      const rime = /-(\w+) family/.exec(q.prompt)![1];
      const fam = WORD_FAMILIES.find((f) => f.rime === rime)!;
      for (const w of fam.words) expect(checkAnswer(q, w.word.slice(0, -rime.length))).toBe(true);
      expect(checkAnswer(q, 'x')).toBe(false);
      expect(checkAnswer(q, 'ab')).toBe(false);
    }
  });

  it('odd one out has exactly one word from another family', () => {
    for (const q of round('odd-one-out')) {
      if (q.type !== 'multiple-choice') continue;
      const rime = /-(\w+) family/.exec(q.prompt)![1];
      expect(q.choices.filter((c) => !c.endsWith(rime))).toEqual([q.answer]);
    }
  });

  it('read the word has 4 different choices', () => {
    for (const q of round('read-word')) if (q.type === 'multiple-choice') {
      expect(new Set(q.choices).size).toBe(4);
      expect(q.choices).toContain(q.answer);
    }
  });
});
