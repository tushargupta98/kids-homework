import { motion } from 'framer-motion';
import { useState } from 'react';
import { sounds } from '../../lib/sound';

interface TenFrameProps {
  /** How many dots start filled. */
  filled?: number;
  /** Number of frames (1 = up to 10, 2 = up to 20). */
  frames?: number;
  /** Let kids tap boxes to add/remove dots. */
  interactive?: boolean;
  color?: string;
}

/** Ten-frame: a 2×5 grid for seeing numbers up to 10 (or 20). */
export function TenFrame({ filled = 0, frames = 1, interactive = true, color = '#ef4444' }: TenFrameProps) {
  const total = frames * 10;
  const [cells, setCells] = useState(() => Array.from({ length: total }, (_, i) => i < filled));
  const count = cells.filter(Boolean).length;

  const toggle = (i: number) => {
    if (!interactive) return;
    sounds.tap();
    setCells((c) => c.map((v, j) => (j === i ? !v : v)));
  };

  return (
    <div className="not-prose my-4 flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: frames }, (_, f) => (
          <div key={f} className="grid grid-cols-5 gap-1.5 rounded-2xl border-4 border-ink/70 bg-white p-1.5">
            {cells.slice(f * 10, f * 10 + 10).map((on, k) => {
              const i = f * 10 + k;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!interactive}
                  onClick={() => toggle(i)}
                  aria-label={`Box ${i + 1}${on ? ', has a dot' : ''}`}
                  className="grid h-12 w-12 place-items-center rounded-lg border-2 border-ink/20 bg-amber-50 md:h-14 md:w-14"
                >
                  {on && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="block h-9 w-9 rounded-full md:h-10 md:w-10"
                      style={{ background: color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className="font-display text-2xl font-semibold" aria-live="polite">
        {count} {count === 1 ? 'dot' : 'dots'}
      </p>
      {interactive && <p className="text-base text-ink-soft">Tap a box to add or take away a dot.</p>}
    </div>
  );
}
