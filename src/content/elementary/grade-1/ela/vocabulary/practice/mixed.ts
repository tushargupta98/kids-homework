import { mixOf } from '../../../../../../lib/questions';
import pictureWords from './picture-words';
import wordMeanings from './word-meanings';
import wordsInSentences from './words-in-sentences';

// Review set with no lesson of its own. New vocabulary sets join the mix automatically.
export default [mixOf('mixed', 'vocabulary', 'Random vocabulary', '🎲', [...wordMeanings, ...wordsInSentences, ...pictureWords])];
