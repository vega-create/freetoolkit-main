import { useState, useEffect } from 'react';

const KANJI_LIST = [
  { kanji: '日', reading: 'ひ/にち', meaning: 'day, sun', strokes: 4, jlpt: 5, words: ['日本 (にほん) Japan', '今日 (きょう) today', '毎日 (まいにち) every day'] },
  { kanji: '人', reading: 'ひと/じん', meaning: 'person', strokes: 2, jlpt: 5, words: ['日本人 (にほんじん) Japanese', '大人 (おとな) adult', '人気 (にんき) popular'] },
  { kanji: '大', reading: 'おお(きい)/だい', meaning: 'big', strokes: 3, jlpt: 5, words: ['大学 (だいがく) university', '大切 (たいせつ) important', '大好き (だいすき) love'] },
  { kanji: '学', reading: 'まな(ぶ)/がく', meaning: 'study', strokes: 8, jlpt: 5, words: ['学校 (がっこう) school', '学生 (がくせい) student', '学ぶ (まなぶ) to learn'] },
  { kanji: '食', reading: 'た(べる)/しょく', meaning: 'eat', strokes: 9, jlpt: 5, words: ['食べる (たべる) to eat', '食事 (しょくじ) meal', '和食 (わしょく) Japanese food'] },
  { kanji: '山', reading: 'やま/さん', meaning: 'mountain', strokes: 3, jlpt: 5, words: ['富士山 (ふじさん) Mt. Fuji', '山 (やま) mountain', '登山 (とざん) climbing'] },
  { kanji: '水', reading: 'みず/すい', meaning: 'water', strokes: 4, jlpt: 5, words: ['水 (みず) water', '水泳 (すいえい) swimming', '水曜日 (すいようび) Wednesday'] },
  { kanji: '花', reading: 'はな/か', meaning: 'flower', strokes: 7, jlpt: 4, words: ['花 (はな) flower', '花見 (はなみ) blossom viewing', '花火 (はなび) fireworks'] },
  { kanji: '車', reading: 'くるま/しゃ', meaning: 'car', strokes: 7, jlpt: 5, words: ['電車 (でんしゃ) train', '自転車 (じてんしゃ) bicycle', '車 (くるま) car'] },
  { kanji: '書', reading: 'か(く)/しょ', meaning: 'write', strokes: 10, jlpt: 4, words: ['書く (かく) to write', '辞書 (じしょ) dictionary', '図書館 (としょかん) library'] },
  { kanji: '見', reading: 'み(る)/けん', meaning: 'see', strokes: 7, jlpt: 5, words: ['見る (みる) to see', '花見 (はなみ) blossom viewing', '意見 (いけん) opinion'] },
  { kanji: '行', reading: 'い(く)/こう', meaning: 'go', strokes: 6, jlpt: 5, words: ['行く (いく) to go', '旅行 (りょこう) travel', '銀行 (ぎんこう) bank'] },
  { kanji: '聞', reading: 'き(く)/ぶん', meaning: 'hear, ask', strokes: 14, jlpt: 5, words: ['聞く (きく) to hear/ask', '新聞 (しんぶん) newspaper', '聞こえる (きこえる) can hear'] },
  { kanji: '話', reading: 'はな(す)/わ', meaning: 'talk', strokes: 13, jlpt: 5, words: ['話す (はなす) to speak', '電話 (でんわ) telephone', '会話 (かいわ) conversation'] },
  { kanji: '読', reading: 'よ(む)/どく', meaning: 'read', strokes: 14, jlpt: 5, words: ['読む (よむ) to read', '読書 (どくしょ) reading books', '読者 (どくしゃ) reader'] },
  { kanji: '友', reading: 'とも/ゆう', meaning: 'friend', strokes: 4, jlpt: 5, words: ['友達 (ともだち) friend', '親友 (しんゆう) best friend', '友人 (ゆうじん) friend'] },
  { kanji: '雨', reading: 'あめ/う', meaning: 'rain', strokes: 8, jlpt: 5, words: ['雨 (あめ) rain', '大雨 (おおあめ) heavy rain', '梅雨 (つゆ) rainy season'] },
  { kanji: '空', reading: 'そら/くう', meaning: 'sky', strokes: 8, jlpt: 4, words: ['空 (そら) sky', '空港 (くうこう) airport', '空気 (くうき) air'] },
  { kanji: '気', reading: 'き', meaning: 'spirit, air', strokes: 6, jlpt: 5, words: ['天気 (てんき) weather', '元気 (げんき) energetic', '人気 (にんき) popular'] },
  { kanji: '国', reading: 'くに/こく', meaning: 'country', strokes: 8, jlpt: 5, words: ['国 (くに) country', '外国 (がいこく) foreign country', '中国 (ちゅうごく) China'] },
  { kanji: '時', reading: 'とき/じ', meaning: 'time', strokes: 10, jlpt: 5, words: ['時間 (じかん) time', '時計 (とけい) clock', '時々 (ときどき) sometimes'] },
  { kanji: '手', reading: 'て/しゅ', meaning: 'hand', strokes: 4, jlpt: 5, words: ['手 (て) hand', '上手 (じょうず) skillful', '選手 (せんしゅ) athlete'] },
  { kanji: '目', reading: 'め/もく', meaning: 'eye', strokes: 5, jlpt: 5, words: ['目 (め) eye', '目的 (もくてき) purpose', '一番目 (いちばんめ) first'] },
  { kanji: '耳', reading: 'みみ/じ', meaning: 'ear', strokes: 6, jlpt: 5, words: ['耳 (みみ) ear', '耳鼻科 (じびか) ENT clinic'] },
  { kanji: '口', reading: 'くち/こう', meaning: 'mouth', strokes: 3, jlpt: 5, words: ['口 (くち) mouth', '入口 (いりぐち) entrance', '出口 (でぐち) exit'] },
  { kanji: '心', reading: 'こころ/しん', meaning: 'heart', strokes: 4, jlpt: 4, words: ['心 (こころ) heart/mind', '安心 (あんしん) relief', '心配 (しんぱい) worry'] },
  { kanji: '白', reading: 'しろ(い)/はく', meaning: 'white', strokes: 5, jlpt: 5, words: ['白い (しろい) white', '白紙 (はくし) blank paper', '面白い (おもしろい) interesting'] },
  { kanji: '赤', reading: 'あか(い)/せき', meaning: 'red', strokes: 7, jlpt: 5, words: ['赤い (あかい) red', '赤ちゃん (あかちゃん) baby'] },
  { kanji: '青', reading: 'あお(い)/せい', meaning: 'blue', strokes: 8, jlpt: 5, words: ['青い (あおい) blue', '青春 (せいしゅん) youth', '青空 (あおぞら) blue sky'] },
  { kanji: '金', reading: 'かね/きん', meaning: 'gold, money', strokes: 8, jlpt: 5, words: ['お金 (おかね) money', '金曜日 (きんようび) Friday', '金魚 (きんぎょ) goldfish'] },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.7;
  window.speechSynthesis.speak(u);
}

