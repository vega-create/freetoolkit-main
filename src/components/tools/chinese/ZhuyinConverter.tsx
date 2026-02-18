import { useState } from 'react';

// Pinyin to Zhuyin mapping
const P2Z: Record<string, string> = {
  // Initials
  'b': 'ㄅ', 'p': 'ㄆ', 'm': 'ㄇ', 'f': 'ㄈ',
  'd': 'ㄉ', 't': 'ㄊ', 'n': 'ㄋ', 'l': 'ㄌ',
  'g': 'ㄍ', 'k': 'ㄎ', 'h': 'ㄏ',
  'j': 'ㄐ', 'q': 'ㄑ', 'x': 'ㄒ',
  'zh': 'ㄓ', 'ch': 'ㄔ', 'sh': 'ㄕ', 'r': 'ㄖ',
  'z': 'ㄗ', 'c': 'ㄘ', 's': 'ㄙ',
};

// Full syllable mappings (pinyin without tone → zhuyin)
const SYLLABLE_MAP: Record<string, string> = {
  'a': 'ㄚ', 'o': 'ㄛ', 'e': 'ㄜ', 'ai': 'ㄞ', 'ei': 'ㄟ', 'ao': 'ㄠ', 'ou': 'ㄡ',
  'an': 'ㄢ', 'en': 'ㄣ', 'ang': 'ㄤ', 'eng': 'ㄥ', 'er': 'ㄦ',
  'yi': 'ㄧ', 'ya': 'ㄧㄚ', 'ye': 'ㄧㄝ', 'yao': 'ㄧㄠ', 'you': 'ㄧㄡ',
  'yan': 'ㄧㄢ', 'yin': 'ㄧㄣ', 'yang': 'ㄧㄤ', 'ying': 'ㄧㄥ',
  'wu': 'ㄨ', 'wa': 'ㄨㄚ', 'wo': 'ㄨㄛ', 'wai': 'ㄨㄞ', 'wei': 'ㄨㄟ',
  'wan': 'ㄨㄢ', 'wen': 'ㄨㄣ', 'wang': 'ㄨㄤ', 'weng': 'ㄨㄥ',
  'yu': 'ㄩ', 'yue': 'ㄩㄝ', 'yuan': 'ㄩㄢ', 'yun': 'ㄩㄣ', 'yong': 'ㄩㄥ',
  // With initials
  'ba': 'ㄅㄚ', 'bo': 'ㄅㄛ', 'bi': 'ㄅㄧ', 'bu': 'ㄅㄨ', 'bai': 'ㄅㄞ', 'bei': 'ㄅㄟ',
  'bao': 'ㄅㄠ', 'ban': 'ㄅㄢ', 'ben': 'ㄅㄣ', 'bang': 'ㄅㄤ', 'beng': 'ㄅㄥ',
  'bian': 'ㄅㄧㄢ', 'biao': 'ㄅㄧㄠ', 'bie': 'ㄅㄧㄝ', 'bin': 'ㄅㄧㄣ', 'bing': 'ㄅㄧㄥ',
  'pa': 'ㄆㄚ', 'po': 'ㄆㄛ', 'pi': 'ㄆㄧ', 'pu': 'ㄆㄨ', 'pai': 'ㄆㄞ', 'pei': 'ㄆㄟ',
  'pao': 'ㄆㄠ', 'pou': 'ㄆㄡ', 'pan': 'ㄆㄢ', 'pen': 'ㄆㄣ', 'pang': 'ㄆㄤ', 'peng': 'ㄆㄥ',
  'pian': 'ㄆㄧㄢ', 'piao': 'ㄆㄧㄠ', 'pie': 'ㄆㄧㄝ', 'pin': 'ㄆㄧㄣ', 'ping': 'ㄆㄧㄥ',
  'ma': 'ㄇㄚ', 'mo': 'ㄇㄛ', 'me': 'ㄇㄜ', 'mi': 'ㄇㄧ', 'mu': 'ㄇㄨ',
  'mai': 'ㄇㄞ', 'mei': 'ㄇㄟ', 'mao': 'ㄇㄠ', 'mou': 'ㄇㄡ',
  'man': 'ㄇㄢ', 'men': 'ㄇㄣ', 'mang': 'ㄇㄤ', 'meng': 'ㄇㄥ',
  'mian': 'ㄇㄧㄢ', 'miao': 'ㄇㄧㄠ', 'mie': 'ㄇㄧㄝ', 'min': 'ㄇㄧㄣ', 'ming': 'ㄇㄧㄥ', 'miu': 'ㄇㄧㄡ',
  'fa': 'ㄈㄚ', 'fo': 'ㄈㄛ', 'fu': 'ㄈㄨ', 'fei': 'ㄈㄟ', 'fan': 'ㄈㄢ', 'fen': 'ㄈㄣ',
  'fang': 'ㄈㄤ', 'feng': 'ㄈㄥ', 'fou': 'ㄈㄡ',
  'da': 'ㄉㄚ', 'de': 'ㄉㄜ', 'di': 'ㄉㄧ', 'du': 'ㄉㄨ', 'dai': 'ㄉㄞ', 'dei': 'ㄉㄟ',
  'dao': 'ㄉㄠ', 'dou': 'ㄉㄡ', 'dan': 'ㄉㄢ', 'dang': 'ㄉㄤ', 'deng': 'ㄉㄥ', 'dong': 'ㄉㄨㄥ',
  'dian': 'ㄉㄧㄢ', 'diao': 'ㄉㄧㄠ', 'die': 'ㄉㄧㄝ', 'ding': 'ㄉㄧㄥ', 'diu': 'ㄉㄧㄡ',
  'dui': 'ㄉㄨㄟ', 'duan': 'ㄉㄨㄢ', 'dun': 'ㄉㄨㄣ', 'duo': 'ㄉㄨㄛ',
  'ta': 'ㄊㄚ', 'te': 'ㄊㄜ', 'ti': 'ㄊㄧ', 'tu': 'ㄊㄨ', 'tai': 'ㄊㄞ', 'tao': 'ㄊㄠ',
  'tou': 'ㄊㄡ', 'tan': 'ㄊㄢ', 'tang': 'ㄊㄤ', 'teng': 'ㄊㄥ', 'tong': 'ㄊㄨㄥ',
  'tian': 'ㄊㄧㄢ', 'tiao': 'ㄊㄧㄠ', 'tie': 'ㄊㄧㄝ', 'ting': 'ㄊㄧㄥ',
  'tui': 'ㄊㄨㄟ', 'tuan': 'ㄊㄨㄢ', 'tun': 'ㄊㄨㄣ', 'tuo': 'ㄊㄨㄛ',
  'na': 'ㄋㄚ', 'ne': 'ㄋㄜ', 'ni': 'ㄋㄧ', 'nu': 'ㄋㄨ', 'nv': 'ㄋㄩ',
  'nai': 'ㄋㄞ', 'nei': 'ㄋㄟ', 'nao': 'ㄋㄠ', 'nou': 'ㄋㄡ',
  'nan': 'ㄋㄢ', 'nen': 'ㄋㄣ', 'nang': 'ㄋㄤ', 'neng': 'ㄋㄥ', 'nong': 'ㄋㄨㄥ',
  'nian': 'ㄋㄧㄢ', 'niao': 'ㄋㄧㄠ', 'nie': 'ㄋㄧㄝ', 'nin': 'ㄋㄧㄣ', 'ning': 'ㄋㄧㄥ', 'niu': 'ㄋㄧㄡ',
  'nue': 'ㄋㄩㄝ',
  'la': 'ㄌㄚ', 'le': 'ㄌㄜ', 'li': 'ㄌㄧ', 'lu': 'ㄌㄨ', 'lv': 'ㄌㄩ',
  'lai': 'ㄌㄞ', 'lei': 'ㄌㄟ', 'lao': 'ㄌㄠ', 'lou': 'ㄌㄡ',
  'lan': 'ㄌㄢ', 'lang': 'ㄌㄤ', 'leng': 'ㄌㄥ', 'long': 'ㄌㄨㄥ',
  'lian': 'ㄌㄧㄢ', 'liao': 'ㄌㄧㄠ', 'lie': 'ㄌㄧㄝ', 'lin': 'ㄌㄧㄣ', 'ling': 'ㄌㄧㄥ', 'liu': 'ㄌㄧㄡ',
  'lue': 'ㄌㄩㄝ', 'luan': 'ㄌㄨㄢ', 'lun': 'ㄌㄨㄣ', 'luo': 'ㄌㄨㄛ',
  'ga': 'ㄍㄚ', 'ge': 'ㄍㄜ', 'gu': 'ㄍㄨ', 'gai': 'ㄍㄞ', 'gei': 'ㄍㄟ',
  'gao': 'ㄍㄠ', 'gou': 'ㄍㄡ', 'gan': 'ㄍㄢ', 'gen': 'ㄍㄣ', 'gang': 'ㄍㄤ', 'geng': 'ㄍㄥ', 'gong': 'ㄍㄨㄥ',
  'gua': 'ㄍㄨㄚ', 'guai': 'ㄍㄨㄞ', 'gui': 'ㄍㄨㄟ', 'guan': 'ㄍㄨㄢ', 'gun': 'ㄍㄨㄣ', 'guang': 'ㄍㄨㄤ', 'guo': 'ㄍㄨㄛ',
  'ka': 'ㄎㄚ', 'ke': 'ㄎㄜ', 'ku': 'ㄎㄨ', 'kai': 'ㄎㄞ', 'kao': 'ㄎㄠ', 'kou': 'ㄎㄡ',
  'kan': 'ㄎㄢ', 'ken': 'ㄎㄣ', 'kang': 'ㄎㄤ', 'keng': 'ㄎㄥ', 'kong': 'ㄎㄨㄥ',
  'kua': 'ㄎㄨㄚ', 'kuai': 'ㄎㄨㄞ', 'kui': 'ㄎㄨㄟ', 'kuan': 'ㄎㄨㄢ', 'kun': 'ㄎㄨㄣ', 'kuang': 'ㄎㄨㄤ', 'kuo': 'ㄎㄨㄛ',
  'ha': 'ㄏㄚ', 'he': 'ㄏㄜ', 'hu': 'ㄏㄨ', 'hai': 'ㄏㄞ', 'hei': 'ㄏㄟ',
  'hao': 'ㄏㄠ', 'hou': 'ㄏㄡ', 'han': 'ㄏㄢ', 'hen': 'ㄏㄣ', 'hang': 'ㄏㄤ', 'heng': 'ㄏㄥ', 'hong': 'ㄏㄨㄥ',
  'hua': 'ㄏㄨㄚ', 'huai': 'ㄏㄨㄞ', 'hui': 'ㄏㄨㄟ', 'huan': 'ㄏㄨㄢ', 'hun': 'ㄏㄨㄣ', 'huang': 'ㄏㄨㄤ', 'huo': 'ㄏㄨㄛ',
  'ji': 'ㄐㄧ', 'jia': 'ㄐㄧㄚ', 'jie': 'ㄐㄧㄝ', 'jiao': 'ㄐㄧㄠ', 'jiu': 'ㄐㄧㄡ',
  'jian': 'ㄐㄧㄢ', 'jin': 'ㄐㄧㄣ', 'jiang': 'ㄐㄧㄤ', 'jing': 'ㄐㄧㄥ', 'jiong': 'ㄐㄩㄥ',
  'ju': 'ㄐㄩ', 'jue': 'ㄐㄩㄝ', 'juan': 'ㄐㄩㄢ', 'jun': 'ㄐㄩㄣ',
  'qi': 'ㄑㄧ', 'qia': 'ㄑㄧㄚ', 'qie': 'ㄑㄧㄝ', 'qiao': 'ㄑㄧㄠ', 'qiu': 'ㄑㄧㄡ',
  'qian': 'ㄑㄧㄢ', 'qin': 'ㄑㄧㄣ', 'qiang': 'ㄑㄧㄤ', 'qing': 'ㄑㄧㄥ', 'qiong': 'ㄑㄩㄥ',
  'qu': 'ㄑㄩ', 'que': 'ㄑㄩㄝ', 'quan': 'ㄑㄩㄢ', 'qun': 'ㄑㄩㄣ',
  'xi': 'ㄒㄧ', 'xia': 'ㄒㄧㄚ', 'xie': 'ㄒㄧㄝ', 'xiao': 'ㄒㄧㄠ', 'xiu': 'ㄒㄧㄡ',
  'xian': 'ㄒㄧㄢ', 'xin': 'ㄒㄧㄣ', 'xiang': 'ㄒㄧㄤ', 'xing': 'ㄒㄧㄥ', 'xiong': 'ㄒㄩㄥ',
  'xu': 'ㄒㄩ', 'xue': 'ㄒㄩㄝ', 'xuan': 'ㄒㄩㄢ', 'xun': 'ㄒㄩㄣ',
  'zha': 'ㄓㄚ', 'zhe': 'ㄓㄜ', 'zhi': 'ㄓ', 'zhu': 'ㄓㄨ', 'zhai': 'ㄓㄞ',
  'zhao': 'ㄓㄠ', 'zhou': 'ㄓㄡ', 'zhan': 'ㄓㄢ', 'zhen': 'ㄓㄣ', 'zhang': 'ㄓㄤ', 'zheng': 'ㄓㄥ', 'zhong': 'ㄓㄨㄥ',
  'zhua': 'ㄓㄨㄚ', 'zhuai': 'ㄓㄨㄞ', 'zhui': 'ㄓㄨㄟ', 'zhuan': 'ㄓㄨㄢ', 'zhun': 'ㄓㄨㄣ', 'zhuang': 'ㄓㄨㄤ', 'zhuo': 'ㄓㄨㄛ',
  'cha': 'ㄔㄚ', 'che': 'ㄔㄜ', 'chi': 'ㄔ', 'chu': 'ㄔㄨ', 'chai': 'ㄔㄞ',
  'chao': 'ㄔㄠ', 'chou': 'ㄔㄡ', 'chan': 'ㄔㄢ', 'chen': 'ㄔㄣ', 'chang': 'ㄔㄤ', 'cheng': 'ㄔㄥ', 'chong': 'ㄔㄨㄥ',
  'chua': 'ㄔㄨㄚ', 'chuai': 'ㄔㄨㄞ', 'chui': 'ㄔㄨㄟ', 'chuan': 'ㄔㄨㄢ', 'chun': 'ㄔㄨㄣ', 'chuang': 'ㄔㄨㄤ', 'chuo': 'ㄔㄨㄛ',
  'sha': 'ㄕㄚ', 'she': 'ㄕㄜ', 'shi': 'ㄕ', 'shu': 'ㄕㄨ', 'shai': 'ㄕㄞ',
  'shao': 'ㄕㄠ', 'shou': 'ㄕㄡ', 'shan': 'ㄕㄢ', 'shen': 'ㄕㄣ', 'shang': 'ㄕㄤ', 'sheng': 'ㄕㄥ',
  'shua': 'ㄕㄨㄚ', 'shuai': 'ㄕㄨㄞ', 'shui': 'ㄕㄨㄟ', 'shuan': 'ㄕㄨㄢ', 'shun': 'ㄕㄨㄣ', 'shuang': 'ㄕㄨㄤ', 'shuo': 'ㄕㄨㄛ',
  'ri': 'ㄖ', 'ru': 'ㄖㄨ', 'ran': 'ㄖㄢ', 'ren': 'ㄖㄣ', 'rang': 'ㄖㄤ', 'reng': 'ㄖㄥ', 'rong': 'ㄖㄨㄥ',
  'rui': 'ㄖㄨㄟ', 'ruan': 'ㄖㄨㄢ', 'run': 'ㄖㄨㄣ', 'ruo': 'ㄖㄨㄛ', 'rao': 'ㄖㄠ', 'rou': 'ㄖㄡ', 're': 'ㄖㄜ',
  'za': 'ㄗㄚ', 'ze': 'ㄗㄜ', 'zi': 'ㄗ', 'zu': 'ㄗㄨ', 'zai': 'ㄗㄞ',
  'zao': 'ㄗㄠ', 'zou': 'ㄗㄡ', 'zan': 'ㄗㄢ', 'zen': 'ㄗㄣ', 'zang': 'ㄗㄤ', 'zeng': 'ㄗㄥ', 'zong': 'ㄗㄨㄥ',
  'zui': 'ㄗㄨㄟ', 'zuan': 'ㄗㄨㄢ', 'zun': 'ㄗㄨㄣ', 'zuo': 'ㄗㄨㄛ',
  'ca': 'ㄘㄚ', 'ce': 'ㄘㄜ', 'ci': 'ㄘ', 'cu': 'ㄘㄨ', 'cai': 'ㄘㄞ',
  'cao': 'ㄘㄠ', 'cou': 'ㄘㄡ', 'can': 'ㄘㄢ', 'cen': 'ㄘㄣ', 'cang': 'ㄘㄤ', 'ceng': 'ㄘㄥ', 'cong': 'ㄘㄨㄥ',
  'cui': 'ㄘㄨㄟ', 'cuan': 'ㄘㄨㄢ', 'cun': 'ㄘㄨㄣ', 'cuo': 'ㄘㄨㄛ',
  'sa': 'ㄙㄚ', 'se': 'ㄙㄜ', 'si': 'ㄙ', 'su': 'ㄙㄨ', 'sai': 'ㄙㄞ',
  'sao': 'ㄙㄠ', 'sou': 'ㄙㄡ', 'san': 'ㄙㄢ', 'sen': 'ㄙㄣ', 'sang': 'ㄙㄤ', 'seng': 'ㄙㄥ', 'song': 'ㄙㄨㄥ',
  'sui': 'ㄙㄨㄟ', 'suan': 'ㄙㄨㄢ', 'sun': 'ㄙㄨㄣ', 'suo': 'ㄙㄨㄛ',
};

