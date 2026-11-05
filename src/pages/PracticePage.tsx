import { useSearchParams } from 'react-router-dom';
import { ComingSoon } from '../components/ComingSoon';
import { FlashCards } from '../components/practice/FlashCards';
import { PracticeRunner } from '../components/practice/PracticeRunner';
import { SetPicker } from '../components/practice/SetPicker';
import { Mascot } from '../components/ui';
import { bankId, getConcepts, getQuestionBanks } from '../lib/content';
import { progressKey, useProgress } from '../lib/progress';
import type { QuestionBank } from '../types/practice';
import { useClassification } from './ClassificationLayout';

export default function PracticePage() {
  const { contentPath, base, colors, theme, grade, subject, classification } = useClassification();
  const [params, setParams] = useSearchParams();
  const progress = useProgress();
  const banks = getQuestionBanks(contentPath);
  const concepts = getConcepts(contentPath);

  if (banks.length === 0) return <ComingSoon what={`${classification.name} practice`} />;

  // ?concept=&set= picks the practice set; with only one set there's nothing to choose.
  const selected =
    banks.find((b) => b.conceptSlug === params.get('concept') && b.set === params.get('set')) ??
    (banks.length === 1 ? banks[0] : undefined);
  const lesson = concepts.find((c) => c.slug === params.get('concept'));
  const starsFor = (b: QuestionBank) => progress[progressKey(grade.id, subject.id, classification.id, bankId(b))]?.stars ?? 0;

  const picker = banks.length > 1 && (
    <div className="mb-6">
      <SetPicker
        banks={banks}
        concepts={concepts}
        value={selected}
        onChange={(b) => setParams({ concept: b.conceptSlug, set: b.set })}
        label="Practice:"
        placeholder={lesson ? `Choose a practice for ${lesson.title}…` : 'Choose what to practice…'}
        starsFor={starsFor}
      />
    </div>
  );

  if (!selected) {
    return (
      <>
        {theme.showMascot && (
          <Mascot className="mb-6" size={72}>
            What do you want to practice? Pick one from the list!
          </Mascot>
        )}
        {picker}
      </>
    );
  }

  return (
    <>
      {picker}
      <h2 className="mb-4 text-center text-3xl font-bold">{selected.title}</h2>
      {selected.cards ? (
        <FlashCards key={bankId(selected)} cards={selected.cards} perRound={selected.cardsPerRound} mode={selected.cardMode} colors={colors} />
      ) : (
        <PracticeRunner
          key={bankId(selected)}
          bank={selected}
          progressId={{
            grade: grade.id,
            subject: subject.id,
            classification: classification.id,
          }}
          colors={colors}
          theme={theme}
          worksheetsHref={`${base}/worksheets?concept=${selected.conceptSlug}&set=${selected.set}`}
        />
      )}
    </>
  );
}
