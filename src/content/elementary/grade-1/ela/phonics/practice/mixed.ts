import { mixOf } from '../../../../../../lib/questions';
import type { QuestionBank } from '../../../../../../types/practice';
import { patternSets } from '../../../../../../lib/phonicsPatterns';
import wordFamilies from './word-families';

const sets = (...slugs: string[]) => slugs.flatMap(patternSets);
const shortVowels = sets('short-a', 'short-i', 'short-o', 'short-u', 'short-e');
// Digraph review: two letters that make one sound.
const digraphs = sets('ck', 'sh', 'th', 'ch', 'ng', 'nk');
const doubles = sets('ff-ll-ss-zz', 'all-oll-ull');

// Review sets with no lesson of their own. Card decks are left out of mixes automatically.
// Language Arts is tap and flip only, so Practice skips write-in questions (worksheets keep them).
const noTyping = (bank: QuestionBank): QuestionBank => ({ ...bank, noTyping: true });

export default [
  noTyping(mixOf('mixed', 'short-vowels', 'Random short vowels', '🎲', shortVowels)),
  noTyping(mixOf('mixed', 'digraphs', 'Random digraphs (ck, sh, th, ch, ng, nk)', '🎲', digraphs)),
  noTyping(mixOf('mixed', 'phonics', 'Random phonics', '🔀', [...wordFamilies, ...shortVowels, ...doubles, ...digraphs])),
];