const TONE_MARKS: Record<string, number> = {
  'ā': 1, 'á': 2, 'ǎ': 3, 'à': 4,
  'ē': 1, 'é': 2, 'ě': 3, 'è': 4,
  'ī': 1, 'í': 2, 'ǐ': 3, 'ì': 4,
  'ō': 1, 'ó': 2, 'ǒ': 3, 'ò': 4,
  'ū': 1, 'ú': 2, 'ǔ': 3, 'ù': 4,
  'ǖ': 1, 'ǘ': 2, 'ǚ': 3, 'ǜ': 4,
};

const ZHUYIN_TONES = ['', '', 'ˊ', 'ˇ', 'ˋ', '˙'];

function stripTone(pinyin: string): { base: string; tone: number } {
  let tone = 0;
  let base = pinyin.toLowerCase();
  for (const [mark, t] of Object.entries(TONE_MARKS)) {
    if (base.includes(mark)) {
      tone = t;
      base = base.replace(mark, mark.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
      break;
    }
  }
  // Handle ü
  base = base.replace('ü', 'v');
  return { base, tone };
}

function pinyinToZhuyin(pinyin: string): string {
  const { base, tone } = stripTone(pinyin.trim());
  const zhuyin = SYLLABLE_MAP[base];
  if (!zhuyin) return pinyin;
  const toneChar = tone === 1 ? '' : ZHUYIN_TONES[tone] || '';
  return zhuyin + toneChar;
}

function convertText(text: string): { pinyin: string; zhuyin: string }[] {
  const syllables = text.trim().split(/[\s,，。！？、；：]+/).filter(Boolean);
  const results: { pinyin: string; zhuyin: string }[] = [];
  for (const s of syllables) {
    // Split compound pinyin (e.g. "nihao" → "ni hao" won't happen, user should space them)
    results.push({ pinyin: s, zhuyin: pinyinToZhuyin(s) });
  }
  return results;
}

export default function ZhuyinConverter() {
  const [input, setInput] = useState('');

  const results = input.trim() ? convertText(input) : [];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Pinyin (space-separated)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. nǐ hǎo wǒ shì xué shēng"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
        <p className="text-xs text-gray-400 mt-1">Tip: Use tone marks (nǐ hǎo) or plain pinyin (ni hao). Separate each syllable with a space.</p>
      </div>

      {results.length > 0 && (
        <>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-700 mb-4">Zhuyin (Bopomofo) Result</h3>
            <div className="flex flex-wrap gap-4">
              {results.map((r, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{r.zhuyin}</div>
                  <div className="text-sm text-gray-500">{r.pinyin}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Zhuyin String</h3>
              <button
                onClick={() => navigator.clipboard?.writeText(results.map(r => r.zhuyin).join(' '))}
                className="text-xs px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                📋 Copy
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-xl text-blue-600">
              {results.map(r => r.zhuyin).join(' ')}
            </div>
          </div>
        </>
      )}

      {/* Reference Chart */}
      <details className="bg-gray-50 rounded-xl p-4">
        <summary className="font-medium text-gray-700 cursor-pointer">📋 Quick Reference: Zhuyin ↔ Pinyin</summary>
        <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2 text-center text-sm">
          {[
            ['ㄅ','b'], ['ㄆ','p'], ['ㄇ','m'], ['ㄈ','f'],
            ['ㄉ','d'], ['ㄊ','t'], ['ㄋ','n'], ['ㄌ','l'],
            ['ㄍ','g'], ['ㄎ','k'], ['ㄏ','h'],
            ['ㄐ','j'], ['ㄑ','q'], ['ㄒ','x'],
            ['ㄓ','zh'], ['ㄔ','ch'], ['ㄕ','sh'], ['ㄖ','r'],
            ['ㄗ','z'], ['ㄘ','c'], ['ㄙ','s'],
            ['ㄚ','a'], ['ㄛ','o'], ['ㄜ','e'],
            ['ㄞ','ai'], ['ㄟ','ei'], ['ㄠ','ao'], ['ㄡ','ou'],
            ['ㄢ','an'], ['ㄣ','en'], ['ㄤ','ang'], ['ㄥ','eng'],
            ['ㄦ','er'],
            ['ㄧ','i/yi'], ['ㄨ','u/wu'], ['ㄩ','ü/yu'],
          ].map(([z, p]) => (
            <div key={z} className="p-2 bg-white rounded border">
              <div className="text-lg font-bold">{z}</div>
              <div className="text-xs text-gray-500">{p}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
