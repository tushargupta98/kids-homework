import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from '../../lib/random';
import { sounds } from '../../lib/sound';
import { speakWord } from '../../lib/speech';
import type { SubjectPalette } from '../../theme/subjectColors';
import type { QuestionBank } from '../../types/practice';
import { BigButton } from '../ui';

/** How long the first tap on Flip waits for the second one. */
const ARM_MS = 2000;

interface Props {
  cards: NonNullable<QuestionBank['cards']>;
  colors: SubjectPalette;
  /** Deal only this many cards per round, picked at random. */
  perRound?: number;
  /** listen: hear it, then flip to see it. read: see the word, tap to hear it and check. */
  mode?: 'listen' | 'read';
}

/**
 * Word cards in two modes. Listen: the card only plays the word; tap Flip twice to see it.
 * Read: the word is shown; tap to hear it and check your reading.
 */
export function FlashCards({ cards, colors, perRound, mode = 'listen' }: Props) {
  const [round, setRound] = useState(0);
  // `round` is a dependency so "Shuffle and play again" deals a new order.
  const deck = useMemo(() => shuffle(cards).slice(0, perRound ?? cards.length), [cards, perRound, round]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [armed, setArmed] = useState(false);
  const [done, setDone] = useState(false);
  const disarm = useRef<ReturnType<typeof setTimeout>>(undefined);
  const btn = `${colors.solid} ${colors.solidHover}`;
  const card = deck[index];
  const showWord = flipped || mode === 'read';
  // Every word in a deck shares its ending (pet, vet, chat), so the first sound is what changes.
  const onset = card?.onset ?? card?.word[0] ?? '';
  const rest = card?.word.slice(onset.length);

  useEffect(() => () => clearTimeout(disarm.current), []);

  const play = () => {
    sounds.tap();
    speakWord(card.word);
  };

  const flipTap = () => {
    clearTimeout(disarm.current);
    if (!armed) {
      sounds.tap();
      setArmed(true);
      disarm.current = setTimeout(() => setArmed(false), ARM_MS);
      return;
    }
    setArmed(false);
    setFlipped(true);
  };

  const go = (to: number) => {
    clearTimeout(disarm.current);
    setArmed(false);
    setFlipped(false);
    if (to >= deck.length) {
      sounds.finish();
      setDone(true);
      return;
    }
    setIndex(to);
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-[2.5rem] border-4 border-ink/10 bg-white p-8 text-center shadow-chunky">
        <div className="text-6xl">🎉</div>
        <p className="font-display text-3xl font-bold">You heard all {deck.length} words!</p>
        <p className="font-display text-2xl text-ink-soft">{deck.map((c) => c.word).join(' · ')}</p>
        <BigButton
          color={btn}
          onClick={() => {
            setIndex(0);
            setDone(false);
            setRound((r) => r + 1);
          }}
        >
          🔀 Shuffle and play again
        </BigButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-3 text-center font-display text-sm font-semibold uppercase tracking-wide text-ink-soft">
        Card {index + 1} of {deck.length}
      </p>

      <div style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${round}-${index}-${flipped}`}
            initial={{ rotateY: flipped ? -90 : 0, opacity: flipped ? 1 : 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 0 : 90, opacity: flipped ? 0 : 1 }}
            transition={{ duration: 0.25 }}
            className={`flex min-h-80 flex-col items-center justify-center gap-6 rounded-[2.5rem] border-4 p-8 shadow-chunky ${
              flipped ? 'border-ink/10 bg-white' : 'border-ink/15 bg-amber-50'
            }`}
          >
            {showWord ? (
              <>
                {/* In read mode the picture would give the word away. */}
                {flipped && card.emoji && <div className="text-6xl">{card.emoji}</div>}
                <p className="font-display text-7xl font-bold tracking-wide md:text-8xl">
                  <span className="text-orange-600">{onset}</span>
                  {rest}
                </p>
                {flipped ? (
                  <BigButton variant="secondary" onClick={play}>
                    🔊 Play again
                  </BigButton>
                ) : (
                  <BigButton color={btn} onClick={play} className="min-w-52">
                    🔊 Check it
                  </BigButton>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={play}
                  aria-label="Play the word"
                  className={`flex size-40 items-center justify-center rounded-full border-4 border-ink/15 text-7xl shadow-chunky-sm active:scale-95 ${btn}`}
                >
                  🔊
                </button>
                <motion.div animate={armed ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ repeat: armed ? Infinity : 0, duration: 0.6 }}>
                  <BigButton variant={armed ? 'primary' : 'secondary'} color={btn} onClick={flipTap} className="min-w-52">
                    {armed ? '👆 Tap again to flip' : '🔄 Flip'}
                  </BigButton>
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <BigButton variant="secondary" onClick={() => go(index - 1)} disabled={index === 0}>
          ← Back
        </BigButton>
        <BigButton color={btn} onClick={() => go(index + 1)}>
          {index + 1 >= deck.length ? 'Finish 🏁' : 'Next →'}
        </BigButton>
      </div>
    </div>
  );
}
