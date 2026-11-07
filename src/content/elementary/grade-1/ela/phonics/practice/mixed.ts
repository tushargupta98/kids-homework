import { mixOf } from '../../../../../../lib/questions';
import { patternSets } from '../../../../../../lib/phonicsPatterns';
import wordFamilies from './word-families';

const sets = (...slugs: string[]) => slugs.flatMap(patternSets);
const shortVowels = sets('short-a', 'short-i', 'short-o', 'short-u', 'short-e');
// Digraph review: two letters that make one sound.
const digraphs = sets('ck', 'sh', 'th', 'ch', 'ng', 'nk');
const doubles = sets('ff-ll-ss-zz', 'all-oll-ull');

// Review sets with no lesson of their own. Card decks are left out of mixes automatically.
export default [
  mixOf('mixed', 'short-vowels', 'Random short vowels', '🎲', shortVowels),
  mixOf('mixed', 'digraphs', 'Random digraphs (ck, sh, th, ch, ng, nk)', '🎲', digraphs),
  mixOf('mixed', 'phonics', 'Random phonics', '🔀', [...wordFamilies, ...shortVowels, ...doubles, ...digraphs]),
];
