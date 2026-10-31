import { Link, useNavigate } from 'react-router-dom';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import { setSound, useSettings } from '../../lib/settings';
import { Owl } from '../ui';
import { Breadcrumbs } from './Breadcrumbs';

export function Header() {
  const crumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { sound } = useSettings();
  const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2] : undefined;

  return (
    <header className="no-print sticky top-0 z-30 border-b-4 border-ink/5 bg-cream/90 pt-safe backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-safe py-2">
        {parent ? (
          <button
            type="button"
            onClick={() => navigate(parent.to)}
            aria-label={`Back to ${parent.label}`}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-4 border-ink/10 bg-white text-2xl shadow-chunky-sm active:scale-90"
          >
            ←
          </button>
        ) : null}

        <Link to="/" className="flex min-h-12 items-center gap-1.5 rounded-full pr-3" aria-label="Hoot School home">
          <Owl size={44} />
          <span className="font-display text-2xl font-bold tracking-tight">
            Hoot<span className="text-orange-600">School</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSound(!sound)}
            aria-pressed={sound}
            aria-label={sound ? 'Turn sound off' : 'Turn sound on'}
            className="grid h-12 w-12 place-items-center rounded-full border-4 border-ink/10 bg-white text-2xl shadow-chunky-sm active:scale-90"
          >
            {sound ? '🔔' : '🔕'}
          </button>
        </div>
      </div>
      {crumbs.length > 1 && (
        <div className="mx-auto hidden max-w-6xl px-safe pb-2 md:block">
          <Breadcrumbs crumbs={crumbs} />
        </div>
      )}
    </header>
  );
}
