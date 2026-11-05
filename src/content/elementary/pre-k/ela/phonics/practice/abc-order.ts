import { ALPHABET } from '../../../../../../lib/phonics';
import { setOf } from '../../../../../../lib/questions';
import { randInt, shuffle } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

/** The answer plus 3 letters that aren't it, mostly from nearby. */
function nearbyChoices(i: number): string[] {
  const near = [i - 2, i - 1, i + 1, i + 2, i + 3].filter((j) => j >= 0 && j < 26 && j !== i).map((j) => ALPHABET[j]);
  return shuffle([ALPHABET[i], ...shuffle(near).slice(0, 3)]);
}

const hint = 'Sing the ABC song up to here!';

function next(): Question {
  const i = randInt(2, 25);
  return { type: 'multiple-choice', prompt: `${ALPHABET[i - 2]}, ${ALPHABET[i - 1]}, ? What comes next?`, choices: nearbyChoices(i), answer: ALPHABET[i], hint };
}

function before(): Question {
  const i = randInt(0, 23);
  return { type: 'multiple-choice', prompt: `?, ${ALPHABET[i + 1]}, ${ALPHABET[i + 2]}. What comes before?`, choices: nearbyChoices(i), answer: ALPHABET[i], hint };
}

function between(): Question {
  const i = randInt(1, 24);
  return { type: 'multiple-choice', prompt: `${ALPHABET[i - 1]}, ?, ${ALPHABET[i + 1]}. What goes in the middle?`, choices: nearbyChoices(i), answer: ALPHABET[i], hint };
}

const slug = 'abc-order';

export default [
  setOf(slug, 'next', 'What comes next?', '➡️', next),
  setOf(slug, 'before', 'What comes before?', '⬅️', before),
  setOf(slug, 'between', 'What goes in the middle?', '↔️', between),
];
