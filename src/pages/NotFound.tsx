import { Link } from 'react-router-dom';
import { Mascot } from '../components/ui';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <Mascot mood="thinking" size={120}>
        Hoo-hoo? I can't find that page!
      </Mascot>
      <Link to="/" className="rounded-full border-4 border-ink/10 bg-sky-600 px-8 py-3 font-display text-xl font-semibold text-white shadow-chunky-sm">
        🏠 Go home
      </Link>
    </div>
  );
}
