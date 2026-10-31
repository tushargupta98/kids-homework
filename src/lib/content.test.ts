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

  it('each question bank matches its file name and a concept lesson', () => {
    for (const file of practice) {
      const p = parsePath(file);
      expect(banks[file].conceptSlug, file).toBe(p.slug);
      expect(concepts).toContain(file.replace('/practice/', '/concepts/').replace(/\.ts$/, '.mdx'));
    }
  });

  it('every bank produces valid, self-consistent questions', () => {
    for (const [file, bank] of Object.entries(banks)) {
      const qs = buildRound(bank, 50);
      expect(qs.length, file).toBe(50);
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
