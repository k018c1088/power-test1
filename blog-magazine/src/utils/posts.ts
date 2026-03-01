import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getLatestPosts(count: number = 6): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getPublishedPosts();
  return posts.slice(0, count);
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getPublishedPosts();
  const tagMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return new Map([...tagMap.entries()].sort((a, b) => b[1] - a[1]));
}

export async function getPostsByTag(tag: string): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}

export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  count: number = 3
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getPublishedPosts();
  return posts
    .filter((post) => post.id !== currentSlug)
    .map((post) => ({
      post,
      score: post.data.tags.filter((tag) => tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ post }) => post);
}
