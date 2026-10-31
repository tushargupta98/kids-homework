import { ComingSoon } from '../components/ComingSoon';
import { PageHero } from '../components/layout/PageHero';
import { Badge, Card } from '../components/ui';
import { getGradesForLevel } from '../data/curriculum';
import { useCurriculum } from '../hooks/useCurriculum';
import { defaultGradeColor, gradeColors } from '../theme/subjectColors';
import NotFound from './NotFound';

export default function LevelPage() {
  const { level, invalid } = useCurriculum();
  if (invalid || !level) return <NotFound />;

  return (
    <>
      <PageHero emoji={level.emoji} title={level.name} subtitle={level.tagline} tip="Which grade are you in?" />
      {level.comingSoon ? (
        <ComingSoon what={level.name} />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {getGradesForLevel(level.id).map((g, i) => (
            <Card
              key={g.id}
              to={`/${level.id}/${g.id}`}
              disabled={g.comingSoon}
              index={i}
              className="bg-white"
              label={g.name}
            >
              <div className="flex flex-col items-center gap-2 p-5 text-center">
                <div
                  className={`relative grid h-24 w-24 place-items-center rounded-[1.75rem] border-4 border-ink/15 font-display text-5xl font-bold shadow-chunky-sm md:h-28 md:w-28 ${gradeColors[g.id] ?? defaultGradeColor}`}
                >
                  {g.badge}
                  <span className="absolute -right-3 -top-3 text-3xl">{g.emoji}</span>
                </div>
                <h2 className="text-2xl font-bold">{g.name}</h2>
                <p className="text-base text-ink-soft">{g.ages}</p>
                {g.comingSoon && <Badge className="bg-slate-100 text-ink-soft">🔒 Soon</Badge>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
