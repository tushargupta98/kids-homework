import confetti from 'canvas-confetti';

export function burst(big = false) {
  void confetti({
    particleCount: big ? 160 : 60,
    spread: big ? 100 : 70,
    startVelocity: big ? 45 : 32,
    origin: { y: 0.7 },
    scalar: 1.1,
    disableForReducedMotion: true,
  });
}
