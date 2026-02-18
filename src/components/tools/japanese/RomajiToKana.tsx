import { useState } from 'react';

const R2H: Record<string, string> = {
  'a':'あ','i':'い','u':'う','e':'え','o':'お',
  'ka':'か','ki':'き','ku':'く','ke':'け','ko':'こ',
  'sa':'さ','shi':'し','si':'し','su':'す','se':'せ','so':'そ',
  'ta':'た','chi':'ち','ti':'ち','tsu':'つ','tu':'つ','te':'て','to':'と',
  'na':'な','ni':'に','nu':'ぬ','ne':'ね','no':'の',
  'ha':'は','hi':'ひ','fu':'ふ','hu':'ふ','he':'へ','ho':'ほ',
  'ma':'ま','mi':'み','mu':'む','me':'め','mo':'も',
  'ya':'や','yu':'ゆ','yo':'よ',
  'ra':'ら','ri':'り','ru':'る','re':'れ','ro':'ろ',
  'wa':'わ','wi':'ゐ','we':'ゑ','wo':'を','n':'ん',
  'ga':'が','gi':'ぎ','gu':'ぐ','ge':'げ','go':'ご',
  'za':'ざ','ji':'じ','zi':'じ','zu':'ず','ze':'ぜ','zo':'ぞ',
  'da':'だ','di':'ぢ','du':'づ','de':'で','do':'ど',
  'ba':'ば','bi':'び','bu':'ぶ','be':'べ','bo':'ぼ',
  'pa':'ぱ','pi':'ぴ','pu':'ぷ','pe':'ぺ','po':'ぽ',
  'kya':'きゃ','kyu':'きゅ','kyo':'きょ',
  'sha':'しゃ','shu':'しゅ','sho':'しょ',
  'cha':'ちゃ','chu':'ちゅ','cho':'ちょ',
  'nya':'にゃ','nyu':'にゅ','nyo':'にょ',
  'hya':'ひゃ','hyu':'ひゅ','hyo':'ひょ',
  'mya':'みゃ','myu':'みゅ','myo':'みょ',
  'rya':'りゃ','ryu':'りゅ','ryo':'りょ',
  'gya':'ぎゃ','gyu':'ぎゅ','gyo':'ぎょ',
  'ja':'じゃ','ju':'じゅ','jo':'じょ',
  'bya':'びゃ','byu':'びゅ','byo':'びょ',
  'pya':'ぴゃ','pyu':'ぴゅ','pyo':'ぴょ',
};

function toKatakana(h: string): string {
  const offset = 0x30A0 - 0x3040;
  return [...h].map(c => {
    const code = c.charCodeAt(0);
    return (code >= 0x3040 && code <= 0x309F) ? String.fromCharCode(code + offset) : c;
  }).join('');
}

function romajiToKana(text: string, kata: boolean): string {
  let result = '';
  let i = 0;
  const s = text.toLowerCase();

  while (i < s.length) {
    // Double consonant → っ
    if (i + 1 < s.length && s[i] === s[i + 1] && 'bcdfghjklmpqrstvwxyz'.includes(s[i])) {
      result += 'っ';
      i++;
      continue;
    }

    // Try 3-char, 2-char, 1-char match
    let matched = false;
    for (const len of [3, 2, 1]) {
      const chunk = s.slice(i, i + len);
      if (R2H[chunk]) {
        result += R2H[chunk];
        i += len;
        matched = true;
        break;
      }
    }

    // Handle 'n' before consonant or end
    if (!matched && s[i] === 'n') {
      const next = s[i + 1];
      if (!next || (!'aiueoy'.includes(next) && !R2H['n' + next])) {
        result += 'ん';
        i++;
        matched = true;
      }
    }

    if (!matched) {
      // Pass through spaces, punctuation
      if (s[i] === ' ') result += '　';
      else if (s[i] === '.') result += '。';
      else if (s[i] === ',') result += '、';
      else if (s[i] === '!') result += '！';
      else if (s[i] === '?') result += '？';
      else result += s[i];
      i++;
    }
  }

  return kata ? toKatakana(result) : result;
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP'; u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function RomajiToKana() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'hiragana' | 'katakana'>('hiragana');

  const result = input.trim() ? romajiToKana(input, mode === 'katakana') : '';

  const examples = [
    { romaji: 'konnichiwa', meaning: 'Hello' },
    { romaji: 'arigatou', meaning: 'Thank you' },
    { romaji: 'sumimasen', meaning: 'Excuse me' },
    { romaji: 'nihongo', meaning: 'Japanese language' },
    { romaji: 'sushi', meaning: 'Sushi' },
    { romaji: 'koohii', meaning: 'Coffee' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-3 justify-center">
        <button onClick={() => setMode('hiragana')}
          className={`px-6 py-3 rounded-lg font-medium ${mode === 'hiragana' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
          ひらがな Hiragana
        </button>
        <button onClick={() => setMode('katakana')}
          className={`px-6 py-3 rounded-lg font-medium ${mode === 'katakana' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
          カタカナ Katakana
        </button>
      </div>

      <textarea value={input} onChange={(e) => setInput(e.target.value)}
        placeholder="Type romaji here... e.g. konnichiwa, arigatou, sushi"
        rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-xl" />

      {result && (
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700">{mode === 'hiragana' ? 'ひらがな' : 'カタカナ'} Result</h3>
            <div className="flex gap-2">
              <button onClick={() => speak(result)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">🔊</button>
              <button onClick={() => navigator.clipboard?.writeText(result)} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">📋 Copy</button>
            </div>
          </div>
          <div className="text-3xl leading-relaxed break-all">{result}</div>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-medium text-gray-700 mb-2">Try These Examples</h3>
        <div className="flex flex-wrap gap-2">
          {examples.map(ex => (
            <button key={ex.romaji} onClick={() => setInput(ex.romaji)}
              className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:border-red-300">
              {ex.romaji} <span className="text-gray-400">({ex.meaning})</span>
            </button>
          ))}
        </div>
      </div>

      <details className="bg-gray-50 rounded-xl p-4">
        <summary className="font-medium text-gray-700 cursor-pointer">📋 Romaji Conversion Rules</summary>
        <div className="mt-3 text-sm text-gray-600 space-y-2">
          <p><strong>Double consonants:</strong> Type the consonant twice → っ (e.g., "kk" in "gakkō" → がっこう)</p>
          <p><strong>Long vowels:</strong> Type the vowel twice (e.g., "oo" → おお, "ou" → おう)</p>
          <p><strong>N before consonant:</strong> "n" before a consonant = ん (e.g., "sensei" → せんせい)</p>
          <p><strong>Combination sounds:</strong> "sha" → しゃ, "chi" → ち, "tsu" → つ</p>
        </div>
      </details>
    </div>
  );
}
