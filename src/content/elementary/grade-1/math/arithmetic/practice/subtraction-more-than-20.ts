import { columnQuestion, missingNumberQuestion, setOf } from '../../../../../../lib/questions';
import { pick, randInt } from '../../../../../../lib/random';
import { subtractionStory } from '../../../../../../lib/wordProblems';
import type { Question } from '../../../../../../types/practice';

const needsBorrow = (a: number, b: number) => a % 10 < b % 10;

/** a from 21 to 99, b a 1- or 2-digit number smaller than a. Usually one needs a borrow. */
function pair(withBorrow = Math.random() < 0.75): [number, number] {
  for (;;) {
    const a = randInt(21, 99);
    const b = Math.random() < 0.5 ? randInt(2, 9) : randInt(11, 89);
    if (a - b >= 1 && needsBorrow(a, b) === withBorrow) return [a, b];
  }
}

/** Written in columns, like in a notebook, so there's room to borrow. */
function fillIn(): Question {
  return columnQuestion('-', pair(), 'Start with the ones. Not enough ones? Borrow 1 ten!');
}

/** Mostly without crossing a ten, since counting across one is harder. */
function missing(): Question {
  const [a, b] = pair(Math.random() < 0.3);
  const hide = randInt(0, 1);
  return missingNumberQuestion(
    '-',
    [a, b],
    hide,
    hide === 0 ? `Think: ${a - b} + ${b} = ?` : `Count up from ${a - b} to ${a}: tens first, then ones.`,
  );
}

function story(): Question {
  const [a, b] = pair();
  return subtractionStory(a, b, `Write ${a} − ${b} in columns. Start with the ones, and borrow if you need to!`);
}

const unit = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Break a ten into 10 ones, with either part blank: "Break a ten: 43 = 3 tens and _ ones." */
function breakTen(): Question {
  const n = randInt(20, 99);
  const [t, o] = [Math.floor(n / 10), n % 10];
  return Math.random() < 0.5
    ? { type: 'fill-in', prompt: `Break a ten: ${n} = ${unit(t - 1, 'ten', 'tens')} and ? ones.`, answer: o + 10, hint: `1 ten is 10 ones: ${o} + 10.` }
    : { type: 'fill-in', prompt: `Break a ten: ${n} = ? tens and ${o + 10} ones.`, answer: t - 1, hint: `One ten became ones, so there is 1 ten less than ${t}.` };
}

/** Break a hundred into 10 tens, with either part blank: "Break a hundred: 325 = 2 hundreds, _ tens and 5 ones." */
function breakHundred(): Question {
  const n = randInt(200, 999);
  const [h, t, o] = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
  const ones = unit(o, 'one', 'ones');
  return Math.random() < 0.5
    ? {
        type: 'fill-in',
        prompt: `Break a hundred: ${n} = ${unit(h - 1, 'hundred', 'hundreds')}, ? tens and ${ones}.`,
        answer: t + 10,
        hint: `1 hundred is 10 tens: ${t} + 10.`,
      }
    : {
        type: 'fill-in',
        prompt: `Break a hundred: ${n} = ? hundreds, ${t + 10} tens and ${ones}.`,
        answer: h - 1,
        hint: `One hundred became tens, so there is 1 hundred less than ${h}.`,
      };
}

/** Mixes breaking a ten (2-digit) and breaking a hundred (3-digit). */
function breakApart(): Question {
  return pick([breakTen, breakHundred])();
}

function needBorrow(): Question {
  const [a, b] = pair(Math.random() < 0.5);
  return {
    type: 'true-false',
    prompt: `Do you need to borrow for ${a} - ${b}?`,
    answer: needsBorrow(a, b),
    hint: `Look at the ones: can you take ${b % 10} away from ${a % 10}?`,
  };
}

function trueFalse(): Question {
  const [a, b] = pair(true);
  const correct = Math.random() < 0.5;
  // The classic "forgot to borrow" mistake: taking the smaller ones digit from the bigger one.
  const forgot = (Math.floor(a / 10) - Math.floor(b / 10)) * 10 + (b % 10) - (a % 10);
  const shown = correct ? a - b : pick([forgot, forgot, a - b + 10, a - b - 1, a - b + 1]);
  return { type: 'true-false', prompt: `${a} - ${b} = ${shown}`, answer: shown === a - b, hint: 'Did you remember to borrow a ten?' };
}

const slug = 'subtraction-more-than-20';

/** One practice set per kind of question. */
export default [
  setOf(slug, 'sums', 'Subtract with borrowing', '✏️', fillIn),
  setOf(slug, 'missing', 'Find the missing number', '🔍', missing),
  setOf(slug, 'stories', 'Story problems', '📖', story),
  setOf(slug, 'break-apart', 'Break a ten or a hundred', '🧱', breakApart),
  setOf(slug, 'need-borrow', 'Do I need to borrow?', '🤔', needBorrow),
  setOf(slug, 'true-false', 'True or false?', '✅', trueFalse),
];
