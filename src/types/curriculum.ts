export type LevelId = 'elementary' | 'middle' | 'high';

export type GradeId =
  | 'pre-k'
  | 'kindergarten'
  | 'grade-1'
  | 'grade-2'
  | 'grade-3'
  | 'grade-4'
  | 'grade-5'
  | 'grade-6'
  | 'grade-7'
  | 'grade-8'
  | 'grade-9'
  | 'grade-10'
  | 'grade-11'
  | 'grade-12';

export type SubjectId = 'math' | 'ela' | 'science';

export type SectionId = 'concepts' | 'practice' | 'worksheets';

export interface Level {
  id: LevelId;
  name: string;
  tagline: string;
  emoji: string;
  grades: GradeId[];
  comingSoon?: boolean;
}

export interface Grade {
  id: GradeId;
  levelId: LevelId;
  name: string;
  /** Short label for badges, e.g. "K" or "1". */
  badge: string;
  emoji: string;
  ages: string;
  /** Grades not yet built show a "coming soon" state. */
  comingSoon?: boolean;
}

export interface Subject {
  id: SubjectId;
  name: string;
  /** Kid-facing short name. */
  shortName: string;
  emoji: string;
  description: string;
}

export interface Classification {
  id: string;
  subjectId: SubjectId;
  name: string;
  emoji: string;
  description: string;
  grades: GradeId[];
}
