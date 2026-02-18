import { useState, useCallback } from 'react';

// ===== DATA =====

// Common Chinese surnames with meanings
const SURNAMES = [
  { char: '李', trad: '李', pinyin: 'Lǐ', meaning: 'plum tree' },
  { char: '王', trad: '王', pinyin: 'Wáng', meaning: 'king' },
  { char: '张', trad: '張', pinyin: 'Zhāng', meaning: 'stretch, extend' },
  { char: '刘', trad: '劉', pinyin: 'Liú', meaning: 'flowing' },
  { char: '陈', trad: '陳', pinyin: 'Chén', meaning: 'exhibit, display' },
  { char: '杨', trad: '楊', pinyin: 'Yáng', meaning: 'poplar tree' },
  { char: '林', trad: '林', pinyin: 'Lín', meaning: 'forest' },
  { char: '黄', trad: '黃', pinyin: 'Huáng', meaning: 'yellow, golden' },
  { char: '赵', trad: '趙', pinyin: 'Zhào', meaning: 'to surpass' },
  { char: '周', trad: '周', pinyin: 'Zhōu', meaning: 'complete, cycle' },
  { char: '吴', trad: '吳', pinyin: 'Wú', meaning: 'ancient state' },
  { char: '郑', trad: '鄭', pinyin: 'Zhèng', meaning: 'solemn' },
  { char: '孙', trad: '孫', pinyin: 'Sūn', meaning: 'grandchild' },
  { char: '罗', trad: '羅', pinyin: 'Luó', meaning: 'net, collect' },
  { char: '马', trad: '馬', pinyin: 'Mǎ', meaning: 'horse' },
  { char: '高', trad: '高', pinyin: 'Gāo', meaning: 'tall, high' },
  { char: '白', trad: '白', pinyin: 'Bái', meaning: 'white, pure' },
  { char: '宋', trad: '宋', pinyin: 'Sòng', meaning: 'Song dynasty' },
  { char: '许', trad: '許', pinyin: 'Xǔ', meaning: 'allow, promise' },
  { char: '沈', trad: '沈', pinyin: 'Shěn', meaning: 'deep, profound' },
];

