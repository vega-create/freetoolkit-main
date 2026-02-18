import { useState } from 'react';

const HIRAGANA_MAP: [string, string][] = [
  ['あ','a'],['い','i'],['う','u'],['え','e'],['お','o'],
  ['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko'],
  ['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so'],
  ['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to'],
  ['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no'],
  ['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho'],
  ['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo'],
  ['や','ya'],['ゆ','yu'],['よ','yo'],
  ['ら','ra'],['り','ri'],['る','ru'],['れ','re'],['ろ','ro'],
  ['わ','wa'],['を','wo'],['ん','n'],
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
}

function getOptions(correct: string, all: string[]): string[] {
  const opts = new Set([correct]);
  while (opts.size < 4) opts.add(all[Math.floor(Math.random() * all.length)]);
  return shuffle([...opts]);
}

export default function HiraganaQuiz() {
  const [questions] = useState(() => shuffle([...HIRAGANA_MAP]).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[idx];
  const allRomaji = HIRAGANA_MAP.map(h => h[1]);
  const options = useState(() => questions.map(q => getOptions(q[1], allRomaji)))[0];
  const isCorrect = selected === current?.[1];

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === current[1]) setScore(s => s + 1);
  };

  const next = () => {
    if (idx >= questions.length - 1) {
      setDone(true);
      try {
        const d = JSON.parse(localStorage.getItem('ftk-japanese') || '{}');
        if (!d.quizScores) d.quizScores = {};
        const pct = Math.round((score / questions.length) * 100);
        const prev = d.quizScores.hiragana || { best: 0, last: 0, attempts: 0 };
        d.quizScores.hiragana = { best: Math.max(prev.best, pct), last: pct, attempts: prev.attempts + 1 };
        localStorage.setItem('ftk-japanese', JSON.stringify(d));
      } catch {}
    } else { setIdx(i => i + 1); setSelected(null); }
  };

  const restart = () => { window.location.reload(); };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <div className="text-4xl font-bold text-red-600">{score}/{questions.length}</div>
        <p className="text-gray-500">{pct}% correct</p>
        <button onClick={restart} className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Question {idx + 1}/{questions.length}</span>
        <span>Score: {score}/{idx + (selected ? 1 : 0)}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${((idx + (selected ? 1 : 0)) / questions.length) * 100}%` }} /></div>

      <div className="text-center py-6">
        <p className="text-sm text-gray-500 mb-2">What is the romaji for:</p>
        <div className="text-8xl font-bold mb-4">{current[0]}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options[idx]?.map(opt => {
          let cls = 'border-gray-200 bg-white hover:bg-gray-50';
          if (selected) {
            if (opt === current[1]) cls = 'border-green-500 bg-green-50';
            else if (opt === selected) cls = 'border-red-500 bg-red-50';
          }
          return (<button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected}
            className={`p-4 rounded-xl border-2 text-xl font-bold transition-all ${cls}`}>{opt}</button>);
        })}
      </div>

      {selected && (
        <div className={`p-4 rounded-lg text-center ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className="font-bold">{isCorrect ? '✅ Correct!' : `❌ Answer: ${current[1]}`}</p>
          <button onClick={next} className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg">
            {idx >= questions.length - 1 ? 'See Results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}
