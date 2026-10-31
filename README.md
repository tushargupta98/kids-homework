# Hoot School · Homework Helper

A static homework-help site for kids, organized like the US public school system:

**Level → Grade → Subject → Classification → Learn · Practice · Worksheets**

Built with Vite + React + TypeScript, Tailwind CSS 4, MDX and React Router. Deployed on Vercel.
It's designed for iPhone and iPad, and you can add it to the Home Screen to open it like an app.

## Scripts

```bash
npm install
npm run dev       # local dev server
npm test          # taxonomy + content + generator tests
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
```

## Deploying to Vercel

Import the GitHub repo in Vercel. `vercel.json` already sets the build command, the `dist` output and the
SPA rewrite, so deep links like `/elementary/grade-1/math/arithmetic/practice` work. Every push to
`main` deploys, and every PR gets a preview URL.

## How the site is organized

| Piece | Where |
|---|---|
| Levels, grades, subjects, classifications | `src/data/curriculum.ts` (the single source of truth) |
| Lessons and question banks | `src/content/<level>/<grade>/<subject>/<classification>/` |
| Age-based look and feel (mascot, read-aloud, celebrations) | `src/theme/ageThemes.ts` |
| Subject colors | `src/theme/subjectColors.ts` |
| Widgets you can use in lessons | `src/components/mdx/` |

URLs mirror the tree: `/elementary/grade-1/math/arithmetic/{concepts/<slug> | practice | worksheets}`.
A classification without content shows a friendly "coming soon" page, so the whole tree can be browsed today.

## Adding content

Each topic ("concept") is two files with the same name:

```
src/content/elementary/grade-1/math/arithmetic/
  concepts/addition-within-20.mdx   ← the lesson (Learn tab)
  practice/addition-within-20.ts    ← questions (Practice tab and Worksheets tab)
```

Nothing else needs registering. The files are found automatically.

### 1. The lesson (`concepts/<slug>.mdx`)

```mdx
---
title: Addition within 20
order: 1
emoji: ➕
summary: Put groups together to find how many in all.
standard: 1.OA.C.6
---

## What is adding?

**Adding** means putting groups together.

<Counters a={3} b={2} emoji="🍎" />
<NumberLine min={0} max={20} start={8} jump={5} />
<TenFrame frames={2} filled={9} />
<Callout type="tip" title="Hoot's trick">Start with the bigger number!</Callout>
```

Widgets available without importing them: `Counters`, `NumberLine`, `TenFrame`, `Callout` (`tip` | `remember` | `try`)
and `ReadAloud`. Keep frontmatter values on one line each (`key: value`).

### 2. The questions (`practice/<slug>.ts`)

Use a fixed list, a generator for endless random problems, or both:

```ts
import type { QuestionBank } from '../../../../../../types/practice';

const bank: QuestionBank = {
  conceptSlug: 'addition-within-20', // must match the file name
  title: 'Addition within 20',
  questions: [
    { type: 'fill-in', prompt: '3 + 4 = ?', answer: 7, hint: 'Count on from 4.' },
    { type: 'multiple-choice', visual: '🍎🍎 + 🍎', prompt: 'How many in all?', choices: ['2', '3', '4'], answer: '3' },
    { type: 'true-false', prompt: '5 + 5 = 10', answer: true },
  ],
  // generate: (count) => [...],
};
export default bank;
```

In fill-in prompts, a `?` becomes a write-in box on printed worksheets.

### 3. Check it

`npm test` checks that content folders match the taxonomy, that every question bank has a lesson, and that every
question's answer is valid.

## Adding a grade, subject or classification

Edit `src/data/curriculum.ts`. To open a grade, remove `comingSoon` from it. For a new subject, also add
its colors in `src/theme/subjectColors.ts`.
