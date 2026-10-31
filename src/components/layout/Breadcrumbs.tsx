import { Link } from 'react-router-dom';
import type { Crumb } from '../../hooks/useBreadcrumbs';

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-base text-ink-soft [scrollbar-width:none]">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.to + i} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {c.label}
                </span>
              ) : (
                <Link to={c.to} className="rounded-full px-2 py-1 hover:bg-ink/5 hover:text-ink">
                  {c.label}
                </Link>
              )}
              {!last && <span aria-hidden>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
