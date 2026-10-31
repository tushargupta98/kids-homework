import { describe, expect, it } from 'vitest';
import { classifications, getGrade, grades, levels, subjects } from './curriculum';

describe('curriculum taxonomy', () => {
  it('every level grade exists and points back to its level', () => {
    for (const level of levels) {
      for (const id of level.grades) {
        expect(getGrade(id)?.levelId, `${level.id} → ${id}`).toBe(level.id);
      }
    }
  });

  it('every grade belongs to exactly one level', () => {
    for (const g of grades) {
      expect(levels.filter((l) => l.grades.includes(g.id))).toHaveLength(1);
    }
  });

  it('slugs are unique and URL-safe', () => {
    const slug = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    for (const list of [levels, grades, subjects]) {
      const ids = list.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
      ids.forEach((id) => expect(id).toMatch(slug));
    }
    const classIds = classifications.map((c) => `${c.subjectId}/${c.id}`);
    expect(new Set(classIds).size).toBe(classIds.length);
    classifications.forEach((c) => expect(c.id).toMatch(slug));
  });

  it('classifications reference real subjects and grades', () => {
    for (const c of classifications) {
      expect(subjects.some((s) => s.id === c.subjectId)).toBe(true);
      expect(c.grades.length).toBeGreaterThan(0);
      c.grades.forEach((g) => expect(getGrade(g), `${c.id} → ${g}`).toBeDefined());
    }
  });

  it('every Pre-K to Grade 2 grade has Math, ELA and Science', () => {
    for (const g of ['pre-k', 'kindergarten', 'grade-1', 'grade-2'] as const) {
      for (const s of subjects) {
        expect(classifications.some((c) => c.subjectId === s.id && c.grades.includes(g)), `${g} ${s.id}`).toBe(true);
      }
    }
  });
});
