import { describe, expect, it } from 'vitest';
import { columnQuestion } from './questions';

describe('columnQuestion', () => {
  it('solves each operator and keeps a one-line prompt', () => {
    expect(columnQuestion('+', [27, 5])).toMatchObject({ prompt: '27 + 5 = ?', answer: 32, column: { op: '+', operands: [27, 5] } });
    expect(columnQuestion('-', [42, 17])).toMatchObject({ prompt: '42 - 17 = ?', answer: 25 });
    expect(columnQuestion('×', [12, 3])).toMatchObject({ prompt: '12 × 3 = ?', answer: 36 });
    expect(columnQuestion('÷', [84, 4])).toMatchObject({ prompt: '84 ÷ 4 = ?', answer: 21 });
  });
});
