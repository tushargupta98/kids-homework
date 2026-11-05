import { RHYME_FAMILIES, type PictureWord } from '../../../../../../lib/phonics';
import { setOf } from '../../../../../../lib/questions';
import { pick, shuffle } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

const label = (w: PictureWord) => `${w.emoji} ${w.word}`;
const otherFamilies = (family: PictureWord[]) => RHYME_FAMILIES.filter((f) => f !== family);

function rhymeOrNot(): Question {
  const family = pick(RHYME_FAMILIES);
  const rhymes = Math.random() < 0.5;
  const [a, b] = rhymes ? shuffle(family) : [pick(family), pick(pick(otherFamilies(family)))];
  return { type: 'true-false', visual: `${a.emoji} ${b.emoji}`, prompt: `Do ${a.word} and ${b.word} rhyme?`, answer: rhymes, hint: `Rhyming words sound the same at the end. Say them: ${a.word}, ${b.word}.` };
}

function findRhyme(): Question {
  const family = pick(RHYME_FAMILIES);
  const [target, right] = shuffle(family);
  const wrong = shuffle(otherFamilies(family)).slice(0, 2).map(pick);
  return { type: 'multiple-choice', visual: target.emoji, prompt: `Which one rhymes with ${target.word}?`, choices: shuffle([right, ...wrong]).map(label), answer: label(right), hint: `Listen to the end of ${target.word}. Which word ends the same way?` };
}

const slug = 'rhyming-words';

export default [
  setOf(slug, 'rhyme-or-not', 'Do they rhyme?', '🎵', rhymeOrNot),
  setOf(slug, 'find-rhyme', 'Find the rhyme', '🔍', findRhyme),
];
