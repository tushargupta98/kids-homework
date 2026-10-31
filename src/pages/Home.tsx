import { PageHero } from '../components/layout/PageHero';
import { Badge, Card } from '../components/ui';
import { levels } from '../data/curriculum';

const doorStyles: Record<string, string> = {
  elementary: 'from-yellow-200 via-orange-200 to-pink-200',
  middle: 'from-sky-200 to-indigo-200',
  high: 'from-violet-200 to-slate-200',
};

export default function Home() {
  return (
    <>
      <PageHero
        title="Hi there, friend!"
        subtitle="Pick your school to start learning."
        tip="Tap a door to go in! 🚪"
        gradient="from-yellow-200 via-amber-100 to-sky-200"
      />
      <div className="grid gap-5 md:grid-cols-3">
        {levels.map((l, i) => (
          <Card
            key={l.id}
            to={`/${l.id}`}
            disabled={l.comingSoon}
            index={i}
            className={`bg-gradient-to-b ${doorStyles[l.id]} overflow-hidden`}
          >
            {/* The "door" */}
            <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
              <div className="relative mb-4 grid h-36 w-28 place-items-center rounded-t-full border-4 border-ink/15 bg-white/80 text-6xl shadow-inner md:h-44 md:w-32">
                {l.emoji}
                <span className="absolute right-3 top-1/2 h-3 w-3 rounded-full bg-amber-500" />
              </div>
              <h2 className="text-3xl font-bold">{l.name}</h2>
              <p className="text-lg text-ink-soft">{l.tagline}</p>
              {l.comingSoon && <Badge className="mt-3 bg-white text-ink-soft">🔒 Coming soon</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
