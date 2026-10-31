import { NavLink, useLocation } from 'react-router-dom';
import type { SubjectPalette } from '../../theme/subjectColors';

const tabs = [
  { to: '', label: 'Learn', emoji: '📖', end: false },
  { to: 'practice', label: 'Practice', emoji: '🎯', end: true },
  { to: 'worksheets', label: 'Worksheets', emoji: '🖨️', end: true },
];

/** Segmented control: Learn | Practice | Worksheets. */
export function SectionTabs({ base, colors }: { base: string; colors: SubjectPalette }) {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Sections" className="no-print sticky top-[calc(env(safe-area-inset-top)+4.25rem)] z-20 mb-6 md:top-[calc(env(safe-area-inset-top)+6.5rem)]">
      <div className="grid grid-cols-3 gap-2 rounded-[1.75rem] border-4 border-ink/10 bg-white/95 p-1.5 sm:rounded-full shadow-chunky-sm backdrop-blur">
        {tabs.map((t) => (
          <NavLink
            key={t.label}
            to={t.to ? `${base}/${t.to}` : base}
            end={t.end}
            className={({ isActive }) => {
              // "Learn" is active on the hub page and on concept pages.
              const active = t.to === '' ? isActive && !/\/(practice|worksheets)$/.test(pathname) : isActive;
              return `flex min-h-14 flex-col items-center justify-center gap-0 rounded-[1.5rem] px-1 py-1 font-display text-base font-semibold leading-tight transition-colors sm:flex-row sm:gap-2 sm:rounded-full sm:text-lg md:text-xl ${
                active ? `${colors.solid} text-white` : 'text-ink hover:bg-ink/5'
              }`;
            }}
          >
            <span className="text-xl sm:text-2xl" aria-hidden>
              {t.emoji}
            </span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
