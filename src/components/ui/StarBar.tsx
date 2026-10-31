import { motion } from 'framer-motion';

/** Row of stars: filled = earned. Used for scores and progress. */
export function Stars({ count, max = 3, size = 'text-2xl' }: { count: number; max?: number; size?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${size}`} role="img" aria-label={`${count} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <motion.span
          key={i}
          initial={i < count ? { scale: 0, rotate: -30 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.15, type: 'spring', stiffness: 400, damping: 12 }}
          className={i < count ? '' : 'opacity-25 grayscale'}
        >
          ⭐
        </motion.span>
      ))}
    </span>
  );
}

type Result = 'correct' | 'wrong' | undefined;

/** Progress through a practice round, one dot per question. */
export function StarBar({ results, current }: { results: Result[]; current: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5" aria-label={`Question ${current + 1} of ${results.length}`}>
      {results.map((r, i) => (
        <span
          key={i}
          className={`grid h-8 w-8 place-items-center rounded-full border-2 text-base transition-all md:h-9 md:w-9 ${
            r === 'correct'
              ? 'border-yellow-400 bg-yellow-100'
              : r === 'wrong'
                ? 'border-sky-300 bg-sky-100'
                : i === current
                  ? 'scale-110 border-ink/40 bg-white'
                  : 'border-ink/10 bg-white/60'
          }`}
        >
          {r === 'correct' ? '⭐' : r === 'wrong' ? '💪' : ''}
        </span>
      ))}
    </div>
  );
}
