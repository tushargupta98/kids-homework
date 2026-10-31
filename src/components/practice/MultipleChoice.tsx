import { motion } from 'framer-motion';
import type { MultipleChoiceQuestion } from '../../types/practice';

interface Props {
  question: MultipleChoiceQuestion;
  wrong: string[];
  solved: boolean;
  onAnswer: (choice: string) => void;
}

export function MultipleChoice({ question, wrong, solved, onAnswer }: Props) {
  const short = question.choices.every((c) => c.length <= 4);
  return (
    <div className={`grid gap-3 md:gap-4 ${short ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
      {question.choices.map((c) => {
        const isWrong = wrong.includes(c);
        const isRight = solved && c === question.answer;
        return (
          <motion.button
            key={c}
            type="button"
            disabled={isWrong || solved}
            onClick={() => onAnswer(c)}
            whileTap={{ scale: 0.94 }}
            animate={isWrong ? { x: [0, -8, 8, -4, 0] } : isRight ? { scale: [1, 1.08, 1] } : {}}
            className={`min-h-20 rounded-3xl border-4 px-4 py-3 font-display text-3xl font-bold shadow-chunky-sm transition-colors md:min-h-24 md:text-4xl ${
              isRight
                ? 'border-green-500 bg-green-100 text-green-900'
                : isWrong
                  ? 'border-ink/10 bg-slate-100 text-ink/30'
                  : 'border-ink/15 bg-white hover:bg-sky-50'
            }`}
          >
            {c}
          </motion.button>
        );
      })}
    </div>
  );
}
