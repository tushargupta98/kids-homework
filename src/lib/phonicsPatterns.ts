import data from '../data/phonics-patterns.json';
import type { Question, QuestionBank } from '../types/practice';
import { setOf } from './questions';
import { pick, shuffle } from './random';

/**
 * Grade 1 phonics patterns, heart words and sentences, built from src/data/phonics-patterns.json.
 * Every set is one kind of question; card decks reuse the listen & read FlashCards.
 */

export interface PatternLesson {
  slug: string;
  title: string;
  samples: string[];
  chains: string[][];
  words: string[];
  /** Spelling choices for "missing sounds"; the first member found in a word is the answer. */
  blanks: string[][];
  sentences: string[];
}

export interface HeartWord {
  word: string;
  /** The part that has to be learned by heart, e.g. "ai" in said. */
  heart: string;
  /** Irregular only until the spelling pattern is taught (e.g. go, she, look). */
  forNow?: boolean;
}

export const PATTERN_LESSONS: PatternLesson[] = data.lessons;
export const HEART_WORDS: HeartWord[] = data.heartWords;
export const PICTURES: Record<string, string> = data.pictures;
/** A sentence that uses each spelling word, shown on the back of its card. */
export const EXAMPLE_SENTENCES: Record<string, string> = data.exampleSentences;
/** A child-friendly meaning for each spelling word. It never contains the word, so it can show before the card flips. */
export const MEANINGS: Record<string, string> = data.meanings;
/** Sentences that review several patterns at once. */
export const REVIEW_SENTENCES: string[] = data.reviewSentences;

export const patternLesson = (slug: string) => {
  const lesson = PATTERN_LESSONS.find((l) => l.slug === slug);
  if (!lesson) throw new Error(`No phonics lesson "${slug}" in phonics-patterns.json`);
  return lesson;
};

// ---- Word chains: what changed between two words ----

export interface WordChange {
  from: string;
  to: string;
  /** Letters taken out of `from` ('' when letters are only added). */
  out: string;
  /** Letters put in ('' when letters are only taken away). */
  in: string;
  /** Where the change is: start, middle or end of the word. */
  where: 'start' | 'middle' | 'end';
}

/** The single spot where two words differ, found by trimming the shared start and end. */
export function wordChange(from: string, to: string): WordChange | undefined {
  if (from === to) return undefined;
  let pre = 0;
  while (pre < from.length && pre < to.length && from[pre] === to[pre]) pre++;
  let suf = 0;
  while (suf < from.length - pre && suf < to.length - pre && from[from.length - 1 - suf] === to[to.length - 1 - suf]) suf++;
  const out = from.slice(pre, from.length - suf);
  const put = to.slice(pre, to.length - suf);
  const where = pre === 0 ? 'start' : suf === 0 ? 'end' : 'middle';
  return { from, to, out, in: put, where };
}

/** "Change the f in fan to m." / "Add s to the start of mall." / "Take away the s in stall." */
export function describeChange(c: WordChange): string {
  if (!c.out) return `Add ${c.in} to the ${c.where === 'middle' ? 'middle' : c.where} of ${c.from}.`;
  if (!c.in) return `Take away the ${c.out} in ${c.from}.`;
  return `Change the ${c.out} in ${c.from} to ${c.in}.`;
}

/** Steps from the lesson's chains, plus pairs of lesson words that differ in one small spot. */
export function chainSteps(l: PatternLesson): WordChange[] {
  const steps = l.chains.flatMap((chain) => chain.slice(1).map((to, i) => wordChange(chain[i], to)!));
  for (const a of l.words) {
    for (const b of l.words) {
      const c = wordChange(a, b);
      // Small changes only: one or two letters swapped, added or taken away.
      if (c && c.out.length + c.in.length <= 2) steps.push(c);
    }
  }
  return steps;
}

function chainQuestion(l: PatternLesson): Question {
  const c = pick(chainSteps(l));
  const near = l.words.filter((w) => w !== c.to && w !== c.from);
  // Prefer words that look like the answer, so the child reads every letter.
  const similar = near.filter((w) => w[0] === c.to[0] || w.slice(-2) === c.to.slice(-2));
  const wrong = [...new Set([c.from, ...shuffle(similar), ...shuffle(near)])].filter((w) => w !== c.to).slice(0, 3);
  return {
    type: 'multiple-choice',
    prompt: `${describeChange(c)} What word is it now?`,
    choices: shuffle([c.to, ...wrong]),
    answer: c.to,
    hint: `Start with ${c.from}. Make just that one change, then blend the sounds.`,
  };
}

// ---- Missing sounds: "du__" → ck / k / c ----

/**
 * Where to leave a blank in a word, and the choices. A group's taught spellings are the members as
 * long as its first one: ff in ["ff","f"], ck in ["ck","k","c"], all of a, e, i, o, u.
 */
export function blankIn(l: PatternLesson, word: string): { group: string[]; part: string; at: number } | undefined {
  for (const group of l.blanks) {
    for (const part of group.filter((m) => m.length === group[0].length)) {
      const at = word.indexOf(part);
      if (at >= 0) return { group, part, at };
    }
  }
  return undefined;
}

function missingQuestion(l: PatternLesson): Question {
  const word = pick(l.words.filter((w) => blankIn(l, w)));
  const { group, part, at } = blankIn(l, word)!;
  const shown = `${word.slice(0, at)}${'_'.repeat(part.length)}${word.slice(at + part.length)}`;
  return {
    type: 'multiple-choice',
    visual: PICTURES[word],
    prompt: `Which ${part.length === 1 ? 'letter goes' : 'letters go'} in ${shown}?`,
    say: word,
    choices: shuffle([...group]),
    answer: part,
    hint: `Say "${word}" slowly and listen for each sound.`,
  };
}

