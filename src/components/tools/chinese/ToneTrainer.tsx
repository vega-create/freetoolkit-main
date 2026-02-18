import { useState, useCallback } from 'react';

const TONE_QUESTIONS = [
  { char: '妈', pinyin: 'mā', tone: 1, meaning: 'mother', group: ['mā', 'má', 'mǎ', 'mà'] },
  { char: '麻', pinyin: 'má', tone: 2, meaning: 'hemp, numb', group: ['mā', 'má', 'mǎ', 'mà'] },
  { char: '马', pinyin: 'mǎ', tone: 3, meaning: 'horse', group: ['mā', 'má', 'mǎ', 'mà'] },
  { char: '骂', pinyin: 'mà', tone: 4, meaning: 'scold', group: ['mā', 'má', 'mǎ', 'mà'] },
  { char: '八', pinyin: 'bā', tone: 1, meaning: 'eight', group: ['bā', 'bá', 'bǎ', 'bà'] },
  { char: '拔', pinyin: 'bá', tone: 2, meaning: 'pull out', group: ['bā', 'bá', 'bǎ', 'bà'] },
  { char: '把', pinyin: 'bǎ', tone: 3, meaning: 'hold, handle', group: ['bā', 'bá', 'bǎ', 'bà'] },
  { char: '爸', pinyin: 'bà', tone: 4, meaning: 'father', group: ['bā', 'bá', 'bǎ', 'bà'] },
  { char: '书', pinyin: 'shū', tone: 1, meaning: 'book', group: ['shū', 'shú', 'shǔ', 'shù'] },
  { char: '熟', pinyin: 'shú', tone: 2, meaning: 'cooked, ripe', group: ['shū', 'shú', 'shǔ', 'shù'] },
  { char: '鼠', pinyin: 'shǔ', tone: 3, meaning: 'rat, mouse', group: ['shū', 'shú', 'shǔ', 'shù'] },
  { char: '树', pinyin: 'shù', tone: 4, meaning: 'tree', group: ['shū', 'shú', 'shǔ', 'shù'] },
  { char: '飞', pinyin: 'fēi', tone: 1, meaning: 'fly', group: ['fēi', 'féi', 'fěi', 'fèi'] },
  { char: '肥', pinyin: 'féi', tone: 2, meaning: 'fat', group: ['fēi', 'féi', 'fěi', 'fèi'] },
  { char: '匪', pinyin: 'fěi', tone: 3, meaning: 'bandit', group: ['fēi', 'féi', 'fěi', 'fèi'] },
  { char: '费', pinyin: 'fèi', tone: 4, meaning: 'fee, expense', group: ['fēi', 'féi', 'fěi', 'fèi'] },
  { char: '花', pinyin: 'huā', tone: 1, meaning: 'flower', group: ['huā', 'huá', 'huǎ', 'huà'] },
  { char: '华', pinyin: 'huá', tone: 2, meaning: 'splendid, China', group: ['huā', 'huá', 'huǎ', 'huà'] },
  { char: '画', pinyin: 'huà', tone: 4, meaning: 'draw, painting', group: ['huā', 'huá', 'huǎ', 'huà'] },
  { char: '汤', pinyin: 'tāng', tone: 1, meaning: 'soup', group: ['tāng', 'táng', 'tǎng', 'tàng'] },
  { char: '糖', pinyin: 'táng', tone: 2, meaning: 'sugar, candy', group: ['tāng', 'táng', 'tǎng', 'tàng'] },
  { char: '躺', pinyin: 'tǎng', tone: 3, meaning: 'lie down', group: ['tāng', 'táng', 'tǎng', 'tàng'] },
  { char: '烫', pinyin: 'tàng', tone: 4, meaning: 'hot (to touch)', group: ['tāng', 'táng', 'tǎng', 'tàng'] },
  { char: '猪', pinyin: 'zhū', tone: 1, meaning: 'pig', group: ['zhū', 'zhú', 'zhǔ', 'zhù'] },
  { char: '竹', pinyin: 'zhú', tone: 2, meaning: 'bamboo', group: ['zhū', 'zhú', 'zhǔ', 'zhù'] },
  { char: '主', pinyin: 'zhǔ', tone: 3, meaning: 'owner, main', group: ['zhū', 'zhú', 'zhǔ', 'zhù'] },
  { char: '住', pinyin: 'zhù', tone: 4, meaning: 'live, stay', group: ['zhū', 'zhú', 'zhǔ', 'zhù'] },
];

