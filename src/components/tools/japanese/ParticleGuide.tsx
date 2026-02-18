import { useState } from 'react';

const PARTICLES = [
  { particle: 'は', romaji: 'wa', name: 'Topic marker', desc: 'Marks the topic of the sentence.', examples: ['私は学生です。(わたしはがくせいです。) I am a student.', '東京は大きいです。(とうきょうはおおきいです。) Tokyo is big.'] },
  { particle: 'が', romaji: 'ga', name: 'Subject marker', desc: 'Marks the grammatical subject, often for new information or emphasis.', examples: ['猫がいます。(ねこがいます。) There is a cat.', '誰が来ましたか。(だれがきましたか。) Who came?'] },
  { particle: 'を', romaji: 'wo/o', name: 'Object marker', desc: 'Marks the direct object of a verb.', examples: ['水を飲みます。(みずをのみます。) I drink water.', '本を読みます。(ほんをよみます。) I read a book.'] },
  { particle: 'に', romaji: 'ni', name: 'Direction/time/location', desc: 'Indicates destination, time, or location of existence.', examples: ['学校に行きます。(がっこうにいきます。) I go to school.', '七時に起きます。(しちじにおきます。) I wake up at 7.'] },
  { particle: 'で', romaji: 'de', name: 'Location/means', desc: 'Marks where an action takes place or means of doing something.', examples: ['公園で遊びます。(こうえんであそびます。) I play in the park.', 'バスで行きます。(バスでいきます。) I go by bus.'] },
  { particle: 'の', romaji: 'no', name: 'Possessive/connector', desc: 'Shows possession or connects nouns.', examples: ['私の本 (わたしのほん) my book', '日本の食べ物 (にほんのたべもの) Japanese food'] },
  { particle: 'と', romaji: 'to', name: 'And/with/quotation', desc: 'Connects nouns, marks companionship, or quotes speech.', examples: ['犬と猫 (いぬとねこ) dogs and cats', '友達と行きます。(ともだちといきます。) I go with a friend.'] },
  { particle: 'も', romaji: 'mo', name: 'Also/too', desc: 'Replaces は, が, or を to mean "also."', examples: ['私も学生です。(わたしもがくせいです。) I am also a student.', 'これも美味しい。(これもおいしい。) This is delicious too.'] },
  { particle: 'から', romaji: 'kara', name: 'From/because', desc: 'Marks starting point in time/space, or gives a reason.', examples: ['九時から始まります。(くじからはじまります。) It starts from 9.', '暑いから窓を開けます。(あついからまどをあけます。) Because it\'s hot, I open the window.'] },
  { particle: 'まで', romaji: 'made', name: 'Until/to', desc: 'Marks an ending point in time or space.', examples: ['五時まで勉強します。(ごじまでべんきょうします。) I study until 5.', '駅まで歩きます。(えきまであるきます。) I walk to the station.'] },
  { particle: 'へ', romaji: 'e', name: 'Direction', desc: 'Indicates direction of movement (similar to に but emphasizes direction).', examples: ['日本へ行きます。(にほんへいきます。) I go to Japan.'] },
  { particle: 'か', romaji: 'ka', name: 'Question', desc: 'Turns a statement into a question.', examples: ['日本人ですか。(にほんじんですか。) Are you Japanese?', 'どこに行きますか。(どこにいきますか。) Where are you going?'] },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.7;
  window.speechSynthesis.speak(u);
}

export default function ParticleGuide() {
  const [selected, setSelected] = useState<number>(0);
  const p = PARTICLES[selected];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {PARTICLES.map((pt, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`px-3 py-2 rounded-lg text-sm font-bold ${i === selected ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {pt.particle} ({pt.romaji})
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl font-bold text-red-600">{p.particle}</span>
          <div>
            <div className="font-bold">{p.name}</div>
            <div className="text-sm text-gray-500">{p.romaji}</div>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{p.desc}</p>
        <h4 className="font-medium text-sm text-gray-500 mb-2">Examples:</h4>
        <div className="space-y-2">
          {p.examples.map((ex, i) => {
            const jpPart = ex.split('(')[0].trim();
            return (
              <div key={i} onClick={() => speak(jpPart)} className="p-3 bg-white rounded-lg border cursor-pointer hover:border-red-200">
                <div className="text-sm">{ex}</div>
                <span className="text-xs text-red-400">🔊 tap to listen</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
