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
  answer: string | number;
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
  /** Fixed questions. */
  questions?: Question[];
  /** Generator for endless randomized questions (great for math facts). */
  generate?: (count: number) => Question[];
}
