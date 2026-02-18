import { useState, useEffect } from 'react';

const IDIOMS = [
  { idiom: '一石二鸟', trad: '一石二鳥', pinyin: 'yī shí èr niǎo', meaning: 'Kill two birds with one stone', literal: 'One stone, two birds', story: 'Derived from the English proverb, this idiom is used to describe achieving two goals with a single action.', example: '这个计划一石二鸟，既省钱又省时间。(This plan kills two birds with one stone — saves money and time.)' },
  { idiom: '画龙点睛', trad: '畫龍點睛', pinyin: 'huà lóng diǎn jīng', meaning: 'Add the finishing touch', literal: 'Paint a dragon, dot its eyes', story: 'Legend says painter Zhang Sengyou drew four dragons without eyes. When he dotted two of them with eyes, they came to life and flew away!', example: '这篇文章最后一段画龙点睛。(The last paragraph really adds the finishing touch.)' },
  { idiom: '对牛弹琴', trad: '對牛彈琴', pinyin: 'duì niú tán qín', meaning: 'To cast pearls before swine', literal: 'Play the lute to a cow', story: 'A musician once played beautiful music for a cow, but the cow just kept eating grass. It describes talking to someone who cannot understand.', example: '跟他讲这些就像对牛弹琴。(Telling him this is like playing music to a cow.)' },
  { idiom: '守株待兔', trad: '守株待兔', pinyin: 'shǒu zhū dài tù', meaning: 'Wait for good luck without effort', literal: 'Guard a tree stump, waiting for rabbits', story: 'A farmer once saw a rabbit run into a tree stump and die. He then sat by the stump every day waiting for another rabbit, but none came.', example: '不能守株待兔，要主动去找机会。(You can\'t just wait for luck — go find opportunities.)' },
  { idiom: '入乡随俗', trad: '入鄉隨俗', pinyin: 'rù xiāng suí sú', meaning: 'When in Rome, do as the Romans do', literal: 'Enter a village, follow its customs', story: 'This ancient wisdom teaches respect for local cultures and customs when visiting new places.', example: '去日本旅游要入乡随俗，进屋脱鞋。(When visiting Japan, follow local customs and take off shoes indoors.)' },
  { idiom: '井底之蛙', trad: '井底之蛙', pinyin: 'jǐng dǐ zhī wā', meaning: 'A frog at the bottom of a well (narrow-minded)', literal: 'A frog at the bottom of a well', story: 'A frog living in a well thought the sky was only as big as the well\'s opening. When a sea turtle told it about the ocean, it couldn\'t believe it.', example: '不要做井底之蛙，要多看看外面的世界。(Don\'t be narrow-minded — go see the wider world.)' },
  { idiom: '塞翁失马', trad: '塞翁失馬', pinyin: 'sài wēng shī mǎ', meaning: 'A blessing in disguise', literal: 'The old man on the frontier lost his horse', story: 'An old man\'s horse ran away, but it returned with a beautiful wild horse. His son rode it and broke his leg, but was then exempt from military service.', example: '虽然失去了这份工作，但塞翁失马，你找到了更好的。(Losing that job was a blessing in disguise — you found a better one.)' },
  { idiom: '卧虎藏龙', trad: '臥虎藏龍', pinyin: 'wò hǔ cáng lóng', meaning: 'Hidden talents; crouching tiger, hidden dragon', literal: 'Crouching tiger, hidden dragon', story: 'This idiom describes a place or group where talented people are hidden among ordinary-looking people. Made famous worldwide by Ang Lee\'s film.', example: '这个小公司卧虎藏龙，人才济济。(This small company is full of hidden talents.)' },
  { idiom: '百闻不如一见', trad: '百聞不如一見', pinyin: 'bǎi wén bù rú yī jiàn', meaning: 'Seeing is believing', literal: 'Hearing a hundred times is not as good as seeing once', story: 'A Han Dynasty general used this phrase when asked about enemy forces, insisting on seeing the situation himself rather than relying on reports.', example: '百闻不如一见，你自己去看看吧！(Seeing is believing — go see for yourself!)' },
  { idiom: '半途而废', trad: '半途而廢', pinyin: 'bàn tú ér fèi', meaning: 'Give up halfway', literal: 'Abandon halfway through the journey', story: 'A wife cut the cloth she was weaving to teach her husband a lesson about quitting his studies — once cut, all her work was wasted.', example: '学中文不要半途而废，坚持就是胜利。(Don\'t give up learning Chinese halfway — persistence is victory.)' },
  { idiom: '刻舟求剑', trad: '刻舟求劍', pinyin: 'kè zhōu qiú jiàn', meaning: 'Take rigid measures without considering change', literal: 'Carve a mark on the boat to find a dropped sword', story: 'A man dropped his sword in the river and carved a mark on his moving boat to find it later. Of course, the boat had moved far away from where the sword fell.', example: '时代变了，不能刻舟求剑。(Times have changed — you can\'t use outdated methods.)' },
  { idiom: '三人行必有我师', trad: '三人行必有我師', pinyin: 'sān rén xíng bì yǒu wǒ shī', meaning: 'Among three people, there is always something to learn', literal: 'When three people walk together, one must be my teacher', story: 'From Confucius\' Analerta. It teaches humility — everyone has something they can teach us if we remain open to learning.', example: '三人行必有我师，要虚心向别人学习。(There\'s always something to learn from others — stay humble.)' },
  { idiom: '自相矛盾', trad: '自相矛盾', pinyin: 'zì xiāng máo dùn', meaning: 'Self-contradictory', literal: 'One\'s own spear against one\'s own shield', story: 'A merchant claimed his spear could pierce any shield and his shield could block any spear. Someone asked: what happens when your spear meets your shield?', example: '你说的话自相矛盾。(What you said contradicts itself.)' },
  { idiom: '亡羊补牢', trad: '亡羊補牢', pinyin: 'wáng yáng bǔ láo', meaning: 'Better late than never', literal: 'Mend the pen after losing a sheep', story: 'After losing sheep because of a broken fence, a farmer finally repaired it. His neighbor said it was too late, but no more sheep were lost after that.', example: '虽然晚了，但亡羊补牢，现在开始学还不迟。(It\'s late, but better late than never — start learning now.)' },
  { idiom: '画蛇添足', trad: '畫蛇添足', pinyin: 'huà shé tiān zú', meaning: 'Ruin something by adding unnecessary detail', literal: 'Draw a snake and add feet to it', story: 'In a snake-drawing contest, the first to finish added feet to his snake while waiting. The judge disqualified him — snakes don\'t have feet!', example: '你的报告已经很好了，不要画蛇添足。(Your report is already great — don\'t add unnecessary details.)' },
];

