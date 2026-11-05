import { sequenceQuestion, setOf } from '../../../../../../lib/questions';
import { pick, randInt } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

/** Often start just before a tricky spot (…29 → 30, 99 → 100, 109 → 110). */
function startNear(low: number, high: number): number {
  if (Math.random() < 0.4) {
    const tricky = pick([randInt(1, 11) * 10, 100, 110]);
    return Math.min(high, Math.max(low, tricky - randInt(1, 3)));
  }
  return randInt(low, high);
}

function countOn(): Question {
  const start = startNear(1, 116);
  return sequenceQuestion('Count on:', start, 1, 5, randInt(1, 4), 'Each number is 1 more than the one before.');
}

function countBack(): Question {
  // Counting back 4 steps from here crosses the same tricky spots going down.
  const start = Math.min(120, startNear(1, 116) + 4);
  return sequenceQuestion('Count back:', start, -1, 5, randInt(1, 4), 'Each number is 1 less than the one before.');
}

const slug = 'count-on-and-back';

export default [
  setOf(slug, 'count-on', 'Count on', '⏩', countOn),
  setOf(slug, 'count-back', 'Count back', '⏪', countBack),
];
