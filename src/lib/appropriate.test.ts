import { describe, expect, it } from 'vitest';
import blocked from '../data/blocked-words.json';

/**
 * CONSTITUTION.md, Rule 1: only age-appropriate content is rendered.
 * Scans every file that holds child-visible text for blocked words.
 */
const rendered = import.meta.glob<string>(
  [
    '/src/content/**/*.{mdx,ts}',
    '!/src/content/**/*.test.ts',
    '/src/data/*.{json,ts}',
    '!/src/data/blocked-words.json',
    '!/src/data/*.test.ts',
    // Word lists and story text used by the practice generators.
    '/src/lib/{phonics,wordProblems,numberWords}.ts',
  ],
  { eager: true, query: '?raw', import: 'default' },
);

const pattern = (w: string) => new RegExp(`(^|[^\\p{L}])${w.replace(/ /g, '\\s+')}(?=$|[^\\p{L}])`, 'iu');

describe('age-appropriate content (Constitution, Rule 1)', () => {
  it('finds files to check', () => expect(Object.keys(rendered).length).toBeGreaterThan(20));

  it('no blocked words in anything a child can see or hear', () => {
    const found = Object.entries(rendered).flatMap(([file, text]) =>
      blocked.words.filter((w) => pattern(w).test(text)).map((w) => `${file}: "${w}"`),
    );
    expect(found).toEqual([]);
  });
});
