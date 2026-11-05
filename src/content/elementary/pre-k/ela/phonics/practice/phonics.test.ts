import { describe, expect, it } from 'vitest';
import { ALPHABET, familyOf, LETTER_WORDS, RHYME_FAMILIES, SYLLABLE_WORDS } from '../../../../../../lib/phonics';
import { buildRound } from '../../../../../../lib/questions';
import type { Question, QuestionBank } from '../../../../../../types/practice';
import abcOrder from './abc-order';
import letterSounds from './letter-sounds';
import lowercase from './lowercase-letters';
import rhyming from './rhyming-words';
import syllables from './syllables';
import uppercase from './uppercase-letters';
import wordFamilies from './word-families';

const round = (sets: QuestionBank[], set: string) => buildRound(sets.find((b) => b.set === set)!, 300);
const wordOf = (choice: string) => choice.split(' ').slice(1).join(' ');
const rhymes = (a: string, b: string) => RHYME_FAMILIES.some((f) => f.some((w) => w.word === a) && f.some((w) => w.word === b));

describe('phonics practice sets', () => {
  it('multiple choice has 4 different choices including the answer', () => {
    for (const sets of [uppercase, lowercase, abcOrder, letterSounds, rhyming, syllables, wordFamilies]) {
      for (const bank of sets) {
        for (const q of buildRound(bank, 200).filter((q): q is Extract<Question, { type: 'multiple-choice' }> => q.type === 'multiple-choice')) {
          expect(new Set(q.choices).size, q.prompt).toBe(q.choices.length);
          expect(q.choices).toContain(q.answer);
        }
      }
    }
  });

  it('letters keep their case', () => {
    for (const q of round(uppercase, 'find')) if (q.type === 'multiple-choice') q.choices.forEach((c) => expect(c).toMatch(/^[A-Z]$/));
    for (const q of round(lowercase, 'find')) if (q.type === 'multiple-choice') q.choices.forEach((c) => expect(c).toMatch(/^[a-z]$/));
    for (const q of round(lowercase, 'big-to-little')) expect(q.answer).toBe(q.visual!.toLowerCase());
    for (const q of round(lowercase, 'little-to-big')) expect(q.answer).toBe(q.visual!.toUpperCase());
  });

  it('ABC order answers are the right letter', () => {
    const idx = (l: string) => ALPHABET.indexOf(l);
    for (const q of round(abcOrder, 'next')) expect(idx(String(q.answer))).toBe(idx(q.prompt[3]) + 1);
    for (const q of round(abcOrder, 'before')) expect(idx(String(q.answer))).toBe(idx(q.prompt[3]) - 1);
    for (const q of round(abcOrder, 'between')) expect(idx(String(q.answer))).toBe(idx(q.prompt[0]) + 1);
  });

  it('picture words start with their letter', () => {
    for (const [l, words] of Object.entries(LETTER_WORDS)) for (const w of words) expect(w.word[0].toUpperCase()).toBe(l);
    for (const q of round(letterSounds, 'starts-with')) expect(q.prompt[0].toUpperCase()).toBe(q.answer);
    for (const q of round(letterSounds, 'find-picture')) {
      const l = /letter (\w)/.exec(q.prompt)![1];
      if (q.type !== 'multiple-choice') continue;
      expect(wordOf(q.answer)[0].toUpperCase()).toBe(l);
      for (const c of q.choices) if (c !== q.answer) expect(wordOf(c)[0].toUpperCase()).not.toBe(l);
    }
    for (const q of round(letterSounds, 'same-sound')) {
      const [, a, b] = /Do (.+) and (.+) start/.exec(q.prompt)!;
      expect(a[0] === b[0], q.prompt).toBe(q.answer);
      expect([a[0], b[0]].sort().join('')).not.toBe('ck');
    }
  });

  it('rhymes are right', () => {
    for (const q of round(rhyming, 'rhyme-or-not')) {
      const [, a, b] = /Do (.+) and (.+) rhyme/.exec(q.prompt)!;
      expect(a).not.toBe(b);
      expect(rhymes(a, b), q.prompt).toBe(q.answer);
    }
    for (const q of round(rhyming, 'find-rhyme')) {
      const target = /with (.+)\?/.exec(q.prompt)![1];
      if (q.type !== 'multiple-choice') continue;
      for (const c of q.choices) expect(rhymes(target, wordOf(c)) && wordOf(c) !== target, c).toBe(c === q.answer);
    }
  });

  it('clap counts match the word list', () => {
    for (const q of round(syllables, 'claps')) {
      const word = /out: (.+)\./.exec(q.prompt)![1];
      expect(q.answer).toBe(String(SYLLABLE_WORDS.find((w) => w.word === word)!.claps));
    }
  });

  it('word families are right', () => {
    for (const q of round(wordFamilies, 'which-family')) {
      const rime = /-(\w+) family/.exec(q.prompt)![1];
      if (q.type !== 'multiple-choice') continue;
      for (const c of q.choices) expect(wordOf(c.includes(' ') ? c : ` ${c}`).endsWith(rime), c).toBe(c === q.answer);
    }
    for (const q of round(wordFamilies, 'same-family')) {
      const [, a, b] = /Are (\w+) and (\w+) in/.exec(q.prompt)!;
      expect(a).not.toBe(b);
      expect(familyOf(a) === familyOf(b)).toBe(q.answer);
    }
    for (const q of round(wordFamilies, 'change-sound')) {
      const [, from, letter] = /sound in (\w+) to (\w)\./.exec(q.prompt)!;
      expect(q.answer).toBe(letter + from.slice(1));
      expect(familyOf(String(q.answer))).toBeDefined();
    }
  });
});
