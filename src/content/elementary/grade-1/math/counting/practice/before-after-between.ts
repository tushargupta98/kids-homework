import { setOf } from '../../../../../../lib/questions';
import { randInt } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

function after(): Question {
  const n = randInt(1, 119);
  return { type: 'fill-in', prompt: `What number comes just after ${n}?`, answer: n + 1, hint: `Count on 1 from ${n}.` };
}

function before(): Question {
  const n = randInt(2, 120);
  return { type: 'fill-in', prompt: `What number comes just before ${n}?`, answer: n - 1, hint: `Count back 1 from ${n}.` };
}

function between(): Question {
  const n = randInt(2, 119);
  return {
    type: 'fill-in',
    prompt: `What number is between ${n - 1} and ${n + 1}?`,
    answer: n,
    hint: `Count: ${n - 1}, …, ${n + 1}. Which number is in the middle?`,
  };
}

const slug = 'before-after-between';

export default [
  setOf(slug, 'after', 'What comes after?', '➡️', after),
  setOf(slug, 'before', 'What comes before?', '⬅️', before),
  setOf(slug, 'between', 'What comes between?', '↔️', between),
];
