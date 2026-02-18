import { useState, useEffect } from 'react';

const CHARACTERS = [
  { char: '爱', trad: '愛', pinyin: 'ài', meaning: 'love', hsk: 1, strokes: 10, radical: '心', examples: ['我爱你 (wǒ ài nǐ) - I love you', '爱好 (àihào) - hobby'] },
  { char: '家', trad: '家', pinyin: 'jiā', meaning: 'home, family', hsk: 1, strokes: 10, radical: '宀', examples: ['回家 (huí jiā) - go home', '家人 (jiārén) - family members'] },
  { char: '学', trad: '學', pinyin: 'xué', meaning: 'study, learn', hsk: 1, strokes: 8, radical: '子', examples: ['学习 (xuéxí) - to study', '学生 (xuéshēng) - student'] },
  { char: '水', trad: '水', pinyin: 'shuǐ', meaning: 'water', hsk: 1, strokes: 4, radical: '水', examples: ['喝水 (hē shuǐ) - drink water', '水果 (shuǐguǒ) - fruit'] },
  { char: '天', trad: '天', pinyin: 'tiān', meaning: 'sky, day', hsk: 1, strokes: 4, radical: '大', examples: ['今天 (jīntiān) - today', '天气 (tiānqì) - weather'] },
  { char: '心', trad: '心', pinyin: 'xīn', meaning: 'heart, mind', hsk: 2, strokes: 4, radical: '心', examples: ['开心 (kāixīn) - happy', '小心 (xiǎoxīn) - be careful'] },
  { char: '花', trad: '花', pinyin: 'huā', meaning: 'flower', hsk: 2, strokes: 7, radical: '艹', examples: ['花园 (huāyuán) - garden', '花茶 (huāchá) - flower tea'] },
  { char: '风', trad: '風', pinyin: 'fēng', meaning: 'wind', hsk: 2, strokes: 4, radical: '风', examples: ['大风 (dà fēng) - strong wind', '风景 (fēngjǐng) - scenery'] },
  { char: '光', trad: '光', pinyin: 'guāng', meaning: 'light, ray', hsk: 2, strokes: 6, radical: '儿', examples: ['阳光 (yángguāng) - sunshine', '月光 (yuèguāng) - moonlight'] },
  { char: '春', trad: '春', pinyin: 'chūn', meaning: 'spring', hsk: 2, strokes: 9, radical: '日', examples: ['春天 (chūntiān) - spring', '春节 (chūnjié) - Spring Festival'] },
  { char: '山', trad: '山', pinyin: 'shān', meaning: 'mountain', hsk: 1, strokes: 3, radical: '山', examples: ['上山 (shàng shān) - go up the mountain', '山水 (shānshuǐ) - landscape'] },
  { char: '月', trad: '月', pinyin: 'yuè', meaning: 'moon, month', hsk: 1, strokes: 4, radical: '月', examples: ['月亮 (yuèliàng) - moon', '一月 (yīyuè) - January'] },
  { char: '火', trad: '火', pinyin: 'huǒ', meaning: 'fire', hsk: 2, strokes: 4, radical: '火', examples: ['火车 (huǒchē) - train', '火锅 (huǒguō) - hot pot'] },
  { char: '友', trad: '友', pinyin: 'yǒu', meaning: 'friend', hsk: 1, strokes: 4, radical: '又', examples: ['朋友 (péngyǒu) - friend', '友好 (yǒuhǎo) - friendly'] },
  { char: '书', trad: '書', pinyin: 'shū', meaning: 'book', hsk: 1, strokes: 4, radical: '乛', examples: ['看书 (kànshū) - read a book', '书店 (shūdiàn) - bookstore'] },
  { char: '路', trad: '路', pinyin: 'lù', meaning: 'road, path', hsk: 2, strokes: 13, radical: '足', examples: ['走路 (zǒulù) - walk', '马路 (mǎlù) - road'] },
  { char: '梦', trad: '夢', pinyin: 'mèng', meaning: 'dream', hsk: 3, strokes: 11, radical: '木', examples: ['做梦 (zuòmèng) - to dream', '梦想 (mèngxiǎng) - dream/aspiration'] },
  { char: '笑', trad: '笑', pinyin: 'xiào', meaning: 'laugh, smile', hsk: 2, strokes: 10, radical: '竹', examples: ['微笑 (wēixiào) - smile', '笑话 (xiàohua) - joke'] },
  { char: '龙', trad: '龍', pinyin: 'lóng', meaning: 'dragon', hsk: 3, strokes: 5, radical: '龙', examples: ['龙年 (lóngnián) - Year of the Dragon', '恐龙 (kǒnglóng) - dinosaur'] },
  { char: '福', trad: '福', pinyin: 'fú', meaning: 'blessing, fortune', hsk: 3, strokes: 13, radical: '礻', examples: ['幸福 (xìngfú) - happiness', '福气 (fúqì) - good fortune'] },
  { char: '明', trad: '明', pinyin: 'míng', meaning: 'bright, clear', hsk: 1, strokes: 8, radical: '日', examples: ['明天 (míngtiān) - tomorrow', '聪明 (cōngmíng) - smart'] },
  { char: '星', trad: '星', pinyin: 'xīng', meaning: 'star', hsk: 1, strokes: 9, radical: '日', examples: ['星星 (xīngxīng) - stars', '星期 (xīngqī) - week'] },
  { char: '雨', trad: '雨', pinyin: 'yǔ', meaning: 'rain', hsk: 2, strokes: 8, radical: '雨', examples: ['下雨 (xiàyǔ) - rain', '雨伞 (yǔsǎn) - umbrella'] },
  { char: '飞', trad: '飛', pinyin: 'fēi', meaning: 'fly', hsk: 2, strokes: 3, radical: '飞', examples: ['飞机 (fēijī) - airplane', '飞鸟 (fēiniǎo) - flying bird'] },
  { char: '海', trad: '海', pinyin: 'hǎi', meaning: 'sea, ocean', hsk: 2, strokes: 10, radical: '氵', examples: ['大海 (dàhǎi) - ocean', '海边 (hǎibiān) - seaside'] },
  { char: '安', trad: '安', pinyin: 'ān', meaning: 'peace, safe', hsk: 2, strokes: 6, radical: '宀', examples: ['安全 (ānquán) - safety', '早安 (zǎo ān) - good morning'] },
  { char: '力', trad: '力', pinyin: 'lì', meaning: 'power, strength', hsk: 2, strokes: 2, radical: '力', examples: ['努力 (nǔlì) - work hard', '力气 (lìqi) - strength'] },
  { char: '美', trad: '美', pinyin: 'měi', meaning: 'beautiful', hsk: 2, strokes: 9, radical: '羊', examples: ['美丽 (měilì) - beautiful', '美食 (měishí) - delicious food'] },
  { char: '乐', trad: '樂', pinyin: 'lè', meaning: 'happy, joy', hsk: 2, strokes: 5, radical: '丿', examples: ['快乐 (kuàilè) - happy', '音乐 (yīnyuè) - music'] },
  { char: '金', trad: '金', pinyin: 'jīn', meaning: 'gold, metal', hsk: 3, strokes: 8, radical: '金', examples: ['金色 (jīnsè) - golden', '金鱼 (jīnyú) - goldfish'] },
  { char: '云', trad: '雲', pinyin: 'yún', meaning: 'cloud', hsk: 2, strokes: 4, radical: '二', examples: ['白云 (báiyún) - white cloud', '云南 (Yúnnán) - Yunnan'] },
  { char: '林', trad: '林', pinyin: 'lín', meaning: 'forest', hsk: 3, strokes: 8, radical: '木', examples: ['森林 (sēnlín) - forest', '树林 (shùlín) - woods'] },
  { char: '鸟', trad: '鳥', pinyin: 'niǎo', meaning: 'bird', hsk: 2, strokes: 5, radical: '鸟', examples: ['小鸟 (xiǎoniǎo) - little bird', '鸟巢 (niǎocháo) - bird nest'] },
  { char: '画', trad: '畫', pinyin: 'huà', meaning: 'draw, painting', hsk: 2, strokes: 8, radical: '田', examples: ['画画 (huàhuà) - to draw', '画家 (huàjiā) - painter'] },
  { char: '音', trad: '音', pinyin: 'yīn', meaning: 'sound, music', hsk: 2, strokes: 9, radical: '音', examples: ['音乐 (yīnyuè) - music', '声音 (shēngyīn) - sound/voice'] },
  { char: '思', trad: '思', pinyin: 'sī', meaning: 'think, miss', hsk: 2, strokes: 9, radical: '心', examples: ['意思 (yìsi) - meaning', '思念 (sīniàn) - miss someone'] },
];

