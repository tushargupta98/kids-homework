import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { sounds } from '../../lib/sound';
import { BigButton } from '../ui';
import { Mat, ONE, TenBar } from './CarryAddition';

interface BorrowSubtractionProps {
  a: number;
  b: number;
  /** Show the place-value blocks next to the column problem. */
  showBlocks?: boolean;
}

/** Step-by-step column subtraction that shows when (and how) to borrow a ten. */
export function BorrowSubtraction({ a, b, showBlocks = true }: BorrowSubtractionProps) {
  const [step, setStep] = useState(0);
  const [tensA, onesA] = [Math.floor(a / 10), a % 10];
  const [tensB, onesB] = [Math.floor(b / 10), b % 10];
  const borrow = onesA < onesB;
  const onesTop = borrow ? onesA + 10 : onesA;
  const tensTop = borrow ? tensA - 1 : tensA;
  const diff = a - b;

  // Steps: 0 start → 1 look at the ones → (2 borrow a ten) → take away the ones → take away the tens.
  const steps = borrow ? ['start', 'check', 'borrow', 'ones', 'tens'] : ['start', 'check', 'ones', 'tens'];
  const at = (name: string) => step >= steps.indexOf(name);
  const last = step === steps.length - 1;
  const borrowed = borrow && at('borrow');

  const caption = {
    start: `Let's do ${a} − ${b}. Always start with the ones!`,
    check: borrow
      ? `Can we take ${onesB} ones away from ${onesA} ones? No, there aren't enough. We need to borrow!`
      : `Can we take ${onesB} ones away from ${onesA} ones? Yes, there are enough.`,
    borrow: `Break 1 ten into 10 ones. Now there are ${tensTop} tens and ${onesTop} ones.`,
    ones: `${onesTop} − ${onesB} = ${onesTop - onesB} ones.`,
    tens: `${tensTop} − ${tensB} = ${tensTop - tensB} tens. So ${a} − ${b} = ${diff}! 🎉`,
  }[steps[step]];

  const next = () => {
    sounds.tap();
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const reset = () => {
    sounds.tap();
    setStep(0);
  };

  const cell = 'grid h-14 w-12 place-items-center md:h-16 md:w-14';
  const markCell = 'grid h-8 w-12 place-items-center md:w-14';
  const pop = { initial: { scale: 0, y: 20 }, animate: { scale: 1, y: 0 } };

  // Ones: a's ones, plus 10 borrowed ones (green). Taking away fades the last ones out.
  const onesCount = borrowed ? onesA + 10 : onesA;
  const onesBlocks = Array.from({ length: onesCount }, (_, i) => (
    <motion.span
      layout
      key={i}
      initial={i >= onesA ? { scale: 0 } : false}
      animate={{ scale: 1, opacity: at('ones') && i >= onesCount - onesB ? 0.2 : 1 }}
      className={`${ONE} ${i >= onesA ? 'bg-green-400' : 'bg-orange-400'}`}
    />
  ));
  const tensCount = borrowed ? tensA - 1 : tensA;
  const tensBlocks = Array.from({ length: tensCount }, (_, i) => (
    <motion.span key={i} animate={{ opacity: last && i >= tensCount - tensB ? 0.2 : 1 }}>
      <TenBar />
    </motion.span>
  ));

  return (
    <div className="not-prose my-4 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-6">
        {/* Column problem */}
        <div className="rounded-3xl border-4 border-ink/70 bg-white p-3 font-display text-4xl font-bold md:text-5xl">
          <div className="grid grid-cols-[auto_auto_auto]">
            <span className={cell} />
            <span className={`${cell} text-lg text-sky-800`}>Tens</span>
            <span className={`${cell} text-lg text-amber-800`}>Ones</span>

            <span className={markCell} />
            <span className={`${markCell} text-2xl text-green-600`}>
              <AnimatePresence>{borrowed && <motion.span {...pop}>{tensTop}</motion.span>}</AnimatePresence>
            </span>
            <span className={`${markCell} text-2xl text-green-600`}>
              <AnimatePresence>{borrowed && <motion.span {...pop}>{onesTop}</motion.span>}</AnimatePresence>
            </span>

            <span className={cell} />
            <span className={`${cell} rounded-xl bg-sky-50 ${borrowed ? 'text-ink/40 line-through decoration-red-500 decoration-4' : ''}`}>
              {tensA}
            </span>
            <span className={`${cell} rounded-xl bg-amber-50 text-orange-600 ${borrowed ? 'opacity-40 line-through decoration-red-500 decoration-4' : ''}`}>
              {onesA}
            </span>

            <span className={cell}>−</span>
            <span className={`${cell} rounded-xl bg-sky-50`}>{tensB || ''}</span>
            <span className={`${cell} rounded-xl bg-amber-50 text-pink-600`}>{onesB}</span>

            <span className="col-span-3 my-1 border-t-[6px] border-ink" />

            <span className={cell} />
            <span className={`${cell} text-green-700`}>
              {last && Math.floor(diff / 10) > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>{Math.floor(diff / 10)}</motion.span>}
            </span>
            <span className={`${cell} text-green-700`}>
              {at('ones') && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>{diff % 10}</motion.span>}
            </span>
          </div>
        </div>

        {/* Place-value blocks */}
        {showBlocks && <Mat tens={tensBlocks} ones={onesBlocks} />}
      </div>

      <p className="max-w-xl text-center font-display text-2xl font-semibold" aria-live="polite">
        {caption}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {!last && <BigButton onClick={next}>Next step ▶</BigButton>}
        {step > 0 && (
          <BigButton variant="secondary" onClick={reset}>
            ↺ Start over
          </BigButton>
        )}
      </div>
    </div>
  );
}
