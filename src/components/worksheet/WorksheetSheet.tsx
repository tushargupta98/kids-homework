import type { Question } from '../../types/practice';
import { answerLabel } from '../../lib/questions';
import { Owl } from '../ui';

interface Props {
  title: string;
  subtitle: string;
  questions: Question[];
  answerKey?: boolean;
}

/** Renders "7 + 5 = ?" with a write-in box in place of the "?". */
function Prompt({ text, answer }: { text: string; answer?: string }) {
  const parts = text.split('?');
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <span className="mx-1 inline-block h-[1.6em] min-w-[2.6em] translate-y-[0.3em] rounded-lg border-[3px] border-ink/60 px-1 text-center align-baseline font-bold">
        {answer}
      </span>
      {parts.slice(1).join('?')}
    </>
  );
}

function Choices({ items, answer, showAnswer }: { items: string[]; answer: string; showAnswer?: boolean }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
      {items.map((c) => (
        <span key={c} className="inline-flex items-center gap-2">
          <span className={`inline-block h-6 w-6 rounded-full border-[3px] border-ink/60 ${showAnswer && c === answer ? 'bg-ink/70' : ''}`} />
          {c}
        </span>
      ))}
    </div>
  );
}

export function WorksheetSheet({ title, subtitle, questions, answerKey }: Props) {
  const allShortFillIns = questions.every((q) => q.type === 'fill-in' && q.prompt.length <= 14 && !q.visual);
  return (
    <section className="print-sheet mx-auto max-w-[8.5in] rounded-[2rem] border-4 border-ink/10 bg-white p-6 shadow-chunky md:p-10">
      <header className="mb-6 border-b-4 border-dashed border-ink/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="grayscale-[30%]">
            <Owl size={56} />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold">
              {title}
              {answerKey && <span className="ml-2 text-xl text-ink-soft">— Answer Key</span>}
            </h2>
            <p className="text-lg text-ink-soft">{subtitle}</p>
          </div>
        </div>
        {!answerKey && (
          <div className="mt-4 grid grid-cols-1 gap-3 text-lg sm:grid-cols-[2fr_1fr]">
            <p>
              Name: <span className="inline-block w-[70%] border-b-2 border-ink/60" />
            </p>
            <p>
              Date: <span className="inline-block w-[60%] border-b-2 border-ink/60" />
            </p>
          </div>
        )}
      </header>

      <ol className={`grid gap-x-10 gap-y-6 text-2xl ${allShortFillIns ? 'grid-cols-1 sm:grid-cols-2 print:grid-cols-2' : 'grid-cols-1'}`}>
        {questions.map((q, i) => (
          <li key={i} className="print-avoid-break flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink/30 font-display text-lg font-semibold">
              {i + 1}
            </span>
            <div className="flex-1 pt-0.5">
              {q.visual && <div className="mb-1 text-3xl tracking-wide">{q.visual}</div>}
              {q.type === 'fill-in' ? (
                <>
                  <Prompt text={q.prompt} answer={answerKey ? String(q.answer) : undefined} />
                  {!q.prompt.includes('?') && (
                    <div className="mt-2 h-10 border-b-2 border-ink/50 font-bold">{answerKey ? String(q.answer) : ''}</div>
                  )}
                </>
              ) : (
                <>
                  <p>{q.prompt}</p>
                  <Choices
                    items={q.type === 'multiple-choice' ? q.choices : ['True', 'False']}
                    answer={answerLabel(q)}
                    showAnswer={answerKey}
                  />
                </>
              )}
            </div>
          </li>
        ))}
      </ol>

      <footer className="mt-8 flex items-center justify-between border-t-2 border-dashed border-ink/15 pt-3 text-sm text-ink-soft">
        <span>Hoot School</span>
        <span>{answerKey ? 'For grown-ups' : 'Great work! ⭐'}</span>
      </footer>
    </section>
  );
}
