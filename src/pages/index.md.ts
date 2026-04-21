import type { APIRoute } from 'astro';
import { siteConfig } from '../site.config';

export const GET: APIRoute = async () => {
  const origin = siteConfig.url;

  const lines: string[] = [];
  lines.push(`# ${siteConfig.name}`);
  lines.push('');
  lines.push(`> ${siteConfig.description}`);
  lines.push('');
  lines.push(`Source: ${origin}/`);
  lines.push('');
  lines.push('FreeToolkit is a free hub for learning Mandarin Chinese and Japanese. It provides structured guides, interactive study tools, and daily-practice content, all authored by Yang Lin, a bilingual language educator with 10+ years of teaching experience.');
  lines.push('');
  lines.push('## Main Sections');
  lines.push('');
  lines.push(`- **Chinese (Mandarin)** — ${origin}/chinese/ — Pinyin, tones, characters, HSK prep, vocabulary`);
  lines.push(`- **Japanese** — ${origin}/japanese/ — Hiragana, katakana, kanji, JLPT prep, particles`);
  lines.push(`- **About** — ${origin}/about/`);
  lines.push(`- **Contact** — ${origin}/contact/`);
  lines.push('');
  lines.push('## Flagship Guides');
  lines.push('');
  lines.push('Chinese:');
  lines.push(`- [How to Learn Chinese Tones](${origin}/chinese/chinese-tones-guide/)`);
  lines.push(`- [Complete Pinyin Guide](${origin}/chinese/pinyin-guide/)`);
  lines.push(`- [HSK Exam Preparation](${origin}/chinese/hsk-preparation/)`);
  lines.push(`- [Chinese Sentence Structure](${origin}/chinese/chinese-sentence-structure/)`);
  lines.push('');
  lines.push('Japanese:');
  lines.push(`- [How to Learn Hiragana](${origin}/japanese/hiragana-guide/)`);
  lines.push(`- [Master Katakana](${origin}/japanese/katakana-guide/)`);
  lines.push(`- [JLPT Preparation Guide](${origin}/japanese/jlpt-preparation-guide/)`);
  lines.push(`- [Japanese Particles Explained](${origin}/japanese/japanese-particles-explained/)`);
  lines.push('');
  lines.push('## Machine-Readable Indexes');
  lines.push('');
  lines.push(`- ${origin}/llms.txt — llms.txt site guide`);
  lines.push(`- ${origin}/llms-full.txt — Full blog content`);
  lines.push(`- ${origin}/sitemap-index.xml — Sitemap index`);

  return new Response(lines.join('\n') + '\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
