import { motion } from 'framer-motion';
import type { TrueFalseQuestion } from '../../types/practice';

interface Props {
  question: TrueFalseQuestion;
  wrong: boolean[];
  solved: boolean;
  onAnswer: (value: boolean) => void;
}

const options = [
  { value: true, label: 'True', emoji: '👍', idle: 'bg-green-50 hover:bg-green-100' },
  { value: false, label: 'False', emoji: '👎', idle: 'bg-rose-50 hover:bg-rose-100' },
];

export function TrueFalse({ question, wrong, solved, onAnswer }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {options.map((o) => {
        const isWrong = wrong.includes(o.value);
        const isRight = solved && o.value === question.answer;
        return (
          <motion.button
            key={o.label}
            type="button"
            disabled={isWrong || solved}
            onClick={() => onAnswer(o.value)}
            whileTap={{ scale: 0.94 }}
            animate={isWrong ? { x: [0, -8, 8, -4, 0] } : {}}
            className={`flex min-h-28 flex-col items-center justify-center gap-1 rounded-3xl border-4 font-display text-3xl font-bold shadow-chunky-sm ${
              isRight ? 'border-green-500 bg-green-100' : isWrong ? 'border-ink/10 bg-slate-100 opacity-40' : `border-ink/15 ${o.idle}`
            }`}
          >
            <span className="text-5xl">{o.emoji}</span>
            {o.label}
          </motion.button>
        );
      })}
    </div>
  );
}
