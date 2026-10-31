import { pick, randInt, shuffle } from '../../../../../../lib/random';
import type { Question, QuestionBank } from '../../../../../../types/practice';

const objects = ['🍎', '⭐', '🐟', '🎈', '🍪', '🐞'];

function fillIn(): Question {
  const a = randInt(1, 12);
  const b = randInt(1, 20 - a);
  return { type: 'fill-in', prompt: `${a} + ${b} = ?`, answer: a + b, hint: `Start at ${Math.max(a, b)} and count on ${Math.min(a, b)}.` };
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

/** 6 fill-ins, 2 picture questions and 2 true/false per 10, shuffled. */
export function generate(count: number): Question[] {
  const makers = [fillIn, fillIn, fillIn, pictureChoice, trueFalse];
  return shuffle(Array.from({ length: count }, (_, i) => makers[i % makers.length]()));
}

const bank: QuestionBank = {
  conceptSlug: 'addition-within-20',
  title: 'Addition within 20',
  generate,
};

export default bank;
