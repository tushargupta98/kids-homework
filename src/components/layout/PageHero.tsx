import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Mascot, ReadAloudButton } from '../ui';

interface PageHeroProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  /** Hoot's tip in a speech bubble. */
  tip?: string;
  gradient?: string;
  children?: ReactNode;
}

/** Colorful banner at the top of each node page. */
export function PageHero({ emoji, title, subtitle, tip, gradient = 'from-sky-200 via-cyan-100 to-emerald-200', children }: PageHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative mb-8 overflow-hidden rounded-[2.5rem] border-4 border-ink/10 bg-gradient-to-br ${gradient} p-5 shadow-chunky md:p-8`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/30" />
      <div className="pointer-events-none absolute -bottom-10 right-24 h-24 w-24 rounded-full bg-white/20" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {emoji && (
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl border-4 border-ink/10 bg-white text-4xl shadow-chunky-sm sm:h-20 sm:w-20 sm:text-5xl md:h-24 md:w-24 md:text-6xl">
              {emoji}
            </span>
          )}
          <div>
            <h1 className="text-3xl font-bold leading-tight break-words sm:text-4xl md:text-5xl">{title}</h1>
            {subtitle && <p className="mt-1 text-lg text-ink-soft md:text-xl">{subtitle}</p>}
          </div>
        </div>
        {tip && (
          <div className="flex items-end gap-2">
            <Mascot size={72}>{tip}</Mascot>
            <ReadAloudButton text={tip} className="mb-4" />
          </div>
        )}
      </div>
      {children}
    </motion.section>
  );
}
