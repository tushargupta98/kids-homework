import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  to?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  /** Stagger index for entry animation. */
  index?: number;
  label?: string;
}

const MotionLink = motion.create(Link);

/** Chunky, toy-block style card. Becomes a link when `to` is set. */
export function Card({ to, children, className = '', disabled, index = 0, label }: CardProps) {
  const base = `block rounded-[2rem] border-4 border-ink/10 shadow-chunky transition-colors ${className}`;
  const anim = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.06, type: 'spring' as const, stiffness: 260, damping: 22 },
  };

  if (to && !disabled) {
    return (
      <MotionLink
        to={to}
        aria-label={label}
        className={`${base} active:translate-y-1 active:shadow-chunky-sm`}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
        {...anim}
      >
        {children}
      </MotionLink>
    );
  }
  return (
    <motion.div aria-disabled={disabled} className={`${base} ${disabled ? 'opacity-60 saturate-50' : ''}`} {...anim}>
      {children}
    </motion.div>
  );
}
