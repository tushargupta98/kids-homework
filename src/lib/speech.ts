/** Read text aloud with the browser's built-in voice (works in iOS Safari). */
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speak(text: string) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[\p{Extended_Pictographic}]/gu, ''));
  u.rate = 0.85;
  u.pitch = 1.1;
  u.lang = 'en-US';
  window.speechSynthesis.speak(u);
}

export const stopSpeaking = () => canSpeak() && window.speechSynthesis.cancel();
