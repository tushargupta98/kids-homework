import { bankId, type ConceptMeta } from '../../lib/content';
import type { QuestionBank } from '../../types/practice';

interface SetPickerProps {
  banks: QuestionBank[];
  /** Lessons, used as the dropdown's group headings (in lesson order). */
  concepts: ConceptMeta[];
  value?: QuestionBank;
  onChange: (bank: QuestionBank) => void;
  label: string;
  /** Shown as the first option when nothing is picked yet. */
  placeholder?: string;
  /** Stars earned, shown after each option's name. */
  starsFor?: (bank: QuestionBank) => number;
}

/** Dropdown of practice sets, grouped by lesson. */
export function SetPicker({ banks, concepts, value, onChange, label, placeholder, starsFor }: SetPickerProps) {
  const lessons = concepts.filter((c) => banks.some((b) => b.conceptSlug === c.slug));
  const mixed = banks.filter((b) => b.mixed);
  const option = (b: QuestionBank) => {
    const stars = starsFor?.(b) ?? 0;
    return (
      <option key={bankId(b)} value={bankId(b)}>
        {[b.emoji, b.title, stars > 0 && '⭐'.repeat(stars)].filter(Boolean).join(' ')}
      </option>
    );
  };

  return (
    <label className="flex flex-wrap items-center gap-3">
      <span className="font-display text-lg text-ink-soft">{label}</span>
      <select
        value={value ? bankId(value) : ''}
        onChange={(e) => {
          const bank = banks.find((b) => bankId(b) === e.target.value);
          if (bank) onChange(bank);
        }}
        className="min-h-14 min-w-0 max-w-full flex-1 cursor-pointer rounded-2xl border-4 border-ink/15 bg-white px-4 font-display text-xl font-semibold shadow-chunky-sm outline-none focus:border-sky-500 sm:flex-none"
      >
        {!value && (
          <option value="" disabled>
            {placeholder ?? 'Choose…'}
          </option>
        )}
        {lessons.length > 1 || mixed.length > 0 ? (
          <>
            {lessons.map((c) => (
              <optgroup key={c.slug} label={`${c.emoji ?? ''} ${c.title}`.trim()}>
                {banks.filter((b) => b.conceptSlug === c.slug).map(option)}
              </optgroup>
            ))}
            {mixed.length > 0 && <optgroup label="🎲 Mixed practice">{mixed.map(option)}</optgroup>}
          </>
        ) : (
          banks.map(option)
        )}
      </select>
    </label>
  );
}
