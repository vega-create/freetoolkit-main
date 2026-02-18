import { useState } from 'react';

const PARTICLES = [
  { particle: 'は', romaji: 'wa', name: 'Topic marker', desc: 'Marks the topic of the sentence — what the sentence is about.',
    examples: [
      { jp: '私は学生です。', reading: 'わたしはがくせいです。', en: 'I am a student.' },
      { jp: '東京は大きいです。', reading: 'とうきょうはおおきいです。', en: 'Tokyo is big.' },
    ]},
  { particle: 'が', romaji: 'ga', name: 'Subject marker', desc: 'Marks the grammatical subject, often for new information or emphasis.',
    examples: [
      { jp: '猫がいます。', reading: 'ねこがいます。', en: 'There is a cat.' },
      { jp: '誰が来ましたか。', reading: 'だれがきましたか。', en: 'Who came?' },
    ]},
  { particle: 'を', romaji: 'wo/o', name: 'Object marker', desc: 'Marks the direct object of a verb.',
    examples: [
      { jp: '水を飲みます。', reading: 'みずをのみます。', en: 'I drink water.' },
      { jp: '本を読みます。', reading: 'ほんをよみます。', en: 'I read a book.' },
    ]},
  { particle: 'に', romaji: 'ni', name: 'Direction / time / location', desc: 'Indicates destination, time, or location of existence.',
    examples: [
      { jp: '学校に行きます。', reading: 'がっこうにいきます。', en: 'I go to school.' },
      { jp: '七時に起きます。', reading: 'しちじにおきます。', en: 'I wake up at 7.' },
    ]},
  { particle: 'で', romaji: 'de', name: 'Location of action / means', desc: 'Marks where an action takes place or the means of doing something.',
    examples: [
      { jp: '公園で遊びます。', reading: 'こうえんであそびます。', en: 'I play in the park.' },
      { jp: 'バスで行きます。', reading: 'バスでいきます。', en: 'I go by bus.' },
    ]},
  { particle: 'の', romaji: 'no', name: 'Possessive / connector', desc: 'Shows possession or connects nouns.',
    examples: [
      { jp: '私の本', reading: 'わたしのほん', en: 'my book' },
      { jp: '日本の食べ物', reading: 'にほんのたべもの', en: 'Japanese food' },
    ]},
  { particle: 'と', romaji: 'to', name: 'And / with / quotation', desc: 'Connects nouns, marks companionship, or quotes speech.',
    examples: [
      { jp: '犬と猫', reading: 'いぬとねこ', en: 'dogs and cats' },
      { jp: '友達と行きます。', reading: 'ともだちといきます。', en: 'I go with a friend.' },
    ]},
  { particle: 'も', romaji: 'mo', name: 'Also / too', desc: 'Replaces は, が, or を to mean "also."',
    examples: [
      { jp: '私も学生です。', reading: 'わたしもがくせいです。', en: 'I am also a student.' },
      { jp: 'これも美味しい。', reading: 'これもおいしい。', en: 'This is delicious too.' },
    ]},
  { particle: 'から', romaji: 'kara', name: 'From / because', desc: 'Marks starting point in time/space, or gives a reason.',
    examples: [
      { jp: '九時から始まります。', reading: 'くじからはじまります。', en: 'It starts from 9.' },
      { jp: '暑いから窓を開けます。', reading: 'あついからまどをあけます。', en: "It's hot, so I open the window." },
    ]},
  { particle: 'まで', romaji: 'made', name: 'Until / to', desc: 'Marks an ending point in time or space.',
    examples: [
      { jp: '五時まで勉強します。', reading: 'ごじまでべんきょうします。', en: 'I study until 5.' },
      { jp: '駅まで歩きます。', reading: 'えきまであるきます。', en: 'I walk to the station.' },
    ]},
  { particle: 'へ', romaji: 'e', name: 'Direction', desc: 'Indicates direction of movement (similar to に but emphasizes direction).',
    examples: [
      { jp: '日本へ行きます。', reading: 'にほんへいきます。', en: 'I go to Japan.' },
      { jp: '南へ向かいます。', reading: 'みなみへむかいます。', en: 'I head south.' },
    ]},
  { particle: 'か', romaji: 'ka', name: 'Question', desc: 'Turns a statement into a question.',
    examples: [
      { jp: '日本人ですか。', reading: 'にほんじんですか。', en: 'Are you Japanese?' },
      { jp: 'どこに行きますか。', reading: 'どこにいきますか。', en: 'Where are you going?' },
    ]},
];

