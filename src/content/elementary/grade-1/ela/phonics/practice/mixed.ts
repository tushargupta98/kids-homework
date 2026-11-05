import { mixOf } from '../../../../../../lib/questions';
import wordFamilies from './word-families';

// Review set with no lesson of its own. New phonics lessons can join this mix.
export default [mixOf('mixed', 'phonics', 'Random phonics', '🎲', [...wordFamilies])];
