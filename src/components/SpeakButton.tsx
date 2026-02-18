import { useState, useCallback } from 'react';

interface SpeakButtonProps {
  text: string;
  lang?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeed?: boolean;
  label?: string;
}

export default function SpeakButton({
  text,
  lang = 'zh-TW',
  size = 'md',
  showSpeed = false,
  label,
}: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal'>('normal');

  const speak = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support text-to-speech.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = speed === 'slow' ? 0.6 : 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [text, lang, speed]);

  const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-11 h-11 text-lg',
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        onClick={speak}
        className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-full transition-all ${
          isSpeaking
            ? 'bg-primary-500 text-white animate-pulse'
            : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
        }`}
        title={`Listen to pronunciation`}
        aria-label={`Play audio for ${label || text}`}
      >
        {isSpeaking ? '⏸' : '🔊'}
      </button>

      {showSpeed && (
        <button
          onClick={() => setSpeed(speed === 'normal' ? 'slow' : 'normal')}
          className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title={speed === 'normal' ? 'Switch to slow speed' : 'Switch to normal speed'}
        >
          {speed === 'normal' ? '🐇 Normal' : '🐢 Slow'}
        </button>
      )}
    </span>
  );
}
