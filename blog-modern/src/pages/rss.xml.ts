import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: 'TechBlog',
    description: 'AI・自動化・開発ツールに関する技術ナレッジを発信するブログ',
    site: context.site?.toString() ?? '',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/power-test1/blog-modern/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>ja</language>',
  });
}