// Given name characters organized by theme
const GIVEN_NAMES: Record<string, { char: string; trad: string; pinyin: string; meaning: string }[]> = {
  wisdom: [
    { char: '智', trad: '智', pinyin: 'zhì', meaning: 'wisdom' },
    { char: '慧', trad: '慧', pinyin: 'huì', meaning: 'intelligent' },
    { char: '明', trad: '明', pinyin: 'míng', meaning: 'bright, clear' },
    { char: '哲', trad: '哲', pinyin: 'zhé', meaning: 'philosophy, wise' },
    { char: '思', trad: '思', pinyin: 'sī', meaning: 'think, ponder' },
    { char: '聪', trad: '聰', pinyin: 'cōng', meaning: 'clever' },
    { char: '睿', trad: '睿', pinyin: 'ruì', meaning: 'astute, wise' },
    { char: '博', trad: '博', pinyin: 'bó', meaning: 'extensive, broad' },
  ],
  nature: [
    { char: '山', trad: '山', pinyin: 'shān', meaning: 'mountain' },
    { char: '海', trad: '海', pinyin: 'hǎi', meaning: 'ocean' },
    { char: '风', trad: '風', pinyin: 'fēng', meaning: 'wind' },
    { char: '云', trad: '雲', pinyin: 'yún', meaning: 'cloud' },
    { char: '川', trad: '川', pinyin: 'chuān', meaning: 'river' },
    { char: '林', trad: '林', pinyin: 'lín', meaning: 'forest' },
    { char: '岚', trad: '嵐', pinyin: 'lán', meaning: 'mountain mist' },
    { char: '泉', trad: '泉', pinyin: 'quán', meaning: 'spring water' },
  ],
  beauty: [
    { char: '美', trad: '美', pinyin: 'měi', meaning: 'beautiful' },
    { char: '雅', trad: '雅', pinyin: 'yǎ', meaning: 'elegant' },
    { char: '婷', trad: '婷', pinyin: 'tíng', meaning: 'graceful' },
    { char: '丽', trad: '麗', pinyin: 'lì', meaning: 'lovely' },
    { char: '秀', trad: '秀', pinyin: 'xiù', meaning: 'refined, elegant' },
    { char: '芳', trad: '芳', pinyin: 'fāng', meaning: 'fragrant' },
    { char: '琳', trad: '琳', pinyin: 'lín', meaning: 'fine jade' },
    { char: '瑶', trad: '瑤', pinyin: 'yáo', meaning: 'precious jade' },
  ],
  strength: [
    { char: '强', trad: '強', pinyin: 'qiáng', meaning: 'strong' },
    { char: '勇', trad: '勇', pinyin: 'yǒng', meaning: 'brave' },
    { char: '伟', trad: '偉', pinyin: 'wěi', meaning: 'great, mighty' },
    { char: '刚', trad: '剛', pinyin: 'gāng', meaning: 'firm, unyielding' },
    { char: '毅', trad: '毅', pinyin: 'yì', meaning: 'resolute' },
    { char: '威', trad: '威', pinyin: 'wēi', meaning: 'power, prestige' },
    { char: '豪', trad: '豪', pinyin: 'háo', meaning: 'heroic, grand' },
    { char: '杰', trad: '傑', pinyin: 'jié', meaning: 'outstanding' },
  ],
  virtue: [
    { char: '德', trad: '德', pinyin: 'dé', meaning: 'virtue' },
    { char: '仁', trad: '仁', pinyin: 'rén', meaning: 'kindness' },
    { char: '信', trad: '信', pinyin: 'xìn', meaning: 'trust, faith' },
    { char: '义', trad: '義', pinyin: 'yì', meaning: 'righteousness' },
    { char: '和', trad: '和', pinyin: 'hé', meaning: 'harmony' },
    { char: '善', trad: '善', pinyin: 'shàn', meaning: 'goodness' },
    { char: '诚', trad: '誠', pinyin: 'chéng', meaning: 'sincere' },
    { char: '礼', trad: '禮', pinyin: 'lǐ', meaning: 'courtesy' },
  ],
  flower: [
    { char: '花', trad: '花', pinyin: 'huā', meaning: 'flower' },
    { char: '兰', trad: '蘭', pinyin: 'lán', meaning: 'orchid' },
    { char: '莲', trad: '蓮', pinyin: 'lián', meaning: 'lotus' },
    { char: '梅', trad: '梅', pinyin: 'méi', meaning: 'plum blossom' },
    { char: '菊', trad: '菊', pinyin: 'jú', meaning: 'chrysanthemum' },
    { char: '樱', trad: '櫻', pinyin: 'yīng', meaning: 'cherry blossom' },
    { char: '薇', trad: '薇', pinyin: 'wēi', meaning: 'fern, rose' },
    { char: '桃', trad: '桃', pinyin: 'táo', meaning: 'peach' },
  ],
  light: [
    { char: '光', trad: '光', pinyin: 'guāng', meaning: 'light' },
    { char: '辉', trad: '輝', pinyin: 'huī', meaning: 'radiance' },
    { char: '晨', trad: '晨', pinyin: 'chén', meaning: 'morning' },
    { char: '星', trad: '星', pinyin: 'xīng', meaning: 'star' },
    { char: '阳', trad: '陽', pinyin: 'yáng', meaning: 'sunshine' },
    { char: '曦', trad: '曦', pinyin: 'xī', meaning: 'dawn light' },
    { char: '旭', trad: '旭', pinyin: 'xù', meaning: 'rising sun' },
    { char: '耀', trad: '耀', pinyin: 'yào', meaning: 'shine, glory' },
  ],
  prosperity: [
    { char: '富', trad: '富', pinyin: 'fù', meaning: 'wealth' },
    { char: '贵', trad: '貴', pinyin: 'guì', meaning: 'noble, precious' },
    { char: '荣', trad: '榮', pinyin: 'róng', meaning: 'glory' },
    { char: '祥', trad: '祥', pinyin: 'xiáng', meaning: 'auspicious' },
    { char: '福', trad: '福', pinyin: 'fú', meaning: 'blessing, fortune' },
    { char: '瑞', trad: '瑞', pinyin: 'ruì', meaning: 'lucky omen' },
    { char: '安', trad: '安', pinyin: 'ān', meaning: 'peace' },
    { char: '吉', trad: '吉', pinyin: 'jí', meaning: 'lucky, auspicious' },
  ],
};

