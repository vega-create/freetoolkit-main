import { useState } from 'react';

const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const UNITS = ['', '十', '百', '千'];
const BIG_UNITS = ['', '万', '亿', '兆'];

const FORMAL_DIGITS = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
const FORMAL_UNITS = ['', '拾', '佰', '仟'];
const FORMAL_BIG = ['', '萬', '億', '兆'];

const PINYIN_DIGITS = ['líng', 'yī', 'èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā', 'jiǔ'];

function numberToChinese(num: number, formal: boolean = false): string {
  if (num === 0) return formal ? '零' : '零';
  if (num < 0) return '负' + numberToChinese(-num, formal);

  const d = formal ? FORMAL_DIGITS : DIGITS;
  const u = formal ? FORMAL_UNITS : UNITS;
  const b = formal ? FORMAL_BIG : BIG_UNITS;

  let result = '';
  let bigIdx = 0;
  let remaining = Math.floor(num);

  while (remaining > 0) {
    const section = remaining % 10000;
    if (section > 0) {
      let sectionStr = '';
      let n = section;
      let unitIdx = 0;
      let prevZero = false;

      while (n > 0) {
        const digit = n % 10;
        if (digit === 0) {
          prevZero = true;
        } else {
          if (prevZero && sectionStr) sectionStr = d[0] + sectionStr;
          sectionStr = d[digit] + u[unitIdx] + sectionStr;
          prevZero = false;
        }
        n = Math.floor(n / 10);
        unitIdx++;
      }

      // Handle leading zero between sections
      if (section < 1000 && bigIdx > 0 && result) {
        sectionStr = d[0] + sectionStr;
      }

      result = sectionStr + b[bigIdx] + result;
    } else if (result && bigIdx > 0) {
      // Add zero placeholder
    }

    remaining = Math.floor(remaining / 10000);
    bigIdx++;
  }

  // Special case: 一十 → 十 (for numbers 10-19)
  if (!formal && result.startsWith('一十')) {
    result = result.substring(1);
  }

  return result;
}

function chineseToNumber(text: string): number | null {
  // Clean input
  let s = text.trim().replace(/[,，\s]/g, '');

  // Map all Chinese digit chars to values
  const charMap: Record<string, number> = {
    '零': 0, '〇': 0, '一': 1, '壹': 1, '二': 2, '貳': 2, '两': 2, '兩': 2,
    '三': 3, '參': 3, '四': 4, '肆': 4, '五': 5, '伍': 5, '六': 6, '陸': 6,
    '七': 7, '柒': 7, '八': 8, '捌': 8, '九': 9, '玖': 9,
  };

  const unitMap: Record<string, number> = {
    '十': 10, '拾': 10, '百': 100, '佰': 100, '千': 1000, '仟': 1000,
    '万': 10000, '萬': 10000, '亿': 100000000, '億': 100000000,
  };

  // Handle pure Arabic numbers
  if (/^\d+$/.test(s)) return parseInt(s);

  let result = 0;
  let section = 0;
  let current = 0;

  // Handle leading 十 (十 = 10, 十五 = 15)
  if (s.startsWith('十') || s.startsWith('拾')) {
    s = '一' + s;
  }

  for (const ch of s) {
    if (ch in charMap) {
      current = charMap[ch];
    } else if (ch in unitMap) {
      const unit = unitMap[ch];
      if (unit >= 10000) {
        section += current;
        result += section * unit;
        section = 0;
      } else {
        section += current * unit;
      }
      current = 0;
    }
  }

  result += section + current;
  return result || null;
}

function speak(text: string, lang: string = 'zh-TW') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function ChineseNumberConverter() {
  const [mode, setMode] = useState<'toChinese' | 'toArabic'>('toChinese');
  const [input, setInput] = useState('');
  const [showFormal, setShowFormal] = useState(false);

  const getResult = () => {
    if (!input.trim()) return null;
    if (mode === 'toChinese') {
      const num = parseInt(input.replace(/[,，\s]/g, ''));
      if (isNaN(num)) return null;
      return {
        standard: numberToChinese(num, false),
        formal: numberToChinese(num, true),
        arabic: num.toLocaleString(),
      };
    } else {
      const num = chineseToNumber(input);
      if (num === null) return null;
      return {
        arabic: num.toLocaleString(),
        standard: numberToChinese(num, false),
        formal: numberToChinese(num, true),
      };
    }
  };

  const result = getResult();

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => { setMode('toChinese'); setInput(''); }}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            mode === 'toChinese' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          123 → 一二三
        </button>
        <button
          onClick={() => { setMode('toArabic'); setInput(''); }}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            mode === 'toArabic' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          一二三 → 123
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'toChinese' ? 'Enter a Number' : 'Enter Chinese Number'}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'toChinese' ? 'e.g. 12345' : 'e.g. 一万二千三百四十五'}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Standard */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Standard (小寫)</h3>
              <button
                onClick={() => speak(result.standard)}
                className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                🔊
              </button>
            </div>
            <div className="text-2xl font-bold">{result.standard}</div>
          </div>

          {/* Formal / Financial */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Formal / Financial (大寫)</h3>
              <button
                onClick={() => speak(result.formal)}
                className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                🔊
              </button>
            </div>
            <div className="text-2xl font-bold">{result.formal}</div>
            <p className="text-xs text-gray-400 mt-1">Used on checks and legal documents</p>
          </div>

          {/* Arabic */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Arabic Number</h3>
            <div className="text-2xl font-bold">{result.arabic}</div>
          </div>

          {/* Copy buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard?.writeText(result.standard)}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              📋 Copy Standard
            </button>
            <button
              onClick={() => navigator.clipboard?.writeText(result.formal)}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              📋 Copy Formal
            </button>
          </div>
        </div>
      )}

      {/* Quick Examples */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Examples</h3>
        <div className="flex flex-wrap gap-2">
          {(mode === 'toChinese'
            ? ['10', '88', '100', '520', '1314', '10000', '99999', '1000000']
            : ['十', '八十八', '一百', '五百二十', '一千三百一十四', '一万', '九万九千九百九十九']
          ).map((ex) => (
            <button
              key={ex}
              onClick={() => setInput(ex)}
              className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600 hover:bg-gray-200"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
