import { useState } from 'react';

type VerbType = 'godan' | 'ichidan' | 'irregular';

const VERBS: { dict: string; reading: string; meaning: string; type: VerbType; stem: string; te: string; ta: string; nai: string; masu: string }[] = [
  { dict: '食べる', reading: 'たべる', meaning: 'to eat', type: 'ichidan', stem: '食べ', te: '食べて', ta: '食べた', nai: '食べない', masu: '食べます' },
  { dict: '飲む', reading: 'のむ', meaning: 'to drink', type: 'godan', stem: '飲み', te: '飲んで', ta: '飲んだ', nai: '飲まない', masu: '飲みます' },
  { dict: '行く', reading: 'いく', meaning: 'to go', type: 'godan', stem: '行き', te: '行って', ta: '行った', nai: '行かない', masu: '行きます' },
  { dict: '来る', reading: 'くる', meaning: 'to come', type: 'irregular', stem: '来', te: '来て', ta: '来た', nai: '来ない', masu: '来ます' },
  { dict: 'する', reading: 'する', meaning: 'to do', type: 'irregular', stem: 'し', te: 'して', ta: 'した', nai: 'しない', masu: 'します' },
  { dict: '見る', reading: 'みる', meaning: 'to see', type: 'ichidan', stem: '見', te: '見て', ta: '見た', nai: '見ない', masu: '見ます' },
  { dict: '書く', reading: 'かく', meaning: 'to write', type: 'godan', stem: '書き', te: '書いて', ta: '書いた', nai: '書かない', masu: '書きます' },
  { dict: '読む', reading: 'よむ', meaning: 'to read', type: 'godan', stem: '読み', te: '読んで', ta: '読んだ', nai: '読まない', masu: '読みます' },
  { dict: '話す', reading: 'はなす', meaning: 'to speak', type: 'godan', stem: '話し', te: '話して', ta: '話した', nai: '話さない', masu: '話します' },
  { dict: '聞く', reading: 'きく', meaning: 'to listen', type: 'godan', stem: '聞き', te: '聞いて', ta: '聞いた', nai: '聞かない', masu: '聞きます' },
  { dict: '買う', reading: 'かう', meaning: 'to buy', type: 'godan', stem: '買い', te: '買って', ta: '買った', nai: '買わない', masu: '買います' },
  { dict: '待つ', reading: 'まつ', meaning: 'to wait', type: 'godan', stem: '待ち', te: '待って', ta: '待った', nai: '待たない', masu: '待ちます' },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.7;
  window.speechSynthesis.speak(u);
}

export default function VerbConjugator() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof VERBS[0] | null>(null);

  const filtered = search.trim()
    ? VERBS.filter(v => v.dict.includes(search) || v.reading.includes(search) || v.meaning.toLowerCase().includes(search.toLowerCase()))
    : VERBS;

  const typeLabel = { godan: 'Group 1 (五段)', ichidan: 'Group 2 (一段)', irregular: 'Irregular (不規則)' };

  return (
    <div className="space-y-6">
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search verbs..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-lg" />

      {selected && (
        <div className="bg-red-50 rounded-xl p-5 border border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl font-bold cursor-pointer hover:text-red-600" onClick={() => speak(selected.dict)}>{selected.dict}</div>
            <div>
              <div className="text-red-600">{selected.reading} — {selected.meaning}</div>
              <div className="text-xs text-gray-400">{typeLabel[selected.type]}</div>
            </div>
            <button onClick={() => setSelected(null)} className="ml-auto text-gray-400 hover:text-red-500">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Dictionary', selected.dict],
              ['Polite (ます)', selected.masu],
              ['て-form', selected.te],
              ['Past (た)', selected.ta],
              ['Negative (ない)', selected.nai],
            ].map(([label, form]) => (
              <div key={label} onClick={() => speak(form)} className="p-3 bg-white rounded-lg border cursor-pointer hover:border-red-200">
                <div className="text-xs text-gray-400">{label}</div>
                <div className="font-bold text-lg">{form}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((v, i) => (
          <button key={i} onClick={() => setSelected(v)} className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-red-200 text-left">
            <span className="text-xl font-bold">{v.dict}</span>
            <span className="text-sm text-red-600">{v.reading}</span>
            <span className="text-sm text-gray-500 ml-auto">{v.meaning}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${v.type === 'godan' ? 'bg-blue-100 text-blue-700' : v.type === 'ichidan' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{v.type === 'godan' ? 'G1' : v.type === 'ichidan' ? 'G2' : 'Irr'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
