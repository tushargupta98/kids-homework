import { ALPHABET, LETTER_WORDS, letterChoices, type PictureWord } from '../../../../../../lib/phonics';
import { setOf } from '../../../../../../lib/questions';
import { pick, shuffle } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

const withWords = ALPHABET.filter((l) => LETTER_WORDS[l].length > 0);
const label = (w: PictureWord) => `${w.emoji} ${w.word}`;
/** C and K make the same sound in cat and kite, so never pair them as "different". */
const soundOf = (l: string) => (l === 'K' ? 'C' : l);

function startsWith(): Question {
  const l = pick(withWords);
  const w = pick(LETTER_WORDS[l]);
  return { type: 'multiple-choice', visual: w.emoji, prompt: `${w.word}. What letter does ${w.word} start with?`, choices: letterChoices(l), answer: l, hint: `Say it slowly: ${w.word}. Listen to the very first sound.` };
}

function findPicture(): Question {
  const l = pick(withWords);
  const right = pick(LETTER_WORDS[l]);
  const others = shuffle(withWords.filter((o) => soundOf(o) !== soundOf(l))).slice(0, 3).map((o) => pick(LETTER_WORDS[o]));
  return { type: 'multiple-choice', prompt: `Which one starts with the letter ${l}?`, choices: shuffle([right, ...others]).map(label), answer: label(right), hint: `Say each word. Which one starts with the ${l} sound?` };
}

function sameSound(): Question {
  const a = pick(withWords);
  const same = Math.random() < 0.5 && LETTER_WORDS[a].length > 1;
  const b = same ? a : pick(withWords.filter((o) => soundOf(o) !== soundOf(a)));
  const [w1, w2] = same ? shuffle(LETTER_WORDS[a]) : [pick(LETTER_WORDS[a]), pick(LETTER_WORDS[b])];
  return { type: 'true-false', visual: `${w1.emoji} ${w2.emoji}`, prompt: `Do ${w1.word} and ${w2.word} start with the same sound?`, answer: same, hint: `Say the first sound of each word: ${w1.word}, ${w2.word}.` };
}

const slug = 'letter-sounds';

export default [
  setOf(slug, 'starts-with', 'What letter does it start with?', '🍎', startsWith),
  setOf(slug, 'find-picture', 'Find the picture', '🖼️', findPicture),
  setOf(slug, 'same-sound', 'Same first sound?', '👂', sameSound),
];