// ---- Spelling ----

/** Listen & spell deck: hear each word and its meaning, write it, then turn the card to see it used in a sentence. */
const spellDeck = (conceptSlug: string, cards: NonNullable<QuestionBank['cards']>): QuestionBank => ({
  conceptSlug,
  set: 'spell',
  title: 'Listen and spell',
  emoji: '🎧',
  cards: cards.map((c) => ({ ...c, meaning: MEANINGS[c.word], sentence: EXAMPLE_SENTENCES[c.word] })),
  cardsPerRound: 10,
  cardMode: 'spell',
});

const cards = (words: string[]) => words.map((word) => ({ word }));

/** All practice sets for one pattern lesson. */
export function patternSets(slug: string): QuestionBank[] {
  const l = patternLesson(slug);
  return [
    setOf(slug, 'chains', 'Word chains', '🔗', () => chainQuestion(l)),
    setOf(slug, 'missing', 'Missing sounds', '🧩', () => missingQuestion(l)),
    spellDeck(slug, cards(l.words)),
    { conceptSlug: slug, set: 'listen-cards', title: 'Listen cards', emoji: '🃏', cards: cards(l.words), cardsPerRound: 10 },
    { conceptSlug: slug, set: 'read-cards', title: 'Read cards', emoji: '📖', cards: cards(l.words), cardsPerRound: 10, cardMode: 'read' },
  ];
}

// ---- Heart words ----

const heartCards = () => HEART_WORDS.map((h) => ({ word: h.word, mark: h.heart, markStyle: 'heart' as const }));

function findHeart(): Question {
  const right = pick(HEART_WORDS);
  // Look-alikes make the best wrong choices: same first letter or same length.
  const others = HEART_WORDS.filter((h) => h.word !== right.word);
  const like = others.filter((h) => h.word[0] === right.word[0] || h.word.length === right.word.length);
  const wrong = [...new Set([...shuffle(like), ...shuffle(others)].map((h) => h.word))].slice(0, 3);
  return {
    type: 'multiple-choice',
    prompt: 'Which heart word do you hear?',
    say: right.word,
    choices: shuffle([right.word, ...wrong]),
    answer: right.word,
    hint: `Look for the word with "${right.heart}" in it.`,
  };
}

export function heartSets(slug: string): QuestionBank[] {
  return [
    setOf(slug, 'find', 'Find the heart word', '🔍', findHeart),
    spellDeck(slug, heartCards()),
    { conceptSlug: slug, set: 'read-cards', title: 'Heart word read cards', emoji: '📖', cards: heartCards(), cardsPerRound: 10, cardMode: 'read' },
    { conceptSlug: slug, set: 'listen-cards', title: 'Heart word listen cards', emoji: '🃏', cards: heartCards(), cardsPerRound: 10 },
  ];
}

// ---- Sentences ----

export interface LessonSentence {
  text: string;
  /** Lesson slug, or "review" for sentences that mix patterns. */
  lesson: string;
  /** The pattern word to leave out in "finish the sentence". */
  missing?: string;
}

const wordsOf = (text: string) => text.match(/[A-Za-z]+/g) ?? [];

const heartWordSet = new Set(HEART_WORDS.map((h) => h.word.toLowerCase()));

/** The longest word in a sentence that practises one of these lessons' patterns (not a heart word). */
function patternWord(text: string, lessons: PatternLesson[]): string | undefined {
  return wordsOf(text)
    .filter((w) => w === w.toLowerCase() && w.length >= 3 && !heartWordSet.has(w))
    .filter((w) => lessons.some((l) => l.words.includes(w) || blankIn(l, w)))
    .sort((a, b) => b.length - a.length)[0];
}

export const SENTENCES: LessonSentence[] = [
  ...PATTERN_LESSONS.flatMap((l) => l.sentences.map((text) => ({ text, lesson: l.slug, missing: patternWord(text, [l]) }))),
  // Review sentences: leave out a word from any lesson.
  ...REVIEW_SENTENCES.map((text) => ({ text, lesson: 'review', missing: patternWord(text, PATTERN_LESSONS) })),
];

/** Hear the whole sentence, read it with a word missing, say the word, then flip to check. */
const finishCards = () =>
  SENTENCES.filter((s) => s.missing).map((s) => ({
    word: s.missing!,
    gap: s.text.replace(new RegExp(`\\b${s.missing}\\b`), '___'),
    say: s.text,
    sentence: s.text,
  }));

export function sentenceSets(slug: string): QuestionBank[] {
  const deck = (lesson?: string) =>
    SENTENCES.filter((s) => !lesson || s.lesson === lesson).map((s) => ({ word: s.text }));
  return [
    { conceptSlug: slug, set: 'finish', title: 'Finish the sentence', emoji: '✍️', cards: finishCards(), cardsPerRound: 10, cardMode: 'gap' },
    { conceptSlug: slug, set: 'read-random', title: 'Random sentence cards', emoji: '🎲', cards: deck(), cardsPerRound: 10, cardMode: 'read' },
    ...PATTERN_LESSONS.map((l) => ({
      conceptSlug: slug,
      set: `read-${l.slug}`,
      title: `${l.title} sentences`,
      emoji: '📖',
      cards: deck(l.slug),
      cardMode: 'read' as const,
    })),
  ];
}
