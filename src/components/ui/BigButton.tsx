import { motion, type HTMLMotionProps } from 'framer-motion';

interface BigButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Tailwind classes for the primary fill, e.g. subject color. */
  color?: string;
}

/** Large (≥56px) touch-friendly button. */
export function BigButton({ variant = 'primary', color = 'bg-sky-600 hover:bg-sky-700', className = '', children, ...rest }: BigButtonProps) {
  const styles = {
    primary: `${color} text-white border-ink/15`,
    secondary: 'bg-white text-ink border-ink/15 hover:bg-slate-50',
    ghost: 'bg-transparent text-ink border-transparent shadow-none hover:bg-ink/5',
  }[variant];
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-full border-4 px-6 font-display text-xl font-semibold shadow-chunky-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
