import { useState } from 'react';
import { sounds } from '../../lib/sound';

interface HundredChartProps {
  /** Last number on the chart (100 or 120). */
  max?: number;
  /** Highlight a skip-counting pattern: every `step` numbers starting at `start`. */
  step?: number;
  start?: number;
}

/** A 10-wide number chart. Tap numbers to mark them; an optional skip-count pattern is shaded. */
export function HundredChart({ max = 120, step, start }: HundredChartProps) {
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const from = start ?? step ?? 1;
  const inPattern = (n: number) => step !== undefined && n >= from && (n - from) % step === 0;

  const toggle = (n: number) => {
    sounds.tap();
    setMarked((m) => {
      const next = new Set(m);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  return (
    <div className="not-prose my-4 flex flex-col items-center gap-2">
      <div className="grid w-full max-w-xl grid-cols-10 gap-1 rounded-2xl border-4 border-ink/70 bg-white p-1.5">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => toggle(n)}
            aria-pressed={marked.has(n)}
            className={`aspect-square rounded-md font-display text-sm font-semibold md:text-lg ${
              marked.has(n) ? 'bg-sky-500 text-white' : inPattern(n) ? 'bg-amber-300' : 'bg-amber-50'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-base text-ink-soft">
        Tap numbers to mark them. Each row is 10 numbers: go down one row to add 10.
      </p>
    </div>
  );
}
