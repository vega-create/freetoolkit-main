import { useState, useRef } from 'react';

const PRESETS = [
  { label: 'Hiragana あ行', chars: 'あいうえおかきくけこ' },
  { label: 'Hiragana さ行', chars: 'さしすせそたちつてと' },
  { label: 'Hiragana な行', chars: 'なにぬねのはひふへほ' },
  { label: 'Hiragana ま行', chars: 'まみむめもやゆよらり' },
  { label: 'Katakana ア行', chars: 'アイウエオカキクケコ' },
  { label: 'Katakana サ行', chars: 'サシスセソタチツテト' },
  { label: 'Basic Kanji', chars: '日月火水木金土人大小' },
  { label: 'Numbers', chars: '一二三四五六七八九十' },
];

export default function PracticeSheet() {
  const [input, setInput] = useState('');
  const [cols, setCols] = useState(10);

  const chars = [...input.replace(/\s/g, '')].filter(c => /[\u3040-\u9FFF]/.test(c));

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const rows = chars.map(ch => {
      let cells = '';
      for (let j = 0; j < cols; j++) {
        const content = j === 0 ? `<span style="font-size:24px;font-weight:bold">${ch}</span>` : j === 1 ? `<span style="font-size:24px;color:#ddd">${ch}</span>` : '';
        cells += `<td style="width:45px;height:45px;border:1px solid #ddd;text-align:center;vertical-align:middle;background:linear-gradient(45deg,transparent 49%,#f0f0f0 49%,#f0f0f0 51%,transparent 51%),linear-gradient(-45deg,transparent 49%,#f0f0f0 49%,#f0f0f0 51%,transparent 51%)">${content}</td>`;
      }
      return `<tr>${cells}</tr>`;
    }).join('');

    win.document.write(`<html><head><title>Practice Sheet</title></head><body style="font-family:sans-serif;margin:20px"><h2>Japanese Practice Sheet</h2><p style="color:#888">freetoolkit.cc/japanese</p><table style="border-collapse:collapse">${rows}</table></body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter characters to practice..."
        rows={2} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-xl" />

      <div className="flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => setInput(p.chars)} className="px-3 py-1.5 rounded-full bg-gray-100 text-sm hover:bg-red-100 hover:text-red-700">{p.label}</button>
        ))}
      </div>

      {chars.length > 0 && (
        <>
          <div className="bg-white border rounded-xl p-4 overflow-x-auto">
            {chars.map((ch, ci) => (
              <div key={ci} className="flex gap-0.5 mb-2">
                {Array.from({ length: Math.min(cols, 12) }).map((_, j) => (
                  <div key={j} className="w-10 h-10 border border-gray-200 flex items-center justify-center text-lg font-bold"
                    style={j > 1 ? { backgroundImage: 'linear-gradient(45deg,transparent 49%,#f0f0f0 49%,#f0f0f0 51%,transparent 51%),linear-gradient(-45deg,transparent 49%,#f0f0f0 49%,#f0f0f0 51%,transparent 51%)' } : {}}>
                    {j === 0 ? ch : j === 1 ? <span className="text-gray-300">{ch}</span> : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button onClick={handlePrint} className="w-full py-4 rounded-lg bg-red-600 text-white font-bold text-lg hover:bg-red-700">🖨️ Print Practice Sheet</button>
        </>
      )}
    </div>
  );
}
