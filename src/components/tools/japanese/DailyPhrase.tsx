import { useState, useEffect } from 'react';

const PHRASES = [
  { jp: 'おはようございます', romaji: 'Ohayou gozaimasu', meaning: 'Good morning (polite)', context: 'Used until around 10 AM. Drop ございます with close friends: おはよう.' },
  { jp: 'こんにちは', romaji: 'Konnichiwa', meaning: 'Hello / Good afternoon', context: 'The most common greeting, used from late morning to evening.' },
  { jp: 'こんばんは', romaji: 'Konbanwa', meaning: 'Good evening', context: 'Used after sunset. A polite greeting for evening encounters.' },
  { jp: 'ありがとうございます', romaji: 'Arigatou gozaimasu', meaning: 'Thank you (polite)', context: 'The standard polite thank you. Casual: ありがとう (arigatou).' },
  { jp: 'すみません', romaji: 'Sumimasen', meaning: 'Excuse me / Sorry', context: 'Used to get attention, apologize, or express gratitude. Very versatile.' },
  { jp: 'いただきます', romaji: 'Itadakimasu', meaning: 'I humbly receive (before eating)', context: 'Said before every meal. A core Japanese cultural expression.' },
  { jp: 'ごちそうさまでした', romaji: 'Gochisousama deshita', meaning: 'Thank you for the meal', context: 'Said after eating. Shows appreciation to the cook and the food.' },
  { jp: 'お疲れ様です', romaji: 'Otsukaresama desu', meaning: 'Good work / Thank you for your effort', context: 'Used at work when greeting colleagues or saying goodbye. Very common in offices.' },
  { jp: 'よろしくお願いします', romaji: 'Yoroshiku onegaishimasu', meaning: 'Please take care of it / Nice to meet you', context: 'Used when meeting someone, asking for help, or starting a working relationship.' },
  { jp: 'お元気ですか', romaji: 'Ogenki desu ka', meaning: 'How are you?', context: 'Used less frequently than English "how are you." More common when you haven\'t seen someone in a while.' },
  { jp: 'さようなら', romaji: 'Sayounara', meaning: 'Goodbye', context: 'Formal goodbye. In casual settings, people say じゃあね (jaa ne) or またね (mata ne).' },
  { jp: 'お願いします', romaji: 'Onegaishimasu', meaning: 'Please', context: 'Used when ordering, requesting, or asking for something politely.' },
  { jp: 'ごめんなさい', romaji: 'Gomen nasai', meaning: 'I\'m sorry', context: 'A sincere apology. Casual: ごめん (gomen). More formal: 申し訳ありません.' },
  { jp: 'いってきます', romaji: 'Ittekimasu', meaning: 'I\'m heading out', context: 'Said when leaving home. The person staying responds: いってらっしゃい (itterasshai).' },
  { jp: 'ただいま', romaji: 'Tadaima', meaning: 'I\'m home', context: 'Said when returning home. Response: おかえりなさい (okaerinasai) — welcome back.' },
  { jp: 'おやすみなさい', romaji: 'Oyasuminasai', meaning: 'Good night', context: 'Said before sleeping. Casual: おやすみ (oyasumi).' },
  { jp: 'はじめまして', romaji: 'Hajimemashite', meaning: 'Nice to meet you (first time)', context: 'Used only for first introductions, followed by よろしくお願いします.' },
  { jp: '大丈夫です', romaji: 'Daijoubu desu', meaning: 'It\'s okay / I\'m fine', context: 'Can mean "I\'m fine," "no problem," or politely decline an offer.' },
  { jp: 'わかりました', romaji: 'Wakarimashita', meaning: 'I understood', context: 'Polite past tense of わかる (understand). Shows acknowledgment.' },
  { jp: 'ちょっと待ってください', romaji: 'Chotto matte kudasai', meaning: 'Please wait a moment', context: 'Polite way to ask someone to wait. Casual: ちょっと待って.' },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.7;
  window.speechSynthesis.speak(u);
}

export default function DailyPhrase() {
  const now = new Date();
  const start = new Date('2026-01-01');
  const idx = Math.floor((now.getTime() - start.getTime()) / 86400000) % PHRASES.length;
  const today = PHRASES[idx];
  const [showContext, setShowContext] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <p className="text-sm text-gray-500 mb-2">Today's Phrase — {now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
        <div className="text-4xl md:text-5xl font-bold mb-3 cursor-pointer hover:text-red-600" onClick={() => speak(today.jp)}>{today.jp}</div>
        <div className="text-lg text-red-600 font-medium mb-1">{today.romaji}</div>
        <div className="text-lg text-gray-600">{today.meaning}</div>
        <div className="flex justify-center gap-3 mt-4">
          <button onClick={() => speak(today.jp)} className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">🔊 Normal</button>
          <button onClick={() => { const u = new SpeechSynthesisUtterance(today.jp); u.lang = 'ja-JP'; u.rate = 0.5; window.speechSynthesis.speak(u); }} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">🐢 Slow</button>
        </div>
      </div>

      <button onClick={() => setShowContext(!showContext)} className="w-full p-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100">
        <span className="font-medium">💡 When to use this phrase</span>
        {showContext && <p className="mt-2 text-sm text-gray-600">{today.context}</p>}
      </button>

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-3">Browse All Phrases</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {PHRASES.map((p, i) => (
            <div key={i} onClick={() => speak(p.jp)} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-white ${i === idx ? 'bg-red-50 border border-red-200' : ''}`}>
              <span className="font-bold text-sm">{p.jp}</span>
              <span className="text-xs text-gray-400 flex-1 truncate">{p.meaning}</span>
              <span className="text-red-400 text-xs">🔊</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
