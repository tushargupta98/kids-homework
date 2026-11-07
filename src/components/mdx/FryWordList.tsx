import { useState } from 'react';
import { frySet } from '../../lib/fry';
import { sounds } from '../../lib/sound';
import { speak } from '../../lib/speech';

/** The words of one Fry set. Tapping a word says it and shows its meaning and sentence. */
export function FryWordList({ set }: { set: number }) {
  const { words } = frySet(set);
  const [picked, setPicked] = useState<string>();
  const word = words.find((w) => w.word === picked);

  const tap = (w: string) => {
    sounds.tap();
    setPicked(w);
    speak(w);
  };

  return (
    <div className="not-prose my-4 flex flex-col items-center gap-3">
      <div className="grid w-full max-w-2xl grid-cols-3 gap-2 rounded-2xl border-4 border-ink/70 bg-white p-2 sm:grid-cols-5">
        {words.map((w) => (
          <button
            key={w.word}
            type="button"
            onClick={() => tap(w.word)}
            aria-pressed={picked === w.word}
            className={`rounded-xl px-2 py-3 font-display text-xl font-bold md:text-2xl ${picked === w.word ? 'bg-sky-500 text-white' : 'bg-amber-50'}`}
          >
            {w.word}
          </button>
        ))}
      </div>
      {word && (
        <div className="max-w-2xl text-center text-xl">
          <p>
            <strong>{word.word}</strong>: {word.meaning}
          </p>
          <p className="mt-1 italic text-ink-soft">“{word.sentence}”</p>
        </div>
      )}
      <p className="text-base text-ink-soft">Tap a word to hear it.</p>
    </div>
  );
}
