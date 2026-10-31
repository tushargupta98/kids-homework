interface CountersProps {
  a: number;
  b?: number;
  emoji?: string;
  op?: '+' | '-';
  /** Show the answer after "=". */
  showAnswer?: boolean;
}

/** Picture math: 🍎🍎 + 🍎 = 3. For "-", crossed-out items show what's taken away. */
export function Counters({ a, b = 0, emoji = '🍎', op = '+', showAnswer = true }: CountersProps) {
  const group = (n: number, crossed = 0) => (
    <span className="inline-flex max-w-[11rem] flex-wrap justify-center gap-1 rounded-2xl bg-amber-50 p-2 text-3xl md:text-4xl">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className={i >= n - crossed ? 'relative opacity-40' : ''}>
          {emoji}
          {i >= n - crossed && <span className="absolute inset-0 grid place-items-center text-red-500">✕</span>}
        </span>
      ))}
    </span>
  );
  const answer = op === '+' ? a + b : a - b;
  return (
    <div className="not-prose my-4 flex flex-wrap items-center justify-center gap-3 font-display text-4xl font-bold">
      {op === '+' ? (
        <>
          {group(a)} <span>+</span> {group(b)}
        </>
      ) : (
        <>
          {group(a, b)} <span className="text-2xl text-ink-soft">take away {b}</span>
        </>
      )}
      {showAnswer && (
        <>
          <span>=</span>
          <span className="grid h-16 min-w-16 place-items-center rounded-2xl bg-green-100 px-3 text-green-800">{answer}</span>
        </>
      )}
    </div>
  );
}
