import familyData from '../data/word-families.json';
import type { QuestionBank } from '../types/practice';
import { shuffle } from './random';

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export interface PictureWord {
  word: string;
  emoji: string;
}

/**
 * Picture words for each letter, picked so the first sound is the letter's usual sound.
 * X has none: hardly any words start with its "ks" sound.
 */
export const LETTER_WORDS: Record<string, PictureWord[]> = {
  A: [{ word: 'apple', emoji: '🍎' }, { word: 'ant', emoji: '🐜' }, { word: 'alligator', emoji: '🐊' }],
  B: [{ word: 'bee', emoji: '🐝' }, { word: 'banana', emoji: '🍌' }, { word: 'bear', emoji: '🐻' }],
  C: [{ word: 'cat', emoji: '🐱' }, { word: 'cake', emoji: '🎂' }, { word: 'car', emoji: '🚗' }],
  D: [{ word: 'dog', emoji: '🐶' }, { word: 'duck', emoji: '🦆' }, { word: 'drum', emoji: '🥁' }],
  E: [{ word: 'egg', emoji: '🥚' }, { word: 'elephant', emoji: '🐘' }],
  F: [{ word: 'fish', emoji: '🐟' }, { word: 'frog', emoji: '🐸' }, { word: 'fox', emoji: '🦊' }],
  G: [{ word: 'goat', emoji: '🐐' }, { word: 'gift', emoji: '🎁' }, { word: 'grapes', emoji: '🍇' }],
  H: [{ word: 'hat', emoji: '🎩' }, { word: 'horse', emoji: '🐴' }, { word: 'house', emoji: '🏠' }],
  I: [{ word: 'ice cream', emoji: '🍦' }, { word: 'ice', emoji: '🧊' }],
  J: [{ word: 'juice', emoji: '🧃' }, { word: 'jeans', emoji: '👖' }, { word: 'jar', emoji: '🫙' }],
  K: [{ word: 'kite', emoji: '🪁' }, { word: 'key', emoji: '🔑' }, { word: 'kangaroo', emoji: '🦘' }],
  L: [{ word: 'lion', emoji: '🦁' }, { word: 'lemon', emoji: '🍋' }, { word: 'leaf', emoji: '🍃' }],
  M: [{ word: 'moon', emoji: '🌙' }, { word: 'monkey', emoji: '🐵' }, { word: 'milk', emoji: '🥛' }],
  N: [{ word: 'nest', emoji: '🪺' }, { word: 'nose', emoji: '👃' }, { word: 'nut', emoji: '🥜' }],
  O: [{ word: 'octopus', emoji: '🐙' }, { word: 'orange', emoji: '🍊' }],
  P: [{ word: 'pig', emoji: '🐷' }, { word: 'pizza', emoji: '🍕' }, { word: 'penguin', emoji: '🐧' }],
  Q: [{ word: 'queen', emoji: '👸' }],
  R: [{ word: 'rabbit', emoji: '🐰' }, { word: 'rainbow', emoji: '🌈' }, { word: 'robot', emoji: '🤖' }],
  S: [{ word: 'sun', emoji: '☀️' }, { word: 'snake', emoji: '🐍' }, { word: 'sock', emoji: '🧦' }],
  T: [{ word: 'tiger', emoji: '🐯' }, { word: 'tree', emoji: '🌳' }, { word: 'turtle', emoji: '🐢' }],
  U: [{ word: 'umbrella', emoji: '☂️' }, { word: 'unicorn', emoji: '🦄' }],
  V: [{ word: 'van', emoji: '🚐' }, { word: 'violin', emoji: '🎻' }, { word: 'volcano', emoji: '🌋' }],
  W: [{ word: 'whale', emoji: '🐳' }, { word: 'watermelon', emoji: '🍉' }, { word: 'worm', emoji: '🪱' }],
  X: [],
  Y: [{ word: 'yo-yo', emoji: '🪀' }, { word: 'yarn', emoji: '🧶' }],
  Z: [{ word: 'zebra', emoji: '🦓' }],
};

/** Words that rhyme, grouped by family. */
export const RHYME_FAMILIES: PictureWord[][] = [
  [{ word: 'cat', emoji: '🐱' }, { word: 'hat', emoji: '🎩' }, { word: 'bat', emoji: '🦇' }, { word: 'rat', emoji: '🐀' }],
  [{ word: 'dog', emoji: '🐶' }, { word: 'frog', emoji: '🐸' }, { word: 'log', emoji: '🪵' }],
  [{ word: 'bee', emoji: '🐝' }, { word: 'tree', emoji: '🌳' }, { word: 'key', emoji: '🔑' }, { word: 'three', emoji: '3️⃣' }],
  [{ word: 'cake', emoji: '🎂' }, { word: 'snake', emoji: '🐍' }, { word: 'lake', emoji: '🏞️' }],
  [{ word: 'moon', emoji: '🌙' }, { word: 'spoon', emoji: '🥄' }, { word: 'balloon', emoji: '🎈' }],
  [{ word: 'bug', emoji: '🐛' }, { word: 'mug', emoji: '☕' }, { word: 'rug', emoji: '🟫' }],
  [{ word: 'fox', emoji: '🦊' }, { word: 'box', emoji: '📦' }, { word: 'socks', emoji: '🧦' }],
  [{ word: 'car', emoji: '🚗' }, { word: 'star', emoji: '⭐' }, { word: 'jar', emoji: '🫙' }],
  [{ word: 'house', emoji: '🏠' }, { word: 'mouse', emoji: '🐭' }],
  [{ word: 'bear', emoji: '🐻' }, { word: 'chair', emoji: '🪑' }, { word: 'pear', emoji: '🍐' }],
  [{ word: 'goat', emoji: '🐐' }, { word: 'boat', emoji: '⛵' }, { word: 'coat', emoji: '🧥' }],
];

