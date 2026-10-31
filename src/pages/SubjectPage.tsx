import { PageHero } from '../components/layout/PageHero';
import { Badge, Card } from '../components/ui';
import { getClassificationsFor } from '../data/curriculum';
import { useCurriculum } from '../hooks/useCurriculum';
import { getConcepts } from '../lib/content';
import { starsUnder, useProgress } from '../lib/progress';
import { getAgeTheme } from '../theme/ageThemes';
import { subjectColors } from '../theme/subjectColors';
import NotFound from './NotFound';

export default function SubjectPage() {
  const { level, grade, subject, invalid } = useCurriculum();
  const progress = useProgress();
  if (invalid || !level || !grade || !subject) return <NotFound />;
  const colors = subjectColors[subject.id];
  const theme = getAgeTheme(grade.id);
  const items = getClassificationsFor(grade.id, subject.id);

  return (
    <>
      <PageHero
        emoji={subject.emoji}
        title={subject.shortName}
        subtitle={`${grade.name} · ${subject.description}`}
        tip={theme.showMascot ? 'Pick a topic to explore!' : undefined}
        gradient={colors.gradient}
      />
      {/* A playful "path": a zig-zag trail on tablets, a stacked list on phones. */}
      <ol className="relative grid gap-5 md:grid-cols-2 md:gap-x-10 md:gap-y-6 md:pb-10">
        {items.map((c, i) => {
          const path = { level: level.id, grade: grade.id, subject: subject.id, classification: c.id };
          const concepts = getConcepts(path);
          const ready = concepts.length > 0;
          const stars = starsUnder(progress, `${grade.id}/${subject.id}/${c.id}/`);
          return (
            <li key={c.id} className={i % 2 === 1 ? 'md:translate-y-10' : ''}>
              <Card to={`/${level.id}/${grade.id}/${subject.id}/${c.id}`} index={i} className="h-full bg-white">
                <div className="flex items-center gap-4 p-4 md:p-5">
                  <span className={`relative grid h-20 w-20 shrink-0 place-items-center rounded-3xl border-4 ${colors.border} ${colors.soft} text-5xl`}>
                    {c.emoji}
                    <span className={`absolute -left-3 -top-3 grid h-9 w-9 place-items-center rounded-full border-4 border-white ${colors.solid} font-display text-base font-bold text-white`}>
                      {i + 1}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-tight">{c.name}</h2>
                    <p className="text-base text-ink-soft">{c.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ready ? (
                        <Badge className={`${colors.soft} ${colors.text}`}>
                          📖 {concepts.length} {concepts.length === 1 ? 'lesson' : 'lessons'}
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-ink-soft">🛠️ Coming soon</Badge>
                      )}
                      {stars > 0 && <Badge className="bg-yellow-100 text-yellow-900">⭐ {stars}</Badge>}
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ol>
    </>
  );
}
