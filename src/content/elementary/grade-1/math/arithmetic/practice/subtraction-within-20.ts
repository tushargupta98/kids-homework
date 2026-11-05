import { missingNumberQuestion, setOf } from '../../../../../../lib/questions';
import { pick, randInt, shuffle } from '../../../../../../lib/random';
import { subtractionStory } from '../../../../../../lib/wordProblems';
import type { Question } from '../../../../../../types/practice';

const objects = ['🍎', '⭐', '🐟', '🎈', '🍪', '🐞'];

/** a from 2 to 20, b at least 1, and the answer is at least 1. */
function pair(): [number, number] {
  const a = randInt(2, 20);
  return [a, randInt(1, Math.min(a - 1, 10))];
}

function fillIn(): Question {
  const [a, b] = pair();
  return { type: 'fill-in', prompt: `${a} - ${b} = ?`, answer: a - b, hint: `Start at ${a} and count back ${b}.` };
}

function missing(): Question {
  const [a, b] = pair();
  const hide = randInt(0, 1);
  return missingNumberQuestion(
    '-',
    [a, b],
    hide,
    hide === 0 ? `Think: ${a - b} + ${b} = ?` : `Count up from ${a - b} to ${a}.`,
  );
}

function story(): Question {
  return subtractionStory(...pair());
}

function pictureChoice(): Question {
  const a = randInt(4, 10);
  const b = randInt(1, a - 1);
  const left = a - b;
  const emoji = pick(objects);
  const wrong = shuffle([left - 2, left - 1, left + 1, left + 2].filter((n) => n >= 0)).slice(0, 3);
  return {
    type: 'multiple-choice',
    visual: emoji.repeat(a),
    prompt: `Take away ${b}. How many are left?`,
    choices: shuffle([left, ...wrong]).map(String),
    answer: String(left),
    hint: `Cover ${b} with your finger and count the rest.`,
  };
}

function trueFalse(): Question {
  const [a, b] = pair();
  const correct = Math.random() < 0.5;
  const shown = correct ? a - b : Math.max(0, a - b + pick([-1, 1, 2]));
  return {
    type: 'true-false',
    prompt: `${a} - ${b} = ${shown}`,
    answer: shown === a - b,
    hint: `Check it with adding: ${shown} + ${b} = ${a}?`,
  };
}

const slug = 'subtraction-within-20';

/** One practice set per kind of question. */
export default [
  setOf(slug, 'sums', 'Fill in the difference', '✏️', fillIn),
  setOf(slug, 'missing', 'Find the missing number', '🔍', missing),
  setOf(slug, 'stories', 'Story problems', '📖', story),
  setOf(slug, 'pictures', 'Take away pictures', '🍎', pictureChoice),
  setOf(slug, 'true-false', 'True or false?', '✅', trueFalse),
];
