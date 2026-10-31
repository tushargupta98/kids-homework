import type { ReactNode } from 'react';

export function Badge({ children, className = 'bg-white text-ink' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border-2 border-ink/10 px-3 py-1 font-display text-sm font-semibold ${className}`}>
      {children}
    </span>
  );
}
