import { familyDecks, onsetOf, WORD_FAMILIES, type PictureWord } from '../../../../../../lib/phonics';
import { setOf } from '../../../../../../lib/questions';
import { pick, shuffle } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

const label = (w: PictureWord) => (w.emoji ? `${w.emoji} ${w.word}` : w.word);
const others = (rime: string) => WORD_FAMILIES.filter((f) => f.rime !== rime);

function whichFamily(): Question {
  const fam = pick(WORD_FAMILIES);
  const right = pick(fam.words);
  const wrong = shuffle(others(fam.rime)).slice(0, 3).map((f) => pick(f.words));
  return { type: 'multiple-choice', prompt: `Which word is in the -${fam.rime} family?`, choices: shuffle([right, ...wrong]).map(label), answer: label(right), hint: `Words in the -${fam.rime} family all end with "${fam.rime}".` };
}

function sameFamily(): Question {
  const fam = pick(WORD_FAMILIES);
  const same = Math.random() < 0.5;
  const [a, b] = same ? shuffle(fam.words) : [pick(fam.words), pick(pick(others(fam.rime)).words)];
  return { type: 'true-false', prompt: `Are ${a.word} and ${b.word} in the same word family?`, answer: same, hint: `Listen to the ends: ${a.word}, ${b.word}. Are they the same?` };
}

function changeSound(): Question {
  const fam = pick(WORD_FAMILIES);
  // One-letter first sounds only (pet → vet), the easiest swap to hear.
  const simple = fam.words.filter((w) => onsetOf(w.word, fam.rime).length === 1);
  const [from, to] = shuffle(simple);
  // Wrong choices: the old word, a family word, and the new first sound with a different ending.
  const sameStart = others(fam.rime).flatMap((f) => f.words).filter((w) => w.word[0] === to.word[0]);
  const pool = [from, ...fam.words.filter((w) => w !== from && w !== to), ...sameStart];
  const wrong = [...new Set([from.word, ...shuffle(pool.map((w) => w.word))])].filter((w) => w !== to.word).slice(0, 3);
  return { type: 'multiple-choice', prompt: `Change the first sound in ${from.word} to ${to.word[0]}. What word do you get?`, choices: shuffle([to.word, ...wrong]), answer: to.word, hint: `Keep the end, "${fam.rime}". Put ${to.word[0]} in front.` };
}

const slug = 'word-families';

export default [
  setOf(slug, 'which-family', 'Which word is in the family?', '🏠', whichFamily),
  setOf(slug, 'same-family', 'Same family?', '👨‍👩‍👧', sameFamily),
  setOf(slug, 'change-sound', 'Change the first sound', '🔄', changeSound),
  ...familyDecks(slug),
];
