import { useParams } from 'react-router-dom';
import { getClassification, getGrade, getLevel, getSubject } from '../data/curriculum';
import type { Classification, Grade, Level, Subject } from '../types/curriculum';
import type { ContentPath } from '../lib/content';

export interface CurriculumContext {
  level?: Level;
  grade?: Grade;
  subject?: Subject;
  classification?: Classification;
  contentPath?: ContentPath;
  /** True when a URL segment doesn't match the taxonomy. */
  invalid: boolean;
}

/** Resolve and validate :level/:grade/:subject/:classification URL params. */
export function useCurriculum(): CurriculumContext {
  const p = useParams();
  const level = p.level ? getLevel(p.level) : undefined;
  const grade = p.grade ? getGrade(p.grade) : undefined;
  const subject = p.subject ? getSubject(p.subject) : undefined;
  const classification =
    grade && subject && p.classification ? getClassification(grade.id, subject.id, p.classification) : undefined;

  const invalid =
    (p.level !== undefined && !level) ||
    (p.grade !== undefined && (!grade || grade.levelId !== level?.id)) ||
    (p.subject !== undefined && !subject) ||
    (p.classification !== undefined && !classification);

  const contentPath =
    level && grade && subject && classification
      ? { level: level.id, grade: grade.id, subject: subject.id, classification: classification.id }
      : undefined;

  return { level, grade, subject, classification, contentPath, invalid };
}
