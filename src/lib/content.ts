import type { ComponentType } from 'react';
import type { MDXProps } from 'mdx/types';
import type { QuestionBank } from '../types/practice';

/**
 * Content lives at:
 *   src/content/<level>/<grade>/<subject>/<classification>/concepts/<slug>.mdx
 *   src/content/<level>/<grade>/<subject>/<classification>/practice/<slug>.ts
 * Files are discovered automatically — adding a file is all it takes.
 */

export interface ConceptFrontmatter {
  title: string;
  order?: number;
  emoji?: string;
  summary?: string;
  /** Standard code, e.g. "1.OA.C.6". */
  standard?: string;
}

export interface ConceptMeta extends ConceptFrontmatter {
  slug: string;
  path: string;
}

export interface ContentPath {
  level: string;
  grade: string;
  subject: string;
  classification: string;
}

// Frontmatter is parsed from the raw text so lesson bodies stay lazy-loaded.
const conceptSources = import.meta.glob<string>('/src/content/**/concepts/*.mdx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

/** Minimal frontmatter parser: flat `key: value` lines (strings and numbers). */
export function parseFrontmatter(source: string): ConceptFrontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  const data: Record<string, string | number> = {};
  for (const line of match?.[1].split(/\r?\n/) ?? []) {
    const m = /^(\w+):\s*(.*)$/.exec(line.trim());
    if (!m) continue;
    const raw = m[2].replace(/^['"]|['"]$/g, '');
    data[m[1]] = raw !== '' && !Number.isNaN(Number(raw)) ? Number(raw) : raw;
  }
  return { title: 'Untitled', ...data } as ConceptFrontmatter;
}

const conceptFrontmatter = Object.fromEntries(
  Object.entries(conceptSources).map(([file, src]) => [file, parseFrontmatter(src)]),
);

const conceptLoaders = import.meta.glob<ComponentType<MDXProps>>('/src/content/**/concepts/*.mdx', {
  import: 'default',
});

const questionBanks = import.meta.glob<QuestionBank>(['/src/content/**/practice/*.ts', '!**/*.test.ts'], {
  eager: true,
  import: 'default',
});

const baseDir = ({ level, grade, subject, classification }: ContentPath) =>
  `/src/content/${level}/${grade}/${subject}/${classification}`;

const slugFromFile = (file: string) => file.split('/').pop()!.replace(/\.(mdx|ts)$/, '');

export function getConcepts(path: ContentPath): ConceptMeta[] {
  const dir = `${baseDir(path)}/concepts/`;
  return Object.entries(conceptFrontmatter)
    .filter(([file]) => file.startsWith(dir))
    .map(([file, fm]) => ({ ...fm, slug: slugFromFile(file), path: file }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));
}

export function loadConcept(path: ContentPath, slug: string) {
  return conceptLoaders[`${baseDir(path)}/concepts/${slug}.mdx`];
}

export function getQuestionBanks(path: ContentPath): QuestionBank[] {
  const dir = `${baseDir(path)}/practice/`;
  const order = new Map(getConcepts(path).map((c, i) => [c.slug, i]));
  return Object.entries(questionBanks)
    .filter(([file]) => file.startsWith(dir))
    .map(([, bank]) => bank)
    .sort((a, b) => (order.get(a.conceptSlug) ?? 999) - (order.get(b.conceptSlug) ?? 999));
}

export const hasContent = (path: ContentPath) =>
  getConcepts(path).length > 0 || getQuestionBanks(path).length > 0;

/** All content file paths, for integrity tests. */
export const allContentFiles = () => ({
  concepts: Object.keys(conceptFrontmatter),
  practice: Object.keys(questionBanks),
  banks: questionBanks,
});
