import { useEffect, useRef, useState } from 'react';
import type { FillInQuestion } from '../../types/practice';
import { BigButton } from '../ui';

interface Props {
  question: FillInQuestion;
  solved: boolean;
  /** Bumps after a wrong answer so the field clears. */
  attempt: number;
  color: string;
  onAnswer: (value: string) => void;
}

export function FillIn({ question, solved, attempt, color, onAnswer }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const numeric = typeof question.answer === 'number';

  useEffect(() => {
    setValue('');
    // Avoid popping the iOS keyboard over the question on first load.
    if (attempt > 0) ref.current?.focus();
  }, [attempt, question]);

  return (
    <form
      className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onAnswer(value);
      }}
    >
      <input
        ref={ref}
        value={solved ? String(question.answer) : value}
        onChange={(e) => setValue(e.target.value)}
        disabled={solved}
        inputMode={numeric ? 'numeric' : 'text'}
        pattern={numeric ? '[0-9]*' : undefined}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Your answer"
        placeholder="?"
        className={`h-24 w-40 rounded-3xl border-4 bg-white text-center font-display text-5xl font-bold outline-none focus:border-sky-500 ${
          solved ? 'border-green-500 bg-green-50 text-green-800' : 'border-ink/20'
        }`}
      />
      {!solved && (
        <BigButton type="submit" color={color} disabled={!value.trim()} className="min-w-40">
          Check ✓
        </BigButton>
      )}
    </form>
  );
}
