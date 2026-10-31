import { Fragment, type ReactNode } from 'react';
import type { ColumnLayout } from '../../types/practice';

interface ColumnProblemProps {
  layout: ColumnLayout;
  /** Shown in the answer spot. Leave empty for a blank to write in. */
  answer?: ReactNode;
  /** Leave room above the top number for carried (or borrowed) digits. */
  carrySpace?: boolean;
  className?: string;
}

const signs = { '+': '+', '-': '−', '×': '×', '÷': '÷' };
const BLANK = ' ';

/**
 * A math problem laid out like a notebook: numbers stacked and lined up by place value,
 * the sign in front of the last number, and a line to write the answer under.
 * Division is drawn as long division. Sizes are in em, so it scales with the font size around it.
 * The drawing is aria-hidden: callers should give the problem as text too (e.g. the question prompt).
 */
export function ColumnProblem({ layout, answer, carrySpace = false, className = '' }: ColumnProblemProps) {
  const { op, operands } = layout;
  // Width comes from the numbers (and a plain-text answer), never from a styled placeholder.
  const answerText = typeof answer === 'string' || typeof answer === 'number' ? String(answer) : '';
  const digits = Math.max(...operands.map((n) => String(n).length), answerText.length);

  if (op === '÷') {
    const [dividend, divisor] = operands;
    return (
      <div aria-hidden className={`inline-grid grid-cols-[auto_auto] font-display font-bold tabular-nums leading-tight ${className}`}>
        <span />
        <span className="min-h-[1.25em] pl-[0.25em] text-right tracking-[0.1em]">{answer ?? BLANK}</span>
        <span className="pr-[0.2em]">{divisor}</span>
        <span className="rounded-tl-[0.35em] border-l-[0.12em] border-t-[0.12em] border-current pl-[0.25em] tracking-[0.1em]">
          {dividend}
        </span>
      </div>
    );
  }

  const last = operands.length - 1;
  return (
    <div aria-hidden className={`inline-grid grid-cols-[auto_auto] font-display font-bold tabular-nums leading-tight ${className}`}>
      {carrySpace && (
        <>
          <span />
          <span className="h-[0.8em]" />
        </>
      )}
      {operands.map((n, i) => (
        <Fragment key={i}>
          <span className="pr-[0.4em]">{i === last ? signs[op] : ''}</span>
          <span className="text-right tracking-[0.1em]" style={{ minWidth: `${digits + 0.5}ch` }}>
            {n}
          </span>
        </Fragment>
      ))}
      {/* A border, not a background: browsers drop backgrounds when printing. */}
      <span className="col-span-2 my-[0.1em] border-t-[0.1em] border-current" />
      <span />
      <span className="min-h-[1.25em] text-right tracking-[0.1em]">{answer ?? BLANK}</span>
    </div>
  );
}
