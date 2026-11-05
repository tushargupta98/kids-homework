import { describe, expect, it } from 'vitest';
import { numberToWords, ordinal, ordinalWord } from './numberWords';

describe('number words', () => {
  it('spells numbers to 120', () => {
    expect(numberToWords(0)).toBe('zero');
    expect(numberToWords(14)).toBe('fourteen');
    expect(numberToWords(40)).toBe('forty');
    expect(numberToWords(47)).toBe('forty-seven');
    expect(numberToWords(100)).toBe('one hundred');
    expect(numberToWords(115)).toBe('one hundred fifteen');
    expect(numberToWords(120)).toBe('one hundred twenty');
  });

  it('writes ordinals', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22].map(ordinal)).toEqual(['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd']);
    expect(ordinalWord(3)).toBe('third');
    expect(ordinalWord(10)).toBe('tenth');
  });
});
