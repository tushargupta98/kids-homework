import fry from '../data/fry-words.json';
import type { Question, QuestionBank } from '../types/practice';
import { mixOf, setOf } from './questions';
import { pick, shuffle } from './random';
import { letterClue, wholeWord } from './vocabulary';

/**
 * Fry sight words, Grades 1–5: 40 sets of about 25 words, each with a meaning and an example sentence.
 * The words live in src/data/fry-words.json. Words that don't suit the age group were left out (Rule 1).
 */

export interface FryWord {
  n: number;
  word: string;
  pos: string;
  meaning: string;
  sentence: string;
}

export interface FrySet {
  set: number;
  grade: number;
  words: FryWord[];
}

export const FRY_SETS: FrySet[] = fry.sets;

export const frySet = (n: number) => {
  const s = FRY_SETS.find((x) => x.set === n);
  if (!s) throw new Error(`No Fry set ${n}`);
  return s;
};

export const fryGradeSets = (grade: number) => FRY_SETS.filter((s) => s.grade === grade);

/** Words whose sentence uses them once, so leaving them out leaves one clear gap. */
export const fryGappable = (words: FryWord[]) =>
  words.filter((w) => w.word.length >= 2 && (w.sentence.match(wholeWord(w.word, 'g'))?.length ?? 0) === 1);

/** Two words whose meanings use each other ("fast" means "Very quick.") are never offered together. */
const tooClose = (a: FryWord, b: FryWord) =>
  a.word.toLowerCase() === b.word.toLowerCase() || a.meaning === b.meaning || wholeWord(b.word).test(a.meaning) || wholeWord(a.word).test(b.meaning);

/** Three fair wrong choices from the same set, look-alikes first. */
function fairWrong(answer: FryWord, words: FryWord[], n = 3, lookAlike = true): FryWord[] {
  const ok = words.filter((w) => !tooClose(answer, w));
  const like = lookAlike ? ok.filter((w) => w.word[0].toLowerCase() === answer.word[0].toLowerCase() || w.word.slice(-2) === answer.word.slice(-2)) : [];
  const picked: FryWord[] = [];
  // No two choices with the same word or the same meaning.
  for (const w of [...shuffle(like), ...shuffle(ok)]) if (picked.length < n && !picked.some((p) => tooClose(p, w))) picked.push(w);
  return picked;
}

const spellable = (words: FryWord[]) => words.filter((w) => w.word.length >= 2);

/** "What does "said" mean?" → four meanings. */
export function fryWhatMeans(words: FryWord[]): Question {
  const w = pick(words);
  return {
    type: 'multiple-choice',
    prompt: `What does "${w.word}" mean?`,
    choices: shuffle([w.meaning, ...fairWrong(w, words, 3, false).map((x) => x.meaning)]),
    answer: w.meaning,
    hint: `Try each meaning in a sentence with "${w.word}". Which one makes sense?`,
  };
}

/** "Which word means: Points to a certain thing." → four words. */
export function fryWhichWord(words: FryWord[]): Question {
  const w = pick(words);
  return {
    type: 'multiple-choice',
    prompt: `Which word means: ${w.meaning}`,
    choices: shuffle([w.word, ...fairWrong(w, words).map((x) => x.word)]),
    answer: w.word,
    hint: 'Read each word. Which one is that?',
  };
}

/** The sentence with the word left out, for worksheets with a word box. */
export function fryGap(words: FryWord[]): Question {
  const w = pick(fryGappable(words));
  // Keep the word as written, so a sentence's first word stays capitalised ("You are my best friend.").
  const asWritten = w.sentence.match(wholeWord(w.word))![0];
  return {
    type: 'fill-in',
    inWordBank: true,
    prompt: w.sentence.replace(wholeWord(w.word), '?'),
    clue: letterClue(w.word),
    answer: asWritten,
    hint: 'Read the whole sentence. Which word makes sense?',
  };
}

/** Read the meaning, write the word, for worksheets with a word box. */
export function fryMeaningWord(words: FryWord[]): Question {
  const w = pick(spellable(words));
  return {
    type: 'fill-in',
    inWordBank: true,
    prompt: w.meaning,
    clue: letterClue(w.word),
    answer: w.word,
    hint: `It starts with ${w.word[0]}.`,
  };
}

