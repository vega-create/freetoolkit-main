import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../site.config';

const FULL_CONTENT_CAP = 50;

export const GET: APIRoute = async () => {
  const origin = siteConfig.url;

  let posts: any[] = [];
  try {
    posts = await getCollection('chinese-blog' as any, ({ data }: any) => !data.draft);
    posts = posts.sort((a: any, b: any) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime());
  } catch {}

  const header: string[] = [
    `# ${siteConfig.name} — Full Content`,
    '',
    '> Aggregated guide content for AI agents. The main FreeToolkit hub is largely structured pages (flagship guides + interactive tools); additional long-form content lives in the chinese-blog collection. Individual guides are at /chinese/<slug>/ and /japanese/<slug>/ (see llms.txt).',
    '',
    `Source: ${origin}/`,
    `Generated: ${new Date().toISOString()}`,
    `Chinese-blog posts: ${posts.length}`,
    '',
  ];

  const sections: string[] = [];
  const fullPosts = posts.slice(0, FULL_CONTENT_CAP);
  const digestPosts = posts.slice(FULL_CONTENT_CAP);

  for (const post of fullPosts) {
    const meta: string[] = [`Source: ${origin}/chinese/blog/${post.slug}/`];
    if (post.data.publishDate) meta.push(`Published: ${new Date(post.data.publishDate).toISOString().slice(0, 10)}`);
    if (post.data.category) meta.push(`Category: ${post.data.category}`);
    if (post.data.tags?.length) meta.push(`Tags: ${post.data.tags.join(', ')}`);

    sections.push('---', '', `# ${post.data.title}`, '', ...meta, '', post.body || '_(no content)_', '');
  }

  if (digestPosts.length > 0) {
    sections.push('---', '', `# Additional Posts (title-only, ${digestPosts.length})`, '');
    for (const post of digestPosts) {
      const cat = post.data.category ? ` [${post.data.category}]` : '';
      const date = post.data.publishDate ? ` — ${new Date(post.data.publishDate).toISOString().slice(0, 10)}` : '';
      sections.push(`- [${post.data.title}](${origin}/chinese/blog/${post.slug}/)${cat}${date}`);
    }
    sections.push('');
  }

  return new Response([...header, ...sections].join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
