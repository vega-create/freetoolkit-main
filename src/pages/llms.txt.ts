import type { APIRoute } from 'astro';
import { siteConfig } from '../site.config';

export const GET: APIRoute = async () => {
  const origin = siteConfig.url;

  const lines: string[] = [];
  lines.push(`# ${siteConfig.name}`);
  lines.push('');
  lines.push(`> ${siteConfig.description}`);
  lines.push('');
  lines.push(`${siteConfig.name} (freetoolkit.cc) is a free-to-use hub for learners of Mandarin Chinese and Japanese. It combines interactive tools (flashcards, tone practice, stroke order, HSK/JLPT drills), structured guides, and daily-practice content. The site is authored by Yang Lin, a bilingual language educator.`);
  lines.push('');
  lines.push(`There are also 15 specialised sibling subdomains under the FreeToolkit network (ft-calc, ft-time, ft-image, ft-color, ft-text, ft-convert, ft-password, ft-qr, ft-pdf, ft-json, ft-seo, ft-social, ft-random, ft-healthtools, ft-financetools) — each hosts focused utilities for its topic.`);
  lines.push('');
  lines.push('## Main Language Sections');
  lines.push('');
  lines.push(`- [Chinese (Mandarin)](${origin}/chinese/): Tools, guides, and study resources for Chinese`);
  lines.push(`- [Japanese](${origin}/japanese/): Tools, guides, and study resources for Japanese`);
  lines.push('');
  lines.push('## Flagship Guides');
  lines.push('');
  lines.push(`- [How to Learn Chinese Tones](${origin}/chinese/chinese-tones-guide/)`);
  lines.push(`- [Complete Pinyin Guide](${origin}/chinese/pinyin-guide/)`);
  lines.push(`- [HSK Exam Preparation](${origin}/chinese/hsk-preparation/)`);
  lines.push(`- [How to Learn Hiragana](${origin}/japanese/hiragana-guide/)`);
  lines.push(`- [Master Katakana](${origin}/japanese/katakana-guide/)`);
  lines.push(`- [JLPT Preparation Guide](${origin}/japanese/jlpt-preparation-guide/)`);
  lines.push('');
  lines.push('## Key Pages');
  lines.push('');
  lines.push(`- [Home](${origin}/): Overview of all tools and sections`);
  lines.push(`- [About](${origin}/about/)`);
  lines.push(`- [About Yang Lin](${origin}/about/yang-lin/): Site author & language educator`);
  lines.push(`- [Contact](${origin}/contact/)`);
  lines.push(`- [Privacy](${origin}/privacy/)`);
  lines.push('');
  lines.push('## Optional');
  lines.push('');
  lines.push(`- [Sitemap](${origin}/sitemap-index.xml): Full page index`);
  lines.push(`- [Full Content](${origin}/llms-full.txt): Aggregated guide content`);

  return new Response(lines.join('\n') + '\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
