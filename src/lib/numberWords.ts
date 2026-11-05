const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** 0–999 in words, e.g. 47 → "forty-seven", 115 → "one hundred fifteen". */
export function numberToWords(n: number): string {
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? `-${ones[n % 10]}` : '');
  const rest = n % 100;
  return `${ones[Math.floor(n / 100)]} hundred${rest ? ` ${numberToWords(rest)}` : ''}`;
}

const ordinalWords = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

/** 1–10 as an ordinal word: 3 → "third". */
export const ordinalWord = (n: number) => ordinalWords[n];

/** Short ordinal: 1 → "1st", 2 → "2nd", 3 → "3rd", 4 → "4th", 11 → "11th". */
export function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th';
  return `${n}${suffix}`;
}
