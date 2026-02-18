import { useState, useMemo } from 'react';

function speak(text: string, lang: string = 'zh-TW') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

function analyzeText(text: string) {
  const chars = [...text];
  const totalChars = chars.length;
  const chineseChars = chars.filter(c => /[\u4e00-\u9fff\u3400-\u4dbf]/.test(c));
  const chineseCount = chineseChars.length;
  const englishWords = text.match(/[a-zA-Z]+/g) || [];
  const numbers = text.match(/\d+/g) || [];
  const punctuation = chars.filter(c => /[，。！？、；：""''（）《》【】…—\.\,\!\?\;\:\"\'\(\)]/.test(c));
  const spaces = chars.filter(c => c === ' ' || c === '　');
  const lines = text.split('\n').length;

  // Character frequency
  const freq: Record<string, number> = {};
  for (const c of chineseChars) {
    freq[c] = (freq[c] || 0) + 1;
  }
  const sortedFreq = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20);

  // Unique characters
  const uniqueChinese = new Set(chineseChars).size;

  // Estimate reading time (Chinese ~300 chars/min, English ~200 words/min)
  const readingMinutes = Math.max(1, Math.round((chineseCount / 300 + englishWords.length / 200)));

  return {
    totalChars,
    chineseCount,
    uniqueChinese,
    englishWords: englishWords.length,
    numbers: numbers.length,
    punctuation: punctuation.length,
    spaces: spaces.length,
    lines,
    charFrequency: sortedFreq,
    readingMinutes,
    withoutSpaces: totalChars - spaces.length,
  };
}

export default function CharacterCounter() {
  const [input, setInput] = useState('');
  const stats = useMemo(() => analyzeText(input), [input]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Enter Text</label>
          {input && (
            <button
              onClick={() => setInput('')}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type Chinese text here..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="Total Characters" value={stats.totalChars} color="blue" />
        <StatBox label="Chinese Characters" value={stats.chineseCount} color="red" />
        <StatBox label="Unique Chinese" value={stats.uniqueChinese} color="purple" />
        <StatBox label="Without Spaces" value={stats.withoutSpaces} color="green" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="English Words" value={stats.englishWords} />
        <StatBox label="Numbers" value={stats.numbers} />
        <StatBox label="Punctuation" value={stats.punctuation} />
        <StatBox label="Lines" value={stats.lines} />
      </div>

      {/* Reading Time */}
      {input.trim() && (
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <span className="text-sm text-blue-600">
            📖 Estimated reading time: <strong>~{stats.readingMinutes} min</strong>
          </span>
        </div>
      )}

      {/* Character Frequency */}
      {stats.charFrequency.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">📊 Character Frequency (Top 20)</h3>
          <div className="space-y-2">
            {stats.charFrequency.map(([char, count]) => {
              const pct = (count / stats.chineseCount) * 100;
              return (
                <div key={char} className="flex items-center gap-3">
                  <button
                    onClick={() => speak(char)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-xl font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                    title={`Listen to ${char}`}
                  >
                    {char}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400 rounded-full"
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-20 text-right">
                        {count}× ({pct.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sample Text */}
      {!input && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Try a Sample</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '📜 Classical', text: '天地玄黃，宇宙洪荒。日月盈昃，辰宿列張。寒來暑往，秋收冬藏。' },
              { label: '🗣️ Conversation', text: '你好！我叫大卫，我是美国人。我在学中文。你能教我吗？我很喜欢中国文化。' },
              { label: '📰 News', text: '据报道，今年全球经济增长预计将达到百分之三。各国政府正在积极推动数字化转型，以提高生产力和竞争力。' },
            ].map((sample) => (
              <button
                key={sample.label}
                onClick={() => setInput(sample.text)}
                className="px-3 py-2 rounded-lg bg-gray-100 text-sm text-gray-600 hover:bg-gray-200"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color?: string }) {
  const colorClass = {
    blue: 'bg-blue-50 border-blue-100',
    red: 'bg-red-50 border-red-100',
    purple: 'bg-purple-50 border-purple-100',
    green: 'bg-green-50 border-green-100',
  }[color || ''] || 'bg-gray-50 border-gray-100';

  return (
    <div className={`rounded-lg border p-3 text-center ${colorClass}`}>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
