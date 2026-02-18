import { useState } from 'react';

// Pinyin mapping for common characters (simplified → pinyin)
// This is a subset; a full implementation would use a larger dictionary
const PINYIN_MAP: Record<string, string> = {
  '你': 'nǐ', '好': 'hǎo', '我': 'wǒ', '是': 'shì', '的': 'de', '了': 'le',
  '不': 'bù', '在': 'zài', '他': 'tā', '她': 'tā', '它': 'tā', '们': 'men',
  '这': 'zhè', '那': 'nà', '有': 'yǒu', '人': 'rén', '大': 'dà', '小': 'xiǎo',
  '中': 'zhōng', '国': 'guó', '学': 'xué', '生': 'shēng', '时': 'shí', '候': 'hòu',
  '会': 'huì', '说': 'shuō', '来': 'lái', '去': 'qù', '做': 'zuò', '看': 'kàn',
  '吃': 'chī', '喝': 'hē', '想': 'xiǎng', '要': 'yào', '能': 'néng', '可': 'kě',
  '以': 'yǐ', '很': 'hěn', '都': 'dōu', '也': 'yě', '就': 'jiù', '还': 'hái',
  '什': 'shén', '么': 'me', '怎': 'zěn', '样': 'yàng', '多': 'duō', '少': 'shǎo',
  '几': 'jǐ', '个': 'gè', '年': 'nián', '月': 'yuè', '日': 'rì', '天': 'tiān',
  '上': 'shàng', '下': 'xià', '里': 'lǐ', '外': 'wài', '前': 'qián', '后': 'hòu',
  '左': 'zuǒ', '右': 'yòu', '东': 'dōng', '西': 'xī', '南': 'nán', '北': 'běi',
  '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ', '六': 'liù',
  '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí', '百': 'bǎi', '千': 'qiān',
  '万': 'wàn', '零': 'líng', '两': 'liǎng',
  '爸': 'bà', '妈': 'mā', '哥': 'gē', '姐': 'jiě', '弟': 'dì', '妹': 'mèi',
  '儿': 'ér', '子': 'zǐ', '女': 'nǚ', '男': 'nán', '老': 'lǎo', '师': 'shī',
  '朋': 'péng', '友': 'yǒu', '家': 'jiā', '爱': 'ài', '心': 'xīn', '手': 'shǒu',
  '头': 'tóu', '眼': 'yǎn', '睛': 'jīng', '耳': 'ěr', '口': 'kǒu', '鼻': 'bí',
  '身': 'shēn', '体': 'tǐ', '高': 'gāo', '长': 'cháng', '开': 'kāi', '关': 'guān',
  '门': 'mén', '水': 'shuǐ', '火': 'huǒ', '山': 'shān', '花': 'huā', '树': 'shù',
  '鸟': 'niǎo', '鱼': 'yú', '狗': 'gǒu', '猫': 'māo', '马': 'mǎ', '牛': 'niú',
  '羊': 'yáng', '猪': 'zhū', '鸡': 'jī', '龙': 'lóng', '虎': 'hǔ', '兔': 'tù',
  '蛇': 'shé', '鼠': 'shǔ', '猴': 'hóu',
  '红': 'hóng', '黄': 'huáng', '蓝': 'lán', '绿': 'lǜ', '白': 'bái', '黑': 'hēi',
  '书': 'shū', '写': 'xiě', '读': 'dú', '听': 'tīng', '话': 'huà', '字': 'zì',
  '工': 'gōng', '作': 'zuò', '事': 'shì', '情': 'qíng', '问': 'wèn', '题': 'tí',
  '名': 'míng', '电': 'diàn', '脑': 'nǎo', '车': 'chē', '路': 'lù', '走': 'zǒu',
  '跑': 'pǎo', '飞': 'fēi', '坐': 'zuò', '站': 'zhàn', '住': 'zhù', '买': 'mǎi',
  '卖': 'mài', '钱': 'qián', '块': 'kuài', '元': 'yuán', '点': 'diǎn', '分': 'fēn',
  '早': 'zǎo', '晚': 'wǎn', '午': 'wǔ', '今': 'jīn', '明': 'míng', '昨': 'zuó',
  '现': 'xiàn', '快': 'kuài', '慢': 'màn', '新': 'xīn', '旧': 'jiù', '对': 'duì',
  '错': 'cuò', '冷': 'lěng', '热': 'rè', '忙': 'máng', '累': 'lèi', '饿': 'è',
  '渴': 'kě', '高': 'gāo', '兴': 'xìng', '喜': 'xǐ', '欢': 'huān', '谢': 'xiè',
  '请': 'qǐng', '对': 'duì', '起': 'qǐ', '没': 'méi', '关': 'guān', '系': 'xì',
  '再': 'zài', '见': 'jiàn', '吧': 'ba', '呢': 'ne', '吗': 'ma', '啊': 'a',
  '和': 'hé', '但': 'dàn', '因': 'yīn', '为': 'wèi', '所': 'suǒ', '如': 'rú',
  '果': 'guǒ', '虽': 'suī', '然': 'rán', '已': 'yǐ', '经': 'jīng', '正': 'zhèng',
  '把': 'bǎ', '被': 'bèi', '让': 'ràng', '给': 'gěi', '跟': 'gēn', '比': 'bǐ',
  '从': 'cóng', '到': 'dào', '向': 'xiàng', '往': 'wǎng', '过': 'guò', '着': 'zhe',
  '地': 'de', '得': 'de', '种': 'zhǒng', '第': 'dì', '次': 'cì', '些': 'xiē',
  '每': 'měi', '最': 'zuì', '更': 'gèng', '太': 'tài', '非': 'fēi', '常': 'cháng',
  '真': 'zhēn', '别': 'bié', '只': 'zhǐ', '刚': 'gāng', '才': 'cái',
  '打': 'dǎ', '穿': 'chuān', '戴': 'dài', '带': 'dài', '用': 'yòng', '拿': 'ná',
  '放': 'fàng', '送': 'sòng', '回': 'huí', '进': 'jìn', '出': 'chū',
  '知': 'zhī', '道': 'dào', '觉': 'jué', '认': 'rèn', '识': 'shí', '记': 'jì',
  '懂': 'dǒng', '教': 'jiāo', '习': 'xí', '练': 'liàn', '考': 'kǎo', '试': 'shì',
  '班': 'bān', '课': 'kè', '校': 'xiào',
  '饭': 'fàn', '菜': 'cài', '米': 'mǐ', '面': 'miàn', '肉': 'ròu', '蛋': 'dàn',
  '茶': 'chá', '酒': 'jiǔ', '牛': 'niú', '奶': 'nǎi', '糖': 'táng', '盐': 'yán',
  '桌': 'zhuō', '椅': 'yǐ', '床': 'chuáng', '衣': 'yī', '服': 'fú', '裤': 'kù',
  '鞋': 'xié', '帽': 'mào', '包': 'bāo', '伞': 'sǎn',
  '春': 'chūn', '夏': 'xià', '秋': 'qiū', '冬': 'dōng', '雨': 'yǔ', '雪': 'xuě',
  '风': 'fēng', '云': 'yún', '星': 'xīng', '太': 'tài', '阳': 'yáng', '月': 'yuè',
  '亮': 'liàng',
  '医': 'yī', '院': 'yuàn', '银': 'yín', '行': 'háng', '商': 'shāng', '店': 'diàn',
  '机': 'jī', '场': 'chǎng', '公': 'gōng', '司': 'sī', '办': 'bàn',
  '城': 'chéng', '市': 'shì', '村': 'cūn', '河': 'hé', '湖': 'hú', '海': 'hǎi',
  '岛': 'dǎo', '台': 'tái', '湾': 'wān', '北': 'běi', '京': 'jīng', '港': 'gǎng',
  // Traditional character mappings
  '國': 'guó', '學': 'xué', '時': 'shí', '會': 'huì', '說': 'shuō', '來': 'lái',
  '東': 'dōng', '車': 'chē', '門': 'mén', '書': 'shū', '寫': 'xiě', '讀': 'dú',
  '聽': 'tīng', '話': 'huà', '電': 'diàn', '腦': 'nǎo', '買': 'mǎi', '賣': 'mài',
  '錢': 'qián', '點': 'diǎn', '現': 'xiàn', '關': 'guān', '見': 'jiàn', '經': 'jīng',
  '認': 'rèn', '識': 'shí', '記': 'jì', '練': 'liàn', '習': 'xí', '試': 'shì',
  '課': 'kè', '飯': 'fàn', '麵': 'miàn', '雞': 'jī', '魚': 'yú', '鳥': 'niǎo',
  '馬': 'mǎ', '龍': 'lóng', '長': 'cháng', '開': 'kāi', '紅': 'hóng', '藍': 'lán',
  '綠': 'lǜ', '黃': 'huáng', '華': 'huá', '語': 'yǔ', '對': 'duì', '問': 'wèn',
  '題': 'tí', '讓': 'ràng', '給': 'gěi', '從': 'cóng', '過': 'guò', '進': 'jìn',
  '這': 'zhè', '還': 'hái', '裡': 'lǐ', '後': 'hòu', '種': 'zhǒng',
  '愛': 'ài', '歡': 'huān', '請': 'qǐng', '謝': 'xiè', '飛': 'fēi',
  '樹': 'shù', '風': 'fēng', '雲': 'yún', '島': 'dǎo', '灣': 'wān',
  '醫': 'yī', '銀': 'yín', '機': 'jī', '場': 'chǎng', '辦': 'bàn',
};

