import { ComingSoon } from '../components/ComingSoon';
import { PageHero } from '../components/layout/PageHero';
import { Card, ProgressRing } from '../components/ui';
import { getClassificationsFor, getSubjectsForGrade } from '../data/curriculum';
import { useCurriculum } from '../hooks/useCurriculum';
import { getConcepts } from '../lib/content';
import { progressKey, useProgress } from '../lib/progress';
import { getAgeTheme } from '../theme/ageThemes';
import { subjectColors } from '../theme/subjectColors';
import type { SubjectId } from '../types/curriculum';
import NotFound from './NotFound';

export default function GradePage() {
  const { level, grade, invalid } = useCurriculum();
  const progress = useProgress();
  if (invalid || !level || !grade) return <NotFound />;
  const theme = getAgeTheme(grade.id);
  const subjects = getSubjectsForGrade(grade.id);

  /** Share of available concepts in this subject with at least one star. */
  const subjectProgress = (subjectId: SubjectId) => {
    const keys = getClassificationsFor(grade.id, subjectId).flatMap((c) =>
      getConcepts({ level: level.id, grade: grade.id, subject: subjectId, classification: c.id }).map((m) =>
        progressKey(grade.id, subjectId, c.id, m.slug),
      ),
    );
    if (keys.length === 0) return undefined;
    return keys.filter((k) => (progress[k]?.stars ?? 0) > 0).length / keys.length;
  };

  return (
    <>
      <PageHero
        emoji={grade.emoji}
        title={grade.name}
        subtitle={grade.ages}
        tip={theme.showMascot ? 'What do you want to learn today?' : undefined}
      />
      {grade.comingSoon || subjects.length === 0 ? (
        <ComingSoon what={grade.name} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s, i) => {
            const colors = subjectColors[s.id];
            const pct = subjectProgress(s.id);
            return (
              <Card key={s.id} to={`/${level.id}/${grade.id}/${s.id}`} index={i} className={`bg-gradient-to-br ${colors.gradient}`}>
                <div className="flex items-center gap-4 p-5 md:flex-col md:p-7 md:text-center">
                  <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-4 border-ink/10 bg-white text-6xl shadow-chunky-sm md:h-32 md:w-32 md:text-7xl">
                    {s.emoji}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold">{s.shortName}</h2>
                    <p className="text-lg text-ink/80">{s.description}</p>
                  </div>
                  {pct !== undefined && <ProgressRing value={pct} color={colors.hex} />}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
