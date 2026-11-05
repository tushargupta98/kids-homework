import { numberToWords } from '../../../../../../lib/numberWords';
import { setOf } from '../../../../../../lib/questions';
import { randInt, shuffle } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

/** Half the time a teen or twenty, since those are the trickiest to spell and read. */
const pickNumber = () => (Math.random() < 0.5 ? randInt(11, 20) : randInt(1, 120));

function wordToNumber(): Question {
  const n = pickNumber();
  return { type: 'fill-in', prompt: `Write the number: ${numberToWords(n)}`, answer: n, hint: 'Say the word out loud. Which number is it?' };
}

function numberToWord(): Question {
  const n = pickNumber();
  // Good mix-ups: neighbours, ten more or less, and the digits swapped (14 vs 41).
  const swapped = n >= 10 && n < 100 && n % 10 !== 0 ? Number(String(n).split('').reverse().join('')) : undefined;
  const near = [n - 1, n + 1, n + 10, n - 10, swapped].filter((x): x is number => x !== undefined && x >= 0 && x <= 120 && x !== n);
  const wrong = shuffle([...new Set(near)]).slice(0, 3);
  return {
    type: 'multiple-choice',
    prompt: `Which word is ${n}?`,
    choices: shuffle([n, ...wrong]).map(numberToWords),
    answer: numberToWords(n),
    hint: n > 12 && n < 20 ? `Teen numbers end in "teen": ${n} is ${n - 10} and 10.` : `Look at the tens first, then the ones.`,
  };
}

const slug = 'number-words';

export default [
  setOf(slug, 'words-to-numbers', 'Words to numbers', '🔤', wordToNumber),
  setOf(slug, 'numbers-to-words', 'Numbers to words', '🔢', numberToWord),
];
