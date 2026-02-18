import { useState, useMemo } from 'react';

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

interface Word { word: string; reading: string; meaning: string; jlpt: number; }

const VOCAB: Word[] = [
  // === N5 (30) ===
  { word: '食べる', reading: 'たべる', meaning: 'to eat', jlpt: 5 },
  { word: '飲む', reading: 'のむ', meaning: 'to drink', jlpt: 5 },
  { word: '見る', reading: 'みる', meaning: 'to see', jlpt: 5 },
  { word: '聞く', reading: 'きく', meaning: 'to hear/ask', jlpt: 5 },
  { word: '読む', reading: 'よむ', meaning: 'to read', jlpt: 5 },
  { word: '書く', reading: 'かく', meaning: 'to write', jlpt: 5 },
  { word: '話す', reading: 'はなす', meaning: 'to speak', jlpt: 5 },
  { word: '行く', reading: 'いく', meaning: 'to go', jlpt: 5 },
  { word: '来る', reading: 'くる', meaning: 'to come', jlpt: 5 },
  { word: '帰る', reading: 'かえる', meaning: 'to return', jlpt: 5 },
  { word: '買う', reading: 'かう', meaning: 'to buy', jlpt: 5 },
  { word: '入る', reading: 'はいる', meaning: 'to enter', jlpt: 5 },
  { word: '出る', reading: 'でる', meaning: 'to exit', jlpt: 5 },
  { word: '大きい', reading: 'おおきい', meaning: 'big', jlpt: 5 },
  { word: '小さい', reading: 'ちいさい', meaning: 'small', jlpt: 5 },
  { word: '新しい', reading: 'あたらしい', meaning: 'new', jlpt: 5 },
  { word: '古い', reading: 'ふるい', meaning: 'old', jlpt: 5 },
  { word: '高い', reading: 'たかい', meaning: 'tall/expensive', jlpt: 5 },
  { word: '安い', reading: 'やすい', meaning: 'cheap', jlpt: 5 },
  { word: '近い', reading: 'ちかい', meaning: 'near', jlpt: 5 },
  { word: '遠い', reading: 'とおい', meaning: 'far', jlpt: 5 },
  { word: '早い', reading: 'はやい', meaning: 'early/fast', jlpt: 5 },
  { word: '元気', reading: 'げんき', meaning: 'energetic/well', jlpt: 5 },
  { word: '天気', reading: 'てんき', meaning: 'weather', jlpt: 5 },
  { word: '電車', reading: 'でんしゃ', meaning: 'train', jlpt: 5 },
  { word: '学校', reading: 'がっこう', meaning: 'school', jlpt: 5 },
  { word: '先生', reading: 'せんせい', meaning: 'teacher', jlpt: 5 },
  { word: '学生', reading: 'がくせい', meaning: 'student', jlpt: 5 },
  { word: '友達', reading: 'ともだち', meaning: 'friend', jlpt: 5 },
  { word: '家族', reading: 'かぞく', meaning: 'family', jlpt: 5 },

  // === N4 (30) ===
  { word: '走る', reading: 'はしる', meaning: 'to run', jlpt: 4 },
  { word: '届ける', reading: 'とどける', meaning: 'to deliver', jlpt: 4 },
  { word: '集める', reading: 'あつめる', meaning: 'to collect', jlpt: 4 },
  { word: '決める', reading: 'きめる', meaning: 'to decide', jlpt: 4 },
  { word: '変える', reading: 'かえる', meaning: 'to change', jlpt: 4 },
  { word: '伝える', reading: 'つたえる', meaning: 'to convey', jlpt: 4 },
  { word: '比べる', reading: 'くらべる', meaning: 'to compare', jlpt: 4 },
  { word: '経験', reading: 'けいけん', meaning: 'experience', jlpt: 4 },
  { word: '社会', reading: 'しゃかい', meaning: 'society', jlpt: 4 },
  { word: '自然', reading: 'しぜん', meaning: 'nature', jlpt: 4 },
  { word: '技術', reading: 'ぎじゅつ', meaning: 'technology', jlpt: 4 },
  { word: '文化', reading: 'ぶんか', meaning: 'culture', jlpt: 4 },
  { word: '政治', reading: 'せいじ', meaning: 'politics', jlpt: 4 },
  { word: '経済', reading: 'けいざい', meaning: 'economy', jlpt: 4 },
  { word: '趣味', reading: 'しゅみ', meaning: 'hobby', jlpt: 4 },
  { word: '準備', reading: 'じゅんび', meaning: 'preparation', jlpt: 4 },
  { word: '予定', reading: 'よてい', meaning: 'plan/schedule', jlpt: 4 },
  { word: '連絡', reading: 'れんらく', meaning: 'contact', jlpt: 4 },
  { word: '会議', reading: 'かいぎ', meaning: 'meeting', jlpt: 4 },
  { word: '相談', reading: 'そうだん', meaning: 'consultation', jlpt: 4 },
  { word: '説明', reading: 'せつめい', meaning: 'explanation', jlpt: 4 },
  { word: '紹介', reading: 'しょうかい', meaning: 'introduction', jlpt: 4 },
  { word: '心配', reading: 'しんぱい', meaning: 'worry', jlpt: 4 },
  { word: '残念', reading: 'ざんねん', meaning: 'regrettable', jlpt: 4 },
  { word: '丁寧', reading: 'ていねい', meaning: 'polite/careful', jlpt: 4 },
  { word: '複雑', reading: 'ふくざつ', meaning: 'complicated', jlpt: 4 },
  { word: '簡単', reading: 'かんたん', meaning: 'simple/easy', jlpt: 4 },
  { word: '特別', reading: 'とくべつ', meaning: 'special', jlpt: 4 },
  { word: '普通', reading: 'ふつう', meaning: 'normal/ordinary', jlpt: 4 },
  { word: '必要', reading: 'ひつよう', meaning: 'necessary', jlpt: 4 },

  // === N3 (30) ===
  { word: '影響', reading: 'えいきょう', meaning: 'influence/effect', jlpt: 3 },
  { word: '関係', reading: 'かんけい', meaning: 'relationship', jlpt: 3 },
  { word: '状況', reading: 'じょうきょう', meaning: 'situation', jlpt: 3 },
  { word: '条件', reading: 'じょうけん', meaning: 'condition/requirement', jlpt: 3 },
  { word: '結果', reading: 'けっか', meaning: 'result', jlpt: 3 },
  { word: '原因', reading: 'げんいん', meaning: 'cause/reason', jlpt: 3 },
  { word: '目的', reading: 'もくてき', meaning: 'purpose/objective', jlpt: 3 },
  { word: '方法', reading: 'ほうほう', meaning: 'method/way', jlpt: 3 },
  { word: '意見', reading: 'いけん', meaning: 'opinion', jlpt: 3 },
  { word: '態度', reading: 'たいど', meaning: 'attitude', jlpt: 3 },
  { word: '責任', reading: 'せきにん', meaning: 'responsibility', jlpt: 3 },
  { word: '努力', reading: 'どりょく', meaning: 'effort', jlpt: 3 },
  { word: '成功', reading: 'せいこう', meaning: 'success', jlpt: 3 },
  { word: '失敗', reading: 'しっぱい', meaning: 'failure', jlpt: 3 },
  { word: '問題', reading: 'もんだい', meaning: 'problem/question', jlpt: 3 },
  { word: '解決', reading: 'かいけつ', meaning: 'solution', jlpt: 3 },
  { word: '発展', reading: 'はってん', meaning: 'development', jlpt: 3 },
  { word: '環境', reading: 'かんきょう', meaning: 'environment', jlpt: 3 },
  { word: '増える', reading: 'ふえる', meaning: 'to increase', jlpt: 3 },
  { word: '減る', reading: 'へる', meaning: 'to decrease', jlpt: 3 },
  { word: '進む', reading: 'すすむ', meaning: 'to advance', jlpt: 3 },
  { word: '受ける', reading: 'うける', meaning: 'to receive/take exam', jlpt: 3 },
  { word: '認める', reading: 'みとめる', meaning: 'to recognize/admit', jlpt: 3 },
  { word: '求める', reading: 'もとめる', meaning: 'to seek/demand', jlpt: 3 },
  { word: '含む', reading: 'ふくむ', meaning: 'to include/contain', jlpt: 3 },
  { word: '示す', reading: 'しめす', meaning: 'to show/indicate', jlpt: 3 },
  { word: '具体的', reading: 'ぐたいてき', meaning: 'concrete/specific', jlpt: 3 },
  { word: '一般的', reading: 'いっぱんてき', meaning: 'general/common', jlpt: 3 },
  { word: '積極的', reading: 'せっきょくてき', meaning: 'positive/active', jlpt: 3 },
  { word: '基本的', reading: 'きほんてき', meaning: 'fundamental', jlpt: 3 },

  // === N2 (30) ===
  { word: '傾向', reading: 'けいこう', meaning: 'tendency/trend', jlpt: 2 },
  { word: '対象', reading: 'たいしょう', meaning: 'target/subject', jlpt: 2 },
  { word: '基準', reading: 'きじゅん', meaning: 'standard/criteria', jlpt: 2 },
  { word: '手段', reading: 'しゅだん', meaning: 'means/measure', jlpt: 2 },
  { word: '制度', reading: 'せいど', meaning: 'system/institution', jlpt: 2 },
  { word: '構造', reading: 'こうぞう', meaning: 'structure', jlpt: 2 },
  { word: '機能', reading: 'きのう', meaning: 'function', jlpt: 2 },
  { word: '効果', reading: 'こうか', meaning: 'effect/result', jlpt: 2 },
  { word: '現象', reading: 'げんしょう', meaning: 'phenomenon', jlpt: 2 },
  { word: '背景', reading: 'はいけい', meaning: 'background', jlpt: 2 },
  { word: '分野', reading: 'ぶんや', meaning: 'field/area', jlpt: 2 },
  { word: '段階', reading: 'だんかい', meaning: 'stage/phase', jlpt: 2 },
  { word: '過程', reading: 'かてい', meaning: 'process', jlpt: 2 },
  { word: '要素', reading: 'ようそ', meaning: 'element/factor', jlpt: 2 },
  { word: '特徴', reading: 'とくちょう', meaning: 'feature/characteristic', jlpt: 2 },
  { word: '把握', reading: 'はあく', meaning: 'grasp/comprehension', jlpt: 2 },
  { word: '維持', reading: 'いじ', meaning: 'maintenance', jlpt: 2 },
  { word: '促進', reading: 'そくしん', meaning: 'promotion/facilitation', jlpt: 2 },
  { word: '確認', reading: 'かくにん', meaning: 'confirmation', jlpt: 2 },
  { word: '判断', reading: 'はんだん', meaning: 'judgment', jlpt: 2 },
  { word: '対応', reading: 'たいおう', meaning: 'response/handling', jlpt: 2 },
  { word: '実施', reading: 'じっし', meaning: 'implementation', jlpt: 2 },
  { word: '検討', reading: 'けんとう', meaning: 'examination/review', jlpt: 2 },
  { word: '提供', reading: 'ていきょう', meaning: 'provision/offering', jlpt: 2 },
  { word: '活用', reading: 'かつよう', meaning: 'practical use', jlpt: 2 },
  { word: '展開', reading: 'てんかい', meaning: 'development/expansion', jlpt: 2 },
  { word: '異なる', reading: 'ことなる', meaning: 'to differ', jlpt: 2 },
  { word: '伴う', reading: 'ともなう', meaning: 'to accompany', jlpt: 2 },
  { word: '適切', reading: 'てきせつ', meaning: 'appropriate', jlpt: 2 },
  { word: '豊富', reading: 'ほうふ', meaning: 'abundant/rich', jlpt: 2 },

  // === N1 (30) ===
  { word: '概念', reading: 'がいねん', meaning: 'concept/notion', jlpt: 1 },
  { word: '抽象', reading: 'ちゅうしょう', meaning: 'abstract', jlpt: 1 },
  { word: '普遍', reading: 'ふへん', meaning: 'universal', jlpt: 1 },
  { word: '本質', reading: 'ほんしつ', meaning: 'essence/true nature', jlpt: 1 },
  { word: '矛盾', reading: 'むじゅん', meaning: 'contradiction', jlpt: 1 },
  { word: '妥協', reading: 'だきょう', meaning: 'compromise', jlpt: 1 },
  { word: '偏見', reading: 'へんけん', meaning: 'prejudice/bias', jlpt: 1 },
  { word: '慣習', reading: 'かんしゅう', meaning: 'custom/convention', jlpt: 1 },
  { word: '洞察', reading: 'どうさつ', meaning: 'insight', jlpt: 1 },
  { word: '繊細', reading: 'せんさい', meaning: 'delicate/sensitive', jlpt: 1 },
  { word: '顕著', reading: 'けんちょ', meaning: 'remarkable/prominent', jlpt: 1 },
  { word: '膨大', reading: 'ぼうだい', meaning: 'enormous/vast', jlpt: 1 },
  { word: '厳密', reading: 'げんみつ', meaning: 'strict/rigorous', jlpt: 1 },
  { word: '曖昧', reading: 'あいまい', meaning: 'ambiguous/vague', jlpt: 1 },
  { word: '斬新', reading: 'ざんしん', meaning: 'novel/innovative', jlpt: 1 },
  { word: '網羅', reading: 'もうら', meaning: 'comprehensive coverage', jlpt: 1 },
  { word: '淘汰', reading: 'とうた', meaning: 'elimination/selection', jlpt: 1 },
  { word: '逸脱', reading: 'いつだつ', meaning: 'deviation', jlpt: 1 },
  { word: '是正', reading: 'ぜせい', meaning: 'correction/rectification', jlpt: 1 },
  { word: '促す', reading: 'うながす', meaning: 'to urge/prompt', jlpt: 1 },
  { word: '覆す', reading: 'くつがえす', meaning: 'to overturn', jlpt: 1 },
  { word: '見なす', reading: 'みなす', meaning: 'to regard as', jlpt: 1 },
  { word: '委ねる', reading: 'ゆだねる', meaning: 'to entrust', jlpt: 1 },
  { word: '培う', reading: 'つちかう', meaning: 'to cultivate/foster', jlpt: 1 },
  { word: '遮る', reading: 'さえぎる', meaning: 'to interrupt/block', jlpt: 1 },
  { word: '怠る', reading: 'おこたる', meaning: 'to neglect/be lazy', jlpt: 1 },
  { word: '携わる', reading: 'たずさわる', meaning: 'to be involved in', jlpt: 1 },
  { word: '踏まえる', reading: 'ふまえる', meaning: 'to be based on', jlpt: 1 },
  { word: '捉える', reading: 'とらえる', meaning: 'to grasp/capture', jlpt: 1 },
  { word: '覆う', reading: 'おおう', meaning: 'to cover/conceal', jlpt: 1 },
];