function toPinyin(text: string): { char: string; pinyin: string }[] {
  const result: { char: string; pinyin: string }[] = [];
  for (const char of text) {
    if (PINYIN_MAP[char]) {
      result.push({ char, pinyin: PINYIN_MAP[char] });
    } else if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(char)) {
      result.push({ char, pinyin: '?' });
    } else {
      result.push({ char, pinyin: '' });
    }
  }
  return result;
}

function speak(text: string, lang: string = 'zh-TW') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function PinyinConverter() {
  const [input, setInput] = useState('');
  const [speed, setSpeed] = useState<'normal' | 'slow'>('normal');

  const results = input.trim() ? toPinyin(input) : [];
  const pinyinText = results.map(r => r.pinyin || r.char).join(' ').replace(/\s+/g, ' ');
  const hasResults = results.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Chinese Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入中文... e.g. 你好，我是學生。"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      {hasResults && (
        <>
          {/* Character by character display */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-700">Pinyin Result</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => speak(input, 'zh-TW')}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  title="Listen"
                >
                  🔊
                </button>
                <button
                  onClick={() => {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance(input);
                    u.lang = 'zh-TW';
                    u.rate = 0.6;
                    window.speechSynthesis.speak(u);
                  }}
                  className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200"
                >
                  🐢 Slow
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {results.map((r, i) => (
                <div key={i} className="text-center min-w-[2.5rem]">
                  {r.pinyin && (
                    <div className="text-sm text-blue-600 font-medium">{r.pinyin}</div>
                  )}
                  <div className="text-2xl">{r.char}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Plain pinyin */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Plain Pinyin (copy-friendly)</h3>
              <button
                onClick={() => navigator.clipboard?.writeText(pinyinText)}
                className="text-xs px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                📋 Copy
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-lg text-blue-600 font-medium">
              {pinyinText}
            </div>
          </div>

          {/* Note about coverage */}
          <p className="text-xs text-gray-400">
            💡 This tool covers 300+ common characters. Characters showing "?" are not in our dictionary yet.
            For full coverage, try pasting shorter phrases.
          </p>
        </>
      )}
    </div>
  );
}