// Quiz questions — fill in the blank
const QUIZ_DATA = [
  { sentence: '私___学生です。', answer: 'は', options: ['は','が','を','に'], hint: 'Topic marker: "I [topic] am a student."' },
  { sentence: '水___飲みます。', answer: 'を', options: ['は','を','に','で'], hint: 'Object marker: "I drink [object]."' },
  { sentence: '学校___行きます。', answer: 'に', options: ['で','を','に','は'], hint: 'Destination: "I go [to] school."' },
  { sentence: '公園___遊びます。', answer: 'で', options: ['に','で','を','は'], hint: 'Location of action: "I play [at] the park."' },
  { sentence: '猫___います。', answer: 'が', options: ['は','が','を','の'], hint: 'Subject of existence: "[subject] exists."' },
  { sentence: '私___本', answer: 'の', options: ['は','が','の','に'], hint: 'Possession: "my book."' },
  { sentence: '友達___行きます。', answer: 'と', options: ['に','で','と','を'], hint: 'Companionship: "I go [with] a friend."' },
  { sentence: '私___学生です。', answer: 'も', options: ['は','も','が','を'], hint: '"I [also] am a student."' },
  { sentence: '九時___始まります。', answer: 'から', options: ['まで','から','に','で'], hint: 'Starting point: "It starts [from] 9."' },
  { sentence: '五時___勉強します。', answer: 'まで', options: ['から','まで','に','で'], hint: 'Ending point: "I study [until] 5."' },
  { sentence: '日本___行きます。', answer: 'へ', options: ['に','へ','で','を'], hint: 'Direction: "I go [toward] Japan."' },
  { sentence: '日本人です___。', answer: 'か', options: ['か','は','が','の'], hint: 'Question marker at sentence end.' },
  { sentence: 'バス___行きます。', answer: 'で', options: ['に','で','を','へ'], hint: 'Means: "I go [by] bus."' },
  { sentence: 'これ___美味しい。', answer: 'も', options: ['は','が','も','の'], hint: '"This [also/too] is delicious."' },
  { sentence: '本___読みます。', answer: 'を', options: ['は','を','が','に'], hint: 'Object marker: "I read [object]."' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.7;
  window.speechSynthesis.speak(u);
}

export default function ParticleGuide() {
  const [mode, setMode] = useState<'guide' | 'quiz'>('guide');
  const [selected, setSelected] = useState(0);

  // Quiz state
  const [questions] = useState(() => shuffle(QUIZ_DATA).slice(0, 10));
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  const p = PARTICLES[selected];
  const q = questions[qIdx];

  const handleAnswer = (opt: string) => {
    if (answer) return;
    setAnswer(opt);
    if (opt === q.answer) setScore(s => s + 1);
  };

  const nextQ = () => {
    if (qIdx >= questions.length - 1) { setQuizDone(true); return; }
    setQIdx(i => i + 1); setAnswer(null); setShowHint(false);
  };

  const restartQuiz = () => {
    setQIdx(0); setAnswer(null); setScore(0); setQuizDone(false); setShowHint(false);
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button onClick={() => setMode('guide')}
          className={`flex-1 py-3 rounded-lg font-bold ${mode === 'guide' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
          📖 Reference Guide
        </button>
        <button onClick={() => { setMode('quiz'); restartQuiz(); }}
          className={`flex-1 py-3 rounded-lg font-bold ${mode === 'quiz' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
          🎯 Practice Quiz
        </button>
      </div>

      {/* ===== GUIDE MODE ===== */}
      {mode === 'guide' && (
        <>
          <div className="flex flex-wrap gap-2">
            {PARTICLES.map((pt, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${i === selected ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {pt.particle} ({pt.romaji})
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl font-bold text-red-600">{p.particle}</span>
              <div>
                <div className="font-bold text-lg">{p.name}</div>
                <div className="text-sm text-gray-500">{p.romaji}</div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{p.desc}</p>

            <h4 className="font-medium text-sm text-gray-500 mb-2">Examples:</h4>
            <div className="space-y-2">
              {p.examples.map((ex, i) => (
                <div key={i} onClick={() => speak(ex.jp)} className="p-3 bg-white rounded-lg border cursor-pointer hover:border-red-200">
                  <div className="font-bold">{ex.jp}</div>
                  <div className="text-sm text-gray-400">{ex.reading}</div>
                  <div className="text-sm text-gray-600">{ex.en}</div>
                  <span className="text-xs text-red-400">🔊 tap to listen</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===== QUIZ MODE ===== */}
      {mode === 'quiz' && !quizDone && (
        <>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Question {qIdx + 1}/{questions.length}</span>
            <span>Score: {score}/{qIdx + (answer ? 1 : 0)}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${((qIdx + (answer ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>

          <div className="text-center py-6">
            <p className="text-sm text-gray-500 mb-3">Fill in the blank with the correct particle:</p>
            <div className="text-3xl font-bold">
              {q.sentence.split('___').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className={`inline-block w-12 mx-1 border-b-4 text-center ${answer ? (answer === q.answer ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600') : 'border-red-300'}`}>
                      {answer || '___'}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {!answer && !showHint && (
            <button onClick={() => setShowHint(true)} className="text-sm text-gray-400 hover:text-red-500">💡 Show hint</button>
          )}
          {showHint && !answer && (
            <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700 border border-yellow-200">{q.hint}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {q.options.map(opt => {
              let cls = 'border-gray-200 bg-white hover:bg-gray-50';
              if (answer) {
                if (opt === q.answer) cls = 'border-green-500 bg-green-50';
                else if (opt === answer) cls = 'border-red-500 bg-red-50';
              }
              return (
                <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!answer}
                  className={`p-4 rounded-xl border-2 text-2xl font-bold transition-all ${cls}`}>
                  {opt}
                </button>
              );
            })}
          </div>

          {answer && (
            <div className={`p-4 rounded-lg text-center ${answer === q.answer ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="font-bold">{answer === q.answer ? '✅ Correct!' : `❌ The answer is: ${q.answer}`}</p>
              <p className="text-sm text-gray-500 mt-1">{q.hint}</p>
              <button onClick={nextQ} className="mt-3 px-6 py-2 bg-red-600 text-white rounded-lg">
                {qIdx >= questions.length - 1 ? 'See Results' : 'Next →'}
              </button>
            </div>
          )}
        </>
      )}

      {mode === 'quiz' && quizDone && (
        <div className="text-center py-8 space-y-4">
          <div className="text-6xl">{score >= 8 ? '🎉' : score >= 6 ? '👍' : '💪'}</div>
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          <div className="text-4xl font-bold text-red-600">{score}/{questions.length}</div>
          <p className="text-gray-500">{Math.round((score / questions.length) * 100)}% correct</p>
          <div className="flex gap-3 justify-center">
            <button onClick={restartQuiz} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">Try Again</button>
            <button onClick={() => setMode('guide')} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">Review Guide</button>
          </div>
        </div>
      )}
    </div>
  );
}
