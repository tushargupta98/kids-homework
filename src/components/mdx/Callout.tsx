import type { ReactNode } from 'react';

const styles = {
  tip: { box: 'bg-sky-50 border-sky-300', icon: '💡' },
  remember: { box: 'bg-yellow-50 border-yellow-300', icon: '⭐' },
  try: { box: 'bg-green-50 border-green-300', icon: '✋' },
};

export function Callout({ type = 'tip', title, children }: { type?: keyof typeof styles; title?: string; children: ReactNode }) {
  const s = styles[type];
  return (
    <aside className={`not-prose my-4 flex gap-3 rounded-3xl border-4 p-4 ${s.box}`}>
      <span className="text-3xl" aria-hidden>
        {s.icon}
      </span>
      <div className="space-y-2 text-xl">
        {title && <p className="font-display text-2xl font-semibold">{title}</p>}
        {children}
      </div>
    </aside>
  );
}
