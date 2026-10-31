import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Mood = 'happy' | 'cheer' | 'thinking' | 'sleepy';

interface MascotProps {
  mood?: Mood;
  size?: number;
  /** Speech-bubble content. */
  children?: ReactNode;
  className?: string;
}

/** Hoot the owl — the site's friendly guide. */
export function Owl({ mood = 'happy', size = 96 }: { mood?: Mood; size?: number }) {
  const eyesClosed = mood === 'sleepy';
  return (
    <motion.svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden="true"
      animate={mood === 'cheer' ? { y: [0, -10, 0], rotate: [0, -6, 6, 0] } : { y: [0, -3, 0] }}
      transition={{ duration: mood === 'cheer' ? 0.6 : 2.4, repeat: mood === 'cheer' ? 2 : Infinity, ease: 'easeInOut' }}
    >
      <path d="M26 34 L36 12 L46 30 Z M94 34 L84 12 L74 30 Z" fill="#8b5a2b" />
      <ellipse cx="60" cy="68" rx="40" ry="44" fill="#8b5a2b" />
      <ellipse cx="60" cy="80" rx="25" ry="28" fill="#f3d9b1" />
      {mood === 'cheer' && (
        <>
          <path d="M20 60 Q4 40 14 30" stroke="#8b5a2b" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M100 60 Q116 40 106 30" stroke="#8b5a2b" strokeWidth="10" strokeLinecap="round" fill="none" />
        </>
      )}
      <circle cx="44" cy="52" r="16" fill="#fff" />
      <circle cx="76" cy="52" r="16" fill="#fff" />
      {eyesClosed ? (
        <>
          <path d="M36 54 Q44 60 52 54" stroke="#2b2b2b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M68 54 Q76 60 84 54" stroke="#2b2b2b" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'cheer' ? (
        <>
          <path d="M36 56 Q44 46 52 56" stroke="#2b2b2b" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M68 56 Q76 46 84 56" stroke="#2b2b2b" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={mood === 'thinking' ? 49 : 46} cy={mood === 'thinking' ? 48 : 54} r="7" fill="#2b2b2b" />
          <circle cx={mood === 'thinking' ? 81 : 74} cy={mood === 'thinking' ? 48 : 54} r="7" fill="#2b2b2b" />
          <circle cx={mood === 'thinking' ? 51 : 48} cy={mood === 'thinking' ? 46 : 52} r="2" fill="#fff" />
          <circle cx={mood === 'thinking' ? 83 : 76} cy={mood === 'thinking' ? 46 : 52} r="2" fill="#fff" />
        </>
      )}
      <path d="M54 66 L66 66 L60 76 Z" fill="#ff7a1a" />
      <circle cx="34" cy="70" r="5" fill="#ff9aa2" opacity="0.6" />
      <circle cx="86" cy="70" r="5" fill="#ff9aa2" opacity="0.6" />
    </motion.svg>
  );
}

export function Mascot({ mood = 'happy', size = 88, children, className = '' }: MascotProps) {
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <div className="shrink-0">
        <Owl mood={mood} size={size} />
      </div>
      {children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -8 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="relative mb-4 rounded-3xl border-4 border-ink/10 bg-white px-4 py-3 font-display text-lg leading-snug shadow-chunky-sm md:text-xl"
        >
          <span className="absolute -left-3 bottom-3 h-5 w-5 rotate-45 border-b-4 border-l-4 border-ink/10 bg-white" />
          <span className="relative">{children}</span>
        </motion.div>
      )}
    </div>
  );
}
