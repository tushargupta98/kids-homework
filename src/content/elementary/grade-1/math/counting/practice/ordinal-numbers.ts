import { ordinal, ordinalWord } from '../../../../../../lib/numberWords';
import { setOf } from '../../../../../../lib/questions';
import { randInt, shuffle } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

const animals = ['🐶', '🐱', '🐰', '🐸', '🐵', '🐷', '🐮', '🦊', '🐼', '🐯'];

/** A line of different animals, 5 to 10 long. */
const line = () => shuffle(animals).slice(0, randInt(5, 10));

/** Three other positions in the line, for wrong choices. */
const others = (length: number, pos: number) =>
  shuffle(Array.from({ length }, (_, i) => i + 1).filter((p) => p !== pos)).slice(0, 3);

function whoIsAt(): Question {
  const row = line();
  const pos = randInt(1, row.length);
  return {
    type: 'multiple-choice',
    visual: `👉 ${row.join(' ')}`,
    prompt: `Start at the 👉. Which animal is ${ordinal(pos)}?`,
    choices: shuffle([pos, ...others(row.length, pos)]).map((p) => row[p - 1]),
    answer: row[pos - 1],
    hint: 'Point at each animal from the 👉 and say: first, second, third…',
  };
}

function whatPosition(): Question {
  const row = line();
  const pos = randInt(1, row.length);
  return {
    type: 'multiple-choice',
    visual: `👉 ${row.join(' ')}`,
    prompt: `Start at the 👉. What place is the ${row[pos - 1]} in?`,
    choices: shuffle([pos, ...others(row.length, pos)]).map(ordinal),
    answer: ordinal(pos),
    hint: 'Count from the 👉: 1st, 2nd, 3rd…',
  };
}

/** Either direction: "Which word means 3rd?" or "How do you write 'third' short?" */
function words(): Question {
  const n = randInt(1, 10);
  const wrong = shuffle(Array.from({ length: 10 }, (_, i) => i + 1).filter((x) => x !== n)).slice(0, 3);
  const choices = shuffle([n, ...wrong]);
  return Math.random() < 0.5
    ? { type: 'multiple-choice', prompt: `Which word means ${ordinal(n)}?`, choices: choices.map(ordinalWord), answer: ordinalWord(n), hint: 'Say them in order: first, second, third, fourth…' }
    : { type: 'multiple-choice', prompt: `What is the short way to write "${ordinalWord(n)}"?`, choices: choices.map(ordinal), answer: ordinal(n), hint: 'Say them in order: 1st, 2nd, 3rd, 4th…' };
}

const slug = 'ordinal-numbers';

export default [
  setOf(slug, 'who-is-at', 'Who is in that place?', '🐶', whoIsAt),
  setOf(slug, 'what-position', 'What place is it in?', '🏁', whatPosition),
  setOf(slug, 'words', 'Ordinal words', '🥇', words),
];
