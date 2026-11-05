import { mixOf } from '../../../../../../lib/questions';
import beforeAfter from './before-after-between';
import comparing from './comparing-numbers';
import countOnBack from './count-on-and-back';
import countingObjects from './counting-objects';
import hundredChart from './hundred-chart';
import numberWords from './number-words';
import ordinalNumbers from './ordinal-numbers';
import skipCounting from './skip-counting';

// Review set with no lesson of its own. New sets added to these lessons join the mix automatically.
export default [
  mixOf('mixed', 'counting', 'Random counting', '🎲', [
    ...countOnBack,
    ...beforeAfter,
    ...skipCounting,
    ...countingObjects,
    ...numberWords,
    ...ordinalNumbers,
    ...hundredChart,
    ...comparing,
  ]),
];