function getDayIndex(): number {
  const start = new Date(2026, 0, 1).getTime();
  const now = new Date().getTime();
  return Math.floor((now - start) / 86400000) % IDIOMS.length;
}

function speak(text: string, lang: string = 'zh-TW') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.7;
  window.speechSynthesis.speak(u);
}

export default function DailyIdiom() {
  const [showStory, setShowStory] = useState(false);
  const [saved, setSaved] = useState(false);

  const dayIndex = getDayIndex();
  const idiom = IDIOMS[dayIndex];

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('ftk-chinese') || '{}');
      if (data.bookmarks?.find((b: any) => b.char === idiom.idiom)) setSaved(true);
    } catch {}
  }, []);

  const toggleSave = () => {
    try {
      const data = JSON.parse(localStorage.getItem('ftk-chinese') || '{}');
      if (!data.bookmarks) data.bookmarks = [];
      if (saved) {
        data.bookmarks = data.bookmarks.filter((b: any) => b.char !== idiom.idiom);
      } else {
        data.bookmarks.push({ char: idiom.idiom, pinyin: idiom.pinyin, meaning: idiom.meaning, addedAt: new Date().toISOString().split('T')[0] });
      }
      localStorage.setItem('ftk-chinese', JSON.stringify(data));
      setSaved(!saved);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-gray-500">
        📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>

      {/* Main Idiom */}
      <div className="text-center py-6">
        <div className="relative inline-block">
          <div className="text-5xl md:text-6xl font-bold tracking-wider mb-3 cursor-pointer hover:text-red-600 transition-colors" onClick={() => speak(idiom.idiom)}>
            {idiom.idiom}
          </div>
          <button onClick={toggleSave} className={`absolute -top-2 -right-6 text-2xl ${saved ? '' : 'opacity-30 hover:opacity-60'}`}>
            {saved ? '⭐' : '☆'}
          </button>
        </div>
        {idiom.idiom !== idiom.trad && (
          <div className="text-xl text-gray-400 mb-2">Traditional: {idiom.trad}</div>
        )}
        <div className="flex items-center justify-center gap-3 text-xl text-blue-600 mb-2">
          <span>{idiom.pinyin}</span>
          <button onClick={() => speak(idiom.idiom)} className="w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center">🔊</button>
        </div>
      </div>

      {/* Meaning */}
      <div className="bg-red-50 rounded-xl p-5 border border-red-100">
        <h3 className="text-sm font-medium text-red-400 mb-1">💡 Meaning</h3>
        <p className="text-xl font-bold text-gray-800">{idiom.meaning}</p>
        <p className="text-sm text-gray-500 mt-1">Literally: "{idiom.literal}"</p>
      </div>

      {/* Story */}
      <div>
        <button
          onClick={() => setShowStory(!showStory)}
          className="w-full flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all"
        >
          <span className="font-medium text-amber-800">📖 Origin Story</span>
          <span className={`transition-transform ${showStory ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {showStory && (
          <div className="mt-2 p-4 bg-amber-50 rounded-b-xl text-gray-700 leading-relaxed">
            {idiom.story}
          </div>
        )}
      </div>

      {/* Example */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-500 mb-2">📝 Example Sentence</h3>
        <div className="flex items-start gap-3">
          <button onClick={() => speak(idiom.example.split('(')[0])} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center mt-1 flex-shrink-0">🔊</button>
          <p className="text-gray-700">{idiom.example}</p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">
        Idiom #{dayIndex + 1} of {IDIOMS.length} · New idiom every day
      </p>
    </div>
  );
}
