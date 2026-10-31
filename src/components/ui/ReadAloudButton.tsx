import { canSpeak, speak } from '../../lib/speech';

interface ReadAloudButtonProps {
  /** Text to read, or a function that returns it at click time. */
  text: string | (() => string);
  label?: string;
  className?: string;
}

/** 🔊 "Read to me" — for kids who aren't reading on their own yet. */
export function ReadAloudButton({ text, label = 'Read to me', className = '' }: ReadAloudButtonProps) {
  if (!canSpeak()) return null;
  return (
    <button
      type="button"
      onClick={() => speak(typeof text === 'function' ? text() : text)}
      aria-label={label}
      title={label}
      className={`inline-grid h-12 w-12 shrink-0 place-items-center rounded-full border-4 border-ink/10 bg-white text-2xl shadow-chunky-sm transition-transform active:scale-90 ${className}`}
    >
      🔊
    </button>
  );
}
