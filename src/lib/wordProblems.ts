import { pick } from './random';
import type { FillInQuestion } from '../types/practice';

// Names are used in place of he/she so every story reads naturally for any child.
const names = ['Sam', 'Rob', 'Maya', 'Leo', 'Aisha', 'Ken', 'Priya', 'Omar', 'Zoe', 'Ben', 'Lily', 'Ravi'];
const things = ['apples', 'stickers', 'crayons', 'marbles', 'books', 'cookies', 'balloons', 'shells', 'toy cars', 'pencils'];

const twoNames = () => {
  const a = pick(names);
  return [a, pick(names.filter((n) => n !== a))];
};

const addStories: ((a: number, b: number) => string)[] = [
  (a, b) => {
    const [p, q] = twoNames();
    const t = pick(things);
    return `${p} had ${a} ${t}. ${q} gave ${p} ${b} more ${t}. How many ${t} does ${p} have now?`;
  },
  (a, b) => {
    const [p, q] = twoNames();
    const t = pick(things);
    return `${p} has ${a} ${t}. ${q} has ${b} ${t}. How many ${t} do they have in all?`;
  },
  (a, b) => {
    const p = pick(names);
    const t = pick(things);
    return `There are ${a} ${t} in a box. ${p} puts in ${b} more. How many ${t} are in the box now?`;
  },
  (a, b) => {
    const p = pick(names);
    const t = pick(things);
    return `${p} found ${a} ${t} in the morning and ${b} ${t} after lunch. How many ${t} did ${p} find altogether?`;
  },
];

/** A story problem whose answer is a + b, e.g. "Sam had 10 apples. Rob gave Sam 5 more apples. …" */
export function additionStory(a: number, b: number, hint = `Put the two groups together: ${a} + ${b}.`): FillInQuestion {
  return { type: 'fill-in', prompt: pick(addStories)(a, b), answer: a + b, hint };
}

const subtractStories: ((a: number, b: number) => string)[] = [
  (a, b) => {
    const [p, q] = twoNames();
    const t = pick(things);
    return `${p} had ${a} ${t}. ${p} gave ${b} ${t} to ${q}. How many ${t} does ${p} have now?`;
  },
  (a, b) => {
    const p = pick(names);
    const t = pick(things);
    return `There are ${a} ${t} in a box. ${p} takes out ${b}. How many ${t} are left in the box?`;
  },
  (a, b) => {
    const p = pick(names);
    const t = pick(things);
    return `${p} had ${a} ${t} and lost ${b} of them. How many ${t} does ${p} have left?`;
  },
  (a, b) => {
    const [p, q] = twoNames();
    const t = pick(things);
    return `${p} has ${a} ${t}. ${q} has ${b} ${t}. How many more ${t} does ${p} have than ${q}?`;
  },
];

/** A story problem whose answer is a − b, e.g. "Sam had 10 apples. Sam gave 3 apples to Rob. …" */
export function subtractionStory(a: number, b: number, hint = `Take away: ${a} − ${b}.`): FillInQuestion {
  return { type: 'fill-in', prompt: pick(subtractStories)(a, b), answer: a - b, hint };
}
