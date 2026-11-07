import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { burst } from '../../lib/celebrate';
import { bankId } from '../../lib/content';
import { progressKey, recordRound, starsForScore } from '../../lib/progress';
import { answerLabel, buildRound, checkAnswer, splitBlank } from '../../lib/questions';
import { sounds } from '../../lib/sound';
import { speakWord } from '../../lib/speech';
import type { AgeTheme } from '../../theme/ageThemes';
import type { SubjectPalette } from '../../theme/subjectColors';
import type { QuestionBank } from '../../types/practice';
import { ColumnProblem } from '../math/ColumnProblem';
import { BigButton, Mascot, ReadAloudButton, StarBar } from '../ui';
import { FillIn } from './FillIn';
import { MultipleChoice } from './MultipleChoice';
import { ScoreSummary } from './ScoreSummary';
import { TrueFalse } from './TrueFalse';

const ROUND_SIZE = 10;
/** After this many misses, Hoot shows the answer. */
const MAX_TRIES = 2;

interface Props {
  bank: QuestionBank;
  progressId: { grade: string; subject: string; classification: string };
  colors: SubjectPalette;
  theme: AgeTheme;
  worksheetsHref: string;
}

type Result = 'correct' | 'wrong' | undefined;

/** "? + 5 = 10" with a short blank line where the "?" is; shows the answer once solved. */
function PromptBlank({ prompt, answer }: { prompt: string; answer?: string }) {
  const [before, after] = splitBlank(prompt) ?? [prompt, ''];
  return (
    <>
      {before}
      <span className="mx-1 inline-block min-w-[2.5ch] border-b-4 border-dashed border-ink/50 px-1 text-center">
        {answer ?? <span className="text-ink/25">?</span>}
      </span>
      {after}
    </>
  );
}

