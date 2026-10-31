import { Link } from 'react-router-dom';
import { BigButton, Mascot, Stars } from '../ui';

interface Props {
  correct: number;
  total: number;
  stars: number;
  color: string;
  showMascot: boolean;
  worksheetsHref: string;
  onAgain: () => void;
}

const messages = ['Good try! Practice makes perfect. 💪', 'Nice work! Keep going! 🌟', 'Great job! You are getting it! 🎉', 'WOW! Superstar! 🏆'];

export function ScoreSummary({ correct, total, stars, color, showMascot, worksheetsHref, onAgain }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-[2.5rem] border-4 border-ink/10 bg-gradient-to-b from-yellow-100 to-white px-5 py-8 text-center shadow-chunky">
      {showMascot ? <Mascot mood={stars >= 2 ? 'cheer' : 'happy'} size={110}>{messages[stars]}</Mascot> : <p className="font-display text-3xl">{messages[stars]}</p>}
      <Stars count={stars} size="text-6xl" />
      <p className="font-display text-3xl font-bold">
        {correct} out of {total} right on the first try!
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <BigButton color={color} onClick={onAgain}>
          🔁 Play again
        </BigButton>
        <Link to={worksheetsHref} className="inline-flex min-h-14 items-center rounded-full border-4 border-ink/15 bg-white px-6 font-display text-xl font-semibold shadow-chunky-sm">
          🖨️ Print a worksheet
        </Link>
      </div>
    </div>
  );
}
