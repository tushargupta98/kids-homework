import { describe, expect, it } from 'vitest';
import { getClassification, getGrade, getLevel, getSubject } from '../data/curriculum';
import type { GradeId, SubjectId } from '../types/curriculum';
import { allContentFiles, getConcepts, parseFrontmatter } from './content';
import { buildRound, checkAnswer } from './questions';

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
        expect(new Set(bank.cards.map((c) => c.word)).size, `${file} repeats a card`).toBe(bank.cards.length);
        continue;
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
