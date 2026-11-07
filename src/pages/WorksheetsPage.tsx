import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ComingSoon } from '../components/ComingSoon';
import { SetPicker } from '../components/practice/SetPicker';
import { BigButton } from '../components/ui';
import { WorksheetSheet } from '../components/worksheet/WorksheetSheet';
import { getConcepts, getQuestionBanks } from '../lib/content';
import { buildPrintableRound, hasPrintable } from '../lib/questions';
import { COLUMN_OPTIONS, FONT_SIZES, setWorksheetSettings, useWorksheetSettings } from '../lib/worksheetSettings';
import { useClassification } from './ClassificationLayout';

const COUNTS = [10, 20];

export default function WorksheetsPage() {
  const { contentPath, colors, grade, classification } = useClassification();
  const [params, setParams] = useSearchParams();
  // Card decks and listening-only sets need sound, so they can't be printed.
  const banks = useMemo(() => getQuestionBanks(contentPath).filter(hasPrintable), [contentPath]);
  const [count, setCount] = useState(COUNTS[0]);
  const [seed, setSeed] = useState(0);
  const [showKey, setShowKey] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { fontSize, columns } = useWorksheetSettings();

  const concepts = getConcepts(contentPath);

  const inLesson = banks.filter((b) => b.conceptSlug === params.get('concept'));
  const bank = inLesson.find((b) => b.set === params.get('set')) ?? inLesson[0] ?? banks[0];
  const questions = useMemo(() => (bank ? buildPrintableRound(bank, count) : []), [bank, count, seed]);

  if (!bank) return <ComingSoon what={`${classification.name} worksheets`} />;

  const lesson = concepts.find((c) => c.slug === bank.conceptSlug)?.title ?? classification.name;
  const subtitle = `${grade.name} · ${lesson}`;

  const chip = (active: boolean) =>
    `min-h-12 rounded-full border-4 px-5 font-display text-lg font-semibold shadow-chunky-sm transition-colors ${
      active ? `${colors.solid} border-ink/15 text-white` : 'border-ink/10 bg-white hover:bg-ink/5'
    }`;

  return (
    <>
      <div className="no-print mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            {banks.length > 1 && (
              <SetPicker
                banks={banks}
                concepts={concepts}
                value={bank}
                onChange={(b) => setParams({ concept: b.conceptSlug, set: b.set })}
                label="Questions:"
              />
            )}
          </div>
          <BigButton color={`${colors.solid} ${colors.solidHover}`} onClick={() => window.print()}>
            🖨️ Print
          </BigButton>
          <BigButton variant="secondary" onClick={() => setSeed((s) => s + 1)}>
            🔀 New problems
          </BigButton>
          <button
            type="button"
            className={chip(showSettings)}
            onClick={() => setShowSettings(!showSettings)}
            aria-expanded={showSettings}
            aria-controls="worksheet-settings"
          >
            ⚙️ Settings
          </button>
        </div>

        {showSettings && (
          <div id="worksheet-settings" className="space-y-4 rounded-3xl border-4 border-ink/10 bg-white p-4">
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

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Text size">
              <span className="font-display text-lg text-ink-soft">Text size:</span>
              {FONT_SIZES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={chip(f.value === fontSize)}
                  style={{ fontSize: `min(${f.size}, 1.75rem)` }}
                  onClick={() => setWorksheetSettings({ fontSize: f.value })}
                  aria-pressed={f.value === fontSize}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Columns">
              <span className="font-display text-lg text-ink-soft">Columns:</span>
              {COLUMN_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={chip(c.value === columns)}
                  onClick={() => setWorksheetSettings({ columns: c.value })}
                  aria-pressed={c.value === columns}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="print-area space-y-8">
        <WorksheetSheet title={bank.title} subtitle={subtitle} questions={questions} fontSize={fontSize} columns={columns} />
        {showKey && (
          <WorksheetSheet title={bank.title} subtitle={subtitle} questions={questions} fontSize={fontSize} columns={columns} answerKey />
        )}
      </div>
    </>
  );
}
