import { setOf } from '../../../../../../lib/questions';
import { pick, randInt, shuffle } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

const things: [string, string][] = [
  ['🍎', 'apples'],
  ['🍐', 'pears'],
  ['⭐', 'stars'],
  ['🐟', 'fish'],
  ['🎈', 'balloons'],
  ['🐞', 'ladybugs'],
];

/** Emoji in groups of 5 so they're easier to count. */
const fives = (emoji: string, n: number) =>
  Array.from({ length: Math.ceil(n / 5) }, (_, i) => emoji.repeat(Math.min(5, n - i * 5))).join(' ');

function howMany(): Question {
  const n = randInt(5, 20);
  const [emoji, name] = pick(things);
  return { type: 'fill-in', visual: fives(emoji, n), prompt: `How many ${name}?`, answer: n, hint: 'Count the groups of 5 first: 5, 10, 15… then count on.' };
}

function bundles(): Question {
  const tens = randInt(1, 9);
  const ones = randInt(0, 9);
  return {
    type: 'fill-in',
    visual: `${'📦'.repeat(tens)} ${'✏️'.repeat(ones)}`.trim(),
    prompt: 'Each 📦 has 10 pencils. Each ✏️ is 1 pencil. How many pencils in all?',
    answer: tens * 10 + ones,
    hint: `Count the boxes by 10s, then count on the single pencils.`,
  };
}

/** Two different groups of things, with different counts. */
function twoGroups() {
  const [[e1, n1], [e2, n2]] = shuffle(things).slice(0, 2);
  const a = randInt(2, 10);
  let b = randInt(2, 10);
  while (b === a) b = randInt(2, 10);
  return { a, b, e1, n1, e2, n2, visual: `${e1.repeat(a)}  |  ${e2.repeat(b)}` };
}

function moreOrFewer(): Question {
  const { a, b, e1, n1, e2, n2, visual } = twoGroups();
  const askMore = Math.random() < 0.5;
  const first = `${n1} ${e1}`;
  const second = `${n2} ${e2}`;
  const answer = (a > b) === askMore ? first : second;
  return {
    type: 'multiple-choice',
    visual,
    prompt: `Are there ${askMore ? 'more' : 'fewer'} ${n1} or ${n2}?`,
    choices: [first, second],
    answer,
    hint: 'Count each group, or match them up one to one.',
  };
}

function howManyMore(): Question {
  const { a, b, e1, n1, e2, n2 } = twoGroups();
  const [big, small] = a > b ? [[a, e1, n1], [b, e2, n2]] as const : [[b, e2, n2], [a, e1, n1]] as const;
  return {
    type: 'fill-in',
    visual: `${big[1].repeat(big[0])}  |  ${small[1].repeat(small[0])}`,
    prompt: `How many more ${big[2]} than ${small[2]}?`,
    answer: big[0] - small[0],
    hint: `Match them up. How many ${big[2]} have no partner?`,
  };
}

const slug = 'counting-objects';

export default [
  setOf(slug, 'how-many', 'How many?', '🍎', howMany),
  setOf(slug, 'bundles', 'Count tens and ones', '📦', bundles),
  setOf(slug, 'more-fewer', 'More or fewer?', '⚖️', moreOrFewer),
  setOf(slug, 'how-many-more', 'How many more?', '➕', howManyMore),
];
