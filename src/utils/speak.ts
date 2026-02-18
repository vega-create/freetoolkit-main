/**
 * FreeToolkit Speech Utility
 * Web Speech API wrapper for pronunciation
 */

export type SpeechLang = 'zh-TW' | 'zh-CN' | 'ja-JP';

interface SpeakOptions {
  lang?: SpeechLang;
  rate?: number; // 0.1 - 10, default 1
  pitch?: number; // 0 - 2, default 1
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * Check if speech synthesis is supported
 */
export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
}

/**
 * Speak text aloud
 */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (!isSpeechSupported()) {
    options.onError?.('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || 'zh-TW';
  utterance.rate = options.rate || 1;
  utterance.pitch = options.pitch || 1;

  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onError) utterance.onerror = (e) => options.onError?.(e.error);

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speak at slow speed (0.6x) for learning
 */
export function speakSlow(text: string, lang: SpeechLang = 'zh-TW'): void {
  speak(text, { lang, rate: 0.6 });
}

/**
 * Speak at normal speed
 */
export function speakNormal(text: string, lang: SpeechLang = 'zh-TW'): void {
  speak(text, { lang, rate: 1 });
}