const THEMES = [
  { key: 'wisdom', label: '🧠 Wisdom & Intelligence', desc: 'Smart, thoughtful, philosophical' },
  { key: 'nature', label: '🌿 Nature & Landscape', desc: 'Mountains, rivers, sky' },
  { key: 'beauty', label: '✨ Beauty & Elegance', desc: 'Graceful, refined, lovely' },
  { key: 'strength', label: '💪 Strength & Courage', desc: 'Brave, powerful, heroic' },
  { key: 'virtue', label: '🙏 Virtue & Character', desc: 'Kind, honest, righteous' },
  { key: 'flower', label: '🌸 Flowers & Plants', desc: 'Orchid, lotus, plum blossom' },
  { key: 'light', label: '☀️ Light & Stars', desc: 'Sunshine, dawn, radiance' },
  { key: 'prosperity', label: '🎊 Prosperity & Fortune', desc: 'Lucky, blessed, peaceful' },
];

type Gender = 'male' | 'female' | 'neutral';
type CharSet = 'simplified' | 'traditional';

interface GeneratedName {
  surname: typeof SURNAMES[0];
  given1: typeof GIVEN_NAMES['wisdom'][0];
  given2: typeof GIVEN_NAMES['wisdom'][0];
  theme: string;
}

// ===== HELPERS =====

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickRandom<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function generateNames(
  englishName: string,
  themes: string[],
  gender: Gender,
  count: number = 5
): GeneratedName[] {
  const seed = hashString(englishName.toLowerCase() + gender);
  const rand = seededRandom(seed);
  const results: GeneratedName[] = [];
  const usedCombos = new Set<string>();

  // Filter themes based on gender preference
  let availableThemes = themes.length > 0 ? themes : Object.keys(GIVEN_NAMES);
  if (gender === 'female' && themes.length === 0) {
    availableThemes = ['beauty', 'flower', 'wisdom', 'light', 'nature', 'virtue'];
  } else if (gender === 'male' && themes.length === 0) {
    availableThemes = ['strength', 'wisdom', 'nature', 'light', 'prosperity', 'virtue'];
  }

  let attempts = 0;
  while (results.length < count && attempts < 100) {
    attempts++;
    const theme = pickRandom(availableThemes, rand);
    const chars = GIVEN_NAMES[theme];
    if (!chars) continue;

    const surname = pickRandom(SURNAMES, rand);
    const given1 = pickRandom(chars, rand);

    // 50% chance of 2-char given name
    const useTwoChar = rand() > 0.4;
    const theme2 = pickRandom(availableThemes, rand);
    const given2 = useTwoChar ? pickRandom(GIVEN_NAMES[theme2] || chars, rand) : given1;

    const combo = `${surname.char}${given1.char}${useTwoChar ? given2.char : ''}`;
    if (usedCombos.has(combo)) continue;
    if (useTwoChar && given1.char === given2.char) continue;

    usedCombos.add(combo);
    results.push({
      surname,
      given1,
      given2: useTwoChar ? given2 : given1,
      theme: useTwoChar ? theme : theme,
    });
  }

  return results;
}

function speak(text: string, lang: string = 'zh-TW') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

// ===== COMPONENT =====

