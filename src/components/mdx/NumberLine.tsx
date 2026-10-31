import { useState } from 'react';
import { sounds } from '../../lib/sound';

interface NumberLineProps {
  min?: number;
  max?: number;
  /** Where the hop starts. */
  start?: number;
  /** Size of the hop (negative hops go left). */
  jump?: number;
}

const STEP = 48; // viewBox units per number
const MIN_PX = 40; // never shrink a number's tap target below this

/** Number line with an optional hop arc. Tap a number to mark it. */
export function NumberLine({ min = 0, max = 10, start, jump }: NumberLineProps) {
  const [marked, setMarked] = useState<number | null>(null);
  const nums = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const width = nums.length * STEP;
  const x = (n: number) => (n - min) * STEP + STEP / 2;
  const end = start !== undefined && jump !== undefined ? start + jump : undefined;

  return (
    <div className="not-prose my-4">
      <div className="overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        <svg viewBox={`0 0 ${width} 130`} className="mx-auto block w-full"
          style={{ minWidth: nums.length * MIN_PX, maxWidth: width }} role="img" aria-label={`Number line from ${min} to ${max}`}>
          {start !== undefined && end !== undefined && (
            <>
              <path
                d={`M ${x(start)} 70 Q ${(x(start) + x(end)) / 2} ${70 - Math.min(60, Math.abs(jump!) * 12 + 20)} ${x(end)} 70`}
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeDasharray="8 6"
              />
              <text x={(x(start) + x(end)) / 2} y={18} textAnchor="middle" className="fill-orange-600 font-display text-lg font-bold">
                {jump! > 0 ? `+${jump}` : jump}
              </text>
            </>
          )}
          <line x1={STEP / 4} x2={width - STEP / 4} y1={80} y2={80} stroke="#2d2a32" strokeWidth="4" strokeLinecap="round" />
          {nums.map((n) => {
            const highlight = n === start || n === end || n === marked;
            return (
              <g
                key={n}
                onClick={() => {
                  sounds.tap();
                  setMarked(n === marked ? null : n);
                }}
                className="cursor-pointer"
              >
                <rect x={x(n) - STEP / 2} y={50} width={STEP} height={80} fill="transparent" />
                <line x1={x(n)} x2={x(n)} y1={70} y2={90} stroke="#2d2a32" strokeWidth="3" />
                {highlight && <circle cx={x(n)} cy={80} r={11} fill={n === end ? '#f97316' : n === marked ? '#0ea5e9' : '#22c55e'} />}
                <text x={x(n)} y={118} textAnchor="middle" className="fill-ink font-display text-xl font-semibold">
                  {n}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
