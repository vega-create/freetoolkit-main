import { useState } from 'react';

const FAMILY_NAMES = [
  { kanji: '田中', reading: 'たなか', romaji: 'Tanaka', meaning: 'middle of rice field' },
  { kanji: '山田', reading: 'やまだ', romaji: 'Yamada', meaning: 'mountain field' },
  { kanji: '佐藤', reading: 'さとう', romaji: 'Sato', meaning: 'helpful wisteria' },
  { kanji: '鈴木', reading: 'すずき', romaji: 'Suzuki', meaning: 'bell tree' },
  { kanji: '高橋', reading: 'たかはし', romaji: 'Takahashi', meaning: 'high bridge' },
  { kanji: '渡辺', reading: 'わたなべ', romaji: 'Watanabe', meaning: 'crossing edge' },
  { kanji: '伊藤', reading: 'いとう', romaji: 'Ito', meaning: 'that wisteria' },
  { kanji: '中村', reading: 'なかむら', romaji: 'Nakamura', meaning: 'middle village' },
  { kanji: '小林', reading: 'こばやし', romaji: 'Kobayashi', meaning: 'small forest' },
  { kanji: '加藤', reading: 'かとう', romaji: 'Kato', meaning: 'add wisteria' },
  { kanji: '吉田', reading: 'よしだ', romaji: 'Yoshida', meaning: 'lucky field' },
  { kanji: '松本', reading: 'まつもと', romaji: 'Matsumoto', meaning: 'pine origin' },
  { kanji: '井上', reading: 'いのうえ', romaji: 'Inoue', meaning: 'above the well' },
  { kanji: '木村', reading: 'きむら', romaji: 'Kimura', meaning: 'tree village' },
  { kanji: '林', reading: 'はやし', romaji: 'Hayashi', meaning: 'forest' },
  { kanji: '清水', reading: 'しみず', romaji: 'Shimizu', meaning: 'clear water' },
  { kanji: '森', reading: 'もり', romaji: 'Mori', meaning: 'forest' },
  { kanji: '池田', reading: 'いけだ', romaji: 'Ikeda', meaning: 'pond field' },
  { kanji: '橋本', reading: 'はしもと', romaji: 'Hashimoto', meaning: 'bridge origin' },
  { kanji: '石川', reading: 'いしかわ', romaji: 'Ishikawa', meaning: 'stone river' },
];

const GIVEN_MALE = [
  { kanji: '大翔', reading: 'ひろと', romaji: 'Hiroto', meaning: 'great soaring' },
  { kanji: '蓮', reading: 'れん', romaji: 'Ren', meaning: 'lotus' },
  { kanji: '陽太', reading: 'ようた', romaji: 'Yota', meaning: 'sun great' },
  { kanji: '湊', reading: 'みなと', romaji: 'Minato', meaning: 'harbor' },
  { kanji: '樹', reading: 'いつき', romaji: 'Itsuki', meaning: 'tree' },
  { kanji: '悠真', reading: 'ゆうま', romaji: 'Yuma', meaning: 'eternal truth' },
  { kanji: '翔太', reading: 'しょうた', romaji: 'Shota', meaning: 'soaring great' },
  { kanji: '健太', reading: 'けんた', romaji: 'Kenta', meaning: 'healthy great' },
  { kanji: '龍之介', reading: 'りゅうのすけ', romaji: 'Ryunosuke', meaning: 'dragon helper' },
  { kanji: '太郎', reading: 'たろう', romaji: 'Taro', meaning: 'great son' },
  { kanji: '翼', reading: 'つばさ', romaji: 'Tsubasa', meaning: 'wings' },
  { kanji: '拓海', reading: 'たくみ', romaji: 'Takumi', meaning: 'pioneer sea' },
];

const GIVEN_FEMALE = [
  { kanji: '陽葵', reading: 'ひまり', romaji: 'Himari', meaning: 'sunflower' },
  { kanji: '芽依', reading: 'めい', romaji: 'Mei', meaning: 'sprout reliance' },
  { kanji: '咲良', reading: 'さくら', romaji: 'Sakura', meaning: 'blooming goodness' },
  { kanji: '結愛', reading: 'ゆあ', romaji: 'Yua', meaning: 'bound love' },
  { kanji: '花', reading: 'はな', romaji: 'Hana', meaning: 'flower' },
  { kanji: '美咲', reading: 'みさき', romaji: 'Misaki', meaning: 'beautiful bloom' },
  { kanji: '凛', reading: 'りん', romaji: 'Rin', meaning: 'dignified' },
  { kanji: '愛', reading: 'あい', romaji: 'Ai', meaning: 'love' },
  { kanji: '杏', reading: 'あん', romaji: 'An', meaning: 'apricot' },
  { kanji: '紬', reading: 'つむぎ', romaji: 'Tsumugi', meaning: 'spinning silk' },
  { kanji: '美月', reading: 'みづき', romaji: 'Mizuki', meaning: 'beautiful moon' },
  { kanji: '遥', reading: 'はるか', romaji: 'Haruka', meaning: 'distant' },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP'; u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function JapaneseNameGenerator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<{ family: typeof FAMILY_NAMES[0]; given: typeof GIVEN_MALE[0] } | null>(null);

  const generate = () => {
    const family = FAMILY_NAMES[Math.floor(Math.random() * FAMILY_NAMES.length)];
    const pool = gender === 'male' ? GIVEN_MALE : GIVEN_FEMALE;
    const given = pool[Math.floor(Math.random() * pool.length)];
    setResult({ family, given });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 justify-center">
        <button onClick={() => setGender('male')} className={`px-6 py-3 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>👦 Male</button>
        <button onClick={() => setGender('female')} className={`px-6 py-3 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-gray-100'}`}>👧 Female</button>
      </div>

      <button onClick={generate} className="w-full py-4 rounded-lg bg-red-600 text-white font-bold text-lg hover:bg-red-700">
        🎌 Generate Japanese Name
      </button>

      {result && (
        <div className="bg-gray-50 rounded-xl p-6 text-center space-y-4">
          <div className="text-5xl md:text-6xl font-bold cursor-pointer hover:text-red-600" onClick={() => speak(`${result.family.kanji}${result.given.kanji}`)}>
            {result.family.kanji} {result.given.kanji}
          </div>
          <div className="text-xl text-gray-500">{result.family.reading} {result.given.reading}</div>
          <div className="text-lg text-red-600 font-medium">{result.family.romaji} {result.given.romaji}</div>
          <button onClick={() => speak(`${result.family.kanji}${result.given.kanji}`)} className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">🔊 Listen</button>

          <div className="grid grid-cols-2 gap-3 mt-4 text-left">
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-400">Family Name</div>
              <div className="font-bold">{result.family.kanji} ({result.family.romaji})</div>
              <div className="text-sm text-gray-500">{result.family.meaning}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-400">Given Name</div>
              <div className="font-bold">{result.given.kanji} ({result.given.romaji})</div>
              <div className="text-sm text-gray-500">{result.given.meaning}</div>
            </div>
          </div>

          <button onClick={() => navigator.clipboard?.writeText(`${result.family.kanji} ${result.given.kanji} (${result.family.romaji} ${result.given.romaji})`)} className="text-sm px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">📋 Copy</button>
        </div>
      )}
    </div>
  );
}
