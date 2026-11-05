import { mixOf } from '../../../../../../lib/questions';
import abcOrder from './abc-order';
import letterSounds from './letter-sounds';
import lowercase from './lowercase-letters';
import rhyming from './rhyming-words';
import syllables from './syllables';
import uppercase from './uppercase-letters';
import wordFamilies from './word-families';

// Review sets with no lesson of their own. New sets added to these lessons join the mix automatically.
export default [
  mixOf('mixed', 'letters', 'Random letters', '🎲', [...uppercase, ...lowercase, ...abcOrder]),
  mixOf('mixed', 'sounds', 'Random sounds', '🎲', [...letterSounds, ...rhyming, ...syllables, ...wordFamilies]),
  mixOf('mixed', 'all', 'Random alphabet & phonics', '🔀', [...uppercase, ...lowercase, ...abcOrder, ...letterSounds, ...rhyming, ...syllables, ...wordFamilies]),
];
