import { useState } from 'react';

// Simplified → Traditional mapping (common characters)
const S2T: Record<string, string> = {
  '国': '國', '学': '學', '时': '時', '会': '會', '说': '說', '来': '來',
  '东': '東', '车': '車', '门': '門', '书': '書', '写': '寫', '读': '讀',
  '听': '聽', '话': '話', '电': '電', '脑': '腦', '买': '買', '卖': '賣',
  '钱': '錢', '点': '點', '现': '現', '关': '關', '见': '見', '经': '經',
  '认': '認', '识': '識', '记': '記', '练': '練', '习': '習', '试': '試',
  '课': '課', '饭': '飯', '面': '麵', '鸡': '雞', '鱼': '魚', '鸟': '鳥',
  '马': '馬', '龙': '龍', '长': '長', '开': '開', '红': '紅', '蓝': '藍',
  '绿': '綠', '黄': '黃', '华': '華', '语': '語', '对': '對', '问': '問',
  '题': '題', '让': '讓', '给': '給', '从': '從', '过': '過', '进': '進',
  '这': '這', '还': '還', '里': '裡', '后': '後', '种': '種', '爱': '愛',
  '欢': '歡', '请': '請', '谢': '謝', '飞': '飛', '树': '樹', '风': '風',
  '云': '雲', '岛': '島', '湾': '灣', '医': '醫', '银': '銀', '机': '機',
  '场': '場', '办': '辦', '们': '們', '儿': '兒', '两': '兩', '万': '萬',
  '发': '發', '头': '頭', '实': '實', '产': '產', '动': '動', '务': '務',
  '报': '報', '达': '達', '变': '變', '号': '號', '乐': '樂', '为': '為',
  '义': '義', '气': '氣', '广': '廣', '庆': '慶', '应': '應', '价': '價',
  '亿': '億', '选': '選', '运': '運', '设': '設', '战': '戰', '农': '農',
  '级': '級', '组': '組', '线': '線', '区': '區', '领': '領', '导': '導',
  '决': '決', '条': '條', '则': '則', '团': '團', '资': '資', '济': '濟',
  '术': '術', '欢': '歡', '观': '觀', '规': '規', '难': '難', '护': '護',
  '妈': '媽', '宝': '寶', '贝': '貝', '杂': '雜', '网': '網', '乡': '鄉',
  '县': '縣', '处': '處', '备': '備', '复': '復', '师': '師', '带': '帶',
  '属': '屬', '标': '標', '热': '熱', '据': '據', '单': '單', '亲': '親',
  '证': '證', '转': '轉', '传': '傳', '参': '參', '确': '確', '响': '響',
  '调': '調', '议': '議', '离': '離', '细': '細', '统': '統', '创': '創',
  '独': '獨', '极': '極', '尽': '盡', '丰': '豐', '历': '歷', '乱': '亂',
  '惊': '驚', '怀': '懷', '态': '態', '构': '構', '画': '畫', '质': '質',
  '谁': '誰', '错': '錯', '叶': '葉', '旧': '舊', '减': '減', '适': '適',
  '阅': '閱', '体': '體', '输': '輸', '竞': '競', '获': '獲', '称': '稱',
  '积': '積', '续': '續', '际': '際', '须': '須', '随': '隨', '约': '約',
  '强': '強', '尝': '嘗', '显': '顯', '类': '類', '张': '張', '刘': '劉',
  '陈': '陳', '杨': '楊', '赵': '趙', '孙': '孫', '罗': '羅', '许': '許',
  '郑': '鄭', '园': '園', '楼': '樓', '梦': '夢', '边': '邊', '连': '連',
  '严': '嚴', '够': '夠', '药': '藥', '脏': '髒', '尔': '爾', '权': '權',
  '铁': '鐵', '钟': '鐘', '仅': '僅', '够': '夠', '兰': '蘭', '亚': '亞',
  '丽': '麗', '仓': '倉', '众': '眾', '优': '優', '伤': '傷', '余': '餘',
  '宁': '寧', '异': '異', '毕': '畢', '苏': '蘇', '签': '簽', '举': '舉',
};

// Build reverse map
const T2S: Record<string, string> = {};
for (const [s, t] of Object.entries(S2T)) {
  T2S[t] = s;
}

function convert(text: string, direction: 'toTraditional' | 'toSimplified'): string {
  const map = direction === 'toTraditional' ? S2T : T2S;
  return [...text].map(ch => map[ch] || ch).join('');
}

function speak(text: string, lang: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function TraditionalSimplifiedConverter() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'toTraditional' | 'toSimplified'>('toTraditional');

  const output = input.trim() ? convert(input, direction) : '';

  return (
    <div className="space-y-6">
      {/* Direction Toggle */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => setDirection('toTraditional')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            direction === 'toTraditional'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          简体 → 繁體 (Simplified → Traditional)
        </button>
        <button
          onClick={() => setDirection('toSimplified')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            direction === 'toSimplified'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          繁體 → 简体 (Traditional → Simplified)
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {direction === 'toTraditional' ? 'Enter Simplified Chinese' : 'Enter Traditional Chinese'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={direction === 'toTraditional' ? '输入简体中文...' : '輸入繁體中文...'}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {direction === 'toTraditional' ? 'Traditional Chinese (繁體)' : 'Simplified Chinese (简体)'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => speak(output, direction === 'toTraditional' ? 'zh-TW' : 'zh-CN')}
                className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                title="Listen"
              >
                🔊
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(output)}
                className="text-xs px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                📋 Copy
              </button>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xl leading-relaxed">
            {output}
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-3 text-sm text-gray-500">
            <span>Characters: {output.length}</span>
            <span>Converted: {[...input].filter((ch, i) => ch !== output[i]).length} characters changed</span>
          </div>
        </div>
      )}

      {/* Swap Button */}
      {output && (
        <button
          onClick={() => {
            setInput(output);
            setDirection(d => d === 'toTraditional' ? 'toSimplified' : 'toTraditional');
          }}
          className="w-full py-3 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-all"
        >
          🔄 Swap Direction
        </button>
      )}
    </div>
  );
}
