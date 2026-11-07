import { mixOf } from '../../../../../../lib/questions';
import type { QuestionBank } from '../../../../../../types/practice';
import abcOrder from './abc-order';
import letterSounds from './letter-sounds';
import lowercase from './lowercase-letters';
import rhyming from './rhyming-words';
import syllables from './syllables';
import uppercase from './uppercase-letters';
import wordFamilies from './word-families';

// Review sets with no lesson of their own. New sets added to these lessons join the mix automatically.
// Language Arts is tap and flip only, so Practice skips write-in questions (worksheets keep them).
const noTyping = (bank: QuestionBank): QuestionBank => ({ ...bank, noTyping: true });

export default [
  noTyping(mixOf('mixed', 'letters', 'Random letters', '🎲', [...uppercase, ...lowercase, ...abcOrder])),
  noTyping(mixOf('mixed', 'sounds', 'Random sounds', '🎲', [...letterSounds, ...rhyming, ...syllables, ...wordFamilies])),
  noTyping(mixOf('mixed', 'all', 'Random alphabet & phonics', '🔀', [...uppercase, ...lowercase, ...abcOrder, ...letterSounds, ...rhyming, ...syllables, ...wordFamilies])),
];
