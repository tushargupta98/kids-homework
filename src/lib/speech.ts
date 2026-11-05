import { getSettings } from './settings';

/** Read text aloud with the browser's built-in voice (works in iOS Safari). */
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Short words that voices say in their quick, unstressed form when alone ("can" → "cn").
 * Spelled the way they sound so the vowel comes through clearly.
 */
const SAY_CLEARLY: Record<string, string> = {
  can: 'kann',
  an: 'ann',
  at: 'att',
  and: 'annd',
  ran: 'rann',
  man: 'mann',
  fan: 'fann',
  pan: 'pann',
  van: 'vann',
  tan: 'tann',
  but: 'butt',
  get: 'gett',
  let: 'lett',
  bet: 'bett',
  not: 'naht',
  hut: 'hutt',
  us: 'uss',
};

/** Voices that sound most natural, best first. Downloaded "Enhanced"/"Premium" voices win when present. */
const PREFERRED = [/premium/i, /enhanced/i, /natural/i, /neural/i, /^samantha/i, /^google us english/i, /^ava/i, /^allison/i];

/** English voices this browser offers, US first. They can arrive late, so call again on "voiceschanged". */
export function englishVoices(): SpeechSynthesisVoice[] {
  if (!canSpeak()) return [];
  const english = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
  const us = (v: SpeechSynthesisVoice) => (v.lang.replace('_', '-').toLowerCase() === 'en-us' ? 0 : 1);
  return english.sort((a, b) => us(a) - us(b) || a.name.localeCompare(b.name));
}

/** The voice picked in settings, or else the most natural-sounding US voice. */
function currentVoice(): SpeechSynthesisVoice | undefined {
  const voices = englishVoices();
  const chosen = getSettings().voice;
  const us = voices.filter((v) => v.lang.replace('_', '-').toLowerCase() === 'en-us');
  return (
    (chosen ? voices.find((v) => v.name === chosen) : undefined) ??
    PREFERRED.map((re) => us.find((v) => re.test(v.name))).find(Boolean) ??
    us.find((v) => v.localService) ??
    us[0]
  );
}

/** Say one word on its own, slowly and with its full vowel, e.g. a word-family card. */
export function speakWord(word: string) {
  speak(SAY_CLEARLY[word.toLowerCase()] ?? word, 0.7);
}

export function speak(text: string, rate = 0.85) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const spoken = text
    .replace(/[\p{Extended_Pictographic}]/gu, '')
    // A missing first letter: "?et" → "what letter, et".
    .replace(/(^|\s)\?(?=[a-z])/g, '$1what letter, ')
    // A "?" standing alone is a blank in a math problem: "? + 5 = 10" → "what number + 5 = 10".
    .replace(/(^|\s)\?(?=[\s,.]|$)/g, '$1what number')
    // Voices may read a lone "-" as "dash".
    .replace(/\s[-−]\s/g, ' minus ')
    // Comparison signs, and the ◯ where the sign goes.
    .replace(/\s>\s/g, ' is greater than ')
    .replace(/\s<\s/g, ' is less than ')
    .replace(/◯/g, 'what sign');
  const u = new SpeechSynthesisUtterance(spoken);
  const voice = currentVoice();
  if (voice) u.voice = voice;
  u.rate = rate;
  u.pitch = 1.1;
  u.lang = 'en-US';
  window.speechSynthesis.speak(u);
}

export const stopSpeaking = () => canSpeak() && window.speechSynthesis.cancel();
