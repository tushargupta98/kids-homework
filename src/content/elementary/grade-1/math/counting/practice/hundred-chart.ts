import { setOf } from '../../../../../../lib/questions';
import { pick, randInt } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

type Direction = 'below' | 'above' | 'left' | 'right';
const moves: Record<Direction, number> = { below: 10, above: -10, left: -1, right: 1 };
const hints: Record<Direction, string> = {
  below: 'Going down one row adds 10.',
  above: 'Going up one row takes away 10.',
  left: 'One step left is 1 less.',
  right: 'One step right is 1 more.',
};

/** On a 1–120 chart with rows of 10 (1–10, 11–20, …). */
function neighbour(): Question {
  for (;;) {
    const n = randInt(1, 120);
    const dir = pick(Object.keys(moves) as Direction[]);
    const answer = n + moves[dir];
    // Stay on the chart, and on the same row for left/right.
    if (answer < 1 || answer > 120) continue;
    if (dir !== 'below' && dir !== 'above' && Math.ceil(n / 10) !== Math.ceil(answer / 10)) continue;
    const where = dir === 'below' || dir === 'above' ? `just ${dir}` : `just to the ${dir} of`;
    return { type: 'fill-in', prompt: `On a hundred chart, what number is ${where} ${n}?`, answer, hint: hints[dir] };
  }
}

/** Hops on a number line, by 1s or 10s, forward or back. */
function hops(): Question {
  const size = pick([1, 10]);
  const count = randInt(2, 5);
  const forward = Math.random() < 0.6;
  const start = forward ? randInt(1, 120 - size * count) : randInt(1 + size * count, 120);
  const answer = start + (forward ? 1 : -1) * size * count;
  return {
    type: 'fill-in',
    prompt: `Start at ${start}. Make ${count} hops of ${size} ${forward ? 'forward' : 'back'}. Where do you land?`,
    answer,
    hint: `Count ${forward ? 'on' : 'back'} by ${size}s from ${start}, ${count} times.`,
  };
}

const slug = 'hundred-chart';

export default [
  setOf(slug, 'chart', 'Hundred chart neighbours', '💯', neighbour),
  setOf(slug, 'hops', 'Number line hops', '🐸', hops),
];
