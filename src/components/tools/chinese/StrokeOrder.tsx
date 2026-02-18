import { useState } from 'react';

// Stroke order data for common characters
const STROKE_DATA: Record<string, { strokes: number; radical: string; order: string[]; tips: string }> = {
  '一': { strokes: 1, radical: '一', order: ['横 (héng) — horizontal left to right'], tips: 'The simplest character. One single horizontal stroke from left to right.' },
  '二': { strokes: 2, radical: '一', order: ['横 — top horizontal', '横 — bottom horizontal'], tips: 'Two horizontal strokes. Top stroke is shorter.' },
  '三': { strokes: 3, radical: '一', order: ['横 — top', '横 — middle', '横 — bottom'], tips: 'Three horizontal strokes. Middle is shortest, bottom is longest.' },
  '人': { strokes: 2, radical: '人', order: ['撇 (piě) — left-falling stroke', '捺 (nà) — right-falling stroke'], tips: 'Like a person walking. Left stroke falls left, right stroke falls right.' },
  '大': { strokes: 3, radical: '大', order: ['横 — horizontal', '撇 — left-falling', '捺 — right-falling'], tips: 'Horizontal first, then the "person" radical below.' },
  '小': { strokes: 3, radical: '小', order: ['竖钩 (shùgōu) — vertical hook', '撇 — left dot', '点 (diǎn) — right dot'], tips: 'Center vertical hook first, then left dot, then right dot.' },
  '山': { strokes: 3, radical: '山', order: ['竖 (shù) — center vertical', '竖折 — left peak', '竖 — right vertical'], tips: 'Center peak first, then left side, then right side.' },
  '水': { strokes: 4, radical: '水', order: ['竖钩 — vertical hook', '横撇 — upper left', '撇 — lower left', '捺 — right-falling'], tips: 'Center hook first, then strokes radiate outward.' },
  '火': { strokes: 4, radical: '火', order: ['点 — left dot', '撇 — right short stroke', '撇 — left-falling', '捺 — right-falling'], tips: 'Left dot, right dot, then the two bottom strokes.' },
  '日': { strokes: 4, radical: '日', order: ['竖 — left vertical', '横折 — top-right corner', '横 — inner horizontal', '横 — bottom closing'], tips: 'Left side down, top-right corner, middle bar, then close the bottom.' },
  '月': { strokes: 4, radical: '月', order: ['撇 — left curve', '横折钩 — right side', '横 — upper inner', '横 — lower inner'], tips: 'Left curve first, then the right frame, then fill in the inner lines.' },
  '木': { strokes: 4, radical: '木', order: ['横 — horizontal', '竖 — vertical', '撇 — left-falling', '捺 — right-falling'], tips: 'Cross shape first (horizontal, then vertical), then the two bottom strokes.' },
  '口': { strokes: 3, radical: '口', order: ['竖 — left vertical', '横折 — top and right', '横 — bottom closing'], tips: 'Left side, then top-right corner, then close the bottom. Leave a tiny gap.' },
  '心': { strokes: 4, radical: '心', order: ['点 — left dot', '卧钩 — reclining hook', '点 — upper dot', '点 — right dot'], tips: 'The heart shape. Left dot, the curved hook, then two dots on top.' },
  '手': { strokes: 4, radical: '手', order: ['撇 — first horizontal-left', '横 — upper horizontal', '横 — lower horizontal', '竖钩 — vertical hook'], tips: 'Top strokes first, working downward to the vertical hook.' },
  '目': { strokes: 5, radical: '目', order: ['竖 — left vertical', '横折 — top-right', '横 — upper inner', '横 — lower inner', '横 — bottom closing'], tips: 'Like 日 but taller with two inner horizontal lines.' },
  '田': { strokes: 5, radical: '田', order: ['竖 — left vertical', '横折 — top-right', '横 — inner horizontal', '竖 — inner vertical', '横 — bottom closing'], tips: 'Frame first, then the cross inside, then close the bottom.' },
  '中': { strokes: 4, radical: '丨', order: ['竖 — left side of box', '横折 — top-right of box', '横 — bottom of box', '竖 — center vertical through'], tips: 'Draw the box first (口), then the vertical line through the center.' },
  '学': { strokes: 8, radical: '子', order: ['点 — upper left dot', '点 — upper right dot', '撇 — left cover', '点 — right of cover', '横撇 — connecting stroke', '竖钩 — child radical hook', '横 — horizontal of 子', '点 — dot'], tips: 'Top decoration first, then the cover (冖), then 子 at the bottom.' },
  '爱': { strokes: 10, radical: '心', order: ['撇 — top left', '点 — dot', '横 — horizontal', '撇 — left of cover', '点 — right of cover', '横撇 — connecting', '竖 — vertical', '点 — heart left', '撇 — heart center', '捺 — heart right'], tips: 'Complex character meaning "love". The heart radical is at the bottom.' },
};