export function PracticeRunner({ bank, progressId, colors, theme, worksheetsHref }: Props) {
  const [round, setRound] = useState(0);
  // `round` is a dependency so "Play again" builds a fresh set.
  const questions = useMemo(() => buildRound(bank, ROUND_SIZE), [bank, round]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>(() => Array(questions.length).fill(undefined));
  const [misses, setMisses] = useState<(string | boolean)[]>([]);
  const [solved, setSolved] = useState(false);
  // What the child answered correctly; it can differ from q.answer when many answers work.
  const [rightAnswer, setRightAnswer] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setIndex(0);
    setResults(Array(questions.length).fill(undefined));
    setMisses([]);
    setSolved(false);
    setRightAnswer('');
    setDone(false);
  }, [questions]);

  const q = questions[index];

  // Listening questions play their word as soon as they appear (browsers may wait for the first tap).
  useEffect(() => {
    if (q?.say) speakWord(q.say);
  }, [q]);
  const btn = `${colors.solid} ${colors.solidHover}`;
  const revealed = misses.length >= MAX_TRIES && !solved;
  const shownAnswer = solved ? rightAnswer : String(q?.answer ?? '');
  const correctCount = results.filter((r) => r === 'correct').length;
  const stars = starsForScore(correctCount, questions.length);

  if (!q) return null;

  const answer = (given: string | boolean) => {
    if (solved || revealed) return;
    if (checkAnswer(q, given)) {
      sounds.correct();
      if (theme.celebrate) burst();
      setSolved(true);
      setRightAnswer(String(given));
      setResults((r) => r.map((v, i) => (i === index ? (misses.length === 0 ? 'correct' : 'wrong') : v)));
    } else {
      sounds.oops();
      const nextMisses = [...misses, given];
      setMisses(nextMisses);
      if (nextMisses.length >= MAX_TRIES) setResults((r) => r.map((v, i) => (i === index ? 'wrong' : v)));
    }
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      const key = (id: string) => progressKey(progressId.grade, progressId.subject, progressId.classification, id);
      // The set's own stars, plus the lesson's best across its sets.
      recordRound(key(bankId(bank)), stars);
      recordRound(key(bank.conceptSlug), stars);
      sounds.finish();
      if (theme.celebrate && stars >= 2) burst(true);
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setMisses([]);
    setSolved(false);
    setRightAnswer('');
  };

  if (done) {
    return (
      <ScoreSummary
        correct={correctCount}
        total={questions.length}
        stars={stars}
        color={btn}
        showMascot={theme.showMascot}
        worksheetsHref={worksheetsHref}
        onAgain={() => setRound((r) => r + 1)}
      />
    );
  }

  const feedback = solved
    ? { mood: 'cheer' as const, text: misses.length === 0 ? 'Yes! You got it! 🎉' : 'You did it! 💪' }
    : revealed
      ? { mood: 'happy' as const, text: `The answer is ${answerLabel(q)}. You'll get the next one!` }
      : misses.length > 0
        ? { mood: 'thinking' as const, text: q.hint ? `Try again! Hint: ${q.hint}` : 'Almost! Try again! 🤔' }
        : undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5">
        <StarBar results={results} current={index} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${round}-${index}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="rounded-[2.5rem] border-4 border-ink/10 bg-white p-5 shadow-chunky md:p-8"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Question {index + 1} of {questions.length}
            </p>
            {theme.readAloud && <ReadAloudButton text={q.prompt} label="Read the question to me" />}
          </div>

          {q.say && (
            <div className="mb-4 flex justify-center">
              <button
                type="button"
                onClick={() => speakWord(q.say!)}
                aria-label="Play it again"
                className={`flex size-28 items-center justify-center rounded-full border-4 border-ink/15 text-6xl shadow-chunky-sm active:scale-95 ${btn}`}
              >
                🔊
              </button>
            </div>
          )}
          {q.visual && <div className="mb-4 text-center text-5xl leading-tight tracking-wide md:text-6xl">{q.visual}</div>}
          {q.column ? (
            <>
              <h2 className="sr-only">{q.prompt}</h2>
              <div className="mb-6 flex justify-center text-6xl md:text-7xl">
                <ColumnProblem
                  layout={q.column}
                  answer={solved || revealed ? answerLabel(q) : <span className="text-ink/25">?</span>}
                />
              </div>
            </>
          ) : q.type === 'fill-in' && splitBlank(q.prompt) ? (
            <h2 className="mb-6 text-center text-3xl font-bold leading-snug md:text-4xl">
              <span className="sr-only">{q.prompt}</span>
              <span aria-hidden>
                <PromptBlank prompt={q.prompt} answer={solved || revealed ? shownAnswer : undefined} />
              </span>
            </h2>
          ) : (
            <h2 className="mb-6 text-center text-3xl font-bold leading-snug md:text-4xl">{q.prompt}</h2>
          )}

          {q.type === 'multiple-choice' && (
            <MultipleChoice question={q} wrong={misses as string[]} solved={solved || revealed} onAnswer={answer} />
          )}
          {q.type === 'true-false' && (
            <TrueFalse question={q} wrong={misses as boolean[]} solved={solved || revealed} onAnswer={answer} />
          )}
          {q.type === 'fill-in' && (
            <FillIn question={q} solved={solved || revealed} shownAnswer={shownAnswer} attempt={misses.length} color={btn} onAnswer={answer} />
          )}

          {(q.patternHint || q.clue) && (
            <p className="-mt-3 mb-5 text-center font-display text-lg text-ink-soft">
              💡 {[q.patternHint && `Hint: ${q.patternHint}`, q.clue].filter(Boolean).join(' · ')}
            </p>
          )}

          <div className="mt-6 min-h-24" aria-live="polite">
            {feedback && (
              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                {theme.showMascot ? (
                  <Mascot key={feedback.text} mood={feedback.mood} size={72}>
                    {feedback.text}
                  </Mascot>
                ) : (
                  <p className="font-display text-2xl">{feedback.text}</p>
                )}
                {(solved || revealed) && (
                  <BigButton color={btn} onClick={next} autoFocus className="min-w-44">
                    {index + 1 >= questions.length ? 'Finish 🏁' : 'Next →'}
                  </BigButton>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
