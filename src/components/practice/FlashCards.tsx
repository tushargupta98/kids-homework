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

type Card = NonNullable<QuestionBank['cards']>[number];

interface Props {
  cards: Card[];
  colors: SubjectPalette;
  /** Deal only this many cards per round, picked at random. */
  perRound?: number;
  /**
   * listen: hear it, then tap Flip twice to see it. read: see the word, tap to hear it and check.
   * spell: hear it and write it on paper, then one tap shows the word and a sentence with it.
   * gap: read a sentence with a word missing and say the word, then one tap shows the whole sentence.
   */
  mode?: 'listen' | 'read' | 'spell' | 'gap';
}

/** A card's word with its mark highlighted: the first sound in orange, or a heart part in red under a ❤️. */
function MarkedWord({ card }: { card: Card }) {
  const at = card.mark ? card.word.indexOf(card.mark) : -1;
  if (!card.mark || at < 0) return <>{card.word}</>;
  const heart = card.markStyle === 'heart';
  return (
    <>
      {card.word.slice(0, at)}
      <span className={`relative inline-block ${heart ? 'text-rose-600' : 'text-orange-600'}`}>
        {heart && <span className="absolute -top-[0.7em] left-1/2 -translate-x-1/2 text-[0.4em]">❤️</span>}
        {card.mark}
      </span>
      {card.word.slice(at + card.mark.length)}
    </>
  );
}

/** The sentence with its word in bold, so the child sees the word used. */
function UsedIn({ sentence, word }: { sentence: string; word: string }) {
  const at = sentence.search(new RegExp(`(?<![A-Za-z])${word}(?![A-Za-z])`, word === 'I' ? '' : 'i'));
  if (at < 0) return <>{sentence}</>;
  return (
    <>
      {sentence.slice(0, at)}
      <strong className="text-orange-700">{sentence.slice(at, at + word.length)}</strong>
      {sentence.slice(at + word.length)}
    </>
  );
}

/**
 * Word cards in three modes. Listen: the card only plays the word; tap Flip twice to see it.
 * Read: the word is shown; tap to hear it and check your reading.
 * Spell: hear the word, write it on paper, then tap to see it and a sentence that uses it.
 * Gap: read the sentence with a word missing, say the word, then tap to see the whole sentence.
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
  const sentence = card?.word.includes(' ');

  useEffect(() => () => clearTimeout(disarm.current), []);

  // Spelling cards say their word as soon as they're dealt (browsers may wait for the first tap).
  useEffect(() => {
    if (mode === 'spell' && card && !done) speakWord(card.word);
  }, [mode, card, done]);

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
        <p className="font-display text-3xl font-bold">{sentence || mode === 'gap' ? `You read all ${deck.length} sentences!` : mode === 'spell' ? `You spelled ${deck.length} words!` : `You heard all ${deck.length} words!`}</p>
        {mode !== 'gap' && <p className="font-display text-2xl text-ink-soft">{deck.map((c) => c.word).join(' · ')}</p>}
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
            {mode === 'gap' ? (
              <>
                <p className="text-center font-display text-4xl font-bold leading-snug md:text-5xl">
                  {flipped ? <UsedIn sentence={card.sentence ?? card.word} word={card.word} /> : card.gap}
                </p>
                {flipped ? (
                  <BigButton variant="secondary" onClick={() => speakWord(card.sentence ?? card.word)}>
                    🔊 Sentence
                  </BigButton>
                ) : (
                  <>
                    {card.say && (
                      <button
                        type="button"
                        onClick={() => speakWord(card.say!)}
                        aria-label="Hear the sentence"
                        className={`flex size-24 items-center justify-center rounded-full border-4 border-ink/15 text-5xl shadow-chunky-sm active:scale-95 ${btn}`}
                      >
                        🔊
                      </button>
                    )}
                    {card.patternHint && (
                      <p className="rounded-full bg-amber-100 px-4 py-1 font-display text-xl font-semibold">💡 Hint: {card.patternHint}</p>
                    )}
                    <p className="text-center font-display text-xl text-ink-soft">
                      {card.say ? '👂 Listen, then say the missing word.' : '🤔 What word goes in the gap? Say it out loud.'}
                    </p>
                    <BigButton color={btn} onClick={() => setFlipped(true)} className="min-w-52">
                      👀 Show the word
                    </BigButton>
                  </>
                )}
              </>
            ) : showWord ? (
              <>
                {/* In read mode the picture would give the word away. */}
                {flipped && card.emoji && <div className="text-6xl">{card.emoji}</div>}
                <p
                  className={`text-center font-display font-bold ${sentence ? 'text-4xl leading-snug md:text-5xl' : 'text-7xl tracking-wide md:text-8xl'}`}
                >
                  <MarkedWord card={card} />
                </p>
                {flipped && card.sentence && (
                  <p className="text-center font-display text-2xl leading-snug text-ink-soft md:text-3xl">
                    <UsedIn sentence={card.sentence} word={card.word} />
                  </p>
                )}
                {flipped ? (
                  <div className="flex flex-wrap justify-center gap-3">
                    <BigButton variant="secondary" onClick={play}>
                      🔊 {mode === 'spell' ? 'Word' : 'Play again'}
                    </BigButton>
                    {card.sentence && (
                      <BigButton variant="secondary" onClick={() => speakWord(card.sentence!)}>
                        🔊 Sentence
                      </BigButton>
                    )}
                  </div>
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
                  aria-label={sentence ? "Play the sentence" : "Play the word"}
                  className={`flex size-40 items-center justify-center rounded-full border-4 border-ink/15 text-7xl shadow-chunky-sm active:scale-95 ${btn}`}
                >
                  🔊
                </button>
                {mode === 'spell' ? (
                  <>
                    {card.meaning && (
                      <div className="flex w-full items-start gap-3 rounded-2xl border-4 border-ink/10 bg-white p-4">
                        <p className="flex-1 text-left font-display text-2xl leading-snug">
                          <span className="block text-sm font-semibold uppercase tracking-wide text-ink-soft">It means</span>
                          {card.meaning}
                        </p>
                        <button
                          type="button"
                          onClick={() => speakWord(card.meaning!)}
                          aria-label="Hear the meaning"
                          className="grid size-12 shrink-0 place-items-center rounded-full border-4 border-ink/10 bg-amber-50 text-2xl active:scale-90"
                        >
                          🔈
                        </button>
                      </div>
                    )}
                    <p className="text-center font-display text-xl text-ink-soft">✏️ Write the word on paper. Then check it!</p>
                    <BigButton color={btn} onClick={() => setFlipped(true)} className="min-w-52">
                      👀 Show the word
                    </BigButton>
                  </>
                ) : (
                <motion.div animate={armed ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ repeat: armed ? Infinity : 0, duration: 0.6 }}>
                  <BigButton variant={armed ? 'primary' : 'secondary'} color={btn} onClick={flipTap} className="min-w-52">
                    {armed ? '👆 Tap again to flip' : '🔄 Flip'}
                  </BigButton>
                </motion.div>
                )}
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
