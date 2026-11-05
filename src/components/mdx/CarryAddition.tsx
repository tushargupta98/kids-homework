import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { sounds } from '../../lib/sound';
import { BigButton } from '../ui';

export const ONE = 'h-5 w-5 rounded-md border-2 border-ink/30 md:h-6 md:w-6';

/** A "ten" block: a tall bar of 10 little squares. */
export function TenBar({ color = 'bg-sky-400', carried = false }: { color?: string; carried?: boolean }) {
  return (
    <motion.span
      layout
      initial={carried ? { scale: 0, y: -30 } : false}
      animate={{ scale: 1, y: 0 }}
      className={`inline-flex flex-col gap-0.5 rounded-md border-2 p-0.5 ${carried ? 'border-green-700' : 'border-ink/40'}`}
      aria-hidden
    >
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className={`h-2.5 w-5 rounded-sm md:h-3 md:w-6 ${carried ? 'bg-green-400' : color}`} />
      ))}
    </motion.span>
  );
}

/** A place-value mat: tens on the left, ones on the right. */
export function Mat({ tens, ones }: { tens: ReactNode; ones: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-3xl border-4 border-ink/70 bg-white p-2">
      <div className="flex min-h-36 flex-col items-center gap-2 rounded-2xl bg-sky-50 p-2">
        <span className="font-display text-lg font-semibold text-sky-800">Tens</span>
        <div className="flex flex-wrap items-end justify-center gap-1.5">{tens}</div>
      </div>
      <div className="flex min-h-36 flex-col items-center gap-2 rounded-2xl bg-amber-50 p-2">
        <span className="font-display text-lg font-semibold text-amber-800">Ones</span>
        <div className="grid grid-cols-5 gap-1.5">{ones}</div>
      </div>
    </div>
  );
}

/** Show one number as tens and ones blocks, e.g. 27 = 2 tens and 7 ones. */
export function TensOnes({ n }: { n: number }) {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (
    <div className="not-prose my-4 flex flex-col items-center gap-3">
      <Mat
        tens={Array.from({ length: tens }, (_, i) => <TenBar key={i} />)}
        ones={Array.from({ length: ones }, (_, i) => <span key={i} className={`${ONE} bg-orange-400`} />)}
      />
      <p className="font-display text-2xl font-semibold">
        {n} = {tens} {tens === 1 ? 'ten' : 'tens'} and {ones} {ones === 1 ? 'one' : 'ones'}
      </p>
    </div>
  );
}

interface CarryAdditionProps {
  a: number;
  b: number;
  /** Show the place-value blocks next to the column sum. */
  showBlocks?: boolean;
}

/** Step-by-step column addition that shows when (and how) to carry a ten. */
export function CarryAddition({ a, b, showBlocks = true }: CarryAdditionProps) {
  const [step, setStep] = useState(0);
  const [tensA, onesA] = [Math.floor(a / 10), a % 10];
  const [tensB, onesB] = [Math.floor(b / 10), b % 10];
  const onesSum = onesA + onesB;
  const carry = onesSum >= 10;
  const sum = a + b;

  // Steps: 0 start → 1 add ones → (2 carry the ten) → last: add tens.
  const steps = carry ? ['start', 'ones', 'carry', 'tens'] : ['start', 'ones', 'tens'];
  const at = (name: string) => step >= steps.indexOf(name);
  const last = step === steps.length - 1;

  const showOnes = carry ? at('carry') : at('ones');
  const carried = carry && at('carry');
  const tensParts = [...(carry ? [1] : []), tensA, ...(tensB ? [tensB] : [])];

  const caption = [
    `Let's add ${a} + ${b}. Always start with the ones!`,
    carry
      ? `${onesA} + ${onesB} = ${onesSum} ones. That's 10 or more, so we carry!`
      : `${onesA} + ${onesB} = ${onesSum} ones. Write ${onesSum} in the ones place.`,
    ...(carry ? [`Trade 10 ones for 1 ten. Carry the 1 to the tens! ${onesSum - 10} ones stay.`] : []),
    `${tensParts.join(' + ')} = ${Math.floor(sum / 10)} tens. So ${a} + ${b} = ${sum}! 🎉`,
  ][step];

  const next = () => {
    sounds.tap();
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const reset = () => {
    sounds.tap();
    setStep(0);
  };

  const cell = 'grid h-14 w-12 place-items-center md:h-16 md:w-14';
  const carryCell = 'grid h-8 w-12 place-items-center md:w-14';

  // Ones blocks: a's ones in orange, b's in pink. After carrying, only the leftover ones remain.
  const onesBlocks = carried
    ? Array.from({ length: onesSum - 10 }, (_, i) => <motion.span layout key={`left-${i}`} className={`${ONE} bg-orange-400`} />)
    : [
        ...Array.from({ length: onesA }, (_, i) => ({ key: `a-${i}`, color: 'bg-orange-400' })),
        ...Array.from({ length: onesB }, (_, i) => ({ key: `b-${i}`, color: 'bg-pink-400' })),
      ].map((o, i) => (
        <motion.span
          layout
          key={o.key}
          className={`${ONE} ${o.color} ${carry && at('ones') && i < 10 ? 'ring-4 ring-green-500' : ''}`}
        />
      ));

  return (
    <div className="not-prose my-4 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-6">
        {/* Column sum */}
        <div className="rounded-3xl border-4 border-ink/70 bg-white p-3 font-display text-4xl font-bold md:text-5xl">
          <div className="grid grid-cols-[auto_auto_auto]">
            <span className={cell} />
            <span className={`${cell} text-lg text-sky-800`}>Tens</span>
            <span className={`${cell} text-lg text-amber-800`}>Ones</span>

            <span className={carryCell} />
            <span className={`${carryCell} text-2xl text-green-600`}>
              <AnimatePresence>
                {carried && (
                  <motion.span initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} aria-label="carried 1">
                    1
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span className={carryCell} />

            <span className={cell} />
            <span className={`${cell} rounded-xl bg-sky-50`}>{tensA || ''}</span>
            <span className={`${cell} rounded-xl bg-amber-50 text-orange-600`}>{onesA}</span>

            <span className={cell}>+</span>
            <span className={`${cell} rounded-xl bg-sky-50`}>{tensB || ''}</span>
            <span className={`${cell} rounded-xl bg-amber-50 text-pink-600`}>{onesB}</span>

            <span className="col-span-3 my-1 h-1.5 rounded-full bg-ink" />

            <span className={cell} />
            <span className={`${cell} text-green-700`}>
              {last && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  {Math.floor(sum / 10)}
                </motion.span>
              )}
            </span>
            <span className={`${cell} text-green-700`}>
              {showOnes && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  {sum % 10}
                </motion.span>
              )}
            </span>
          </div>
        </div>

        {/* Place-value blocks */}
        {showBlocks && (
          <Mat
            tens={
              <>
                {Array.from({ length: tensA }, (_, i) => <TenBar key={`a-${i}`} />)}
                {Array.from({ length: tensB }, (_, i) => <TenBar key={`b-${i}`} color="bg-indigo-400" />)}
                {carried && <TenBar key="carried" carried />}
              </>
            }
            ones={onesBlocks}
          />
        )}
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
