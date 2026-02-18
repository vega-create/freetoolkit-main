import { useState } from 'react';

const RADICALS = [
  { radical: '人', pinyin: 'rén', meaning: 'person', strokes: 2, examples: ['你', '他', '们', '休', '仁', '位', '住', '作'] },
  { radical: '口', pinyin: 'kǒu', meaning: 'mouth', strokes: 3, examples: ['吃', '喝', '叫', '吗', '呢', '听', '告', '唱'] },
  { radical: '心', pinyin: 'xīn', meaning: 'heart', strokes: 4, examples: ['想', '思', '忙', '快', '怕', '情', '感', '意'] },
  { radical: '手', pinyin: 'shǒu', meaning: 'hand', strokes: 4, examples: ['打', '找', '把', '拿', '推', '拉', '接', '提'] },
  { radical: '水', pinyin: 'shuǐ', meaning: 'water', strokes: 4, examples: ['河', '海', '洗', '游', '泳', '汁', '汤', '湖'] },
  { radical: '火', pinyin: 'huǒ', meaning: 'fire', strokes: 4, examples: ['热', '烤', '烧', '灯', '炒', '煮', '蒸', '炸'] },
  { radical: '木', pinyin: 'mù', meaning: 'wood, tree', strokes: 4, examples: ['树', '林', '森', '桌', '椅', '果', '杯', '板'] },
  { radical: '土', pinyin: 'tǔ', meaning: 'earth, soil', strokes: 3, examples: ['地', '场', '城', '坐', '块', '坏', '堂', '墙'] },
  { radical: '金', pinyin: 'jīn', meaning: 'metal, gold', strokes: 8, examples: ['银', '铁', '钟', '钱', '针', '锅', '错', '链'] },
  { radical: '日', pinyin: 'rì', meaning: 'sun, day', strokes: 4, examples: ['明', '早', '晚', '时', '春', '星', '晴', '暖'] },
  { radical: '月', pinyin: 'yuè', meaning: 'moon, month', strokes: 4, examples: ['朋', '服', '脸', '胖', '脑', '腿', '朝', '期'] },
  { radical: '女', pinyin: 'nǚ', meaning: 'woman', strokes: 3, examples: ['妈', '姐', '妹', '好', '她', '姓', '婚', '嫁'] },
  { radical: '言', pinyin: 'yán', meaning: 'speech, word', strokes: 7, examples: ['说', '话', '请', '谢', '读', '课', '语', '记'] },
  { radical: '走', pinyin: 'zǒu', meaning: 'walk', strokes: 7, examples: ['跑', '路', '跳', '踢', '趣', '超', '越', '足'] },
  { radical: '食', pinyin: 'shí', meaning: 'food, eat', strokes: 9, examples: ['饭', '饿', '饮', '饼', '馆', '饺', '馒', '饱'] },
  { radical: '衣', pinyin: 'yī', meaning: 'clothing', strokes: 6, examples: ['裤', '被', '裙', '衫', '袜', '补', '初', '衬'] },
  { radical: '目', pinyin: 'mù', meaning: 'eye', strokes: 5, examples: ['看', '睡', '眼', '睛', '盲', '瞪', '眉', '盯'] },
  { radical: '竹', pinyin: 'zhú', meaning: 'bamboo', strokes: 6, examples: ['笑', '笔', '筷', '篮', '简', '算', '答', '等'] },
  { radical: '草', pinyin: 'cǎo', meaning: 'grass, plant', strokes: 3, examples: ['花', '茶', '药', '菜', '蓝', '苹', '落', '英'] },
  { radical: '虫', pinyin: 'chóng', meaning: 'insect', strokes: 6, examples: ['蛇', '蛋', '蝴', '蝶', '蜜', '蜂', '虾', '蚊'] },
  { radical: '山', pinyin: 'shān', meaning: 'mountain', strokes: 3, examples: ['岛', '岸', '崇', '岩', '峰', '崩', '嵐', '岭'] },
  { radical: '雨', pinyin: 'yǔ', meaning: 'rain', strokes: 8, examples: ['雪', '雷', '云', '零', '需', '霜', '雾', '霸'] },
  { radical: '门', pinyin: 'mén', meaning: 'door, gate', strokes: 3, examples: ['问', '间', '闻', '关', '开', '闹', '闲', '闪'] },
  { radical: '车', pinyin: 'chē', meaning: 'vehicle', strokes: 4, examples: ['辆', '转', '轮', '软', '轻', '载', '输', '辩'] },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-TW';
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function RadicalLookup() {
  const [search, setSearch] = useState('');
  const [selectedRadical, setSelectedRadical] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'strokes' | 'pinyin'>('strokes');

  const sorted = [...RADICALS].sort((a, b) =>
    sortBy === 'strokes' ? a.strokes - b.strokes : a.pinyin.localeCompare(b.pinyin)
  );

  const filtered = search.trim()
    ? sorted.filter(r =>
        r.radical.includes(search) || r.pinyin.includes(search.toLowerCase()) ||
        r.meaning.toLowerCase().includes(search.toLowerCase()) ||
        r.examples.some(e => e.includes(search))
      )
    : sorted;

  const selected = selectedRadical ? RADICALS.find(r => r.radical === selectedRadical) : null;

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by radical, pinyin, meaning, or character..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
      />

      <div className="flex gap-2">
        <button onClick={() => setSortBy('strokes')} className={`px-3 py-1 rounded text-sm ${sortBy === 'strokes' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>By Strokes</button>
        <button onClick={() => setSortBy('pinyin')} className={`px-3 py-1 rounded text-sm ${sortBy === 'pinyin' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>By Pinyin</button>
      </div>

      {/* Selected Radical Detail */}
      {selected && (
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center gap-4 mb-3">
            <div className="text-5xl font-bold cursor-pointer hover:text-blue-600" onClick={() => speak(selected.radical)}>{selected.radical}</div>
            <div>
              <div className="text-lg text-blue-600 font-medium">{selected.pinyin}</div>
              <div className="text-gray-600">{selected.meaning}</div>
              <div className="text-xs text-gray-400">{selected.strokes} strokes</div>
            </div>
            <button onClick={() => setSelectedRadical(null)} className="ml-auto text-gray-400 hover:text-red-500 text-xl">✕</button>
          </div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Characters with this radical:</h4>
          <div className="flex flex-wrap gap-2">
            {selected.examples.map(ex => (
              <button key={ex} onClick={() => speak(ex)} className="w-12 h-12 rounded-lg bg-white border text-xl font-bold hover:bg-blue-100 hover:border-blue-300 transition-all">
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Radical Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {filtered.map(r => (
          <button
            key={r.radical}
            onClick={() => setSelectedRadical(r.radical === selectedRadical ? null : r.radical)}
            className={`p-3 rounded-lg border text-center transition-all ${
              selectedRadical === r.radical
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl font-bold">{r.radical}</div>
            <div className="text-xs text-blue-600">{r.pinyin}</div>
            <div className="text-xs text-gray-400">{r.strokes}画</div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-400">No radicals found.</div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Showing {filtered.length} of {RADICALS.length} common radicals
      </p>
    </div>
  );
}
