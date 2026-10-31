import type { Classification, Grade, GradeId, Level, LevelId, Subject, SubjectId } from '../types/curriculum';

/**
 * Single source of truth for the site's navigation tree:
 * Level → Grade → Subject → Classification → {Concepts, Practice, Worksheets}.
 * Classifications follow Common Core (Math, ELA) and NGSS (Science).
 */

export const levels: Level[] = [
  {
    id: 'elementary',
    name: 'Elementary School',
    tagline: 'Pre-K to Grade 5',
    emoji: '🏫',
    grades: ['pre-k', 'kindergarten', 'grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5'],
  },
  {
    id: 'middle',
    name: 'Middle School',
    tagline: 'Grades 6 to 8',
    emoji: '🎒',
    grades: ['grade-6', 'grade-7', 'grade-8'],
    comingSoon: true,
  },
  {
    id: 'high',
    name: 'High School',
    tagline: 'Grades 9 to 12',
    emoji: '🎓',
    grades: ['grade-9', 'grade-10', 'grade-11', 'grade-12'],
    comingSoon: true,
  },
];

export const grades: Grade[] = [
  { id: 'pre-k', levelId: 'elementary', name: 'Pre-K', badge: 'P', emoji: '🌱', ages: 'Ages 4–5' },
  { id: 'kindergarten', levelId: 'elementary', name: 'Kindergarten', badge: 'K', emoji: '⭐', ages: 'Ages 5–6' },
  { id: 'grade-1', levelId: 'elementary', name: 'Grade 1', badge: '1', emoji: '🚀', ages: 'Ages 6–7' },
  { id: 'grade-2', levelId: 'elementary', name: 'Grade 2', badge: '2', emoji: '🌈', ages: 'Ages 7–8' },
  { id: 'grade-3', levelId: 'elementary', name: 'Grade 3', badge: '3', emoji: '🦊', ages: 'Ages 8–9', comingSoon: true },
  { id: 'grade-4', levelId: 'elementary', name: 'Grade 4', badge: '4', emoji: '🐢', ages: 'Ages 9–10', comingSoon: true },
  { id: 'grade-5', levelId: 'elementary', name: 'Grade 5', badge: '5', emoji: '🦉', ages: 'Ages 10–11', comingSoon: true },
  { id: 'grade-6', levelId: 'middle', name: 'Grade 6', badge: '6', emoji: '🧭', ages: 'Ages 11–12', comingSoon: true },
  { id: 'grade-7', levelId: 'middle', name: 'Grade 7', badge: '7', emoji: '🔭', ages: 'Ages 12–13', comingSoon: true },
  { id: 'grade-8', levelId: 'middle', name: 'Grade 8', badge: '8', emoji: '🧪', ages: 'Ages 13–14', comingSoon: true },
  { id: 'grade-9', levelId: 'high', name: 'Grade 9', badge: '9', emoji: '📐', ages: 'Ages 14–15', comingSoon: true },
  { id: 'grade-10', levelId: 'high', name: 'Grade 10', badge: '10', emoji: '🧬', ages: 'Ages 15–16', comingSoon: true },
  { id: 'grade-11', levelId: 'high', name: 'Grade 11', badge: '11', emoji: '📚', ages: 'Ages 16–17', comingSoon: true },
  { id: 'grade-12', levelId: 'high', name: 'Grade 12', badge: '12', emoji: '🎓', ages: 'Ages 17–18', comingSoon: true },
];

export const subjects: Subject[] = [
  { id: 'math', name: 'Math', shortName: 'Math', emoji: '🔢', description: 'Numbers, shapes and counting fun' },
  { id: 'ela', name: 'Language Arts', shortName: 'Reading & Writing', emoji: '📖', description: 'Letters, words, reading and writing' },
  { id: 'science', name: 'Science', shortName: 'Science', emoji: '🔬', description: 'Plants, animals, weather and more' },
];

