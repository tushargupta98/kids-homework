import { Outlet, useOutletContext } from 'react-router-dom';
import { SectionTabs } from '../components/classification/SectionTabs';
import { PageHero } from '../components/layout/PageHero';
import { useCurriculum, type CurriculumContext } from '../hooks/useCurriculum';
import { getAgeTheme, type AgeTheme } from '../theme/ageThemes';
import { subjectColors, type SubjectPalette } from '../theme/subjectColors';
import NotFound from './NotFound';

export interface ClassificationOutlet extends Required<Omit<CurriculumContext, 'invalid'>> {
  base: string;
  colors: SubjectPalette;
  theme: AgeTheme;
}

export const useClassification = () => useOutletContext<ClassificationOutlet>();

/** Hub for one classification: hero banner + Learn/Practice/Worksheets tabs. */
export default function ClassificationLayout() {
  const ctx = useCurriculum();
  const { level, grade, subject, classification, contentPath, invalid } = ctx;
  if (invalid || !level || !grade || !subject || !classification || !contentPath) return <NotFound />;

  const base = `/${level.id}/${grade.id}/${subject.id}/${classification.id}`;
  const colors = subjectColors[subject.id];
  const theme = getAgeTheme(grade.id);
  const outlet: ClassificationOutlet = { level, grade, subject, classification, contentPath, base, colors, theme };

  return (
    <>
      <div className="no-print">
        <PageHero
          emoji={classification.emoji}
          title={classification.name}
          subtitle={`${grade.name} · ${subject.shortName}`}
          gradient={colors.gradient}
        />
      </div>
      <SectionTabs base={base} colors={colors} />
      <Outlet context={outlet} />
    </>
  );
}
