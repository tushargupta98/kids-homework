/** Operators the column (notebook-style) layout can draw. */
export type ColumnOp = '+' | '-' | '×' | '÷';

/**
 * Show the problem the way a student writes it in a notebook:
 * numbers stacked and lined up by place value, with the sign in front of the last one.
 * For "÷", operands are [dividend, divisor] and it's drawn as long division.
 */
export interface ColumnLayout {
  op: ColumnOp;
  operands: number[];
}

interface BaseQuestion {
  /** Text shown (and read aloud) to the child. */
  prompt: string;
  /** Optional big visual shown above the prompt, e.g. "🍎🍎🍎". */
  visual?: string;
  /** Gentle nudge shown after a wrong answer. */
  hint?: string;
  /** A spelling-pattern hint shown in Practice and on worksheets, e.g. "short e" or "ll". */
  patternHint?: string;
  /** A small extra clue shown under the prompt in Practice only, e.g. "4 letters, starts with d". Worksheets have a word box instead. */
  clue?: string;
  /** On worksheets, list this answer in the word box at the bottom of the page. */
  inWordBank?: boolean;
  /** Word or sentence for the 🔊 button to say, kept out of the prompt so the answer isn't shown. */
  say?: string;
  /** Draw the problem stacked in columns instead of on one line. */
  column?: ColumnLayout;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  choices: string[];
  answer: string;
}

export interface FillInQuestion extends BaseQuestion {
  type: 'fill-in';
  /** The answer, or one example answer when `accepts` allows others. */
  answer: string | number;
  /** For questions with many right answers (e.g. "45 > ?"): returns true for any answer that works. */
  accepts?: (given: string) => boolean;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  answer: boolean;
}

export type Question = MultipleChoiceQuestion | FillInQuestion | TrueFalseQuestion;

export interface QuestionBank {
  /** Must match the concept .mdx file name. */
  conceptSlug: string;
  /** Practice set id, unique within the lesson, e.g. "sums". Each set is one kind of question. */
  set: string;
  /** Name of the practice set, e.g. "Add with carrying". */
  title: string;
  emoji?: string;
  /** Practice skips write-in questions (Language Arts is tap and flip only); worksheets still print them. */
  noTyping?: boolean;
  /** Review set that mixes other sets' questions; it has no lesson of its own. */
  mixed?: boolean;
  /** Listen & flip deck: hear a word, then flip the card to see it. Not scored, and has no questions. */
  cards?: {
    word: string;
    emoji?: string;
    /** Part of the word to highlight: the first sound ("ch" in chat), or a heart word's tricky part. */
    mark?: string;
    /** onset (default): the mark is at the start, in orange. heart: shown in red under a ❤️. */
    markStyle?: 'onset' | 'heart';
    /** What the word means, shown on the front of a spelling card. It must not contain the word. */
    meaning?: string;
    /** Text on the front of a prompt card: a meaning, "Write the first letter: __at", and so on. */
    front?: string;
    /** Answer cards: what the flip shows when the answer isn't the word, e.g. "noun". */
    back?: string;
    /** Small clue under the front, e.g. "4 letters, starts with d". */
    clue?: string;
    /** A spelling-pattern hint shown on the front of a gap card, e.g. "short e" or "ck". */
    patternHint?: string;
    /** The sentence with the word left out ("The ___ swims in the pond."), shown on the front of a gap card. */
    gap?: string;
    /** What the front's 🔊 says, if anything, e.g. the whole sentence for a listening gap card. */
    say?: string;
    /** A sentence that uses the word, shown when a spelling card is turned over. */
    sentence?: string;
  }[];
  /** listen (default): hear the word, then flip to see it. read: see the word, then tap to hear it. spell: hear it, write it, tap to check. gap: say the missing word, tap to see the whole sentence. prompt: read the front (a meaning, a picture), say or write the word, tap to see it. */
  cardMode?: 'listen' | 'read' | 'spell' | 'gap' | 'prompt' | 'answer';
  /** For a big deck, how many cards one round deals (default: the whole deck). */
  cardsPerRound?: number;
  /**
   * A set can have both cards and questions: Practice shows the cards, Worksheets print the questions.
   * Fixed questions.
   */
  questions?: Question[];
  /** Generator for endless randomized questions (great for math facts). */
  generate?: (count: number) => Question[];
}
