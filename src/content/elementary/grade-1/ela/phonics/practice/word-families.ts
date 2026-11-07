import { familyDecks, onsetOf, WORD_FAMILIES } from '../../../../../../lib/phonics';
import { setOf } from '../../../../../../lib/questions';
import { pick, shuffle } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

const others = (rime: string) => WORD_FAMILIES.filter((f) => f.rime !== rime);
const withPictures = WORD_FAMILIES.flatMap((f) => f.words.filter((w) => w.emoji).map((w) => ({ fam: f, w })));

function missingLetter(): Question {
  const { fam, w } = pick(withPictures);
  const onset = onsetOf(w.word, fam.rime);
  return {
    type: 'fill-in',
    visual: w.emoji,
    prompt: `What is this? Write the ${onset.length === 1 ? 'first letter' : 'first letters'}: ?${fam.rime}`,
    answer: onset,
    hint: `Say "${w.word}" slowly. What sound do you hear first?`,
  };
}

function buildWord(): Question {
  const fam = pick(WORD_FAMILIES);
  const words = new Set(fam.words.map((w) => w.word));
  return {
    type: 'fill-in',
    prompt: `Make a word in the -${fam.rime} family: ?${fam.rime}`,
    answer: onsetOf(fam.words[0].word, fam.rime),
    accepts: (given) => given.length > 0 && words.has(given.toLowerCase() + fam.rime),
    hint: `Try putting different sounds in front of "${fam.rime}". Is it a real word?`,
  };
}

function oddOneOut(): Question {
  const fam = pick(WORD_FAMILIES);
  const odd = pick(pick(others(fam.rime)).words);
  const members = shuffle(fam.words).slice(0, 3);
  return { type: 'multiple-choice', prompt: `Which word is NOT in the -${fam.rime} family?`, choices: shuffle([odd, ...members]).map((w) => w.word), answer: odd.word, hint: `Look at the last two letters of each word.` };
}

function readWord(): Question {
  const { fam, w } = pick(withPictures);
  // Wrong choices share the first letter or the ending, so the child has to read the whole word.
  const near = [
    ...fam.words.filter((o) => o !== w),
    ...others(fam.rime).flatMap((f) => f.words).filter((o) => o.word[0] === w.word[0]),
  ].map((o) => o.word);
  const wrong = shuffle([...new Set(near)]).slice(0, 3);
  return { type: 'multiple-choice', visual: w.emoji, prompt: 'Which word goes with the picture?', choices: shuffle([w.word, ...wrong]), answer: w.word, hint: 'Read the first letter, then the ending. Blend them together.' };
}

const slug = 'word-families';

// Practice flips these cards instead of typing; worksheets still print the write-in questions.
const missingLetterCards = withPictures.map(({ fam, w }) => {
  const onset = onsetOf(w.word, fam.rime);
  return { word: w.word, emoji: w.emoji, mark: onset, front: `${'_'.repeat(onset.length)}${fam.rime}`, clue: `Which ${onset.length === 1 ? 'letter goes' : 'letters go'} first?` };
});
const buildWordCards = WORD_FAMILIES.map((f) => ({
  word: f.words.map((w) => w.word).join(', '),
  front: `Say words in the -${f.rime} family: __${f.rime}`,
  clue: 'How many can you make?',
}));

export default [
  { ...setOf(slug, 'missing-letter', 'Write the first letter', '✍️', missingLetter), cards: missingLetterCards, cardsPerRound: 10, cardMode: 'prompt' as const },
  { ...setOf(slug, 'build-word', 'Make a family word', '🧱', buildWord), cards: buildWordCards, cardsPerRound: 10, cardMode: 'prompt' as const },
  setOf(slug, 'odd-one-out', 'Odd one out', '🙃', oddOneOut),
  setOf(slug, 'read-word', 'Read the word', '📖', readWord),
  ...familyDecks(slug),
];
