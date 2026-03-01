import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('general'),
    draft: z.boolean().default(false),
    aiGenerated: z.boolean().default(false),
  }),
});

const downloads = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/downloads' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['script', 'document', 'template', 'tool', 'game', 'site']),
    fileName: z.string(),
    version: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    fileSize: z.string().optional(),
  }),
});

export const collections = { blog, downloads };
