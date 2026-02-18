import { useState, useMemo } from 'react';

const VOCAB = [
  { word: '食べる', reading: 'たべる', meaning: 'to eat', jlpt: 5 },
  { word: '飲む', reading: 'のむ', meaning: 'to drink', jlpt: 5 },
  { word: '見る', reading: 'みる', meaning: 'to see', jlpt: 5 },
  { word: '聞く', reading: 'きく', meaning: 'to hear/ask', jlpt: 5 },
  { word: '読む', reading: 'よむ', meaning: 'to read', jlpt: 5 },
  { word: '書く', reading: 'かく', meaning: 'to write', jlpt: 5 },
  { word: '話す', reading: 'はなす', meaning: 'to speak', jlpt: 5 },
  { word: '行く', reading: 'いく', meaning: 'to go', jlpt: 5 },
  { word: '来る', reading: 'くる', meaning: 'to come', jlpt: 5 },
  { word: '帰る', reading: 'かえる', meaning: 'to return', jlpt: 5 },
  { word: '買う', reading: 'かう', meaning: 'to buy', jlpt: 5 },
  { word: '入る', reading: 'はいる', meaning: 'to enter', jlpt: 5 },
  { word: '出る', reading: 'でる', meaning: 'to exit', jlpt: 5 },
  { word: '大きい', reading: 'おおきい', meaning: 'big', jlpt: 5 },
  { word: '小さい', reading: 'ちいさい', meaning: 'small', jlpt: 5 },
  { word: '新しい', reading: 'あたらしい', meaning: 'new', jlpt: 5 },
  { word: '古い', reading: 'ふるい', meaning: 'old', jlpt: 5 },
  { word: '高い', reading: 'たかい', meaning: 'tall/expensive', jlpt: 5 },
  { word: '安い', reading: 'やすい', meaning: 'cheap', jlpt: 5 },
  { word: '近い', reading: 'ちかい', meaning: 'near', jlpt: 5 },
  { word: '遠い', reading: 'とおい', meaning: 'far', jlpt: 5 },
  { word: '早い', reading: 'はやい', meaning: 'early/fast', jlpt: 5 },
  { word: '遅い', reading: 'おそい', meaning: 'late/slow', jlpt: 5 },
  { word: '元気', reading: 'げんき', meaning: 'energetic/well', jlpt: 5 },
  { word: '天気', reading: 'てんき', meaning: 'weather', jlpt: 5 },
  { word: '電車', reading: 'でんしゃ', meaning: 'train', jlpt: 5 },
  { word: '学校', reading: 'がっこう', meaning: 'school', jlpt: 5 },
  { word: '先生', reading: 'せんせい', meaning: 'teacher', jlpt: 5 },
  { word: '学生', reading: 'がくせい', meaning: 'student', jlpt: 5 },
  { word: '友達', reading: 'ともだち', meaning: 'friend', jlpt: 5 },
  { word: '走る', reading: 'はしる', meaning: 'to run', jlpt: 4 },
  { word: '届ける', reading: 'とどける', meaning: 'to deliver', jlpt: 4 },
  { word: '届く', reading: 'とどく', meaning: 'to arrive/reach', jlpt: 4 },
  { word: '集める', reading: 'あつめる', meaning: 'to collect', jlpt: 4 },
  { word: '決める', reading: 'きめる', meaning: 'to decide', jlpt: 4 },
  { word: '変える', reading: 'かえる', meaning: 'to change', jlpt: 4 },
  { word: '伝える', reading: 'つたえる', meaning: 'to convey', jlpt: 4 },
  { word: '比べる', reading: 'くらべる', meaning: 'to compare', jlpt: 4 },
  { word: '経験', reading: 'けいけん', meaning: 'experience', jlpt: 4 },
  { word: '社会', reading: 'しゃかい', meaning: 'society', jlpt: 4 },
  { word: '自然', reading: 'しぜん', meaning: 'nature', jlpt: 4 },
  { word: '技術', reading: 'ぎじゅつ', meaning: 'technology', jlpt: 4 },
  { word: '文化', reading: 'ぶんか', meaning: 'culture', jlpt: 4 },
  { word: '政治', reading: 'せいじ', meaning: 'politics', jlpt: 4 },
  { word: '経済', reading: 'けいざい', meaning: 'economy', jlpt: 4 },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function JLPTVocabulary() {
  const [level, setLevel] = useState(5);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let words = VOCAB.filter(w => w.jlpt === level);
    if (search.trim()) {
      const q = search.toLowerCase();
      words = VOCAB.filter(w => w.word.includes(q) || w.reading.includes(q) || w.meaning.toLowerCase().includes(q));
    }
    return words;
  }, [level, search]);

  return (
    <div className="space-y-6">
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by word, reading, or meaning..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-lg" />
      {!search && (
        <div className="flex gap-2">
          {[5, 4].map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${level === l ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
              JLPT N{l} ({VOCAB.filter(v => v.jlpt === l).length})
            </button>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-500">{search ? `Found ${filtered.length}` : `JLPT N${level}: ${filtered.length} words`}</p>
      <div className="space-y-2">
        {filtered.map((w, i) => (
          <div key={i} onClick={() => speak(w.word)} className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-red-200 cursor-pointer">
            <span className="text-xl font-bold">{w.word}</span>
            <span className="text-red-600 text-sm">{w.reading}</span>
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">N{w.jlpt}</span>
            <span className="text-sm text-gray-500 ml-auto">{w.meaning}</span>
            <span className="text-red-400">🔊</span>
          </div>
        ))}
      </div>
    </div>
  );
}