export default function ChineseNameGenerator() {
  const [englishName, setEnglishName] = useState('');
  const [gender, setGender] = useState<Gender>('neutral');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [charset, setCharset] = useState<CharSet>('traditional');
  const [results, setResults] = useState<GeneratedName[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [savedNames, setSavedNames] = useState<string[]>([]);

  const toggleTheme = (key: string) => {
    setSelectedThemes(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    );
  };

  const handleGenerate = useCallback(() => {
    if (!englishName.trim()) return;
    const names = generateNames(englishName, selectedThemes, gender, 6);
    setResults(names);
    setHasGenerated(true);
  }, [englishName, selectedThemes, gender]);

  const getFullName = (name: GeneratedName) => {
    const c = charset === 'traditional' ? 'trad' : 'char';
    if (name.given1.char === name.given2.char) {
      return `${name.surname[c]}${name.given1[c]}`;
    }
    return `${name.surname[c]}${name.given1[c]}${name.given2[c]}`;
  };

  const getFullPinyin = (name: GeneratedName) => {
    if (name.given1.char === name.given2.char) {
      return `${name.surname.pinyin} ${name.given1.pinyin}`;
    }
    return `${name.surname.pinyin} ${name.given1.pinyin} ${name.given2.pinyin}`;
  };

  const getMeaning = (name: GeneratedName) => {
    if (name.given1.char === name.given2.char) {
      return `${name.surname.meaning} + ${name.given1.meaning}`;
    }
    return `${name.surname.meaning} + ${name.given1.meaning} + ${name.given2.meaning}`;
  };

  const toggleSave = (fullName: string) => {
    setSavedNames(prev =>
      prev.includes(fullName) ? prev.filter(n => n !== fullName) : [...prev, fullName]
    );
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your English Name
        </label>
        <input
          type="text"
          value={englishName}
          onChange={(e) => setEnglishName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="e.g. David, Sarah, Michael..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
        <div className="flex gap-3">
          {([
            ['male', '👨 Male'],
            ['female', '👩 Female'],
            ['neutral', '⚡ Any'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setGender(value)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                gender === value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Character Set */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Character Set</label>
        <div className="flex gap-3">
          <button
            onClick={() => setCharset('traditional')}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              charset === 'traditional'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            繁 Traditional
          </button>
          <button
            onClick={() => setCharset('simplified')}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              charset === 'simplified'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            简 Simplified
          </button>
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name Themes <span className="text-gray-400 font-normal">(optional, select 1-3)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme.key}
              onClick={() => toggleTheme(theme.key)}
              className={`text-left p-3 rounded-lg border text-sm transition-all ${
                selectedThemes.includes(theme.key)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{theme.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{theme.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!englishName.trim()}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
          englishName.trim()
            ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        🈶 Generate Chinese Names
      </button>

      {/* Results */}
      {hasGenerated && results.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-bold">
            Chinese Names for "{englishName}"
          </h2>

          {results.map((name, idx) => {
            const fullName = getFullName(name);
            const fullPinyin = getFullPinyin(name);
            const isSaved = savedNames.includes(fullName);

            return (
              <div
                key={idx}
                className="p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {fullName}
                      </span>
                      <button
                        onClick={() => speak(fullName, charset === 'traditional' ? 'zh-TW' : 'zh-CN')}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        title="Listen to pronunciation"
                      >
                        🔊
                      </button>
                      <button
                        onClick={() => speak(fullName, charset === 'traditional' ? 'zh-TW' : 'zh-CN')}
                        className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200"
                        title="Slow pronunciation"
                      >
                        🐢 Slow
                      </button>
                    </div>
                    <div className="text-lg text-blue-600 mb-2">{fullPinyin}</div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Meaning:</span> {getMeaning(name)}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                        Surname: {name.surname[charset === 'traditional' ? 'trad' : 'char']} ({name.surname.meaning})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSave(fullName)}
                    className={`text-2xl transition-transform hover:scale-110 ${isSaved ? '' : 'opacity-30 hover:opacity-60'}`}
                    title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    {isSaved ? '⭐' : '☆'}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Regenerate */}
          <button
            onClick={() => {
              const names = generateNames(englishName + Date.now(), selectedThemes, gender, 6);
              setResults(names);
            }}
            className="w-full py-3 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-all"
          >
            🔄 Generate More Names
          </button>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <p className="font-medium mb-1">💡 Tips for choosing your Chinese name:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Say it out loud — does it flow naturally?</li>
              <li>Ask a Chinese-speaking friend for their opinion</li>
              <li>Check that the characters don't have unintended meanings together</li>
              <li>Traditional characters are used in Taiwan, Simplified in mainland China</li>
            </ul>
          </div>
        </div>
      )}

      {hasGenerated && results.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No names generated. Try a different name or theme combination.
        </div>
      )}
    </div>
  );
}
