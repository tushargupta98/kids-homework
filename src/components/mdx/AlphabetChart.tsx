import { useState } from 'react';
import { ALPHABET, LETTER_WORDS } from '../../lib/phonics';
import { sounds } from '../../lib/sound';
import { speak } from '../../lib/speech';

interface AlphabetChartProps {
  /** Show only big letters, only little letters, or both together ("Aa"). */
  show?: 'upper' | 'lower' | 'both';
  /** Say a picture word with each letter ("B is for bee"). */
  words?: boolean;
}

/** A tappable A–Z chart. Tapping a letter says its name, and optionally a word that starts with it. */
export function AlphabetChart({ show = 'both', words = false }: AlphabetChartProps) {
  const [picked, setPicked] = useState<string>();
  const face = (l: string) => (show === 'upper' ? l : show === 'lower' ? l.toLowerCase() : `${l}${l.toLowerCase()}`);
  const word = picked ? LETTER_WORDS[picked][0] : undefined;

  const tap = (l: string) => {
    sounds.tap();
    setPicked(l);
    const w = LETTER_WORDS[l][0];
    speak(words && w ? `${l}. ${l} is for ${w.word}.` : l);
  };

  return (
    <div className="not-prose my-4 flex flex-col items-center gap-3">
      <div className="grid w-full max-w-xl grid-cols-5 gap-2 rounded-2xl border-4 border-ink/70 bg-white p-2 sm:grid-cols-7">
        {ALPHABET.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => tap(l)}
            aria-pressed={picked === l}
            className={`aspect-square rounded-xl font-display text-2xl font-bold md:text-3xl ${
              picked === l ? 'bg-sky-500 text-white' : 'bg-amber-50'
            }`}
          >
            {face(l)}
          </button>
        ))}
      </div>
      {words && picked && (
        <p className="font-display text-2xl">
          {word ? (
            <>
              <span className="text-4xl">{word.emoji}</span> {picked} is for <strong>{word.word}</strong>
            </>
          ) : (
            <>{picked} is at the end of fox 🦊 and box 📦</>
          )}
        </p>
      )}
      <p className="text-base text-ink-soft">Tap a letter to hear it.</p>
    </div>
  );
}
