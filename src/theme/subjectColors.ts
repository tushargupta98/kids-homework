import type { SubjectId } from '../types/curriculum';

/** Literal class strings so Tailwind can see them at build time. */
export interface SubjectPalette {
  /** Soft background for tiles and banners. */
  soft: string;
  /** Strong fill for buttons and active tabs (white text is readable on it). */
  solid: string;
  solidHover: string;
  text: string;
  border: string;
  gradient: string;
  /** Hex for SVG strokes such as progress rings. */
  hex: string;
}

export const subjectColors: Record<SubjectId, SubjectPalette> = {
  math: {
    soft: 'bg-orange-100',
    solid: 'bg-orange-600',
    solidHover: 'hover:bg-orange-700',
    text: 'text-orange-800',
    border: 'border-orange-300',
    gradient: 'from-amber-200 via-orange-200 to-orange-300',
    hex: '#ea580c',
  },
  ela: {
    soft: 'bg-fuchsia-100',
    solid: 'bg-fuchsia-700',
    solidHover: 'hover:bg-fuchsia-800',
    text: 'text-fuchsia-800',
    border: 'border-fuchsia-300',
    gradient: 'from-pink-200 via-fuchsia-200 to-purple-300',
    hex: '#a21caf',
  },
  science: {
    soft: 'bg-green-100',
    solid: 'bg-green-700',
    solidHover: 'hover:bg-green-800',
    text: 'text-green-800',
    border: 'border-green-300',
    gradient: 'from-lime-200 via-green-200 to-emerald-300',
    hex: '#15803d',
  },
};

/** Each grade badge gets its own cheerful color. */
export const gradeColors: Record<string, string> = {
  'pre-k': 'bg-lime-300 text-lime-950',
  kindergarten: 'bg-yellow-300 text-yellow-950',
  'grade-1': 'bg-sky-300 text-sky-950',
  'grade-2': 'bg-pink-300 text-pink-950',
};

export const defaultGradeColor = 'bg-slate-200 text-slate-700';