/** Words with their syllable (clap) count. */
export const SYLLABLE_WORDS: (PictureWord & { claps: number })[] = [
  { word: 'cat', emoji: '🐱', claps: 1 },
  { word: 'dog', emoji: '🐶', claps: 1 },
  { word: 'sun', emoji: '☀️', claps: 1 },
  { word: 'fish', emoji: '🐟', claps: 1 },
  { word: 'tree', emoji: '🌳', claps: 1 },
  { word: 'apple', emoji: '🍎', claps: 2 },
  { word: 'tiger', emoji: '🐯', claps: 2 },
  { word: 'monkey', emoji: '🐵', claps: 2 },
  { word: 'pizza', emoji: '🍕', claps: 2 },
  { word: 'rabbit', emoji: '🐰', claps: 2 },
  { word: 'rainbow', emoji: '🌈', claps: 2 },
  { word: 'turtle', emoji: '🐢', claps: 2 },
  { word: 'penguin', emoji: '🐧', claps: 2 },
  { word: 'banana', emoji: '🍌', claps: 3 },
  { word: 'elephant', emoji: '🐘', claps: 3 },
  { word: 'butterfly', emoji: '🦋', claps: 3 },
  { word: 'dinosaur', emoji: '🦖', claps: 3 },
  { word: 'kangaroo', emoji: '🦘', claps: 3 },
  { word: 'octopus', emoji: '🐙', claps: 3 },
  { word: 'umbrella', emoji: '☂️', claps: 3 },
  { word: 'watermelon', emoji: '🍉', claps: 4 },
  { word: 'alligator', emoji: '🐊', claps: 4 },
  { word: 'caterpillar', emoji: '🐛', claps: 4 },
];

/** Letters that look alike, the best wrong choices. */
export const LOOK_ALIKE: Record<string, string[]> = {
  b: ['d', 'p', 'q'], d: ['b', 'p', 'q'], p: ['q', 'b', 'd'], q: ['p', 'b', 'd'],
  m: ['n', 'w'], n: ['m', 'h', 'u'], u: ['n', 'v'], w: ['m', 'v'],
  E: ['F'], F: ['E', 'P'], M: ['N', 'W'], W: ['M', 'V'], O: ['Q', 'C'], Q: ['O'],
  i: ['l', 'j'], l: ['i', 't'], h: ['n'], a: ['o', 'e'], e: ['a', 'c'],
};

/** The answer plus 3 other letters, look-alikes first (b with d, M with W). */
export function letterChoices(answer: string): string[] {
  const lower = answer === answer.toLowerCase();
  const others = shuffle(ALPHABET.map((l) => (lower ? l.toLowerCase() : l)).filter((l) => l !== answer));
  const wrong = [...new Set([...shuffle(LOOK_ALIKE[answer] ?? []), ...others])].slice(0, 3);
  return shuffle([answer, ...wrong]);
}

export interface WordFamily {
  /** The shared ending, e.g. "et". */
  rime: string;
  words: PictureWord[];
}

/** Short-vowel word families, from src/data/word-families.json. Edit that file to add families or words. */
export const WORD_FAMILIES: WordFamily[] = Object.entries(familyData.families).map(([rime, words]) => ({
  rime,
  words: words.map((word) => ({ word, emoji: (familyData.pictures as Record<string, string>)[word] ?? '' })),
}));

/** The first sound of a family word: "v" in vet, "ch" in chat. */
export const onsetOf = (word: string, rime: string) => word.slice(0, word.length - rime.length);

export const familyOf = (word: string) => WORD_FAMILIES.find((f) => f.words.some((w) => w.word === word));

/** Card decks for a lesson's practice dropdown: listen and read decks for each family, plus a random one of each. */
export function familyDecks(conceptSlug: string): QuestionBank[] {
  const cardsOf = (f: WordFamily) => f.words.map((w) => ({ ...w, onset: onsetOf(w.word, f.rime) }));
  return [
    ...WORD_FAMILIES.map((f) => ({ conceptSlug, set: `cards-${f.rime}`, title: `-${f.rime} listen cards`, emoji: '🃏', cards: cardsOf(f) })),
    // Every family shuffled together; each round deals a handful.
    { conceptSlug, set: 'cards-random', title: 'Random listen cards', emoji: '🎲', cards: WORD_FAMILIES.flatMap(cardsOf), cardsPerRound: 10 },
    ...WORD_FAMILIES.map((f) => ({ conceptSlug, set: `read-${f.rime}`, title: `-${f.rime} read cards`, emoji: '📖', cards: cardsOf(f), cardMode: 'read' as const })),
    { conceptSlug, set: 'read-random', title: 'Random read cards', emoji: '🎲', cards: WORD_FAMILIES.flatMap(cardsOf), cardsPerRound: 10, cardMode: 'read' },
  ];
}
