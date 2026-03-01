# /blog-post - ブログ記事投稿スキル

## Description
ブログ記事を生成して投稿する。ユーザーの指示に基づいてMarkdown記事を作成し、
コンテンツディレクトリに保存してgit commit & pushする。

## User-invocable
true

## Trigger
ユーザーが以下のような指示をした場合:
- 「ブログ書いて」「ブログ上げて」「記事書いて」
- 「今日の作業まとめてブログに」
- 「このツール紹介しといて」
- `/blog-post`

## Instructions

### 1. ユーザーの指示を分析
ユーザーの指示から以下を判定:
- **トピック**: 何について書くか
- **カテゴリ**: 技術解説 / AI入門 / ツール紹介 / 設計書 / 日記 / その他
- **タグ**: 関連キーワード（3-5個）
- **対象ブログ**: blog-modern（デフォルト）or blog-magazine

### 2. 記事を生成
以下のフォーマットでMarkdownファイルを作成:

```markdown
---
title: "記事タイトル"
description: "記事の説明（100-150文字）"
pubDate: YYYY-MM-DD
tags: ["tag1", "tag2", "tag3"]
category: "カテゴリ名"
draft: false
aiGenerated: true
---

## はじめに
（導入文）

## 本文セクション
（内容）

## まとめ
（まとめ）
```

### 3. ファイルを保存
- パス: `blog-{modern|magazine}/src/content/blog/YYYYMMDD-slug.md`
- slugはタイトルから英語で生成（例: `20260301-astro-blog-setup`）

### 4. Git操作
```bash
git add blog-{target}/src/content/blog/YYYYMMDD-slug.md
git commit -m "feat: add blog post - {タイトル要約}"
git push
```

### 5. 完了報告
ユーザーに以下を報告:
- 作成したファイルパス
- 記事タイトル
- タグ
- GitHub Actionsで自動デプロイされる旨

## Notes
- `blog-modern/` と `blog-magazine/` は同じコンテンツ構造
- frontmatter の `aiGenerated: true` は必ず設定する
- 両方のブログに同じ記事を投稿する場合はユーザーに確認する
- 記事が日本語の場合、タグは日本語でもOK
