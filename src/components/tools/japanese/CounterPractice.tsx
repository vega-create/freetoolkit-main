import { useState } from 'react';

const COUNTERS = [
  { counter: 'つ', name: 'General (1-10)', readings: [['一つ','ひとつ','1 thing'],['二つ','ふたつ','2 things'],['三つ','みっつ','3'],['四つ','よっつ','4'],['五つ','いつつ','5'],['六つ','むっつ','6'],['七つ','ななつ','7'],['八つ','やっつ','8'],['九つ','ここのつ','9'],['十','とお','10']] },
  { counter: '人', name: 'People', readings: [['一人','ひとり','1 person'],['二人','ふたり','2 people'],['三人','さんにん','3'],['四人','よにん','4'],['五人','ごにん','5'],['六人','ろくにん','6'],['七人','しちにん','7'],['八人','はちにん','8'],['九人','きゅうにん','9'],['十人','じゅうにん','10']] },
  { counter: '本', name: 'Long objects', readings: [['一本','いっぽん','1 stick'],['二本','にほん','2'],['三本','さんぼん','3'],['四本','よんほん','4'],['五本','ごほん','5'],['六本','ろっぽん','6'],['七本','ななほん','7'],['八本','はっぽん','8'],['九本','きゅうほん','9'],['十本','じゅっぽん','10']] },
  { counter: '枚', name: 'Flat objects', readings: [['一枚','いちまい','1 sheet'],['二枚','にまい','2'],['三枚','さんまい','3'],['四枚','よんまい','4'],['五枚','ごまい','5'],['六枚','ろくまい','6'],['七枚','ななまい','7'],['八枚','はちまい','8'],['九枚','きゅうまい','9'],['十枚','じゅうまい','10']] },
  { counter: '匹', name: 'Small animals', readings: [['一匹','いっぴき','1 animal'],['二匹','にひき','2'],['三匹','さんびき','3'],['四匹','よんひき','4'],['五匹','ごひき','5'],['六匹','ろっぴき','6'],['七匹','ななひき','7'],['八匹','はっぴき','8'],['九匹','きゅうひき','9'],['十匹','じゅっぴき','10']] },
  { counter: '杯', name: 'Cups/glasses', readings: [['一杯','いっぱい','1 cup'],['二杯','にはい','2'],['三杯','さんばい','3'],['四杯','よんはい','4'],['五杯','ごはい','5'],['六杯','ろっぱい','6'],['七杯','ななはい','7'],['八杯','はっぱい','8'],['九杯','きゅうはい','9'],['十杯','じゅっぱい','10']] },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.7;
  window.speechSynthesis.speak(u);
}

export default function CounterPractice() {
  const [selectedCounter, setSelectedCounter] = useState(0);
  const c = COUNTERS[selectedCounter];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {COUNTERS.map((ct, i) => (
          <button key={i} onClick={() => setSelectedCounter(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${i === selectedCounter ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {ct.counter} {ct.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-lg mb-3">{c.name} Counter: {c.counter}</h3>
        <div className="space-y-2">
          {c.readings.map(([kanji, reading, meaning], i) => (
            <div key={i} onClick={() => speak(reading)} className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-red-200 transition-all">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-bold">{i + 1}</span>
              <span className="text-xl font-bold">{kanji}</span>
              <span className="text-red-600">{reading}</span>
              <span className="text-sm text-gray-400 ml-auto">{meaning}</span>
              <span className="text-red-400">🔊</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 text-sm text-amber-800">
        <p>💡 Notice how numbers 1, 3, 6, 8, and 10 often change pronunciation when combined with counters. These are called <strong>sound changes</strong> (音便, onbin).</p>
      </div>
    </div>
  );
}
