import { describe, expect, it } from 'vitest';
import { buildRound } from './questions';
import {
  blankIn,
  chainSteps,
  HEART_WORDS,
  heartSets,
  patternSets,
  PICTURES,
  SENTENCES,
  sentenceSets,
  PATTERN_LESSONS,
  wordChange,
} from './phonicsPatterns';

const round = (sets: ReturnType<typeof patternSets>, set: string) => buildRound(sets.find((b) => b.set === set)!, 200);

describe('phonics pattern data', () => {
  it('every lesson word has a blank to practise, and words are unique', () => {
    for (const l of PATTERN_LESSONS) {
      expect(new Set(l.words).size, l.slug).toBe(l.words.length);
      for (const w of l.words) expect(blankIn(l, w), `${l.slug}: ${w}`).toBeDefined();
    }
  });

  it('every chain step changes one spot', () => {
    for (const l of PATTERN_LESSONS) for (const chain of l.chains) {
      chain.slice(1).forEach((to, i) => {
        const c = wordChange(chain[i], to);
        expect(c, `${chain[i]} → ${to}`).toBeDefined();
        expect(c!.out.length + c!.in.length, `${chain[i]} → ${to}`).toBeLessThanOrEqual(4);
      });
    }
  });

  it('every picture belongs to a lesson word, and no picture is used twice', () => {
    const words = new Set(PATTERN_LESSONS.flatMap((l) => l.words));
    for (const w of Object.keys(PICTURES)) expect(words.has(w), w).toBe(true);
    const emoji = Object.values(PICTURES);
    expect(new Set(emoji).size).toBe(emoji.length);
  });

  it('every heart part is in its word', () => {
    for (const h of HEART_WORDS) expect(h.word.includes(h.heart), h.word).toBe(true);
  });

  it('every sentence has a missing word that is in it', () => {
    for (const s of SENTENCES) {
      expect(s.missing, s.text).toBeTruthy();
      expect(s.text).toMatch(new RegExp(`\\b${s.missing}\\b`));
    }
  });
});

describe('phonics pattern practice', () => {
  it('word chain answers make exactly the stated change', () => {
    for (const l of PATTERN_LESSONS) {
      for (const c of chainSteps(l)) {
        // Rebuild the new word from the old one using only the stated change.
        const pre = [...c.from].findIndex((ch, i) => ch !== c.to[i]);
        const at = pre < 0 ? c.from.length : Math.min(pre, c.from.length - c.out.length);
        expect(c.from.slice(0, at) + c.in + c.from.slice(at + c.out.length), `${c.from} → ${c.to}`).toBe(c.to);
      }
      const known = [...l.words, ...l.chains.flat()];
      for (const q of round(patternSets(l.slug), 'chains')) if (q.type === 'multiple-choice') expect(known).toContain(q.answer);
    }
  });

  it('missing-sound answers rebuild the spoken word', () => {
    for (const l of PATTERN_LESSONS) {
      for (const q of round(patternSets(l.slug), 'missing')) {
        const shown = /in (\S+)\?$/.exec(q.prompt)![1];
        expect(shown.replace(/_+/, String(q.answer)), q.prompt).toBe(q.say);
      }
    }
  });

  it('phonics lessons keep to sounds and spelling (word meaning practice is in Vocabulary)', () => {
    for (const l of PATTERN_LESSONS) {
      const ids = patternSets(l.slug).map((b) => b.set);
      for (const id of ['meaning', 'fill-sentence', 'pictures']) expect(ids).not.toContain(id);
    }
  });

  it('every spelling word has a sentence that uses it', () => {
    const decks = [...PATTERN_LESSONS.flatMap((l) => patternSets(l.slug)), ...heartSets('heart-words')].filter((b) => b.set === 'spell');
    expect(decks).toHaveLength(PATTERN_LESSONS.length + 1);
    for (const d of decks) {
      expect(d.cardMode).toBe('spell');
      for (const c of d.cards!) {
        expect(c.sentence, c.word).toBeTruthy();
        expect(c.sentence, c.word).toMatch(new RegExp(`(?<![A-Za-z])${c.word}(?![A-Za-z])`, c.word === 'I' ? '' : 'i'));
        expect(c.sentence!.split(' ').length, c.sentence).toBeLessThanOrEqual(12);
        // The meaning shows before the flip, so it must not give the word away.
        expect(c.meaning, c.word).toBeTruthy();
        const stem = c.word.length > 3 && c.word.endsWith('s') ? c.word.slice(0, -1) : c.word;
        expect(c.meaning, c.word).not.toMatch(new RegExp(`(?<![A-Za-z])(${c.word}|${stem})(?![A-Za-z])`, c.word === 'I' ? '' : 'i'));
      }
    }
  });

  
  it('find the heart word plays one of its choices', () => {
    for (const q of buildRound(heartSets('heart-words')[0], 200)) if (q.type === 'multiple-choice') expect(q.answer).toBe(q.say);
  });

  it('finish the sentence leaves out the word, and the full sentence is spoken', () => {
    for (const q of buildRound(sentenceSets('read-sentences')[0], 200)) {
      expect(q.prompt.replace('?', String(q.answer))).toBe(q.say);
    }
  });

  
  });

