import type { Question, QuestionBank } from '../types/practice';
import { blankIn, EXAMPLE_SENTENCES, HEART_WORDS, MEANINGS, PATTERN_LESSONS, PICTURES } from './phonicsPatterns';
import { setOf } from './questions';
import { pick, shuffle } from './random';

/**
 * Grade 1 vocabulary practice: word meanings, words in sentences (context clues) and picture words.
 * Uses the same words, meanings, sentences and pictures as the phonics lessons (src/data/phonics-patterns.json).
 */

export interface WordGroup {
  id: string;
  title: string;
  words: string[];
  /** Phonics lessons the words come from, so a question can name the word's pattern. */
  lessons?: string[];
}

const lessonGroup = (id: string, title: string, lessons: string[]): WordGroup => ({
  id,
  title,
  lessons,
  words: [...new Set(PATTERN_LESSONS.filter((l) => lessons.includes(l.slug)).flatMap((l) => l.words))],
});

/** Each vocab practice type comes in these groups, so the dropdown stays short. */
export const WORD_GROUPS: WordGroup[] = [
  { id: 'all', title: 'All words', words: [...new Set([...PATTERN_LESSONS.flatMap((l) => l.words), ...HEART_WORDS.map((h) => h.word)])] },
  lessonGroup('short-vowels', 'Short vowels', ['short-a', 'short-i', 'short-o', 'short-u', 'short-e']),
  lessonGroup('doubles', 'Double letters', ['ff-ll-ss-zz', 'all-oll-ull']),
  lessonGroup('digraphs', 'Digraphs', ['ck', 'sh', 'th', 'ch', 'ng', 'nk']),
  { id: 'heart', title: 'Heart words', words: HEART_WORDS.map((h) => h.word) },
];

/** The word as a whole word ("I" is matched by case, other words ignore it). */
export const wholeWord = (word: string, flags = '') => new RegExp(`(?<![A-Za-z])${word}(?![A-Za-z])`, (word === 'I' ? '' : 'i') + flags);

/** In Practice, a meaning like "Very quick." can fit more than one word, so give its length and first letter. */
export const letterClue = (word: string) => `${word.length} letters, starts with ${word[0]}`;

/** Words whose example sentence uses them exactly once, so leaving them out leaves one clear gap. */
export const gappable = (words: string[]) =>
  words.filter((w) => w.length >= 2 && (EXAMPLE_SENTENCES[w]?.match(wholeWord(w, 'g'))?.length ?? 0) === 1);

export const pictured = (words: string[]) => words.filter((w) => PICTURES[w]);

/**
 * Could these two words be mixed up as meaning the same thing? True when either one's meaning uses the
 * other word, e.g. fast ("Very quick.") and quick. Such words are never offered as wrong choices together.
 */
export const tooClose = (a: string, b: string) =>
  a.toLowerCase() === b.toLowerCase() || wholeWord(b).test(MEANINGS[a] ?? '') || wholeWord(a).test(MEANINGS[b] ?? '');

/** Wrong choices: words from the group that can't be mistaken for the answer, look-alikes first. */
export function fairWrong(answer: string, words: string[], n = 3, lookAlike = true): string[] {
  const ok = words.filter((w) => !tooClose(answer, w));
  const like = lookAlike ? ok.filter((w) => w[0] === answer[0] || w.slice(-2) === answer.slice(-2)) : [];
  return [...new Set([...shuffle(like), ...shuffle(ok)])].slice(0, n);
}

// ---- Word meanings ----

/** Read the meaning, write the word. Works on paper, where the word box helps choose. */
export function meaningQuestion(words: string[]): Question {
  const word = pick(words.filter((w) => w.length >= 2 && MEANINGS[w]));
  return {
    type: 'fill-in',
    inWordBank: true,
    visual: PICTURES[word],
    prompt: MEANINGS[word],
    clue: letterClue(word),
    answer: word,
    hint: `It starts with ${word[0]}. Say the word slowly and write each sound.`,
  };
}

/** "Which word means: A bird that swims and says quack?" → duck / sock / clock / truck. */
function whichWordQuestion(words: string[]): Question {
  const word = pick(words.filter((w) => MEANINGS[w]));
  return {
    type: 'multiple-choice',
    prompt: `Which word means: ${MEANINGS[word]}`,
    choices: shuffle([word, ...fairWrong(word, words)]),
    answer: word,
    hint: 'Read each word. Which one is that?',
  };
}

/** "What does duck mean?" → four meanings. */
function whatMeansQuestion(words: string[]): Question {
  const word = pick(words.filter((w) => MEANINGS[w]));
  const wrong = fairWrong(word, words.filter((w) => MEANINGS[w]), 3, false).map((w) => MEANINGS[w]);
  return {
    type: 'multiple-choice',
    prompt: `What does "${word}" mean?`,
    choices: shuffle([MEANINGS[word], ...wrong]),
    answer: MEANINGS[word],
    hint: `Try each meaning in a sentence with "${word}". Which one makes sense?`,
  };
}

// ---- Words in sentences ----