const PK: GradeId = 'pre-k';
const K: GradeId = 'kindergarten';
const G1: GradeId = 'grade-1';
const G2: GradeId = 'grade-2';

export const classifications: Classification[] = [
  // Math
  { id: 'counting', subjectId: 'math', name: 'Counting & Numbers', emoji: '🔢', description: 'Count objects and know your numbers', grades: [PK, K, G1] },
  { id: 'arithmetic', subjectId: 'math', name: 'Addition & Subtraction', emoji: '➕', description: 'Put together and take away', grades: [PK, K, G1, G2] },
  { id: 'place-value', subjectId: 'math', name: 'Place Value', emoji: '🧱', description: 'Ones, tens and hundreds', grades: [K, G1, G2] },
  { id: 'measurement-data', subjectId: 'math', name: 'Measurement & Data', emoji: '📏', description: 'Longer, shorter, heavier — and simple graphs', grades: [PK, K, G1, G2] },
  { id: 'geometry', subjectId: 'math', name: 'Shapes', emoji: '🔷', description: 'Circles, squares, triangles and more', grades: [PK, K, G1, G2] },
  { id: 'time-money', subjectId: 'math', name: 'Time & Money', emoji: '🕐', description: 'Tell time and count coins', grades: [G1, G2] },
  { id: 'patterns-sorting', subjectId: 'math', name: 'Patterns & Sorting', emoji: '🧩', description: 'What comes next? Group things that match', grades: [PK, K] },

  // Language Arts
  { id: 'phonics', subjectId: 'ela', name: 'Alphabet & Phonics', emoji: '🔤', description: 'Letters and the sounds they make', grades: [PK, K, G1, G2] },
  { id: 'reading', subjectId: 'ela', name: 'Reading', emoji: '📚', description: 'Read stories and understand them', grades: [PK, K, G1, G2] },
  { id: 'writing', subjectId: 'ela', name: 'Writing', emoji: '✏️', description: 'Write letters, words and sentences', grades: [PK, K, G1, G2] },
  { id: 'grammar', subjectId: 'ela', name: 'Grammar', emoji: '🧠', description: 'Nouns, verbs and building sentences', grades: [K, G1, G2] },
  { id: 'vocabulary', subjectId: 'ela', name: 'Vocabulary & Sight Words', emoji: '💬', description: 'Learn new words and read them fast', grades: [PK, K, G1, G2] },

  // Science
  { id: 'explore-world', subjectId: 'science', name: 'Explore the World', emoji: '🌍', description: 'Look, touch, wonder and ask why', grades: [PK] },
  { id: 'life-science', subjectId: 'science', name: 'Life Science', emoji: '🌻', description: 'Plants, animals and living things', grades: [K, G1, G2] },
  { id: 'earth-space', subjectId: 'science', name: 'Earth & Space', emoji: '🌦️', description: 'Weather, seasons, sun and moon', grades: [K, G1, G2] },
  { id: 'physical-science', subjectId: 'science', name: 'Physical Science', emoji: '🧲', description: 'Push, pull, light and sound', grades: [K, G1, G2] },
];

// ---- Lookup helpers ----

export const getLevel = (id: string) => levels.find((l) => l.id === id);
export const getGrade = (id: string) => grades.find((g) => g.id === id);
export const getSubject = (id: string) => subjects.find((s) => s.id === id);

export const getGradesForLevel = (levelId: LevelId) => grades.filter((g) => g.levelId === levelId);

export const getClassificationsFor = (gradeId: GradeId, subjectId: SubjectId) =>
  classifications.filter((c) => c.subjectId === subjectId && c.grades.includes(gradeId));

export const getSubjectsForGrade = (gradeId: GradeId) =>
  subjects.filter((s) => getClassificationsFor(gradeId, s.id).length > 0);

export const getClassification = (gradeId: GradeId, subjectId: SubjectId, classificationId: string) =>
  getClassificationsFor(gradeId, subjectId).find((c) => c.id === classificationId);
