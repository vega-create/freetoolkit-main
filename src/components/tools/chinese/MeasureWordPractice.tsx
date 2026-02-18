import { useState } from 'react';

interface MWQuestion {
  noun: string;
  nounPinyin: string;
  meaning: string;
  correct: string;
  correctPinyin: string;
  options: string[];
}

const MEASURE_WORDS = [
  { mw: '个', pinyin: 'gè', use: 'General/default measure word', nouns: [
    { noun: '人', nounPinyin: 'rén', meaning: 'person' },
    { noun: '苹果', nounPinyin: 'píngguǒ', meaning: 'apple' },
    { noun: '朋友', nounPinyin: 'péngyǒu', meaning: 'friend' },
  ]},
  { mw: '本', pinyin: 'běn', use: 'Books, magazines', nouns: [
    { noun: '书', nounPinyin: 'shū', meaning: 'book' },
    { noun: '杂志', nounPinyin: 'zázhì', meaning: 'magazine' },
    { noun: '词典', nounPinyin: 'cídiǎn', meaning: 'dictionary' },
  ]},
  { mw: '杯', pinyin: 'bēi', use: 'Cups/glasses of liquid', nouns: [
    { noun: '水', nounPinyin: 'shuǐ', meaning: 'water' },
    { noun: '茶', nounPinyin: 'chá', meaning: 'tea' },
    { noun: '咖啡', nounPinyin: 'kāfēi', meaning: 'coffee' },
  ]},
  { mw: '只', pinyin: 'zhī', use: 'Animals (small)', nouns: [
    { noun: '猫', nounPinyin: 'māo', meaning: 'cat' },
    { noun: '鸟', nounPinyin: 'niǎo', meaning: 'bird' },
    { noun: '兔子', nounPinyin: 'tùzi', meaning: 'rabbit' },
  ]},
  { mw: '条', pinyin: 'tiáo', use: 'Long, thin things; fish; roads', nouns: [
    { noun: '鱼', nounPinyin: 'yú', meaning: 'fish' },
    { noun: '路', nounPinyin: 'lù', meaning: 'road' },
    { noun: '裤子', nounPinyin: 'kùzi', meaning: 'pants' },
  ]},
  { mw: '张', pinyin: 'zhāng', use: 'Flat things: paper, tables, photos', nouns: [
    { noun: '纸', nounPinyin: 'zhǐ', meaning: 'paper' },
    { noun: '桌子', nounPinyin: 'zhuōzi', meaning: 'table' },
    { noun: '照片', nounPinyin: 'zhàopiàn', meaning: 'photo' },
  ]},
  { mw: '件', pinyin: 'jiàn', use: 'Clothing (upper body); matters', nouns: [
    { noun: '衣服', nounPinyin: 'yīfu', meaning: 'clothes' },
    { noun: '事', nounPinyin: 'shì', meaning: 'matter' },
    { noun: '礼物', nounPinyin: 'lǐwù', meaning: 'gift' },
  ]},
  { mw: '辆', pinyin: 'liàng', use: 'Vehicles', nouns: [
    { noun: '车', nounPinyin: 'chē', meaning: 'car' },
    { noun: '自行车', nounPinyin: 'zìxíngchē', meaning: 'bicycle' },
  ]},
  { mw: '双', pinyin: 'shuāng', use: 'Pairs', nouns: [
    { noun: '鞋', nounPinyin: 'xié', meaning: 'shoes' },
    { noun: '筷子', nounPinyin: 'kuàizi', meaning: 'chopsticks' },
    { noun: '眼睛', nounPinyin: 'yǎnjīng', meaning: 'eyes' },
  ]},
  { mw: '瓶', pinyin: 'píng', use: 'Bottles', nouns: [
    { noun: '水', nounPinyin: 'shuǐ', meaning: 'water' },
    { noun: '啤酒', nounPinyin: 'píjiǔ', meaning: 'beer' },
  ]},
  { mw: '块', pinyin: 'kuài', use: 'Pieces, chunks; money (colloquial)', nouns: [
    { noun: '蛋糕', nounPinyin: 'dàngāo', meaning: 'cake' },
    { noun: '钱', nounPinyin: 'qián', meaning: 'money' },
  ]},
  { mw: '位', pinyin: 'wèi', use: 'People (polite)', nouns: [
    { noun: '老师', nounPinyin: 'lǎoshī', meaning: 'teacher' },
    { noun: '客人', nounPinyin: 'kèrén', meaning: 'guest' },
  ]},
];

