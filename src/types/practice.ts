interface BaseQuestion {
  /** Text shown (and read aloud) to the child. */
  prompt: string;
  /** Optional big visual shown above the prompt, e.g. "🍎🍎🍎". */
  visual?: string;
  /** Gentle nudge shown after a wrong answer. */
  hint?: string;
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
  title: string;
  /** Fixed questions. */
  questions?: Question[];
  /** Generator for endless randomized questions (great for math facts). */
  generate?: (count: number) => Question[];
}
