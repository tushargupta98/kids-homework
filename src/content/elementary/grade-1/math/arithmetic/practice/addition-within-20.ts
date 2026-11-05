import { missingNumberQuestion, setOf } from '../../../../../../lib/questions';
import { pick, randInt, shuffle } from '../../../../../../lib/random';
import { additionStory } from '../../../../../../lib/wordProblems';
import type { Question } from '../../../../../../types/practice';

const objects = ['🍎', '⭐', '🐟', '🎈', '🍪', '🐞'];

function fillIn(): Question {
  const a = randInt(1, 12);
  const b = randInt(1, 20 - a);
  return { type: 'fill-in', prompt: `${a} + ${b} = ?`, answer: a + b, hint: `Start at ${Math.max(a, b)} and count on ${Math.min(a, b)}.` };
}

function missing(): Question {
  const a = randInt(1, 12);
  const b = randInt(1, 20 - a);
  const hide = randInt(0, 1);
  return missingNumberQuestion('+', [a, b], hide, `Start at ${hide === 0 ? b : a} and count up to ${a + b}.`);
}

function story(): Question {
  const a = randInt(2, 12);
  return additionStory(a, randInt(1, 20 - a));
}

function pictureChoice(): Question {
  const a = randInt(1, 6);
  const b = randInt(1, 5);
  const sum = a + b;
  const emoji = pick(objects);
  const wrong = shuffle([sum - 2, sum - 1, sum + 1, sum + 2].filter((n) => n > 0)).slice(0, 3);
  return {
    type: 'multiple-choice',
    visual: `${emoji.repeat(a)} + ${emoji.repeat(b)}`,
    prompt: 'How many in all?',
    choices: shuffle([sum, ...wrong]).map(String),
    answer: String(sum),
    hint: 'Count every one!',
  };
}

function trueFalse(): Question {
  const a = randInt(2, 10);
  const b = randInt(2, 10);
  const correct = Math.random() < 0.5;
  const shown = correct ? a + b : a + b + pick([-1, 1, 2]);
  return { type: 'true-false', prompt: `${a} + ${b} = ${shown}`, answer: correct, hint: 'Try making a ten first.' };
}

const slug = 'addition-within-20';

/** One practice set per kind of question. */
export default [
  setOf(slug, 'sums', 'Fill in the sum', '✏️', fillIn),
  setOf(slug, 'missing', 'Find the missing number', '🔍', missing),
  setOf(slug, 'stories', 'Story problems', '📖', story),
  setOf(slug, 'pictures', 'Count the pictures', '🍎', pictureChoice),
  setOf(slug, 'true-false', 'True or false?', '✅', trueFalse),
];