export default function DailyKanji() {
  const now = new Date();
  const start = new Date('2026-01-01');
  const idx = Math.floor((now.getTime() - start.getTime()) / 86400000) % KANJI_LIST.length;
  const today = KANJI_LIST[idx];
  const [learned, setLearned] = useState(false);

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem('ftk-japanese') || '{}');
      const todayStr = now.toISOString().slice(0, 10);
      if (d.dailyCompleted?.includes(todayStr)) setLearned(true);
    } catch {}
  }, []);

  const markLearned = () => {
    setLearned(true);
    try {
      const d = JSON.parse(localStorage.getItem('ftk-japanese') || '{}');
      const todayStr = now.toISOString().slice(0, 10);
      if (!d.dailyCompleted) d.dailyCompleted = [];
      if (!d.dailyCompleted.includes(todayStr)) d.dailyCompleted.push(todayStr);
      d.lastVisit = todayStr;
      localStorage.setItem('ftk-japanese', JSON.stringify(d));
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <p className="text-sm text-gray-500 mb-2">Today's Kanji — {now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
        <div className="text-8xl md:text-9xl font-bold cursor-pointer hover:text-red-600 mb-3" onClick={() => speak(today.kanji)}>{today.kanji}</div>
        <div className="text-xl text-red-600 font-medium mb-1">{today.reading}</div>
        <div className="text-lg text-gray-600">{today.meaning}</div>
        <div className="flex justify-center gap-4 mt-2 text-sm text-gray-400">
          <span>JLPT N{today.jlpt}</span>
          <span>{today.strokes} strokes</span>
        </div>
        <button onClick={() => speak(today.kanji)} className="mt-3 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">🔊 Listen</button>
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="font-bold text-gray-700 mb-3">Example Words</h3>
        <div className="space-y-2">
          {today.words.map((w, i) => (
            <div key={i} onClick={() => speak(w.split(' ')[0])} className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-red-200">
              <span className="text-lg font-bold">{w.split(' ')[0]}</span>
              <span className="text-sm text-gray-500">{w.split(' ').slice(1).join(' ')}</span>
              <span className="ml-auto text-red-400">🔊</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={markLearned} disabled={learned}
        className={`w-full py-4 rounded-lg font-bold text-lg ${learned ? 'bg-green-100 text-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}>
        {learned ? '✅ Learned Today!' : '📚 I Learned This Kanji'}
      </button>
    </div>
  );
}
