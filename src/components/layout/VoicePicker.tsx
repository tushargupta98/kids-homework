import { useEffect, useState } from 'react';
import { setVoice, useSettings } from '../../lib/settings';
import { canSpeak, englishVoices, speakWord } from '../../lib/speech';

/** Header button that opens a list of the browser's English voices, with a test word. */
export function VoicePicker() {
  const { voice } = useSettings();
  const [open, setOpen] = useState(false);
  const [voices, setVoices] = useState(englishVoices);

  useEffect(() => {
    if (!canSpeak()) return;
    const update = () => setVoices(englishVoices());
    window.speechSynthesis.addEventListener?.('voiceschanged', update);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', update);
  }, []);

  if (!canSpeak()) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Choose the reading voice"
        className="grid h-12 w-12 place-items-center rounded-full border-4 border-ink/10 bg-white text-2xl shadow-chunky-sm active:scale-90"
      >
        🗣️
      </button>
      {open && (
        <div className="absolute right-0 top-14 z-40 w-80 rounded-2xl border-4 border-ink/10 bg-white p-4 shadow-chunky">
          <label className="flex flex-col gap-2">
            <span className="font-display text-lg font-semibold">Reading voice</span>
            <select
              value={voice ?? ''}
              onChange={(e) => {
                setVoice(e.target.value);
                setTimeout(() => speakWord('can'), 0);
              }}
              className="min-h-12 rounded-xl border-4 border-ink/15 bg-white px-3 text-lg"
            >
              <option value="">Best available (automatic)</option>
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => speakWord('can')}
            className="mt-3 min-h-12 w-full rounded-xl border-4 border-ink/10 bg-amber-50 font-display text-lg font-semibold"
          >
            🔊 Test: "can"
          </button>
          <p className="mt-3 text-sm text-ink-soft">
            Only voices this browser offers are listed. Downloaded Enhanced voices often show up in Safari but not in Chrome.
          </p>
        </div>
      )}
    </div>
  );
}
