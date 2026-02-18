import { useState } from 'react';

const HIRAGANA = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const ROMAJI = ['a','i','u','e','o','ka','ki','ku','ke','ko','sa','shi','su','se','so','ta','chi','tsu','te','to','na','ni','nu','ne','no','ha','hi','fu','he','ho','ma','mi','mu','me','mo','ya','yu','yo','ra','ri','ru','re','ro','wa','wo','n'];

// Extended mappings
const H2K: Record<string, string> = {};
const K2H: Record<string, string> = {};
const H2R: Record<string, string> = {};
for (let i = 0; i < HIRAGANA.length; i++) {
  H2K[HIRAGANA[i]] = KATAKANA[i];
  K2H[KATAKANA[i]] = HIRAGANA[i];
  H2R[HIRAGANA[i]] = ROMAJI[i];
}

// Dakuten
const DAKU_H = 'がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ';
const DAKU_K = 'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';
const DAKU_R = ['ga','gi','gu','ge','go','za','ji','zu','ze','zo','da','di','du','de','do','ba','bi','bu','be','bo','pa','pi','pu','pe','po'];
for (let i = 0; i < DAKU_H.length; i++) {
  H2K[DAKU_H[i]] = DAKU_K[i];
  K2H[DAKU_K[i]] = DAKU_H[i];
  H2R[DAKU_H[i]] = DAKU_R[i];
}

// Small kana
const SMALL_H = 'ぁぃぅぇぉっゃゅょ';
const SMALL_K = 'ァィゥェォッャュョ';
for (let i = 0; i < SMALL_H.length; i++) {
  H2K[SMALL_H[i]] = SMALL_K[i];
  K2H[SMALL_K[i]] = SMALL_H[i];
}

type Mode = 'h2k' | 'k2h' | 'h2r';

function convert(text: string, mode: Mode): string {
  return [...text].map(ch => {
    if (mode === 'h2k') return H2K[ch] || ch;
    if (mode === 'k2h') return K2H[ch] || ch;
    if (mode === 'h2r') return H2R[ch] ? H2R[ch] + ' ' : ch;
    return ch;
  }).join('');
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP'; u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function KanaConverter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('h2k');

  const result = input.trim() ? convert(input, mode) : '';
  const modeLabels: Record<Mode, string> = {
    h2k: 'Hiragana → Katakana',
    k2h: 'Katakana → Hiragana',
    h2r: 'Hiragana → Romaji',
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto">
        {(Object.keys(modeLabels) as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {modeLabels[m]}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'k2h' ? 'カタカナを入力...' : 'ひらがなを入力...'}
        rows={3}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-xl"
      />

      {result && (
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700">Result</h3>
            <div className="flex gap-2">
              <button onClick={() => speak(result)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">🔊</button>
              <button onClick={() => navigator.clipboard?.writeText(result)} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">📋 Copy</button>
            </div>
          </div>
          <div className="text-2xl leading-relaxed break-all">{result}</div>
        </div>
      )}

      <details className="bg-gray-50 rounded-xl p-4">
        <summary className="font-medium text-gray-700 cursor-pointer">📋 Hiragana ↔ Katakana Chart</summary>
        <div className="mt-3 grid grid-cols-5 sm:grid-cols-8 gap-1 text-center text-sm">
          {HIRAGANA.split('').map((h, i) => (
            <div key={i} className="p-2 bg-white rounded border">
              <div className="font-bold">{h} {KATAKANA[i]}</div>
              <div className="text-xs text-gray-400">{ROMAJI[i]}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