function getDayIndex(): number {
  const start = new Date(2026, 0, 1).getTime();
  const now = new Date().getTime();
  return Math.floor((now - start) / 86400000) % CHARACTERS.length;
}

function speak(text: string, lang: string = 'zh-TW') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

const STORAGE_KEY = 'ftk-chinese';

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveProgress(data: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function DailyCharacter() {
  const [completed, setCompleted] = useState(false);
  const [saved, setSaved] = useState(false);

  const dayIndex = getDayIndex();
  const char = CHARACTERS[dayIndex];
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const data = getProgress();
    if (data.dailyCompleted?.includes(today)) setCompleted(true);
    if (data.bookmarks?.find((b: any) => b.char === char.char)) setSaved(true);
  }, []);

  const markComplete = () => {
    const data = getProgress();
    if (!data.dailyCompleted) data.dailyCompleted = [];
    if (!data.dailyCompleted.includes(today)) {
      data.dailyCompleted.push(today);
    }
    // Update streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (!data.lastVisit || data.lastVisit === yesterday) {
      data.streak = (data.streak || 0) + 1;
    } else if (data.lastVisit !== today) {
      data.streak = 1;
    }
    data.lastVisit = today;
    if (!data.charsLearned) data.charsLearned = [];
    if (!data.charsLearned.includes(char.char)) data.charsLearned.push(char.char);
    saveProgress(data);
    setCompleted(true);
  };

  const toggleSave = () => {
    const data = getProgress();
    if (!data.bookmarks) data.bookmarks = [];
    if (saved) {
      data.bookmarks = data.bookmarks.filter((b: any) => b.char !== char.char);
    } else {
      data.bookmarks.push({ char: char.char, pinyin: char.pinyin, meaning: char.meaning, addedAt: today });
    }
    saveProgress(data);
    setSaved(!saved);
  };

  return (
    <div className="space-y-6">
      {/* Date */}
      <div className="text-center text-sm text-gray-500">
        📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>

      {/* Main Character */}
      <div className="text-center py-8">
        <div className="relative inline-block">
          <div className="text-8xl md:text-9xl font-bold mb-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => speak(char.char)}>
            {char.char}
          </div>
          <button
            onClick={toggleSave}
            className={`absolute -top-2 -right-6 text-2xl ${saved ? '' : 'opacity-30 hover:opacity-60'}`}
            title={saved ? 'Remove from word list' : 'Save to word list'}
          >
            {saved ? '⭐' : '☆'}
          </button>
        </div>
        {char.char !== char.trad && (
          <div className="text-2xl text-gray-400 mb-2">Traditional: {char.trad}</div>
        )}
        <div className="flex items-center justify-center gap-3 text-2xl text-blue-600">
          <span>{char.pinyin}</span>
          <button onClick={() => speak(char.char)} className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200">🔊</button>
          <button onClick={() => { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(char.char); u.lang = 'zh-TW'; u.rate = 0.5; window.speechSynthesis.speak(u); }} className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">🐢 Slow</button>
        </div>
        <div className="text-xl text-gray-600 mt-2">{char.meaning}</div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500">HSK Level</div>
          <div className="text-lg font-bold">HSK {char.hsk}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500">Strokes</div>
          <div className="text-lg font-bold">{char.strokes}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500">Radical</div>
          <div className="text-lg font-bold">{char.radical}</div>
        </div>
      </div>

      {/* Example Words */}
      <div>
        <h3 className="font-bold text-gray-700 mb-3">📝 Example Words</h3>
        <div className="space-y-2">
          {char.examples.map((ex, i) => {
            const chinesePart = ex.split('(')[0].trim();
            return (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <button onClick={() => speak(chinesePart)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center text-sm">🔊</button>
                <span className="text-gray-700">{ex}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Button */}
      {!completed ? (
        <button
          onClick={markComplete}
          className="w-full py-4 rounded-lg bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all"
        >
          ✅ I Learned This Character!
        </button>
      ) : (
        <div className="text-center py-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl mb-1">🎉</div>
          <p className="text-green-700 font-medium">Completed for today! Come back tomorrow for a new character.</p>
        </div>
      )}

      {/* Navigation hint */}
      <p className="text-center text-xs text-gray-400">
        Character #{dayIndex + 1} of {CHARACTERS.length} · New character every day at midnight
      </p>
    </div>
  );
}
