import { useState } from 'react';

const KATAKANA_MAP: [string, string][] = [
  ['ア','a'],['イ','i'],['ウ','u'],['エ','e'],['オ','o'],
  ['カ','ka'],['キ','ki'],['ク','ku'],['ケ','ke'],['コ','ko'],
  ['サ','sa'],['シ','shi'],['ス','su'],['セ','se'],['ソ','so'],
  ['タ','ta'],['チ','chi'],['ツ','tsu'],['テ','te'],['ト','to'],
  ['ナ','na'],['ニ','ni'],['ヌ','nu'],['ネ','ne'],['ノ','no'],
  ['ハ','ha'],['ヒ','hi'],['フ','fu'],['ヘ','he'],['ホ','ho'],
  ['マ','ma'],['ミ','mi'],['ム','mu'],['メ','me'],['モ','mo'],
  ['ヤ','ya'],['ユ','yu'],['ヨ','yo'],
  ['ラ','ra'],['リ','ri'],['ル','ru'],['レ','re'],['ロ','ro'],
  ['ワ','wa'],['ヲ','wo'],['ン','n'],
];

// Common loanwords for context
const LOANWORDS = [
  { kata: 'コーヒー', romaji: 'koohii', meaning: 'coffee' },
  { kata: 'レストラン', romaji: 'resutoran', meaning: 'restaurant' },
  { kata: 'テレビ', romaji: 'terebi', meaning: 'television' },
  { kata: 'パソコン', romaji: 'pasokon', meaning: 'computer' },
  { kata: 'アイスクリーム', romaji: 'aisukuriimu', meaning: 'ice cream' },
  { kata: 'ホテル', romaji: 'hoteru', meaning: 'hotel' },
  { kata: 'タクシー', romaji: 'takushii', meaning: 'taxi' },
  { kata: 'サッカー', romaji: 'sakkaa', meaning: 'soccer' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
}
function getOptions(correct: string, all: string[]): string[] {
  const opts = new Set([correct]);
  while (opts.size < 4) opts.add(all[Math.floor(Math.random() * all.length)]);
  return shuffle([...opts]);
}

export default function KatakanaQuiz() {
  const [mode, setMode] = useState<'quiz' | 'loanwords'>('quiz');
  const [questions] = useState(() => shuffle([...KATAKANA_MAP]).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const allRomaji = KATAKANA_MAP.map(h => h[1]);
  const options = useState(() => questions.map(q => getOptions(q[1], allRomaji)))[0];

  if (mode === 'loanwords') {
    return (
      <div className="space-y-6">
        <button onClick={() => setMode('quiz')} className="text-sm text-red-600 hover:underline">← Back to Quiz</button>
        <h3 className="font-bold text-lg">Common Katakana Loanwords</h3>
        <div className="space-y-2">
          {LOANWORDS.map((w, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:bg-red-50"
              onClick={() => { const u = new SpeechSynthesisUtterance(w.kata); u.lang = 'ja-JP'; u.rate = 0.8; window.speechSynthesis.speak(u); }}>
              <span className="text-xl font-bold">{w.kata}</span>
              <span className="text-sm text-red-600">{w.romaji}</span>
              <span className="text-sm text-gray-500">{w.meaning}</span>
              <span className="ml-auto text-red-400">🔊</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const current = questions[idx];
  const isCorrect = selected === current?.[1];

  const handleSelect = (opt: string) => { if (selected) return; setSelected(opt); if (opt === current[1]) setScore(s => s + 1); };
  const next = () => {
    if (idx >= questions.length - 1) { setDone(true); } else { setIdx(i => i + 1); setSelected(null); }
  };

  if (done) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">{score >= 8 ? '🎉' : '💪'}</div>
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <div className="text-4xl font-bold text-red-600">{score}/{questions.length}</div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 text-white rounded-lg">Try Again</button>
          <button onClick={() => setMode('loanwords')} className="px-6 py-3 bg-gray-200 rounded-lg">Practice Loanwords</button>
        </div>
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
          if (selected) { if (opt === current[1]) cls = 'border-green-500 bg-green-50'; else if (opt === selected) cls = 'border-red-500 bg-red-50'; }
          return (<button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected} className={`p-4 rounded-xl border-2 text-xl font-bold transition-all ${cls}`}>{opt}</button>);
        })}
      </div>
      {selected && (
        <div className={`p-4 rounded-lg text-center ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className="font-bold">{isCorrect ? '✅ Correct!' : `❌ Answer: ${current[1]}`}</p>
          <button onClick={next} className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg">{idx >= questions.length - 1 ? 'See Results' : 'Next →'}</button>
        </div>
      )}
      <button onClick={() => setMode('loanwords')} className="w-full py-2 text-sm text-gray-500 hover:text-red-600">📝 Practice Katakana Loanwords</button>
    </div>
  );
}
