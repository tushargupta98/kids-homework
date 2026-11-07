import { describe, expect, it } from 'vitest';
import { EXAMPLE_SENTENCES, MEANINGS, PICTURES } from './phonicsPatterns';
import { buildRound, checkAnswer, isPrintable, splitBlank } from './questions';
import { meaningSets, pictureSets, sentenceWordSets, tooClose, WORD_GROUPS } from './vocabulary';

const sets = { meaning: meaningSets('m'), sentence: sentenceWordSets('s'), picture: pictureSets('p') };
const of = (banks: ReturnType<typeof meaningSets>, prefix: string) => banks.filter((b) => b.set.startsWith(prefix));
const word = (w: string) => new RegExp(`(?<![A-Za-z])${w}(?![A-Za-z])`, w === 'I' ? '' : 'i');
const rounds = (banks: ReturnType<typeof meaningSets>, n = 60) => banks.flatMap((b) => buildRound(b, n));

describe('vocabulary sets', () => {
  it('come in word groups, and every set prints', () => {
    expect(WORD_GROUPS.map((g) => g.id)).toEqual(['all', 'short-vowels', 'doubles', 'digraphs', 'heart']);
    for (const bank of [...sets.meaning, ...sets.sentence, ...sets.picture]) {
      for (const q of buildRound(bank, 30)) expect(isPrintable(q), `${bank.set}: ${q.prompt}`).toBe(true);
    }
    // Heart words have no pictures, so picture practice has no heart group.
    expect(sets.picture.map((b) => b.set)).not.toContain('spell-heart');
  });

  it('meaning → spell shows the meaning and never the word', () => {
    for (const q of rounds(of(sets.meaning, 'meaning-spell-'))) {
      const w = String(q.answer);
      expect(q.prompt).toBe(MEANINGS[w]);
      expect(q.prompt).not.toMatch(word(w));
      expect(q.clue).toBe(`${w.length} letters, starts with ${w[0]}`);
      expect(q.inWordBank).toBe(true);
      expect(checkAnswer(q, w)).toBe(true);
    }
  });

  it('which word means: the answer fits the meaning, and no wrong choice is a near twin', () => {
    for (const q of rounds(of(sets.meaning, 'which-word-'))) {
      if (q.type !== 'multiple-choice') continue;
      expect(q.prompt).toBe(`Which word means: ${MEANINGS[q.answer]}`);
      expect(new Set(q.choices).size).toBe(4);
      for (const c of q.choices) if (c !== q.answer) expect(tooClose(q.answer, c), `${q.answer} / ${c}`).toBe(false);
    }
  });

  it('what does it mean: the answer is the word’s meaning, and the other meanings are fair', () => {
    for (const q of rounds(of(sets.meaning, 'what-means-'))) {
      if (q.type !== 'multiple-choice') continue;
      const w = /What does "(.+)" mean\?/.exec(q.prompt)![1];
      expect(q.answer).toBe(MEANINGS[w]);
      expect(new Set(q.choices).size).toBe(4);
      for (const c of q.choices) if (c !== q.answer) expect(c, w).not.toMatch(word(w));
    }
  });

  it('fill the sentence and pick the word put the answer back into its sentence', () => {
    for (const q of rounds(of(sets.sentence, 'fill-'))) {
      const w = String(q.answer);
      const [before, after] = splitBlank(q.prompt)!;
      expect((before + w + after).toLowerCase()).toBe(EXAMPLE_SENTENCES[w].toLowerCase());
      expect(q.prompt).not.toMatch(word(w));
      expect(q.inWordBank).toBe(true);
    }
    for (const q of rounds(of(sets.sentence, 'pick-'))) {
      if (q.type !== 'multiple-choice') continue;
      expect(q.prompt.replace('___', q.answer).toLowerCase()).toBe(EXAMPLE_SENTENCES[q.answer].toLowerCase());
      for (const c of q.choices) if (c !== q.answer) expect(q.prompt, c).not.toMatch(word(c));
    }
  });

  it('picture practice shows the right picture', () => {
    for (const q of rounds(of(sets.picture, 'spell-'))) {
      expect(q.visual).toBe(PICTURES[String(q.answer)]);
      expect(q.inWordBank).toBe(true);
    }
    for (const q of rounds(of(sets.picture, 'name-'))) {
      if (q.type !== 'multiple-choice') continue;
      expect(q.visual).toBe(PICTURES[q.answer]);
      for (const c of q.choices) if (c !== q.answer) expect(PICTURES[c] === q.visual, c).toBe(false);
    }
  });

  it('fill the sentence names the pattern for pattern groups only', () => {
    for (const bank of of(sets.sentence, 'fill-')) {
      const group = bank.set.replace('fill-', '');
      const items = [...buildRound(bank, 60).map((q) => ({ word: String(q.answer), hint: q.patternHint })), ...bank.cards!.map((c) => ({ word: c.word, hint: c.patternHint }))];
      for (const { word, hint } of items) {
        if (group === 'all' || group === 'heart') expect(hint, word).toBeUndefined();
        else if (group === 'short-vowels') expect(hint && word.includes(hint.replace('short ', '')) && hint.startsWith('short '), `${word}: ${hint}`).toBe(true);
        else expect(hint && word.includes(hint), `${word}: ${hint}`).toBe(true);
      }
    }
  });
});

