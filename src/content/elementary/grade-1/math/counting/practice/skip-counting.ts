import { sequenceQuestion, setOf } from '../../../../../../lib/questions';
import { randInt } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

/** By 10s, half the time from a number that isn't a ten (7, 17, 27, …). */
function by10s(): Question {
  const start = Math.random() < 0.5 ? randInt(1, 8) * 10 : randInt(1, 79);
  return sequenceQuestion('Count by 10s:', start, 10, 5, randInt(1, 4), 'Add 10 each time. The ones digit stays the same!');
}

function by5s(): Question {
  return sequenceQuestion('Count by 5s:', randInt(1, 16) * 5, 5, 5, randInt(1, 4), 'Add 5 each time. The numbers end in 0 or 5.');
}

function by2s(): Question {
  return sequenceQuestion('Count by 2s:', randInt(1, 45) * 2, 2, 5, randInt(1, 4), 'Add 2 each time: skip one number.');
}

const slug = 'skip-counting';

export default [
  setOf(slug, 'by-10s', 'Count by 10s', '🔟', by10s),
  setOf(slug, 'by-5s', 'Count by 5s', '🖐️', by5s),
  setOf(slug, 'by-2s', 'Count by 2s', '✌️', by2s),
];