const LEVELS = [5, 4, 3, 2, 1];
const LEVEL_INFO: Record<number, { label: string; desc: string; color: string }> = {
  5: { label: 'N5 · Beginner', desc: '~800 words — Basic greetings, everyday verbs & adjectives', color: 'bg-green-600' },
  4: { label: 'N4 · Elementary', desc: '~1,500 words — Daily conversation, basic kanji compounds', color: 'bg-blue-600' },
  3: { label: 'N3 · Intermediate', desc: '~3,750 words — Abstract concepts, formal expressions', color: 'bg-yellow-600' },
  2: { label: 'N2 · Upper-Intermediate', desc: '~6,000 words — Academic, business, and technical terms', color: 'bg-orange-600' },
  1: { label: 'N1 · Advanced', desc: '~10,000 words — Nuanced, literary, and specialized vocabulary', color: 'bg-red-600' },
};

export default function JLPTVocabulary() {
  const [level, setLevel] = useState(5);
  const [search, setSearch] = useState('');
  const [starred, setStarred] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return VOCAB.filter(w => w.word.includes(q) || w.reading.includes(q) || w.meaning.toLowerCase().includes(q));
    }
    return VOCAB.filter(w => w.jlpt === level);
  }, [level, search]);

  const toggleStar = (word: string) => {
    setStarred(prev => {
      const next = new Set(prev);
      next.has(word) ? next.delete(word) : next.add(word);
      return next;
    });
  };

  const info = LEVEL_INFO[level];

  return (
    <div className="space-y-6">
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search all levels by word, reading, or meaning..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-lg" />

      {!search && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${level === l ? `${LEVEL_INFO[l].color} text-white` : 'bg-gray-100 hover:bg-gray-200'}`}>
                N{l} ({VOCAB.filter(v => v.jlpt === l).length})
              </button>
            ))}
          </div>
          <div className={`${info.color} text-white rounded-lg p-3`}>
            <div className="font-bold">{info.label}</div>
            <div className="text-sm opacity-90">{info.desc}</div>
          </div>
        </>
      )}

      <p className="text-sm text-gray-500">
        {search ? `Found ${filtered.length} across all levels` : `Showing ${filtered.length} words`}
        {starred.size > 0 && <span className="ml-2">⭐ {starred.size} starred</span>}
      </p>

      <div className="space-y-2">
        {filtered.map((w, i) => (
          <div key={`${w.word}-${i}`} className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-red-200 transition-all">
            <button onClick={() => toggleStar(w.word)} className="text-lg flex-shrink-0">
              {starred.has(w.word) ? '⭐' : '☆'}
            </button>
            <div className="flex-1 cursor-pointer" onClick={() => speak(w.word)}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-bold">{w.word}</span>
                <span className="text-red-600 text-sm">{w.reading}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${LEVEL_INFO[w.jlpt].color} text-white`}>N{w.jlpt}</span>
              </div>
              <div className="text-sm text-gray-500">{w.meaning}</div>
            </div>
            <button onClick={() => speak(w.word)} className="text-red-400 flex-shrink-0">🔊</button>
          </div>
        ))}
      </div>

      {starred.size > 0 && (
        <details className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <summary className="font-medium text-yellow-800 cursor-pointer">⭐ My Starred Words ({starred.size})</summary>
          <div className="mt-2 space-y-1">
            {VOCAB.filter(w => starred.has(w.word)).map((w, i) => (
              <div key={i} onClick={() => speak(w.word)} className="flex items-center gap-2 p-2 bg-white rounded cursor-pointer text-sm">
                <span className="font-bold">{w.word}</span>
                <span className="text-red-600">{w.reading}</span>
                <span className="text-gray-400 ml-auto">{w.meaning}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No words found.</p>}
    </div>
  );
}
