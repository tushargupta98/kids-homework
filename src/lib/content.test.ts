import { describe, expect, it } from 'vitest';
import { getClassification, getGrade, getLevel, getSubject } from '../data/curriculum';
import type { GradeId, SubjectId } from '../types/curriculum';
import { allContentFiles, getConcepts, parseFrontmatter } from './content';
import { buildPracticeRound, buildPrintableRound, buildRound, checkAnswer, hasPrintable, isPrintable } from './questions';

const parsePath = (file: string) => {
  const [, , , level, grade, subject, classification, kind, name] = file.split('/');
  return { level, grade, subject, classification, kind, slug: name.replace(/\.(mdx|ts)$/, '') };
};

describe('content files', () => {
  const { concepts, practice, banks } = allContentFiles();

  it('live in folders that match the taxonomy', () => {
    for (const file of [...concepts, ...practice]) {
      const p = parsePath(file);
      expect(getLevel(p.level), file).toBeDefined();
      expect(getGrade(p.grade)?.levelId, file).toBe(p.level);
      expect(getSubject(p.subject), file).toBeDefined();
      expect(getClassification(p.grade as GradeId, p.subject as SubjectId, p.classification), file).toBeDefined();
    }
  });

  it('every lesson has a title in its frontmatter', () => {
    for (const file of concepts) {
      const p = parsePath(file);
      const meta = getConcepts(p).find((c) => c.slug === p.slug);
      expect(meta?.title, file).toBeTruthy();
      expect(meta?.title, file).not.toBe('Untitled');
    }
  });

  it('each practice set matches its file name and a concept lesson', () => {
    for (const file of practice) {
      const p = parsePath(file);
      expect(banks[file].length, file).toBeGreaterThan(0);
      for (const bank of banks[file]) expect(bank.conceptSlug, file).toBe(p.slug);
      // Mixed review sets have no lesson of their own.
      if (banks[file].every((b) => b.mixed)) continue;
      expect(concepts).toContain(file.replace('/practice/', '/concepts/').replace(/\.ts$/, '.mdx'));
    }
  });

  it('practice set ids are unique within a lesson', () => {
    for (const [file, sets] of Object.entries(banks)) {
      const ids = sets.map((b) => b.set);
      expect(new Set(ids).size, file).toBe(ids.length);
    }
  });

  it('every practice set produces valid, self-consistent questions (one type unless mixed)', () => {
    for (const [file, bank] of Object.entries(banks).flatMap(([f, sets]) => sets.map((b) => [`${f}#${b.set}`, b] as const))) {
      if (bank.cards) {
        expect(bank.cards.length, file).toBeGreaterThan(0);
        // Gap cards can share a missing word across different sentences, so compare whole cards.
        expect(new Set(bank.cards.map((c) => c.gap ?? c.word)).size, `${file} repeats a card`).toBe(bank.cards.length);
        for (const c of bank.cards.filter((x) => x.gap)) {
          expect(c.gap, file).toContain('___');
          expect(c.gap!.replace('___', c.word).toLowerCase(), file).toBe(c.sentence!.toLowerCase());
        }
        // A set with both cards and questions also prints; check its questions below.
        if (!bank.generate && !bank.questions) continue;
      }
      const qs = buildRound(bank, 50);
      expect(qs.length, file).toBe(50);
      if (!bank.mixed) expect(new Set(qs.map((q) => q.type)).size, `${file} mixes question types`).toBe(1);
      for (const q of qs) {
        expect(checkAnswer(q, q.type === 'true-false' ? q.answer : String(q.answer)), `${file}: ${q.prompt}`).toBe(true);
        if (q.type === 'multiple-choice') {
          expect(q.choices).toContain(q.answer);
          expect(new Set(q.choices).size).toBe(q.choices.length);
        }
      }
    }
  });
});

describe('parseFrontmatter', () => {
  it('reads strings and numbers', () => {
    const fm = parseFrontmatter('---\ntitle: Adding\norder: 2\nstandard: 1.OA.C.6\n---\n# Hi');
    expect(fm).toEqual({ title: 'Adding', order: 2, standard: '1.OA.C.6' });
  });
});

describe('worksheets', () => {
  const sets = Object.values(allContentFiles().banks).flat();

  it('only print questions that work on paper', () => {
    for (const bank of sets.filter(hasPrintable)) {
      for (const q of buildPrintableRound(bank, 20)) expect(isPrintable(q), `${bank.conceptSlug}/${bank.set}: ${q.prompt}`).toBe(true);
    }
  });

  it('leave out listening-only sets and card decks', () => {
    const hidden = sets.filter((b) => !hasPrintable(b)).map((b) => `${b.conceptSlug}/${b.set}`);
    for (const id of ['heart-words/find', 'read-sentences/finish', 'ck/spell']) expect(hidden).toContain(id);
    // Picture spelling works on paper: the picture stands in for the sound.
    expect(hidden).not.toContain('picture-words/spell-all');
  });
});


describe('word box', () => {
  it('meaning, fill-the-sentence and picture spelling answers go in the word box', () => {
    // Language Arts only: math has its own, unrelated "pictures" sets.
    const sets = Object.entries(allContentFiles().banks)
      .filter(([file]) => file.includes('/ela/'))
      .flatMap(([, banks]) => banks);
    for (const prefix of ['meaning-spell-', 'fill-', 'spell-']) {
      for (const bank of sets.filter((b) => b.set.startsWith(prefix) && !b.cards)) {
        for (const q of buildRound(bank, 20)) expect(q.inWordBank, `${bank.conceptSlug}/${bank.set}`).toBe(true);
      }
    }
    // Other spelling-free questions keep their answers off the page.
    for (const bank of sets.filter((b) => b.set === 'chains')) for (const q of buildRound(bank, 20)) expect(q.inWordBank).toBeFalsy();
  });
});

describe('worksheet repeats', () => {
  it('no question or spelling word appears twice on a sheet', () => {
    for (const bank of Object.values(allContentFiles().banks).flat().filter(hasPrintable)) {
      for (let i = 0; i < 5; i++) {
        const qs = buildPrintableRound(bank, 20);
        const prompts = qs.map((q) => `${q.prompt}|${q.visual ?? ''}`);
        expect(new Set(prompts).size, `${bank.conceptSlug}/${bank.set}`).toBe(prompts.length);
        const words = qs.filter((q) => q.inWordBank).map((q) => String(q.answer));
        expect(new Set(words).size, `${bank.conceptSlug}/${bank.set} repeats a word`).toBe(words.length);
      }
    }
  });
});

describe('Language Arts practice', () => {
  it('never asks the child to type: any set with write-in questions flips cards in Practice', () => {
    const ela = Object.entries(allContentFiles().banks)
      .filter(([file]) => file.includes('/ela/'))
      .flatMap(([, banks]) => banks);
    for (const bank of ela) {
      if (bank.cards) continue;
      const typed = buildPracticeRound(bank, 30).some((q) => q.type === 'fill-in');
      expect(typed, `${bank.conceptSlug}/${bank.set} needs cards for Practice`).toBe(false);
    }
  });
});
