import { useState } from 'react';

type HSKLevel = 1 | 2 | 3;

interface Question {
  char: string;
  correct: string;
  options: string[];
  meaning: string;
  hsk: HSKLevel;
}

const VOCAB: { char: string; pinyin: string; meaning: string; hsk: HSKLevel }[] = [
  // HSK 1
  { char: '你', pinyin: 'nǐ', meaning: 'you', hsk: 1 },
  { char: '好', pinyin: 'hǎo', meaning: 'good', hsk: 1 },
  { char: '大', pinyin: 'dà', meaning: 'big', hsk: 1 },
  { char: '小', pinyin: 'xiǎo', meaning: 'small', hsk: 1 },
  { char: '人', pinyin: 'rén', meaning: 'person', hsk: 1 },
  { char: '天', pinyin: 'tiān', meaning: 'day, sky', hsk: 1 },
  { char: '水', pinyin: 'shuǐ', meaning: 'water', hsk: 1 },
  { char: '学', pinyin: 'xué', meaning: 'study', hsk: 1 },
  { char: '中', pinyin: 'zhōng', meaning: 'middle', hsk: 1 },
  { char: '国', pinyin: 'guó', meaning: 'country', hsk: 1 },
  { char: '来', pinyin: 'lái', meaning: 'come', hsk: 1 },
  { char: '去', pinyin: 'qù', meaning: 'go', hsk: 1 },
  { char: '吃', pinyin: 'chī', meaning: 'eat', hsk: 1 },
  { char: '喝', pinyin: 'hē', meaning: 'drink', hsk: 1 },
  { char: '看', pinyin: 'kàn', meaning: 'look', hsk: 1 },
  { char: '听', pinyin: 'tīng', meaning: 'listen', hsk: 1 },
  { char: '说', pinyin: 'shuō', meaning: 'speak', hsk: 1 },
  { char: '读', pinyin: 'dú', meaning: 'read', hsk: 1 },
  { char: '写', pinyin: 'xiě', meaning: 'write', hsk: 1 },
  { char: '住', pinyin: 'zhù', meaning: 'live', hsk: 1 },
  // HSK 2
  { char: '快', pinyin: 'kuài', meaning: 'fast', hsk: 2 },
  { char: '慢', pinyin: 'màn', meaning: 'slow', hsk: 2 },
  { char: '新', pinyin: 'xīn', meaning: 'new', hsk: 2 },
  { char: '长', pinyin: 'cháng', meaning: 'long', hsk: 2 },
  { char: '高', pinyin: 'gāo', meaning: 'tall', hsk: 2 },
  { char: '白', pinyin: 'bái', meaning: 'white', hsk: 2 },
  { char: '黑', pinyin: 'hēi', meaning: 'black', hsk: 2 },
  { char: '红', pinyin: 'hóng', meaning: 'red', hsk: 2 },
  { char: '跑', pinyin: 'pǎo', meaning: 'run', hsk: 2 },
  { char: '走', pinyin: 'zǒu', meaning: 'walk', hsk: 2 },
  { char: '唱', pinyin: 'chàng', meaning: 'sing', hsk: 2 },
  { char: '笑', pinyin: 'xiào', meaning: 'laugh', hsk: 2 },
  { char: '哭', pinyin: 'kū', meaning: 'cry', hsk: 2 },
  { char: '穿', pinyin: 'chuān', meaning: 'wear', hsk: 2 },
  { char: '问', pinyin: 'wèn', meaning: 'ask', hsk: 2 },
  // HSK 3
  { char: '决', pinyin: 'jué', meaning: 'decide', hsk: 3 },
  { char: '像', pinyin: 'xiàng', meaning: 'resemble', hsk: 3 },
  { char: '概', pinyin: 'gài', meaning: 'general', hsk: 3 },
  { char: '环', pinyin: 'huán', meaning: 'ring, loop', hsk: 3 },
  { char: '境', pinyin: 'jìng', meaning: 'territory', hsk: 3 },
  { char: '健', pinyin: 'jiàn', meaning: 'healthy', hsk: 3 },
  { char: '康', pinyin: 'kāng', meaning: 'well-being', hsk: 3 },
  { char: '影', pinyin: 'yǐng', meaning: 'shadow, movie', hsk: 3 },
  { char: '越', pinyin: 'yuè', meaning: 'exceed', hsk: 3 },
  { char: '极', pinyin: 'jí', meaning: 'extreme', hsk: 3 },
  { char: '聪', pinyin: 'cōng', meaning: 'clever', hsk: 3 },
  { char: '努', pinyin: 'nǔ', meaning: 'strive', hsk: 3 },
  { char: '认', pinyin: 'rèn', meaning: 'recognize', hsk: 3 },
  { char: '真', pinyin: 'zhēn', meaning: 'real, true', hsk: 3 },
  { char: '感', pinyin: 'gǎn', meaning: 'feel', hsk: 3 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(level: HSKLevel, count: number = 10): Question[] {
  const pool = VOCAB.filter(v => v.hsk <= level);
  const selected = shuffle(pool).slice(0, count);
  return selected.map(item => {
    const distractors = shuffle(pool.filter(v => v.pinyin !== item.pinyin))
      .slice(0, 3)
      .map(v => v.pinyin);
    return {
      char: item.char,
      correct: item.pinyin,
      options: shuffle([item.pinyin, ...distractors]),
      meaning: item.meaning,
      hsk: item.hsk,
    };
  });
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function PinyinQuiz() {
  const [level, setLevel] = useState<HSKLevel | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const startQuiz = (l: HSKLevel) => {
    setLevel(l);
    setQuestions(generateQuestions(l, 10));
    setIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === questions[idx].correct) setScore(s => s + 1);
    speak(questions[idx].char);
  };

  const next = () => {
    if (idx === questions.length - 1) {
      setDone(true);
      try {
        const data = JSON.parse(localStorage.getItem('ftk-chinese') || '{}');
        if (!data.quizScores) data.quizScores = {};
        const pct = Math.round(((score + (selected === questions[idx].correct ? 0 : 0)) / questions.length) * 100);
        const key = `pinyinQuizHSK${level}`;
        const prev = data.quizScores[key] || { best: 0, last: 0, attempts: 0 };
        data.quizScores[key] = { best: Math.max(prev.best, pct), last: pct, attempts: prev.attempts + 1 };
        localStorage.setItem('ftk-chinese', JSON.stringify(data));
      } catch {}
    } else {
      setIdx(i => i + 1);
      setSelected(null);
    }
  };

  // Level selection
  if (level === null) {
    return (
      <div className="space-y-6 text-center py-8">
        <h2 className="text-xl font-bold">Choose Your Level</h2>
        <p className="text-gray-500">Select an HSK level to start the quiz</p>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {([1, 2, 3] as HSKLevel[]).map(l => (
            <button
              key={l}
              onClick={() => startQuiz(l)}
              className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="text-2xl font-bold">HSK {l}</div>
              <div className="text-xs text-gray-500 mt-1">
                {l === 1 ? 'Beginner' : l === 2 ? 'Elementary' : 'Intermediate'}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Results
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 60 ? '👏' : '💪'}</div>
        <h2 className="text-2xl font-bold">HSK {level} Quiz Complete!</h2>
        <div className="text-4xl font-bold text-blue-600">{score} / {questions.length}</div>
        <p className="text-gray-500">{pct}% correct</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => startQuiz(level)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">🔄 Retry</button>
          <button onClick={() => setLevel(null)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Change Level</button>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const isCorrect = selected === q.correct;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>HSK {level} · Q{idx + 1}/{questions.length}</span>
        <span>Score: {score}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((idx + (selected ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      <div className="text-center py-6">
        <p className="text-sm text-gray-500 mb-3">What is the pinyin for:</p>
        <div className="text-7xl font-bold mb-2 cursor-pointer hover:text-blue-600" onClick={() => speak(q.char)}>{q.char}</div>
        <button onClick={() => speak(q.char)} className="text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">🔊 Listen</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map(opt => {
          let cls = 'border-gray-200 bg-white hover:bg-gray-50';
          if (selected) {
            if (opt === q.correct) cls = 'border-green-500 bg-green-50';
            else if (opt === selected) cls = 'border-red-500 bg-red-50';
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected} className={`p-4 rounded-xl border-2 text-lg font-medium transition-all ${cls}`}>
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={`p-4 rounded-lg text-center ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className="font-bold">{isCorrect ? '✅ Correct!' : `❌ Answer: ${q.correct}`}</p>
          <p className="text-sm text-gray-600">{q.char} ({q.correct}) — {q.meaning}</p>
          <button onClick={next} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {idx === questions.length - 1 ? 'See Results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}
