import { mixOf } from '../../../../../../lib/questions';
import type { QuestionBank } from '../../../../../../types/practice';
import pictureWords from './picture-words';
import wordMeanings from './word-meanings';
import wordsInSentences from './words-in-sentences';

// Language Arts is tap and flip only, so Practice skips write-in questions (worksheets keep them).
const noTyping = (bank: QuestionBank): QuestionBank => ({ ...bank, noTyping: true });

// Review set with no lesson of its own. New vocabulary sets join the mix automatically.
export default [noTyping(mixOf('mixed', 'vocabulary', 'Random vocabulary', '🎲', [...wordMeanings, ...wordsInSentences, ...pictureWords]))];
