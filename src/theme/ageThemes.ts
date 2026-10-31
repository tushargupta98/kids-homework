import type { GradeId } from '../types/curriculum';

export type AgeGroup = 'early' | 'upper-elementary' | 'middle' | 'high';

export interface AgeTheme {
  group: AgeGroup;
  /** Show Hoot the owl with tips and cheers. */
  showMascot: boolean;
  /** Confetti and sounds on correct answers. */
  celebrate: boolean;
  /** Show the read-aloud button on prompts and lessons. */
  readAloud: boolean;
  cardRadius: string;
  titleSize: string;
}

const themes: Record<AgeGroup, AgeTheme> = {
  early: {
    group: 'early',
    showMascot: true,
    celebrate: true,
    readAloud: true,
    cardRadius: 'rounded-[2rem]',
    titleSize: 'text-4xl md:text-5xl',
  },
  'upper-elementary': {
    group: 'upper-elementary',
    showMascot: true,
    celebrate: true,
    readAloud: false,
    cardRadius: 'rounded-3xl',
    titleSize: 'text-3xl md:text-4xl',
  },
  middle: {
    group: 'middle',
    showMascot: false,
    celebrate: false,
    readAloud: false,
    cardRadius: 'rounded-2xl',
    titleSize: 'text-3xl md:text-4xl',
  },
  high: {
    group: 'high',
    showMascot: false,
    celebrate: false,
    readAloud: false,
    cardRadius: 'rounded-xl',
    titleSize: 'text-3xl md:text-4xl',
  },
};

const groupByGrade: Partial<Record<GradeId, AgeGroup>> = {
  'pre-k': 'early',
  kindergarten: 'early',
  'grade-1': 'early',
  'grade-2': 'early',
  'grade-3': 'upper-elementary',
  'grade-4': 'upper-elementary',
  'grade-5': 'upper-elementary',
  'grade-6': 'middle',
  'grade-7': 'middle',
  'grade-8': 'middle',
};

export function getAgeTheme(gradeId?: string): AgeTheme {
  if (!gradeId) return themes.early;
  return themes[groupByGrade[gradeId as GradeId] ?? 'high'];
}