const TONE_NAMES = ['', '1st (flat)', '2nd (rising)', '3rd (dipping)', '4th (falling)'];
const TONE_SYMBOLS = ['', '¯', 'ˊ', 'ˇ', 'ˋ'];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 0.7;
  window.speechSynthesis.speak(u);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ToneTrainer() {
  const [questions, setQuestions] = useState(() => shuffle(TONE_QUESTIONS).slice(0, 10));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const current = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const isCorrect = selected === current?.tone;

  const handleSelect = (tone: number) => {
    if (selected !== null) return;
    setSelected(tone);
    const correct = tone === current.tone;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, correct]);
    speak(current.char);
  };

  const handleNext = () => {
    if (isLast) {
      setShowResult(true);
      // Save score
      try {
        const data = JSON.parse(localStorage.getItem('ftk-chinese') || '{}');
        if (!data.quizScores) data.quizScores = {};
        const pct = Math.round(((score + (selected === current.tone ? 1 : 0)) / questions.length) * 100);
        const prev = data.quizScores.toneTrainer || { best: 0, last: 0, attempts: 0 };
        data.quizScores.toneTrainer = { best: Math.max(prev.best, pct), last: pct, attempts: prev.attempts + 1 };
        localStorage.setItem('ftk-chinese', JSON.stringify(data));
      } catch {}
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setQuestions(shuffle(TONE_QUESTIONS).slice(0, 10));
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setAnswers([]);
  };

  if (showResult) {
    const finalScore = score;
    const pct = Math.round((finalScore / questions.length) * 100);
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-6xl">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <div className="text-4xl font-bold text-blue-600">{finalScore} / {questions.length}</div>
        <p className="text-gray-500">{pct}% correct</p>
        <p className="text-gray-500">
          {pct >= 90 ? 'Excellent! You have a great ear for tones!' : pct >= 70 ? 'Good job! Keep practicing!' : 'Tones are tricky — keep at it!'}
        </p>
        <button onClick={restart} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Question {currentIdx + 1} of {questions.length}</span>
        <span>Score: {score}/{currentIdx + (selected !== null ? 1 : 0)}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((currentIdx + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="text-center py-6">
        <p className="text-sm text-gray-500 mb-4">Listen and identify the tone:</p>
        <div className="text-7xl font-bold mb-4 cursor-pointer hover:text-blue-600" onClick={() => speak(current.char)}>
          {current.char}
        </div>
        <button onClick={() => speak(current.char)} className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 text-lg">
          🔊 Play Sound
        </button>
      </div>

      {/* Tone Choices */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(tone => {
          let btnClass = 'border-gray-200 bg-white hover:bg-gray-50';
          if (selected !== null) {
            if (tone === current.tone) btnClass = 'border-green-500 bg-green-50';
            else if (tone === selected) btnClass = 'border-red-500 bg-red-50';
          }
          return (
            <button
              key={tone}
              onClick={() => handleSelect(tone)}
              disabled={selected !== null}
              className={`p-4 rounded-xl border-2 transition-all ${btnClass}`}
            >
              <div className="text-2xl font-bold">{TONE_SYMBOLS[tone]}</div>
              <div className="text-sm text-gray-600">{TONE_NAMES[tone]}</div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selected !== null && (
        <div className={`p-4 rounded-lg text-center ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="font-bold text-lg">{isCorrect ? '✅ Correct!' : `❌ It's ${TONE_NAMES[current.tone]}`}</p>
          <p className="text-sm text-gray-600 mt-1">{current.pinyin} — {current.meaning}</p>
          <button onClick={handleNext} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {isLast ? 'See Results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}
