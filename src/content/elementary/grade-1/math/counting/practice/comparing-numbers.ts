import { setOf } from '../../../../../../lib/questions';
import { pick, randInt, shuffle } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

const SIGNS = ['>', '<', '='];
const sign = (a: number, b: number) => (a > b ? '>' : a < b ? '<' : '=');
const signHint = 'The open mouth eats the bigger number. Compare the tens first, then the ones.';

/** Two numbers to compare: sometimes equal, often with the same tens or swapped digits (36 vs 63). */
function pair(): [number, number] {
  const a = randInt(10, 120);
  const r = Math.random();
  if (r < 0.15) return [a, a];
  if (r < 0.35 && a < 100) return [a, Math.floor(a / 10) * 10 + randInt(0, 9)];
  if (r < 0.5 && a < 100 && a % 10 !== 0) return [a, Number(String(a).split('').reverse().join(''))];
  return [a, randInt(10, 120)];
}

function pickSign(): Question {
  const [a, b] = pair();
  return { type: 'multiple-choice', prompt: `${a} ◯ ${b}`, choices: SIGNS, answer: sign(a, b), hint: signHint };
}

function trueFalse(): Question {
  const [a, b] = pair();
  const shown = Math.random() < 0.5 ? sign(a, b) : pick(SIGNS.filter((s) => s !== sign(a, b)));
  return { type: 'true-false', prompt: `${a} ${shown} ${b}`, answer: shown === sign(a, b), hint: signHint };
}

/** "Which number is greater?" or "…less?" from 3 different numbers. */
function greatestLeast(): Question {
  const nums = new Set<number>();
  const tens = randInt(1, 9);
  // Same tens for some of them, so the ones matter too.
  while (nums.size < 3) nums.add(Math.random() < 0.5 ? tens * 10 + randInt(0, 9) : randInt(10, 120));
  const list = [...nums];
  const greatest = Math.random() < 0.5;
  const answer = greatest ? Math.max(...list) : Math.min(...list);
  return {
    type: 'multiple-choice',
    prompt: `Which number is the ${greatest ? 'greatest' : 'least'}?`,
    choices: shuffle(list).map(String),
    answer: String(answer),
    hint: 'Look at the hundreds and tens first. If they match, look at the ones.',
  };
}

function compareSums(): Question {
  const a = randInt(2, 10);
  const b = randInt(2, 10);
  const total = a + b;
  const other = total + pick([-2, -1, 0, 0, 1, 2]);
  const sumFirst = Math.random() < 0.5;
  return sumFirst
    ? { type: 'multiple-choice', prompt: `${a} + ${b} ◯ ${other}`, choices: SIGNS, answer: sign(total, other), hint: `Work out ${a} + ${b} first.` }
    : { type: 'multiple-choice', prompt: `${other} ◯ ${a} + ${b}`, choices: SIGNS, answer: sign(other, total), hint: `Work out ${a} + ${b} first.` };
}

/** Put 3 numbers in order; the choices are different orders. */
function order(): Question {
  const nums = new Set<number>();
  while (nums.size < 3) nums.add(randInt(1, 120));
  const up = [...nums].sort((x, y) => x - y);
  const least = Math.random() < 0.5;
  const right = least ? up : [...up].reverse();
  const orders = [
    [up[0], up[1], up[2]], [up[0], up[2], up[1]], [up[1], up[0], up[2]],
    [up[1], up[2], up[0]], [up[2], up[0], up[1]], [up[2], up[1], up[0]],
  ].map((o) => o.join(', '));
  const answer = right.join(', ');
  return {
    type: 'multiple-choice',
    prompt: `Which shows the numbers from ${least ? 'least to greatest' : 'greatest to least'}?`,
    choices: shuffle([answer, ...shuffle(orders.filter((o) => o !== answer)).slice(0, 3)]),
    answer,
    hint: least ? 'Find the smallest number first.' : 'Find the biggest number first.',
  };
}

/** "45 > ?" — any whole number from 0 to 120 that makes it true is right. */
function fillNumber(): Question {
  const n = randInt(5, 115);
  const s = pick(['>', '<']);
  const blankFirst = Math.random() < 0.5;
  const prompt = blankFirst ? `Write a number that makes this true: ? ${s} ${n}` : `Write a number that makes this true: ${n} ${s} ?`;
  // Is the blank's number on the small side?
  const blankSmaller = (s === '<') === blankFirst;
  return {
    type: 'fill-in',
    prompt,
    answer: blankSmaller ? n - randInt(1, 5) : n + randInt(1, 5),
    accepts: (given) => /^\d+$/.test(given) && Number(given) <= 120 && (blankSmaller ? Number(given) < n : Number(given) > n),
    hint: blankSmaller ? `Think of a number less than ${n}.` : `Think of a number greater than ${n}.`,
  };
}

const slug = 'comparing-numbers';

export default [
  setOf(slug, 'pick-sign', 'Pick the sign: >, < or =', '🐊', pickSign),
  setOf(slug, 'true-false', 'True or false?', '✅', trueFalse),
  setOf(slug, 'greatest-least', 'Greatest or least?', '🏆', greatestLeast),
  setOf(slug, 'compare-sums', 'Compare sums', '➕', compareSums),
  setOf(slug, 'order', 'Put in order', '📶', order),
  setOf(slug, 'fill-number', 'Make it true', '✍️', fillNumber),
];
