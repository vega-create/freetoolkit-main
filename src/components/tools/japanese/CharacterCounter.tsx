import { useState } from 'react';

function analyze(text: string) {
  const chars = [...text];
  let hiragana = 0, katakana = 0, kanji = 0, romaji = 0, numbers = 0, punct = 0, spaces = 0;

  for (const c of chars) {
    const code = c.charCodeAt(0);
    if (c === ' ' || c === '　') spaces++;
    else if (code >= 0x3040 && code <= 0x309F) hiragana++;
    else if (code >= 0x30A0 && code <= 0x30FF) katakana++;
    else if ((code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3400 && code <= 0x4DBF)) kanji++;
    else if (/[a-zA-Z]/.test(c)) romaji++;
    else if (/[0-9０-９]/.test(c)) numbers++;
    else punct++;
  }

  return {
    total: chars.length,
    noSpaces: chars.length - spaces,
    hiragana, katakana, kanji, romaji, numbers, punct, spaces,
    lines: text.split('\n').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
  };
}

export default function JapaneseCharacterCounter() {
  const [text, setText] = useState('');
  const stats = analyze(text);

  const bars = [
    { label: 'Hiragana', count: stats.hiragana, color: 'bg-red-500' },
    { label: 'Katakana', count: stats.katakana, color: 'bg-orange-500' },
    { label: 'Kanji', count: stats.kanji, color: 'bg-blue-500' },
    { label: 'Romaji', count: stats.romaji, color: 'bg-green-500' },
    { label: 'Numbers', count: stats.numbers, color: 'bg-purple-500' },
    { label: 'Punctuation', count: stats.punct, color: 'bg-gray-400' },
  ].filter(b => b.count > 0);

  return (
    <div className="space-y-6">
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste Japanese text here... 日本語のテキストを入力してください"
        rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-lg" />

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: 'Characters', value: stats.total },
          { label: 'No Spaces', value: stats.noSpaces },
          { label: 'Hiragana', value: stats.hiragana },
          { label: 'Katakana', value: stats.katakana },
          { label: 'Kanji', value: stats.kanji },
          { label: 'Lines', value: stats.lines },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {stats.total > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Character Breakdown</h3>
          {bars.map(b => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-20">{b.label}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${b.color} rounded-full transition-all`} style={{ width: `${(b.count / stats.total) * 100}%` }} />
              </div>
              <span className="text-sm text-gray-500 w-16 text-right">{b.count} ({Math.round((b.count / stats.total) * 100)}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
