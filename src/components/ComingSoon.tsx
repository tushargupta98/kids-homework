import { Mascot } from './ui';

export function ComingSoon({ what = 'This page' }: { what?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[2rem] border-4 border-dashed border-ink/15 bg-white/70 px-6 py-10 text-center">
      <Mascot mood="sleepy" size={96}>
        {what}: coming soon!
      </Mascot>
      <p className="max-w-md text-lg text-ink-soft">Hoot is busy getting it ready. Check back later! 🛠️</p>
    </div>
  );
}
