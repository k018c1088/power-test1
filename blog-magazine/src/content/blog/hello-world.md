---
title: "ブログシステム構築記 - Astro + GitHub Pagesで作るモダンブログ"
description: "Astro 5 + Tailwind CSS 4 + GitHub Pagesを使って、高速でモダンなテックブログを構築した記録。技術選定から実装まで。"
pubDate: 2026-03-01
tags: ["Astro", "GitHub Pages", "Tailwind CSS", "ブログ構築"]
category: "技術解説"
draft: false
aiGenerated: false
---

## はじめに

社内での技術ナレッジ共有を目的として、マイブログシステムを構築しました。この記事では、技術選定から実装までの過程を記録します。

## 技術選定

### なぜAstroを選んだか

静的サイトジェネレーター（SSG）の選定にあたり、以下の要件を重視しました：

- **高速なパフォーマンス**: Lighthouse 100点を目指す
- **Markdown対応**: 記事はMarkdownで書きたい
- **GitHub Pages対応**: 無料ホスティング
- **モダンなDX**: TypeScript、HMR対応

Astroは「デフォルトでJavaScript 0」のアーキテクチャにより、最速のパフォーマンスを実現できます。

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.github.io',
  integrations: [mdx(), sitemap()],
});
```

### Tailwind CSS 4

Tailwind CSS 4ではViteプラグインとして統合され、`@theme`ブロックでデザイントークンを管理できます。

```css
@theme {
  --color-primary-500: oklch(0.55 0.25 260);
  --color-accent-500: oklch(0.7 0.18 180);
  --font-display: 'Inter', system-ui;
}
```

## Content Collections

Astro 5のContent Collectionsを使い、型安全なコンテンツ管理を実現しました。

```typescript
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
    category: z.string(),
  }),
});
```

## CI/CDパイプライン

GitHub Actionsで自動ビルド＆デプロイを構成。pushするだけで自動的にGitHub Pagesに反映されます。

## AI自動投稿

Claude APIを活用し、定期的に記事を自動生成・投稿する仕組みも導入しました。詳しくは別記事で解説します。

## まとめ

Astro + Tailwind CSS + GitHub Pagesの組み合わせは、無料かつ高性能なブログシステムを構築するのに最適です。
