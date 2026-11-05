import { ALPHABET, letterChoices } from '../../../../../../lib/phonics';
import { setOf } from '../../../../../../lib/questions';
import { pick } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

function findLetter(): Question {
  const l = pick(ALPHABET);
  return { type: 'multiple-choice', prompt: `Find the letter ${l}.`, choices: letterChoices(l), answer: l, hint: 'Look at the shape of each letter.' };
}

function sameLetter(): Question {
  const l = pick(ALPHABET);
  return { type: 'multiple-choice', visual: l, prompt: 'Find the same letter.', choices: letterChoices(l), answer: l, hint: 'Look for lines and curves just like this one.' };
}

const slug = 'uppercase-letters';

export default [
  setOf(slug, 'find', 'Find the letter', '🔍', findLetter),
  setOf(slug, 'same', 'Match the same letter', '👀', sameLetter),
];