/**
 * The spelling pattern a word practises within its group: "short e" for rent, "ll" for spell, "ck" for duck.
 * Groups without one pattern (all words, heart words) give no hint.
 */
export function patternHint(word: string, group?: WordGroup): string | undefined {
  for (const lesson of PATTERN_LESSONS.filter((l) => group?.lessons?.includes(l.slug) && l.words.includes(word))) {
    const blank = blankIn(lesson, word);
    if (blank) return lesson.slug.startsWith('short-') ? `short ${blank.part}` : blank.part;
  }
  return undefined;
}

/** The example sentence with the word left out: "The ? swims in the pond." Works on paper. */
export function gapQuestion(words: string[], group?: WordGroup): Question {
  const word = pick(gappable(words));
  return {
    type: 'fill-in',
    inWordBank: true,
    prompt: EXAMPLE_SENTENCES[word].replace(wholeWord(word), '?'),
    patternHint: patternHint(word, group),
    clue: letterClue(word),
    answer: word,
    hint: 'Read the whole sentence. Which word makes sense? Then say it slowly and write each sound.',
  };
}

/** "The ___ swims in the pond." → duck / sock / lock / pick. */
function pickFitsQuestion(words: string[]): Question {
  const word = pick(gappable(words));
  const sentence = EXAMPLE_SENTENCES[word];
  // A wrong choice that's already in the sentence would read oddly, so leave those out.
  const candidates = words.filter((w) => !wholeWord(w).test(sentence));
  return {
    type: 'multiple-choice',
    prompt: sentence.replace(wholeWord(word), '___'),
    choices: shuffle([word, ...fairWrong(word, candidates)]),
    answer: word,
    hint: 'Read the sentence with each word. Which one makes sense?',
  };
}

// ---- Picture words ----

/** A picture and its 🔊: write the word. Works on paper, where the picture stands in for the sound. */
export function pictureQuestion(words: string[]): Question {
  const word = pick(pictured(words));
  return {
    type: 'fill-in',
    inWordBank: true,
    visual: PICTURES[word],
    prompt: 'Write the word for the picture.',
    say: word,
    answer: word,
    hint: 'Tap 🔊, say the word slowly, and write one sound at a time.',
  };
}

/** 🦆 → duck / dock / deck / luck. */
function namePictureQuestion(words: string[]): Question {
  const word = pick(pictured(words));
  // Wrong choices can't have a picture that could also be this one.
  const others = words.filter((w) => PICTURES[w] !== PICTURES[word]);
  return {
    type: 'multiple-choice',
    visual: PICTURES[word],
    prompt: 'Which word goes with the picture?',
    choices: shuffle([word, ...fairWrong(word, others)]),
    answer: word,
    hint: 'Say what you see. Then read each word slowly.',
  };
}

// ---- Practice sets: each type, for each word group ----

type Maker = (words: string[], group: WordGroup) => Question;

function typeSets(
  slug: string,
  type: string,
  title: string,
  emoji: string,
  maker: Maker,
  usable: (words: string[]) => string[],
  extend: (group: WordGroup) => Partial<QuestionBank> = () => ({}),
): QuestionBank[] {
  return WORD_GROUPS.filter((g) => usable(g.words).length >= 4).map((g) => ({
    ...setOf(slug, `${type}-${g.id}`, `${title} · ${g.title}`, emoji, () => maker(g.words, g)),
    ...extend(g),
  }));
}

const withMeaning = (words: string[]) => words.filter((w) => MEANINGS[w]);

export const meaningSets = (slug: string): QuestionBank[] => [
  ...typeSets(slug, 'meaning-spell', 'Meaning → spell', '📝', meaningQuestion, (w) => withMeaning(w).filter((x) => x.length >= 2)),
  ...typeSets(slug, 'which-word', 'Which word means…?', '🔤', whichWordQuestion, withMeaning),
  ...typeSets(slug, 'what-means', 'What does it mean?', '💭', whatMeansQuestion, withMeaning),
];

/** Gap cards for Practice: read the sentence, say the missing word, flip to see it. */
const gapCards = (group: WordGroup) =>
  gappable(group.words).map((word) => ({
    word,
    patternHint: patternHint(word, group),
    gap: EXAMPLE_SENTENCES[word].replace(wholeWord(word), '___'),
    sentence: EXAMPLE_SENTENCES[word],
  }));

export const sentenceWordSets = (slug: string): QuestionBank[] => [
  // Practice flips cards; Worksheets print the same sentences with a write-in line and a word box.
  ...typeSets(slug, 'fill', 'Fill the sentence', '✏️', gapQuestion, gappable, (g) => ({
    cards: gapCards(g),
    cardsPerRound: 10,
    cardMode: 'gap',
  })),
  ...typeSets(slug, 'pick', 'Pick the word that fits', '👆', pickFitsQuestion, gappable),
];

export const pictureSets = (slug: string): QuestionBank[] => [
  ...typeSets(slug, 'spell', 'Picture spelling', '🖼️', pictureQuestion, pictured),
  ...typeSets(slug, 'name', 'Name the picture', '🏷️', namePictureQuestion, pictured),
];
