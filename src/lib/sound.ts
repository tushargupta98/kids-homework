import { getSettings } from './settings';

/** Cheerful sounds synthesized with Web Audio — no audio files needed. */
let ctx: AudioContext | null = null;

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', gain = 0.15) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration);
}

function play(fn: () => void) {
  if (!getSettings().sound) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    fn();
  } catch {
    // Audio not supported.
  }
}

export const sounds = {
  correct: () => play(() => [523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle'))),
  oops: () => play(() => [330, 262].forEach((f, i) => tone(f, i * 0.12, 0.22, 'sine', 0.1))),
  tap: () => play(() => tone(880, 0, 0.06, 'sine', 0.05)),
  finish: () => play(() => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.35, 'triangle'))),
};