const ALL_MW = MEASURE_WORDS.map(m => m.mw);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(count: number = 10): MWQuestion[] {
  const pool: MWQuestion[] = [];
  for (const mw of MEASURE_WORDS) {
    for (const noun of mw.nouns) {
      const distractors = shuffle(ALL_MW.filter(m => m !== mw.mw)).slice(0, 3);
      pool.push({
        noun: noun.noun,
        nounPinyin: noun.nounPinyin,
        meaning: noun.meaning,
        correct: mw.mw,
        correctPinyin: mw.pinyin,
        options: shuffle([mw.mw, ...distractors]),
      });
    }
  }
  return shuffle(pool).slice(0, count);
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function MeasureWordPractice() {
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [questions, setQuestions] = useState<MWQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const startQuiz = () => {
    setMode('quiz');
    setQuestions(generateQuestions(10));
    setIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  const handleAnswer = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    const q = questions[idx];
    if (opt === q.correct) setScore(s => s + 1);
    speak(`一${q.correct}${q.noun}`);
  };

  const next = () => {
    if (idx === questions.length - 1) {
      setDone(true);
      try {
        const data = JSON.parse(localStorage.getItem('ftk-chinese') || '{}');
        if (!data.quizScores) data.quizScores = {};
        const pct = Math.round((score / questions.length) * 100);
        const prev = data.quizScores.measureWord || { best: 0, last: 0, attempts: 0 };
        data.quizScores.measureWord = { best: Math.max(prev.best, pct), last: pct, attempts: prev.attempts + 1 };
        localStorage.setItem('ftk-chinese', JSON.stringify(data));
      } catch {}
    } else {
      setIdx(i => i + 1);
      setSelected(null);
    }
  };

  // Learn mode
  if (mode === 'learn') {
    return (
      <div className="space-y-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold mb-2">📖 Chinese Measure Words</h2>
          <p className="text-gray-500 text-sm">Learn which measure word goes with which noun, then test yourself!</p>
        </div>

        <div className="space-y-3">
          {MEASURE_WORDS.map(mw => (
            <div key={mw.mw} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => speak(mw.mw)} className="text-2xl font-bold cursor-pointer hover:text-blue-600">{mw.mw}</button>
                <span className="text-blue-600">{mw.pinyin}</span>
                <span className="text-sm text-gray-500">— {mw.use}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mw.nouns.map(n => (
                  <button
                    key={n.noun}
                    onClick={() => speak(`一${mw.mw}${n.noun}`)}
                    className="px-3 py-1 bg-white rounded-full border text-sm hover:bg-blue-50 hover:border-blue-300"
                  >
                    一{mw.mw}{n.noun} ({n.meaning})
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={startQuiz} className="w-full py-4 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700">
          ❓ Start Quiz
        </button>
      </div>
    );
  }

  // Done
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 60 ? '👏' : '💪'}</div>
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <div className="text-4xl font-bold text-blue-600">{score} / {questions.length}</div>
        <p className="text-gray-500">{pct}%</p>
        <div className="flex gap-3 justify-center">
          <button onClick={startQuiz} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">🔄 Retry</button>
          <button onClick={() => setMode('learn')} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">📖 Review</button>
        </div>
      </div>
    );
  }

  // Quiz
  const q = questions[idx];
  const isCorrect = selected === q.correct;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Q{idx + 1}/{questions.length}</span>
        <span>Score: {score}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((idx + (selected ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      <div className="text-center py-6">
        <p className="text-sm text-gray-500 mb-3">Which measure word goes with:</p>
        <div className="text-5xl font-bold mb-2">{q.noun}</div>
        <div className="text-gray-500">{q.nounPinyin} — {q.meaning}</div>
        <p className="text-lg text-gray-700 mt-3">一 <span className="text-3xl text-blue-600 font-bold">?</span> {q.noun}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map(opt => {
          let cls = 'border-gray-200 bg-white hover:bg-gray-50';
          if (selected) {
            if (opt === q.correct) cls = 'border-green-500 bg-green-50';
            else if (opt === selected) cls = 'border-red-500 bg-red-50';
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected} className={`p-4 rounded-xl border-2 text-2xl font-bold transition-all ${cls}`}>
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={`p-4 rounded-lg text-center ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className="font-bold">{isCorrect ? '✅ Correct!' : `❌ Answer: ${q.correct} (${q.correctPinyin})`}</p>
          <p className="text-sm text-gray-600">一{q.correct}{q.noun}</p>
          <button onClick={next} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {idx === questions.length - 1 ? 'See Results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}
