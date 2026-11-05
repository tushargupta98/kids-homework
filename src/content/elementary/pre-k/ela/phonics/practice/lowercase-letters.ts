import { ALPHABET, letterChoices } from '../../../../../../lib/phonics';
import { setOf } from '../../../../../../lib/questions';
import { pick } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

function findLetter(): Question {
  const l = pick(ALPHABET).toLowerCase();
  return { type: 'multiple-choice', prompt: `Find the little letter ${l}.`, choices: letterChoices(l), answer: l, hint: 'Careful with b, d, p and q: which way does it face?' };
}

function bigToLittle(): Question {
  const big = pick(ALPHABET);
  const little = big.toLowerCase();
  return { type: 'multiple-choice', visual: big, prompt: `Find the little letter that goes with big ${big}.`, choices: letterChoices(little), answer: little, hint: `Big ${big} and little ${little} make the same sound.` };
}

function littleToBig(): Question {
  const big = pick(ALPHABET);
  const little = big.toLowerCase();
  return { type: 'multiple-choice', visual: little, prompt: `Find the big letter that goes with little ${little}.`, choices: letterChoices(big), answer: big, hint: `Little ${little} and big ${big} are the same letter.` };
}

const slug = 'lowercase-letters';

export default [
  setOf(slug, 'find', 'Find the little letter', '🔍', findLetter),
  setOf(slug, 'big-to-little', 'Big letter to little letter', '🔡', bigToLittle),
  setOf(slug, 'little-to-big', 'Little letter to big letter', '🔠', littleToBig),
];
