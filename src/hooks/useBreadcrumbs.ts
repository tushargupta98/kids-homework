import { useLocation } from 'react-router-dom';
import { getClassification, getGrade, getLevel, getSubject } from '../data/curriculum';
import { getConcepts } from '../lib/content';
import type { GradeId, SubjectId } from '../types/curriculum';

export interface Crumb {
  label: string;
  to: string;
}

const sectionLabels: Record<string, string> = { practice: 'Practice', worksheets: 'Worksheets', concepts: 'Learn' };

/** Breadcrumbs derived from the URL path. */
export function useBreadcrumbs(): Crumb[] {
  const parts = useLocation().pathname.split('/').filter(Boolean);
  const [level, grade, subject, classification, section, concept] = parts;
  const crumbs: Crumb[] = [{ label: 'Home', to: '/' }];
  const at = (n: number) => '/' + parts.slice(0, n).join('/');

  const l = level && getLevel(level);
  if (!l) return crumbs;
  crumbs.push({ label: l.name, to: at(1) });

  const g = grade && getGrade(grade);
  if (!g) return crumbs;
  crumbs.push({ label: g.name, to: at(2) });

  const s = subject && getSubject(subject);
  if (!s) return crumbs;
  crumbs.push({ label: s.name, to: at(3) });

  const c = classification && getClassification(grade as GradeId, subject as SubjectId, classification);
  if (!c) return crumbs;
  crumbs.push({ label: c.name, to: at(4) });

  if (section && sectionLabels[section]) {
    crumbs.push({ label: sectionLabels[section], to: section === 'concepts' ? at(4) : at(5) });
  }
  if (section === 'concepts' && concept) {
    const meta = getConcepts({ level, grade, subject, classification }).find((m) => m.slug === concept);
    crumbs.push({ label: meta?.title ?? concept, to: at(6) });
  }
  return crumbs;
}
