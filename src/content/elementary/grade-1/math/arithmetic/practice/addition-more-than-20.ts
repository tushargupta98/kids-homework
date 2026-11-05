import { columnQuestion, missingNumberQuestion, setOf } from '../../../../../../lib/questions';
import { pick, randInt } from '../../../../../../lib/random';
import { additionStory } from '../../../../../../lib/wordProblems';
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

/** Mostly without crossing a ten, since counting up across one is harder. */
function missing(): Question {
  const [a, b] = pair(Math.random() < 0.3);
  const hide = randInt(0, 1);
  return missingNumberQuestion('+', [a, b], hide, `Count up from ${hide === 0 ? b : a} to ${a + b}: tens first, then ones.`);
}

/**
 * Carrying in words, with either part blank:
 * "8 + 5 = 13 ones. That makes _ ten and 3 ones." or
 * "7 tens + 5 tens = 12 tens. That makes 1 hundred and _ tens."
 */
function regroup(small: 'ones' | 'tens'): Question {
  const big = small === 'ones' ? 'ten' : 'hundred';
  const x = randInt(2, 9);
  const y = randInt(Math.max(2, 10 - x), 9);
  const total = x + y;
  const sum = small === 'ones' ? `${x} + ${y} = ${total} ones` : `${x} tens + ${y} tens = ${total} tens`;
  return Math.random() < 0.5
    ? {
        type: 'fill-in',
        prompt: `${sum}. That makes 1 ${big} and ? ${small}.`,
        answer: total - 10,
        hint: `Take 10 away from ${total}.`,
      }
    : {
        type: 'fill-in',
        prompt: `${sum}. That makes ? ${big} and ${total - 10} ${small}.`,
        answer: 1,
        hint: `10 ${small} make 1 ${big}.`,
      };
}

const unit = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** A 3-digit number split into place values, with one part blank: "345 = 3 hundreds, _ tens and 5 ones." */
function placeValue(): Question {
  const n = randInt(100, 999);
  const digits = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
  const names: [string, string][] = [
    ['hundred', 'hundreds'],
    ['ten', 'tens'],
    ['one', 'ones'],
  ];
  const hide = randInt(0, 2);
  const parts = digits.map((d, i) => (i === hide ? `? ${names[i][1]}` : unit(d, ...names[i])));
  return {
    type: 'fill-in',
    prompt: `${n} = ${parts[0]}, ${parts[1]} and ${parts[2]}.`,
    answer: digits[hide],
    hint: `Look at the ${['first', 'middle', 'last'][hide]} digit of ${n}.`,
  };
}

/** Mixes carrying ones, carrying tens into a hundred, and 3-digit place value. */
function tensAndOnes(): Question {
  return pick([() => regroup('ones'), () => regroup('tens'), placeValue, placeValue])();
}

function story(): Question {
  const [a, b] = pair();
  return additionStory(a, b, `Write ${a} + ${b} in columns. Add the ones first, and carry if you need to!`);
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
  setOf(slug, 'missing', 'Find the missing number', '🔍', missing),
  setOf(slug, 'stories', 'Story problems', '📖', story),
  setOf(slug, 'make-a-ten', 'Hundreds, tens and ones', '🧱', tensAndOnes),
  setOf(slug, 'need-carry', 'Do I need to carry?', '🤔', needCarry),
  setOf(slug, 'true-false', 'True or false?', '✅', trueFalse),
];
