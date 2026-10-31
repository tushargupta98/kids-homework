import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ComingSoon } from '../components/ComingSoon';
import { BigButton, Mascot } from '../components/ui';
import { WorksheetSheet } from '../components/worksheet/WorksheetSheet';
import { getQuestionBanks } from '../lib/content';
import { buildRound } from '../lib/questions';
import { useClassification } from './ClassificationLayout';

const COUNTS = [10, 20];

export default function WorksheetsPage() {
  const { contentPath, colors, theme, grade, classification } = useClassification();
  const [params, setParams] = useSearchParams();
  const banks = getQuestionBanks(contentPath);
  const [count, setCount] = useState(COUNTS[0]);
  const [seed, setSeed] = useState(0);
  const [showKey, setShowKey] = useState(false);

  const bank = banks.find((b) => b.conceptSlug === params.get('concept')) ?? banks[0];
  const questions = useMemo(() => (bank ? buildRound(bank, count) : []), [bank, count, seed]);

  if (!bank) return <ComingSoon what={`${classification.name} worksheets`} />;

  const chip = (active: boolean) =>
    `min-h-12 rounded-full border-4 px-5 font-display text-lg font-semibold shadow-chunky-sm transition-colors ${
      active ? `${colors.solid} border-ink/15 text-white` : 'border-ink/10 bg-white hover:bg-ink/5'
    }`;

  return (
    <>
      <div className="no-print mb-6 space-y-4">
        {theme.showMascot && (
          <Mascot size={64}>Pick a worksheet, then tap Print! 🖨️</Mascot>
        )}

        {banks.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Topic">
            {banks.map((b) => (
              <button key={b.conceptSlug} type="button" className={chip(b === bank)} onClick={() => setParams({ concept: b.conceptSlug })}>
                {b.title}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-lg text-ink-soft">Problems:</span>
          {COUNTS.map((n) => (
            <button key={n} type="button" className={chip(n === count)} onClick={() => setCount(n)} aria-pressed={n === count}>
              {n}
            </button>
          ))}
          <button type="button" className={chip(showKey)} onClick={() => setShowKey(!showKey)} aria-pressed={showKey}>
            🔑 Answer key
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <BigButton color={`${colors.solid} ${colors.solidHover}`} onClick={() => window.print()}>
            🖨️ Print
          </BigButton>
          <BigButton variant="secondary" onClick={() => setSeed((s) => s + 1)}>
            🔀 New problems
          </BigButton>
        </div>
      </div>

      <div className="print-area space-y-8">
        <WorksheetSheet title={bank.title} subtitle={`${grade.name} · ${classification.name}`} questions={questions} />
        {showKey && (
          <WorksheetSheet title={bank.title} subtitle={`${grade.name} · ${classification.name}`} questions={questions} answerKey />
        )}
      </div>
    </>
  );
}
