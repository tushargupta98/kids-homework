import { mixOf } from '../../../../../../lib/questions';
import additionMore from './addition-more-than-20';
import additionWithin from './addition-within-20';
import subtractionMore from './subtraction-more-than-20';
import subtractionWithin from './subtraction-within-20';

// Review sets with no lesson of their own. New sets added to these lessons join the mix automatically.
const addition = [...additionWithin, ...additionMore];
const subtraction = [...subtractionWithin, ...subtractionMore];
const slug = 'mixed';

export default [
  mixOf(slug, 'addition', 'Random addition', '🎲', addition),
  mixOf(slug, 'subtraction', 'Random subtraction', '🎲', subtraction),
  mixOf(slug, 'both', 'Random addition & subtraction', '🔀', [...addition, ...subtraction]),
];
