import { createStore } from './storage';

export type WorksheetFontSize = 'small' | 'medium' | 'large' | 'xl';
export type WorksheetColumns = 'auto' | 1 | 2 | 3 | 4;

interface WorksheetSettings {
  fontSize: WorksheetFontSize;
  columns: WorksheetColumns;
}

/** Problem text size on the sheet; everything inside a problem scales with it. */
export const FONT_SIZES: { value: WorksheetFontSize; label: string; size: string }[] = [
  { value: 'small', label: 'Small', size: '1.125rem' },
  { value: 'medium', label: 'Medium', size: '1.5rem' },
  { value: 'large', label: 'Large', size: '1.875rem' },
  { value: 'xl', label: 'Extra large', size: '2.25rem' },
];

export const COLUMN_OPTIONS: { value: WorksheetColumns; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
];

// Remembered across lessons and visits.
const store = createStore<WorksheetSettings>('hoot:worksheet:v1', { fontSize: 'medium', columns: 'auto' });

export const useWorksheetSettings = store.useStore;
export const setWorksheetSettings = (next: Partial<WorksheetSettings>) => store.set({ ...store.get(), ...next });
