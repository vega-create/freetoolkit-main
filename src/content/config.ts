import { defineCollection, z } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  relatedTools: z.array(z.string()).default([]),
  faq: z.array(z.object({
    q: z.string(),
    a: z.string(),
  })).default([]),
  externalLinks: z.array(z.object({
    text: z.string(),
    url: z.string(),
  })).default([]),
  author: z.string().default('FreeToolkit'),
  draft: z.boolean().default(false),
});

const chineseBlog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const japaneseBlog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

export const collections = {
  'chinese-blog': chineseBlog,
  'japanese-blog': japaneseBlog,
};
