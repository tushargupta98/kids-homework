import { onsetOf, WORD_FAMILIES } from '../../lib/phonics';

/** Every word family and its words, from src/data/word-families.json. The first sound is highlighted. */
export function WordFamilyList() {
  return (
    <ul className="not-prose my-4 space-y-2">
      {WORD_FAMILIES.map((f) => (
        <li key={f.rime} className="text-lg">
          <strong className="font-display text-xl text-orange-700">-{f.rime}:</strong>{' '}
          {f.words.map((w, i) => {
            const onset = onsetOf(w.word, f.rime);
            return (
              <span key={w.word}>
                {i > 0 && ', '}
                <span className="font-semibold text-sky-700">{onset}</span>
                {f.rime}
              </span>
            );
          })}
        </li>
      ))}
    </ul>
  );
}
