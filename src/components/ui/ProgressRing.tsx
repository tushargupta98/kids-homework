/** Circular progress ring, 0–1. */
export function ProgressRing({ value, color, size = 56, label }: { value: number; color: string; size?: number; label?: string }) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ?? `${Math.round(pct * 100)}% done`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgb(45 42 50 / 0.1)" strokeWidth={stroke} fill="white" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-ink font-display text-sm font-semibold">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}
