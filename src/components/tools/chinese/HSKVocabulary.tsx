import { useState, useMemo } from 'react';

const HSK_VOCAB: { char: string; pinyin: string; meaning: string; hsk: number }[] = [
  // HSK 1 (30 words)
  { char: '你', pinyin: 'nǐ', meaning: 'you', hsk: 1 },
  { char: '好', pinyin: 'hǎo', meaning: 'good', hsk: 1 },
  { char: '我', pinyin: 'wǒ', meaning: 'I, me', hsk: 1 },
  { char: '是', pinyin: 'shì', meaning: 'to be', hsk: 1 },
  { char: '不', pinyin: 'bù', meaning: 'not', hsk: 1 },
  { char: '他', pinyin: 'tā', meaning: 'he', hsk: 1 },
  { char: '她', pinyin: 'tā', meaning: 'she', hsk: 1 },
  { char: '的', pinyin: 'de', meaning: 'possessive particle', hsk: 1 },
  { char: '了', pinyin: 'le', meaning: 'completion particle', hsk: 1 },
  { char: '在', pinyin: 'zài', meaning: 'at, in', hsk: 1 },
  { char: '人', pinyin: 'rén', meaning: 'person', hsk: 1 },
  { char: '大', pinyin: 'dà', meaning: 'big', hsk: 1 },
  { char: '中', pinyin: 'zhōng', meaning: 'middle', hsk: 1 },
  { char: '国', pinyin: 'guó', meaning: 'country', hsk: 1 },
  { char: '来', pinyin: 'lái', meaning: 'come', hsk: 1 },
  { char: '去', pinyin: 'qù', meaning: 'go', hsk: 1 },
  { char: '吃', pinyin: 'chī', meaning: 'eat', hsk: 1 },
  { char: '喝', pinyin: 'hē', meaning: 'drink', hsk: 1 },
  { char: '看', pinyin: 'kàn', meaning: 'look, see', hsk: 1 },
  { char: '说', pinyin: 'shuō', meaning: 'speak', hsk: 1 },
  { char: '学', pinyin: 'xué', meaning: 'study', hsk: 1 },
  { char: '水', pinyin: 'shuǐ', meaning: 'water', hsk: 1 },
  { char: '天', pinyin: 'tiān', meaning: 'day, sky', hsk: 1 },
  { char: '一', pinyin: 'yī', meaning: 'one', hsk: 1 },
  { char: '二', pinyin: 'èr', meaning: 'two', hsk: 1 },
  { char: '三', pinyin: 'sān', meaning: 'three', hsk: 1 },
  { char: '十', pinyin: 'shí', meaning: 'ten', hsk: 1 },
  { char: '年', pinyin: 'nián', meaning: 'year', hsk: 1 },
  { char: '月', pinyin: 'yuè', meaning: 'month, moon', hsk: 1 },
  { char: '日', pinyin: 'rì', meaning: 'day, sun', hsk: 1 },
  // HSK 2 (30 words)
  { char: '快', pinyin: 'kuài', meaning: 'fast, happy', hsk: 2 },
  { char: '慢', pinyin: 'màn', meaning: 'slow', hsk: 2 },
  { char: '高', pinyin: 'gāo', meaning: 'tall, high', hsk: 2 },
  { char: '长', pinyin: 'cháng', meaning: 'long', hsk: 2 },
  { char: '新', pinyin: 'xīn', meaning: 'new', hsk: 2 },
  { char: '走', pinyin: 'zǒu', meaning: 'walk', hsk: 2 },
  { char: '跑', pinyin: 'pǎo', meaning: 'run', hsk: 2 },
  { char: '笑', pinyin: 'xiào', meaning: 'laugh, smile', hsk: 2 },
  { char: '红', pinyin: 'hóng', meaning: 'red', hsk: 2 },
  { char: '白', pinyin: 'bái', meaning: 'white', hsk: 2 },
  { char: '黑', pinyin: 'hēi', meaning: 'black', hsk: 2 },
  { char: '开', pinyin: 'kāi', meaning: 'open', hsk: 2 },
  { char: '关', pinyin: 'guān', meaning: 'close', hsk: 2 },
  { char: '问', pinyin: 'wèn', meaning: 'ask', hsk: 2 },
  { char: '早', pinyin: 'zǎo', meaning: 'early, morning', hsk: 2 },
  { char: '晚', pinyin: 'wǎn', meaning: 'late, evening', hsk: 2 },
  { char: '忙', pinyin: 'máng', meaning: 'busy', hsk: 2 },
  { char: '累', pinyin: 'lèi', meaning: 'tired', hsk: 2 },
  { char: '冷', pinyin: 'lěng', meaning: 'cold', hsk: 2 },
  { char: '热', pinyin: 'rè', meaning: 'hot', hsk: 2 },
  { char: '花', pinyin: 'huā', meaning: 'flower', hsk: 2 },
  { char: '鸟', pinyin: 'niǎo', meaning: 'bird', hsk: 2 },
  { char: '鱼', pinyin: 'yú', meaning: 'fish', hsk: 2 },
  { char: '狗', pinyin: 'gǒu', meaning: 'dog', hsk: 2 },
  { char: '猫', pinyin: 'māo', meaning: 'cat', hsk: 2 },
  { char: '雨', pinyin: 'yǔ', meaning: 'rain', hsk: 2 },
  { char: '风', pinyin: 'fēng', meaning: 'wind', hsk: 2 },
  { char: '雪', pinyin: 'xuě', meaning: 'snow', hsk: 2 },
  { char: '飞', pinyin: 'fēi', meaning: 'fly', hsk: 2 },
  { char: '画', pinyin: 'huà', meaning: 'draw, painting', hsk: 2 },
  // HSK 3 (30 words)
  { char: '决', pinyin: 'jué', meaning: 'decide', hsk: 3 },
  { char: '定', pinyin: 'dìng', meaning: 'determine, fix', hsk: 3 },
  { char: '变', pinyin: 'biàn', meaning: 'change', hsk: 3 },
  { char: '化', pinyin: 'huà', meaning: 'transform', hsk: 3 },
  { char: '节', pinyin: 'jié', meaning: 'festival, section', hsk: 3 },
  { char: '习', pinyin: 'xí', meaning: 'practice', hsk: 3 },
  { char: '惯', pinyin: 'guàn', meaning: 'accustomed', hsk: 3 },
  { char: '历', pinyin: 'lì', meaning: 'experience', hsk: 3 },
  { char: '史', pinyin: 'shǐ', meaning: 'history', hsk: 3 },
  { char: '环', pinyin: 'huán', meaning: 'ring, loop', hsk: 3 },
  { char: '境', pinyin: 'jìng', meaning: 'territory', hsk: 3 },
  { char: '健', pinyin: 'jiàn', meaning: 'healthy', hsk: 3 },
  { char: '康', pinyin: 'kāng', meaning: 'well-being', hsk: 3 },
  { char: '影', pinyin: 'yǐng', meaning: 'shadow, movie', hsk: 3 },
  { char: '响', pinyin: 'xiǎng', meaning: 'sound, loud', hsk: 3 },
  { char: '极', pinyin: 'jí', meaning: 'extreme', hsk: 3 },
  { char: '聪', pinyin: 'cōng', meaning: 'clever', hsk: 3 },
  { char: '明', pinyin: 'míng', meaning: 'bright, clear', hsk: 3 },
  { char: '努', pinyin: 'nǔ', meaning: 'strive', hsk: 3 },
  { char: '力', pinyin: 'lì', meaning: 'power', hsk: 3 },
  { char: '感', pinyin: 'gǎn', meaning: 'feel', hsk: 3 },
  { char: '觉', pinyin: 'jué', meaning: 'sense, feel', hsk: 3 },
  { char: '安', pinyin: 'ān', meaning: 'peace, safe', hsk: 3 },
  { char: '全', pinyin: 'quán', meaning: 'complete, whole', hsk: 3 },
  { char: '世', pinyin: 'shì', meaning: 'world, era', hsk: 3 },
  { char: '界', pinyin: 'jiè', meaning: 'boundary, world', hsk: 3 },
  { char: '经', pinyin: 'jīng', meaning: 'pass through', hsk: 3 },
  { char: '济', pinyin: 'jì', meaning: 'economy', hsk: 3 },
  { char: '文', pinyin: 'wén', meaning: 'culture, text', hsk: 3 },
  { char: '艺', pinyin: 'yì', meaning: 'art, skill', hsk: 3 },
  // HSK 4 (20 words)
  { char: '复', pinyin: 'fù', meaning: 'repeat, complex', hsk: 4 },
  { char: '杂', pinyin: 'zá', meaning: 'miscellaneous', hsk: 4 },
  { char: '丰', pinyin: 'fēng', meaning: 'abundant', hsk: 4 },
  { char: '富', pinyin: 'fù', meaning: 'rich, wealthy', hsk: 4 },
  { char: '积', pinyin: 'jī', meaning: 'accumulate', hsk: 4 },
  { char: '极', pinyin: 'jí', meaning: 'extreme', hsk: 4 },
  { char: '竞', pinyin: 'jìng', meaning: 'compete', hsk: 4 },
  { char: '争', pinyin: 'zhēng', meaning: 'fight, argue', hsk: 4 },
  { char: '独', pinyin: 'dú', meaning: 'alone', hsk: 4 },
  { char: '特', pinyin: 'tè', meaning: 'special', hsk: 4 },
  { char: '缺', pinyin: 'quē', meaning: 'lack', hsk: 4 },
  { char: '乏', pinyin: 'fá', meaning: 'tired, lack', hsk: 4 },
  { char: '严', pinyin: 'yán', meaning: 'strict', hsk: 4 },
  { char: '格', pinyin: 'gé', meaning: 'standard, style', hsk: 4 },
  { char: '温', pinyin: 'wēn', meaning: 'warm, mild', hsk: 4 },
  { char: '柔', pinyin: 'róu', meaning: 'soft, gentle', hsk: 4 },
  { char: '勇', pinyin: 'yǒng', meaning: 'brave', hsk: 4 },
  { char: '敢', pinyin: 'gǎn', meaning: 'dare', hsk: 4 },
  { char: '智', pinyin: 'zhì', meaning: 'wisdom', hsk: 4 },
  { char: '慧', pinyin: 'huì', meaning: 'intelligent', hsk: 4 },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-TW';
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function HSKVocabulary() {
  const [level, setLevel] = useState(1);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let words = HSK_VOCAB.filter(w => w.hsk === level);
    if (search.trim()) {
      const q = search.toLowerCase();
      words = HSK_VOCAB.filter(w =>
        w.char.includes(q) || w.pinyin.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
      );
    }
    return words;
  }, [level, search]);

  const toggleSave = (char: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(char)) next.delete(char); else next.add(char);
      return next;
    });
  };

  const counts = useMemo(() => {
    const c: Record<number, number> = {};
    for (const w of HSK_VOCAB) c[w.hsk] = (c[w.hsk] || 0) + 1;
    return c;
  }, []);

  return (
    <div className="space-y-6">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by character, pinyin, or meaning..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
      />

      {/* Level Tabs */}
      {!search && (
        <div className="flex gap-2 overflow-x-auto">
          {[1, 2, 3, 4].map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                level === l ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              HSK {l} ({counts[l] || 0})
            </button>
          ))}
        </div>
      )}

      {/* Word Count */}
      <p className="text-sm text-gray-500">
        {search ? `Found ${filtered.length} results` : `HSK ${level}: ${filtered.length} words`}
      </p>

      {/* Word List */}
      <div className="space-y-2">
        {filtered.map((w, i) => (
          <div key={`${w.char}-${i}`} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
            <button
              onClick={() => speak(w.char)}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50 text-2xl font-bold hover:bg-blue-50 transition-colors flex-shrink-0"
            >
              {w.char}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-medium">{w.pinyin}</span>
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">HSK {w.hsk}</span>
              </div>
              <div className="text-sm text-gray-600 truncate">{w.meaning}</div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => speak(w.char)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center text-sm">🔊</button>
              <button onClick={() => toggleSave(w.char)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${saved.has(w.char) ? 'bg-yellow-100' : 'bg-gray-100 opacity-40 hover:opacity-70'}`}>
                {saved.has(w.char) ? '⭐' : '☆'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-400">No words found. Try a different search term.</div>
      )}
    </div>
  );
}
