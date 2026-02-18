import { useState, useRef } from 'react';

const PRESETS = [
  { label: 'Numbers 1-10', chars: '一二三四五六七八九十' },
  { label: 'Basic Greetings', chars: '你好谢再见早上午晚安' },
  { label: 'Family', chars: '爸妈哥姐弟妹儿女家人' },
  { label: 'Colors', chars: '红蓝绿黄白黑紫橙粉灰' },
  { label: 'Animals', chars: '狗猫鸟鱼马牛羊猪鸡龙' },
  { label: 'Nature', chars: '山水火木花草风云雨雪' },
  { label: 'Body Parts', chars: '头眼耳口鼻手脚心身脸' },
  { label: 'Food', chars: '饭菜肉鱼茶酒米面蛋奶' },
];

export default function PracticeSheetGenerator() {
  const [input, setInput] = useState('');
  const [rows, setRows] = useState(6);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const chars = [...new Set([...input.replace(/\s/g, '')])].filter(c => /[\u4e00-\u9fff]/.test(c));

  const handlePrint = () => {
    if (!printRef.current) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Chinese Practice Sheet</title>
      <style>
        body { font-family: 'Noto Sans TC', sans-serif; margin: 20px; }
        .grid { display: grid; grid-template-columns: repeat(${Math.min(chars.length, 10)}, 1fr); gap: 2px; margin-bottom: 20px; }
        .cell { border: 1px solid #ddd; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; font-size: 28px; position: relative; }
        .cell.guide { background: linear-gradient(45deg, transparent 49.5%, #eee 49.5%, #eee 50.5%, transparent 50.5%), linear-gradient(-45deg, transparent 49.5%, #eee 49.5%, #eee 50.5%, transparent 50.5%), linear-gradient(transparent 49.5%, #eee 49.5%, #eee 50.5%, transparent 50.5%), linear-gradient(90deg, transparent 49.5%, #eee 49.5%, #eee 50.5%, transparent 50.5%); }
        .cell.empty { color: #ddd; }
        .pinyin { font-size: 10px; color: #888; position: absolute; top: 2px; left: 50%; transform: translateX(-50%); }
        h2 { font-size: 18px; color: #333; }
        @media print { body { margin: 10px; } }
      </style></head><body>
      ${printRef.current.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter Characters to Practice</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste Chinese characters..."
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xl"
        />
      </div>

      {/* Presets */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Or choose a preset:</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => setInput(p.chars)} className="px-3 py-1.5 rounded-full bg-gray-100 text-sm hover:bg-blue-100 hover:text-blue-700 transition-all">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 text-sm">
          <span>Rows per character:</span>
          <select value={rows} onChange={(e) => setRows(Number(e.target.value))} className="border rounded px-2 py-1">
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={10}>10</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={showPinyin} onChange={() => setShowPinyin(!showPinyin)} className="rounded" />
          Show Pinyin
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={showGuide} onChange={() => setShowGuide(!showGuide)} className="rounded" />
          Grid Guidelines
        </label>
      </div>

      {/* Preview */}
      {chars.length > 0 && (
        <>
          <div ref={printRef} className="bg-white border rounded-xl p-6 overflow-x-auto">
            <h2 className="text-lg font-bold mb-4">Chinese Character Practice Sheet</h2>
            {chars.map((char, ci) => (
              <div key={ci} className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold">{char}</span>
                  {showPinyin && <span className="text-sm text-blue-600">(pinyin)</span>}
                </div>
                <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${rows + 1}, 48px)` }}>
                  {/* First cell: model character */}
                  <div className="w-12 h-12 border border-gray-300 flex items-center justify-center text-2xl font-bold bg-gray-50">
                    {char}
                  </div>
                  {/* Practice cells */}
                  {Array.from({ length: rows }).map((_, j) => (
                    <div key={j} className={`w-12 h-12 border border-gray-200 relative ${showGuide ? 'bg-[length:100%_100%]' : ''}`}
                      style={showGuide ? {
                        backgroundImage: 'linear-gradient(45deg, transparent 49%, #f0f0f0 49%, #f0f0f0 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, #f0f0f0 49%, #f0f0f0 51%, transparent 51%)',
                      } : {}}
                    >
                      {j === 0 && (
                        <span className="absolute inset-0 flex items-center justify-center text-2xl text-gray-200">{char}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Print/Download */}
          <button
            onClick={handlePrint}
            className="w-full py-4 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700"
          >
            🖨️ Print Practice Sheet
          </button>
        </>
      )}

      {chars.length === 0 && input.trim() && (
        <p className="text-center text-gray-400">No Chinese characters detected. Please enter Chinese characters.</p>
      )}
    </div>
  );
}
