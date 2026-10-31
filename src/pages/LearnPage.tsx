import { ComingSoon } from '../components/ComingSoon';
import { Card, Mascot, Stars } from '../components/ui';
import { getConcepts } from '../lib/content';
import { progressKey, useProgress } from '../lib/progress';
import { useClassification } from './ClassificationLayout';

/** List of concept lessons in a classification. */
export default function LearnPage() {
  const { contentPath, base, colors, theme, grade, subject, classification } = useClassification();
  const progress = useProgress();
  const concepts = getConcepts(contentPath);

  if (concepts.length === 0) return <ComingSoon what={`${classification.name} lessons`} />;

  return (
    <>
      {theme.showMascot && (
        <Mascot className="mb-6" size={72}>
          Start with lesson 1, then practice to earn ⭐!
        </Mascot>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {concepts.map((c, i) => {
          const stars = progress[progressKey(grade.id, subject.id, classification.id, c.slug)]?.stars ?? 0;
          return (
            <Card key={c.slug} to={`${base}/concepts/${c.slug}`} index={i} className="bg-white">
              <div className="flex items-center gap-4 p-4 md:p-5">
                <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${colors.soft} text-4xl`}>{c.emoji ?? '📘'}</span>
                <div className="min-w-0 flex-1">
                  <p className={`font-display text-sm font-semibold uppercase tracking-wide ${colors.text}`}>Lesson {i + 1}</p>
                  <h2 className="text-2xl font-bold leading-tight">{c.title}</h2>
                  {c.summary && <p className="text-base text-ink-soft">{c.summary}</p>}
                </div>
                <Stars count={stars} size="text-xl" />
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
