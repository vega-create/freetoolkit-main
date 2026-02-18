import { useState } from 'react';

const KANJI_DATA = [
  { kanji: '日', onyomi: 'ニチ/ジツ', kunyomi: 'ひ/か', meaning: 'day, sun', strokes: 4, jlpt: 5, examples: ['日本 にほん Japan', '毎日 まいにち every day', '日曜日 にちようび Sunday'] },
  { kanji: '月', onyomi: 'ゲツ/ガツ', kunyomi: 'つき', meaning: 'month, moon', strokes: 4, jlpt: 5, examples: ['一月 いちがつ January', '月曜日 げつようび Monday', '今月 こんげつ this month'] },
  { kanji: '火', onyomi: 'カ', kunyomi: 'ひ', meaning: 'fire', strokes: 4, jlpt: 5, examples: ['火曜日 かようび Tuesday', '火山 かざん volcano', '花火 はなび fireworks'] },
  { kanji: '水', onyomi: 'スイ', kunyomi: 'みず', meaning: 'water', strokes: 4, jlpt: 5, examples: ['水曜日 すいようび Wednesday', '水泳 すいえい swimming', 'お水 おみず water'] },
  { kanji: '木', onyomi: 'モク/ボク', kunyomi: 'き', meaning: 'tree, wood', strokes: 4, jlpt: 5, examples: ['木曜日 もくようび Thursday', '木 き tree', '大木 たいぼく large tree'] },
  { kanji: '金', onyomi: 'キン/コン', kunyomi: 'かね', meaning: 'gold, money', strokes: 8, jlpt: 5, examples: ['金曜日 きんようび Friday', 'お金 おかね money', '金魚 きんぎょ goldfish'] },
  { kanji: '土', onyomi: 'ド/ト', kunyomi: 'つち', meaning: 'earth, soil', strokes: 3, jlpt: 5, examples: ['土曜日 どようび Saturday', '土地 とち land', '土 つち soil'] },
  { kanji: '人', onyomi: 'ジン/ニン', kunyomi: 'ひと', meaning: 'person', strokes: 2, jlpt: 5, examples: ['日本人 にほんじん Japanese person', '人 ひと person', '大人 おとな adult'] },
  { kanji: '大', onyomi: 'ダイ/タイ', kunyomi: 'おお(きい)', meaning: 'big, large', strokes: 3, jlpt: 5, examples: ['大学 だいがく university', '大きい おおきい big', '大切 たいせつ important'] },
  { kanji: '小', onyomi: 'ショウ', kunyomi: 'ちい(さい)/こ', meaning: 'small', strokes: 3, jlpt: 5, examples: ['小学校 しょうがっこう elementary school', '小さい ちいさい small', '小説 しょうせつ novel'] },
  { kanji: '山', onyomi: 'サン', kunyomi: 'やま', meaning: 'mountain', strokes: 3, jlpt: 5, examples: ['富士山 ふじさん Mt. Fuji', '山 やま mountain', '火山 かざん volcano'] },
  { kanji: '川', onyomi: 'セン', kunyomi: 'かわ', meaning: 'river', strokes: 3, jlpt: 5, examples: ['川 かわ river', '石川 いしかわ Ishikawa', '小川 おがわ stream'] },
  { kanji: '学', onyomi: 'ガク', kunyomi: 'まな(ぶ)', meaning: 'study, learn', strokes: 8, jlpt: 5, examples: ['学生 がくせい student', '学校 がっこう school', '学ぶ まなぶ to learn'] },
  { kanji: '生', onyomi: 'セイ/ショウ', kunyomi: 'い(きる)/う(まれる)', meaning: 'life, birth', strokes: 5, jlpt: 5, examples: ['先生 せんせい teacher', '学生 がくせい student', '生まれる うまれる to be born'] },
  { kanji: '食', onyomi: 'ショク', kunyomi: 'た(べる)', meaning: 'eat, food', strokes: 9, jlpt: 5, examples: ['食べる たべる to eat', '食事 しょくじ meal', '食堂 しょくどう cafeteria'] },
  { kanji: '車', onyomi: 'シャ', kunyomi: 'くるま', meaning: 'car, vehicle', strokes: 7, jlpt: 5, examples: ['電車 でんしゃ train', '車 くるま car', '自転車 じてんしゃ bicycle'] },
  { kanji: '国', onyomi: 'コク', kunyomi: 'くに', meaning: 'country', strokes: 8, jlpt: 5, examples: ['国 くに country', '中国 ちゅうごく China', '外国 がいこく foreign country'] },
  { kanji: '語', onyomi: 'ゴ', kunyomi: 'かた(る)', meaning: 'language, word', strokes: 14, jlpt: 5, examples: ['日本語 にほんご Japanese', '英語 えいご English', '語る かたる to narrate'] },
  { kanji: '時', onyomi: 'ジ', kunyomi: 'とき', meaning: 'time, hour', strokes: 10, jlpt: 5, examples: ['時間 じかん time', '一時 いちじ one o\'clock', '時々 ときどき sometimes'] },
  { kanji: '年', onyomi: 'ネン', kunyomi: 'とし', meaning: 'year', strokes: 6, jlpt: 5, examples: ['今年 ことし this year', '去年 きょねん last year', '一年 いちねん one year'] },
  { kanji: '友', onyomi: 'ユウ', kunyomi: 'とも', meaning: 'friend', strokes: 4, jlpt: 5, examples: ['友達 ともだち friend', '友人 ゆうじん friend (formal)', '親友 しんゆう best friend'] },
  { kanji: '花', onyomi: 'カ', kunyomi: 'はな', meaning: 'flower', strokes: 7, jlpt: 4, examples: ['花 はな flower', '花火 はなび fireworks', '花見 はなみ cherry blossom viewing'] },
  { kanji: '雨', onyomi: 'ウ', kunyomi: 'あめ', meaning: 'rain', strokes: 8, jlpt: 5, examples: ['雨 あめ rain', '大雨 おおあめ heavy rain', '梅雨 つゆ rainy season'] },
  { kanji: '風', onyomi: 'フウ', kunyomi: 'かぜ', meaning: 'wind, style', strokes: 9, jlpt: 4, examples: ['風 かぜ wind', '台風 たいふう typhoon', '和風 わふう Japanese style'] },
  { kanji: '空', onyomi: 'クウ', kunyomi: 'そら/あ(ける)', meaning: 'sky, empty', strokes: 8, jlpt: 4, examples: ['空 そら sky', '空港 くうこう airport', '空気 くうき air'] },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP'; u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function KanjiLookup() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof KANJI_DATA[0] | null>(null);
  const [filter, setFilter] = useState(0); // 0=all, 5=N5, 4=N4

  const filtered = KANJI_DATA.filter(k => {
    if (filter && k.jlpt !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return k.kanji.includes(q) || k.meaning.toLowerCase().includes(q) || k.onyomi.includes(q) || k.kunyomi.includes(q);
  });

  return (
    <div className="space-y-6">
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by kanji, meaning, or reading..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-lg" />

      <div className="flex gap-2">
        {[{ v: 0, l: 'All' }, { v: 5, l: 'JLPT N5' }, { v: 4, l: 'JLPT N4' }].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)}
            className={`px-3 py-1 rounded text-sm ${filter === f.v ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{f.l}</button>
        ))}
      </div>

      {selected && (
        <div className="bg-red-50 rounded-xl p-5 border border-red-100">
          <div className="flex items-start gap-4">
            <div className="text-6xl font-bold cursor-pointer hover:text-red-600" onClick={() => speak(selected.kanji)}>{selected.kanji}</div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">JLPT N{selected.jlpt} · {selected.strokes} strokes</div>
              <div className="font-bold text-lg">{selected.meaning}</div>
              <div className="text-sm"><span className="text-red-600">On:</span> {selected.onyomi} <span className="text-red-600 ml-3">Kun:</span> {selected.kunyomi}</div>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
          </div>
          <div className="mt-3 space-y-1">
            {selected.examples.map((ex, i) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-white rounded p-2 cursor-pointer hover:bg-red-50" onClick={() => speak(ex.split(' ')[0])}>
                <span className="font-bold">{ex.split(' ')[0]}</span>
                <span className="text-gray-500">{ex.split(' ').slice(1).join(' ')}</span>
                <span className="ml-auto text-red-400">🔊</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
        {filtered.map(k => (
          <button key={k.kanji} onClick={() => setSelected(k)}
            className={`p-3 rounded-lg border text-center transition-all ${selected?.kanji === k.kanji ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="text-2xl font-bold">{k.kanji}</div>
            <div className="text-xs text-gray-400 truncate">{k.meaning}</div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No kanji found.</p>}
    </div>
  );
}