/** A short, kid-friendly line for each part of speech in the Fry list. */
export const POS_HELP: Record<string, string> = {
  noun: 'A person, place or thing.',
  verb: 'An action word, or a word like "is".',
  adjective: 'Tells more about a noun.',
  adverb: 'Tells how, when or where.',
  preposition: 'Tells where or when, like "in" or "on".',
  pronoun: 'Takes the place of a noun, like "she".',
  determiner: 'Comes before a noun to tell which or how many.',
  conjunction: 'Joins words or ideas, like "and".',
  number: 'Tells how many.',
  article: 'The words a, an and the.',
  interjection: 'A word that shows feeling, like "oh!"',
};

const ALL_POS = Object.keys(POS_HELP);

/** "What part of speech is "said" in: She said hi." → noun / verb / adjective / adverb. */
export function fryPartOfSpeech(words: FryWord[]): Question {
  const w = pick(words);
  // Wrong choices: other parts of speech in this set first, then any.
  const others = [...new Set([...shuffle(words.map((x) => x.pos)), ...shuffle(ALL_POS)])].filter((p) => p !== w.pos);
  return {
    type: 'multiple-choice',
    prompt: `What part of speech is "${w.word}" in: ${w.sentence}`,
    choices: shuffle([w.pos, ...others.slice(0, 3)]),
    answer: w.pos,
    hint: 'Is it a person, place or thing? An action? A word that tells more?',
  };
}

const slugOf = (n: number) => `fry-set-${n}`;
const deck = (cards: NonNullable<QuestionBank['cards']>, cardMode?: QuestionBank['cardMode']) => ({ cards, cardsPerRound: 10, cardMode });

/** All practice sets for one Fry set. Practice is tap and flip only; worksheets print the questions. */
export function frySets(n: number): QuestionBank[] {
  const slug = slugOf(n);
  const { words } = frySet(n);
  const tag = `· Set ${n}`;
  const banks: QuestionBank[] = [
    { conceptSlug: slug, set: 'read-cards', title: `Read the word ${tag}`, emoji: '👀', ...deck(words.map((w) => ({ word: w.word, sentence: w.sentence })), 'read') },
    { conceptSlug: slug, set: 'listen-cards', title: `Listen and find ${tag}`, emoji: '👂', ...deck(words.map((w) => ({ word: w.word, sentence: w.sentence }))) },
    setOf(slug, 'what-means', `What does it mean? ${tag}`, '💭', () => fryWhatMeans(words)),
    setOf(slug, 'which-word', `Which word means…? ${tag}`, '🔤', () => fryWhichWord(words)),
    {
      ...setOf(slug, 'fill', `Fill the sentence ${tag}`, '✏️', () => fryGap(words)),
      ...deck(fryGappable(words).map((w) => ({ word: w.word, gap: w.sentence.replace(wholeWord(w.word), '___'), sentence: w.sentence })), 'gap'),
    },
    {
      ...setOf(slug, 'meaning-word', `Meaning → word ${tag}`, '📝', () => fryMeaningWord(words)),
      ...deck(spellable(words).map((w) => ({ word: w.word, front: w.meaning, clue: letterClue(w.word), sentence: w.sentence })), 'prompt'),
    },
    {
      ...setOf(slug, 'pos', `Parts of speech ${tag}`, '🏷️', () => fryPartOfSpeech(words)),
      ...deck(words.map((w) => ({ word: w.word, front: 'What part of speech is it?', back: w.pos, clue: POS_HELP[w.pos], sentence: w.sentence })), 'answer'),
    },
  ];
  return banks.map((b) => ({ ...b, noTyping: true }));
}

/** A review set mixing every Fry set in a grade. */
export const fryGradeMix = (grade: number): QuestionBank[] => [
  {
    ...mixOf('fry-mixed', 'fry-mix', `Fry mix · Grade ${grade}`, '🎲', fryGradeSets(grade).flatMap((s) => frySets(s.set))),
    noTyping: true,
  },
];