const STROKE_TYPES = [
  { name: '横 (héng)', desc: 'Horizontal', dir: 'Left → Right' },
  { name: '竖 (shù)', desc: 'Vertical', dir: 'Top → Bottom' },
  { name: '撇 (piě)', desc: 'Left-falling', dir: 'Upper right → Lower left' },
  { name: '捺 (nà)', desc: 'Right-falling', dir: 'Upper left → Lower right' },
  { name: '点 (diǎn)', desc: 'Dot', dir: 'Quick press' },
  { name: '折 (zhé)', desc: 'Turn/bend', dir: 'Direction change' },
  { name: '钩 (gōu)', desc: 'Hook', dir: 'End with small hook' },
  { name: '提 (tí)', desc: 'Rising', dir: 'Lower left → Upper right' },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-TW';
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function StrokeOrder() {
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const char = input.trim().charAt(0);
  const data = STROKE_DATA[char];
  const allChars = Object.keys(STROKE_DATA);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter a Chinese Character</label>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value.slice(0, 1)); setCurrentStep(0); }}
          placeholder="e.g. 人, 大, 心, 学..."
          maxLength={1}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-4xl text-center"
        />
      </div>

      {/* Quick select */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Or choose a character:</p>
        <div className="flex flex-wrap gap-2">
          {allChars.map(c => (
            <button key={c} onClick={() => { setInput(c); setCurrentStep(0); }}
              className={`w-10 h-10 rounded-lg border text-xl font-bold transition-all ${
                char === c ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {data && (
        <div className="space-y-4">
          {/* Character Display */}
          <div className="text-center py-6">
            <div className="text-8xl font-bold mb-2 cursor-pointer hover:text-blue-600" onClick={() => speak(char)}>{char}</div>
            <button onClick={() => speak(char)} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">🔊 Listen</button>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Strokes</div>
              <div className="text-2xl font-bold">{data.strokes}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Radical</div>
              <div className="text-2xl font-bold">{data.radical}</div>
            </div>
          </div>

          {/* Step by step */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">✍️ Stroke Order ({data.strokes} strokes)</h3>
            <div className="space-y-2">
              {data.order.map((stroke, i) => (
                <div key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                    i === currentStep ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentStep(i)}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>{i + 1}</span>
                  <span className="text-gray-700">{stroke}</span>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
              >← Previous</button>
              <button
                onClick={() => setCurrentStep(Math.min(data.order.length - 1, currentStep + 1))}
                disabled={currentStep === data.order.length - 1}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30"
              >Next →</button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <p className="text-sm text-amber-800">💡 {data.tips}</p>
          </div>
        </div>
      )}

      {char && !data && (
        <div className="text-center py-8 text-gray-400">
          <p>Character "{char}" not in our stroke order database yet.</p>
          <p className="text-sm mt-1">Try one of the characters above!</p>
        </div>
      )}

      {/* Stroke Types Reference */}
      <details className="bg-gray-50 rounded-xl p-4">
        <summary className="font-medium text-gray-700 cursor-pointer">📋 Basic Stroke Types</summary>
        <div className="mt-3 space-y-2">
          {STROKE_TYPES.map(s => (
            <div key={s.name} className="flex items-center gap-3 p-2 bg-white rounded border text-sm">
              <span className="font-bold text-blue-600 w-28">{s.name}</span>
              <span className="text-gray-600 flex-1">{s.desc}</span>
              <span className="text-gray-400">{s.dir}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
