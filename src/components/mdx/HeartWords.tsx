import { sounds } from '../../lib/sound';
import { speakWord } from '../../lib/speech';
import { HEART_WORDS } from '../../lib/phonicsPatterns';

/** Every heart word, tap to hear it, with its tricky part in red under a ❤️. */
export function HeartWords() {
  return (
    <div className="not-prose my-4 flex flex-col items-center gap-2">
      <div className="flex max-w-xl flex-wrap justify-center gap-2">
        {HEART_WORDS.map((h) => {
          const at = h.word.indexOf(h.heart);
          return (
            <button
              key={h.word}
              type="button"
              onClick={() => {
                sounds.tap();
                speakWord(h.word);
              }}
              className="min-h-16 rounded-2xl border-4 border-ink/15 bg-white px-4 pt-3 font-display text-2xl font-bold md:text-3xl"
            >
              {h.word.slice(0, at)}
              <span className="relative inline-block text-rose-600">
                <span className="absolute -top-[0.75em] left-1/2 -translate-x-1/2 text-[0.45em]">❤️</span>
                {h.heart}
              </span>
              {h.word.slice(at + h.heart.length)}
              {h.forNow && <span className="ml-1 align-super text-sm text-ink-soft">*</span>}
            </button>
          );
        })}
      </div>
      <p className="text-base text-ink-soft">Tap a word to hear it. * = tricky only for now.</p>
    </div>
  );
}
