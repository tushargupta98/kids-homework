import { columnQuestion, setOf } from '../../../../../../lib/questions';
import { pick, randInt, shuffle } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

const needsCarry = (a: number, b: number) => (a % 10) + (b % 10) >= 10;

/** Two numbers with a sum from 21 to 99. Usually one needs a carry. */
function pair(withCarry = Math.random() < 0.75): [number, number] {
  for (;;) {
    const a = randInt(11, 89);
    const b = Math.random() < 0.5 ? randInt(2, 9) : randInt(11, 89);
    const sum = a + b;
    if (sum > 20 && sum < 100 && needsCarry(a, b) === withCarry) return [a, b];
  }
}

/** Written in columns, like in a notebook, so there's room to carry. */
function fillIn(): Question {
  return columnQuestion('+', pair(), 'Add the ones first. 10 or more ones? Carry 1 ten!');
}

function carryChoice(): Question {
  const x = randInt(2, 9);
  const y = randInt(Math.max(2, 10 - x), 9);
  const left = x + y - 10;
  const wrong = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n !== left)).slice(0, 3);
  return {
    type: 'multiple-choice',
    prompt: `${x} + ${y} = ${x + y} ones. That makes 1 ten and how many ones?`,
    choices: shuffle([left, ...wrong]).map(String),
    answer: String(left),
    hint: `Take 10 away from ${x + y}.`,
  };
}

function needCarry(): Question {
  const [a, b] = pair(Math.random() < 0.5);
  return {
    type: 'true-false',
    prompt: `Do you need to carry for ${a} + ${b}?`,
    answer: needsCarry(a, b),
    hint: `Add the ones: ${a % 10} + ${b % 10}. Is it 10 or more?`,
  };
}

function trueFalse(): Question {
  const [a, b] = pair(true);
  const correct = Math.random() < 0.5;
  // The "forgot to carry" mistake is 10 less than the real answer.
  const shown = correct ? a + b : a + b + pick([-10, -10, -1, 1, 10]);
  return { type: 'true-false', prompt: `${a} + ${b} = ${shown}`, answer: correct, hint: 'Did you remember to carry the 1?' };
}

const slug = 'addition-more-than-20';

/** One practice set per kind of question. */
export default [
  setOf(slug, 'sums', 'Add with carrying', '✏️', fillIn),
  setOf(slug, 'make-a-ten', 'Tens and ones', '🧱', carryChoice),
  setOf(slug, 'need-carry', 'Do I need to carry?', '🤔', needCarry),
  setOf(slug, 'true-false', 'True or false?', '✅', trueFalse),
];
