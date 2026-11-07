import { useState } from 'react';
import { sounds } from '../../lib/sound';
import { speakWord } from '../../lib/speech';
import { PICTURES, patternLesson } from '../../lib/phonicsPatterns';

interface WordChartProps {
  /** Lesson slug in src/data/phonics-patterns.json, e.g. "ck". */
  lesson: string;
  /** Show every lesson word instead of just the sample words. */
  all?: boolean;
  /** Letters to highlight in each word, e.g. "ck". Defaults to none. */
  mark?: string;
}

/** Tap-to-hear chart of a phonics lesson's words, with the pattern highlighted. */
export function WordChart({ lesson, all = false, mark }: WordChartProps) {
  const l = patternLesson(lesson);
  const words = all ? l.words : l.samples;
  const [picked, setPicked] = useState<string>();
  const marks = mark?.split(' ') ?? [];

  const show = (w: string) => {
    const m = marks.find((x) => w.includes(x));
    if (!m) return w;
    const at = w.indexOf(m);
    return (
      <>
        {w.slice(0, at)}
        <span className="text-orange-600">{m}</span>
        {w.slice(at + m.length)}
      </>
    );
  };

  return (
    <div className="not-prose my-4 flex flex-col items-center gap-2">
      <div className="flex max-w-xl flex-wrap justify-center gap-2">
        {words.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => {
              sounds.tap();
              setPicked(w);
              speakWord(w);
            }}
            aria-pressed={picked === w}
            className={`min-h-14 rounded-2xl border-4 px-4 font-display text-2xl font-bold md:text-3xl ${
              picked === w ? 'border-sky-600 bg-sky-50' : 'border-ink/15 bg-white'
            }`}
          >
            {PICTURES[w] && <span className="mr-1 text-xl">{PICTURES[w]}</span>}
            {show(w)}
          </button>
        ))}
      </div>
      <p className="text-base text-ink-soft">Tap a word to hear it. Touch each sound as you say it.</p>
    </div>
  );
}
