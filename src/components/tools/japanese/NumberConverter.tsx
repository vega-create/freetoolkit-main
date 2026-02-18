import { useState } from 'react';

const DIGITS: Record<string, string> = { '0': '零', '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六', '7': '七', '8': '八', '9': '九' };
const READINGS: Record<string, string> = { '0': 'れい', '1': 'いち', '2': 'に', '3': 'さん', '4': 'よん', '5': 'ご', '6': 'ろく', '7': 'なな', '8': 'はち', '9': 'きゅう', '10': 'じゅう', '100': 'ひゃく', '1000': 'せん', '10000': 'まん' };

function numberToJapanese(n: number): { kanji: string; reading: string } {
  if (n === 0) return { kanji: '零', reading: 'れい' };
  if (n < 0 || n > 99999999 || !Number.isInteger(n)) return { kanji: '—', reading: '—' };

  let kanji = '';
  let reading = '';

  const man = Math.floor(n / 10000);
  const rem = n % 10000;

  if (man > 0) {
    if (man === 1) { kanji += '一万'; reading += 'いちまん'; }
    else { const sub = buildUnit(man); kanji += sub.kanji + '万'; reading += sub.reading + 'まん'; }
  }
  if (rem > 0) {
    const sub = buildUnit(rem);
    kanji += sub.kanji;
    reading += sub.reading;
  }

  return { kanji, reading };
}

function buildUnit(n: number): { kanji: string; reading: string } {
  let k = '', r = '';
  const sen = Math.floor(n / 1000);
  const hyaku = Math.floor((n % 1000) / 100);
  const juu = Math.floor((n % 100) / 10);
  const ichi = n % 10;

  if (sen > 0) {
    if (sen === 1) { k += '千'; r += 'せん'; }
    else if (sen === 3) { k += '三千'; r += 'さんぜん'; }
    else if (sen === 8) { k += '八千'; r += 'はっせん'; }
    else { k += DIGITS[sen] + '千'; r += READINGS[String(sen)] + 'せん'; }
  }
  if (hyaku > 0) {
    if (hyaku === 1) { k += '百'; r += 'ひゃく'; }
    else if (hyaku === 3) { k += '三百'; r += 'さんびゃく'; }
    else if (hyaku === 6) { k += '六百'; r += 'ろっぴゃく'; }
    else if (hyaku === 8) { k += '八百'; r += 'はっぴゃく'; }
    else { k += DIGITS[hyaku] + '百'; r += READINGS[String(hyaku)] + 'ひゃく'; }
  }
  if (juu > 0) {
    if (juu === 1) { k += '十'; r += 'じゅう'; }
    else { k += DIGITS[juu] + '十'; r += READINGS[String(juu)] + 'じゅう'; }
  }
  if (ichi > 0) { k += DIGITS[ichi]; r += READINGS[String(ichi)]; }

  return { kanji: k, reading: r };
}

const COUNTERS = [
  { name: 'General', suffix: 'つ', readings: ['ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお'] },
  { name: 'People', suffix: '人', readings: ['ひとり', 'ふたり', 'さんにん', 'よにん', 'ごにん', 'ろくにん', 'しちにん', 'はちにん', 'きゅうにん', 'じゅうにん'] },
  { name: 'Long objects', suffix: '本', readings: ['いっぽん', 'にほん', 'さんぼん', 'よんほん', 'ごほん', 'ろっぽん', 'ななほん', 'はっぽん', 'きゅうほん', 'じゅっぽん'] },
  { name: 'Flat objects', suffix: '枚', readings: ['いちまい', 'にまい', 'さんまい', 'よんまい', 'ごまい', 'ろくまい', 'ななまい', 'はちまい', 'きゅうまい', 'じゅうまい'] },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function JapaneseNumberConverter() {
  const [input, setInput] = useState('');
  const num = parseInt(input);
  const result = !isNaN(num) ? numberToJapanese(num) : null;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter a Number</label>
        <input type="number" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 42, 1500, 25000" min="0" max="99999999"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-2xl text-center" />
      </div>

      {result && result.kanji !== '—' && (
        <div className="bg-gray-50 rounded-xl p-6 text-center space-y-3">
          <div className="text-4xl font-bold cursor-pointer hover:text-red-600" onClick={() => speak(result.reading)}>{result.kanji}</div>
          <div className="text-xl text-red-600">{result.reading}</div>
          <button onClick={() => speak(result.reading)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">🔊 Listen</button>
          <button onClick={() => navigator.clipboard?.writeText(`${result.kanji} (${result.reading})`)} className="ml-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">📋 Copy</button>
        </div>
      )}

      <details className="bg-gray-50 rounded-xl p-4">
        <summary className="font-medium text-gray-700 cursor-pointer">📋 Japanese Counters</summary>
        <div className="mt-3 space-y-4">
          {COUNTERS.map(c => (
            <div key={c.name}>
              <h4 className="font-medium text-sm text-gray-600 mb-1">{c.name} ({c.suffix})</h4>
              <div className="grid grid-cols-5 gap-1 text-center text-sm">
                {c.readings.map((r, i) => (
                  <div key={i} className="p-1 bg-white rounded border cursor-pointer hover:bg-red-50" onClick={() => speak(r)}>
                    <div className="font-bold text-xs">{i + 1}</div>
                    <div className="text-xs text-red-600">{r}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
