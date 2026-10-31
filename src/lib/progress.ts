import { createStore } from './storage';

export interface ConceptProgress {
  /** Best stars earned in one round, 0–3. */
  stars: number;
  rounds: number;
  lastPlayed: string;
}

type ProgressState = Record<string, ConceptProgress>;

const store = createStore<ProgressState>('hoot:progress:v1', {});

export const progressKey = (grade: string, subject: string, classification: string, concept: string) =>
  `${grade}/${subject}/${classification}/${concept}`;

/** 3 stars for 90%+, 2 for 70%+, 1 for 40%+. */
export function starsForScore(correct: number, total: number): number {
  if (total === 0) return 0;
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.4) return 1;
  return 0;
}

export function recordRound(key: string, stars: number) {
  const all = store.get();
  const prev = all[key];
  store.set({
    ...all,
    [key]: {
      stars: Math.max(prev?.stars ?? 0, stars),
      rounds: (prev?.rounds ?? 0) + 1,
      lastPlayed: new Date().toISOString(),
    },
  });
}

export const useProgress = store.useStore;

/** Sum of best stars for all keys starting with a prefix, e.g. "grade-1/math/". */
export function starsUnder(progress: ProgressState, prefix: string) {
  return Object.entries(progress)
    .filter(([k]) => k.startsWith(prefix))
    .reduce((sum, [, p]) => sum + p.stars, 0);
}
