import { describe, expect, it } from 'vitest';
import { columnQuestion, missingNumberQuestion, splitBlank } from './questions';

describe('columnQuestion', () => {
  it('solves each operator and keeps a one-line prompt', () => {
    expect(columnQuestion('+', [27, 5])).toMatchObject({ prompt: '27 + 5 = ?', answer: 32, column: { op: '+', operands: [27, 5] } });
    expect(columnQuestion('-', [42, 17])).toMatchObject({ prompt: '42 - 17 = ?', answer: 25 });
    expect(columnQuestion('×', [12, 3])).toMatchObject({ prompt: '12 × 3 = ?', answer: 36 });
    expect(columnQuestion('÷', [84, 4])).toMatchObject({ prompt: '84 ÷ 4 = ?', answer: 21 });
  });
});

describe('missingNumberQuestion', () => {
  it('hides the chosen number and makes it the answer', () => {
    expect(missingNumberQuestion('+', [5, 5], 0)).toMatchObject({ prompt: '? + 5 = 10', answer: 5 });
    expect(missingNumberQuestion('+', [34, 15], 1)).toMatchObject({ prompt: '34 + ? = 49', answer: 15 });
    expect(missingNumberQuestion('-', [12, 5], 1)).toMatchObject({ prompt: '12 - ? = 7', answer: 5 });
  });
});

describe('splitBlank', () => {
  it('finds a standalone ? but not a sentence-ending one', () => {
    expect(splitBlank('8 + 5 = ?')).toEqual(['8 + 5 = ', '']);
    expect(splitBlank('Write the first letter: ?et')).toEqual(['Write the first letter: ', 'et']);
    expect(splitBlank('How many now? Sam')).toBeUndefined();
    expect(splitBlank('Where is the ??')).toEqual(['Where is the ', '?']);
    expect(splitBlank('? + 5 = 10')).toEqual(['', ' + 5 = 10']);
    expect(splitBlank('That makes 1 ten and ? ones.')).toEqual(['That makes 1 ten and ', ' ones.']);
    expect(splitBlank('How many apples does Sam have now?')).toBeUndefined();
  });
});
