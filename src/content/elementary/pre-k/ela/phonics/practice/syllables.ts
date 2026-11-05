import { SYLLABLE_WORDS } from '../../../../../../lib/phonics';
import { setOf } from '../../../../../../lib/questions';
import { pick } from '../../../../../../lib/random';
import type { Question } from '../../../../../../types/practice';

function claps(): Question {
  const w = pick(SYLLABLE_WORDS);
  return { type: 'multiple-choice', visual: w.emoji, prompt: `Clap it out: ${w.word}. How many claps?`, choices: ['1', '2', '3', '4'], answer: String(w.claps), hint: 'Put your hand under your chin. Each time your chin drops, that is one clap!' };
}

export default [setOf('syllables', 'claps', 'Clap the word', '👏', claps)];
