import { useSearchParams } from 'react-router-dom';
import { ComingSoon } from '../components/ComingSoon';
import { PracticeRunner } from '../components/practice/PracticeRunner';
import { Card, Mascot, Stars } from '../components/ui';
import { bankId, getConcepts, getQuestionBanks } from '../lib/content';
import { progressKey, useProgress } from '../lib/progress';
import { useClassification } from './ClassificationLayout';

export default function PracticePage() {
  const { contentPath, base, colors, theme, grade, subject, classification } = useClassification();
  const [params, setParams] = useSearchParams();
  const progress = useProgress();
  const banks = getQuestionBanks(contentPath);
  const concepts = getConcepts(contentPath);

  if (banks.length === 0) return <ComingSoon what={`${classification.name} practice`} />;

  // ?concept= narrows the picker to one lesson; ?set= picks one practice set in it.
  const concept = params.get('concept');
  const shown = concept && banks.some((b) => b.conceptSlug === concept) ? banks.filter((b) => b.conceptSlug === concept) : banks;
  const selected = shown.find((b) => b.set === params.get('set')) ?? (shown.length === 1 ? shown[0] : undefined);

  if (!selected) {
    const lessons = concepts.filter((c) => shown.some((b) => b.conceptSlug === c.slug));
    let index = 0;
    return (
      <>
        {theme.showMascot && (
          <Mascot className="mb-6" size={72}>
            What do you want to practice?
          </Mascot>
        )}
        {shown !== banks && (
          <button
            type="button"
            onClick={() => setParams({})}
            className="mb-4 min-h-12 rounded-full border-4 border-ink/10 bg-white px-5 font-display text-lg font-semibold shadow-chunky-sm"
          >
            ← All lessons
          </button>
        )}
        <div className="space-y-8">
          {lessons.map((lesson) => (
            <section key={lesson.slug}>
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold">
                <span aria-hidden>{lesson.emoji ?? '📘'}</span> {lesson.title}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {shown
                  .filter((b) => b.conceptSlug === lesson.slug)
                  .map((b) => {
                    const stars = progress[progressKey(grade.id, subject.id, classification.id, bankId(b))]?.stars ?? 0;
                    return (
                      <Card key={bankId(b)} to={`?concept=${b.conceptSlug}&set=${b.set}`} index={index++} className="bg-white">
                        <div className="flex items-center gap-4 p-5">
                          <span className={`grid h-16 w-16 place-items-center rounded-2xl ${colors.soft} text-4xl`}>{b.emoji ?? '🎯'}</span>
                          <h3 className="flex-1 text-2xl font-bold">{b.title}</h3>
                          <Stars count={stars} size="text-xl" />
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {banks.length > 1 && (
        <button
          type="button"
          onClick={() => setParams({ concept: selected.conceptSlug })}
          className="mb-4 min-h-12 rounded-full border-4 border-ink/10 bg-white px-5 font-display text-lg font-semibold shadow-chunky-sm"
        >
          ← Pick another
        </button>
      )}
      <h2 className="mb-4 text-center text-3xl font-bold">{selected.title}</h2>
      <PracticeRunner
        key={bankId(selected)}
        bank={selected}
        progressId={{ grade: grade.id, subject: subject.id, classification: classification.id }}
        colors={colors}
        theme={theme}
        worksheetsHref={`${base}/worksheets?concept=${selected.conceptSlug}&set=${selected.set}`}
      />
    </>
  );
}
