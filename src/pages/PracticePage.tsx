import { useSearchParams } from 'react-router-dom';
import { ComingSoon } from '../components/ComingSoon';
import { PracticeRunner } from '../components/practice/PracticeRunner';
import { Card, Mascot, Stars } from '../components/ui';
import { getConcepts, getQuestionBanks } from '../lib/content';
import { progressKey, useProgress } from '../lib/progress';
import { useClassification } from './ClassificationLayout';

export default function PracticePage() {
  const { contentPath, base, colors, theme, grade, subject, classification } = useClassification();
  const [params, setParams] = useSearchParams();
  const progress = useProgress();
  const banks = getQuestionBanks(contentPath);
  const concepts = getConcepts(contentPath);

  if (banks.length === 0) return <ComingSoon what={`${classification.name} practice`} />;

  const selected = banks.find((b) => b.conceptSlug === params.get('concept')) ?? (banks.length === 1 ? banks[0] : undefined);

  if (!selected) {
    return (
      <>
        {theme.showMascot && (
          <Mascot className="mb-6" size={72}>
            What do you want to practice?
          </Mascot>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {banks.map((b, i) => {
            const emoji = concepts.find((c) => c.slug === b.conceptSlug)?.emoji ?? '🎯';
            const stars = progress[progressKey(grade.id, subject.id, classification.id, b.conceptSlug)]?.stars ?? 0;
            return (
              <Card key={b.conceptSlug} to={`?concept=${b.conceptSlug}`} index={i} className="bg-white">
                <div className="flex items-center gap-4 p-5">
                  <span className={`grid h-16 w-16 place-items-center rounded-2xl ${colors.soft} text-4xl`}>{emoji}</span>
                  <h2 className="flex-1 text-2xl font-bold">{b.title}</h2>
                  <Stars count={stars} size="text-xl" />
                </div>
              </Card>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      {banks.length > 1 && (
        <button
          type="button"
          onClick={() => setParams({})}
          className="mb-4 min-h-12 rounded-full border-4 border-ink/10 bg-white px-5 font-display text-lg font-semibold shadow-chunky-sm"
        >
          ← Pick another
        </button>
      )}
      <h2 className="mb-4 text-center text-3xl font-bold">{selected.title}</h2>
      <PracticeRunner
        key={selected.conceptSlug}
        bank={selected}
        progressId={{ grade: grade.id, subject: subject.id, classification: classification.id }}
        colors={colors}
        theme={theme}
        worksheetsHref={`${base}/worksheets?concept=${selected.conceptSlug}`}
      />
    </>
  );
}
