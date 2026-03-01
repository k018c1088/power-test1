---
title: "AI自動投稿の仕組み - Claude APIで記事を自動生成する方法"
description: "GitHub Actions + Claude APIを使ったブログ記事の自動生成・自動投稿システムの設計と実装を解説します。"
pubDate: 2026-03-01
tags: ["AI", "Claude API", "GitHub Actions", "自動化"]
category: "技術解説"
draft: true
aiGenerated: false
---

## はじめに

このブログでは、Claude APIとGitHub Actionsを組み合わせて、ブログ記事を定期的に自動生成・投稿する仕組みを導入しています。この記事では、そのシステムの設計と実装について解説します。

## システム構成

AI自動投稿システムは以下の3つのコンポーネントで構成されています：

1. **記事生成スクリプト** (`scripts/generate-post.ts`)
2. **GitHub Actions ワークフロー** (`.github/workflows/ai-auto-post.yml`)
3. **Claude Code スキル** (`/blog-post`)

## 記事生成スクリプト

TypeScriptで書かれた記事生成スクリプトは、Claude APIまたはOpenAI APIを呼び出してMarkdown記事を生成します。

```typescript
// トピックに基づいてプロンプトを構築
function buildPrompt(topic: string, category: string, audience: string): string {
  return `You are a technical blog writer. Write a blog post in Japanese about "${topic}".
  Target audience: ${audience}
  Category: ${category}`;
}
```

### トピック管理

`topics.json`でトピックキューを管理しています。自動投稿時は未使用のトピックから順番に選択されます。

```json
{
  "topics": [
    {
      "title": "【新卒向け】生成AIとは？",
      "category": "AI入門",
      "tags": ["AI", "入門"],
      "audience": "IT未経験の新卒エンジニア",
      "used": false
    }
  ]
}
```

## GitHub Actions ワークフロー

毎月1日と15日の18:00 JSTに自動実行されます。手動トリガーにも対応しており、トピックやAIプロバイダーを指定できます。

```yaml
on:
  schedule:
    - cron: '0 9 1,15 * *'  # 毎月1日・15日 18:00 JST
  workflow_dispatch:
    inputs:
      topic:
        description: 'Article topic'
        required: false
```

## Claude Code連携

Claude Codeの`/blog-post`スキルを使えば、対話的に記事を作成できます。

- 「今日の作業まとめてブログに上げて」
- 「このツール紹介しといて」

という指示だけで、記事の生成からcommit、pushまで自動で行われます。

## フォールバック戦略

Claude APIが利用できない場合はOpenAI APIにフォールバックします。これにより、API障害時でも記事生成が止まりません。

## まとめ

AI自動投稿システムにより、定期的なコンテンツ更新が自動化され、ブログの継続的な運用が可能になりました。手動投稿もClaude Codeを通じて簡単に行えるため、記事作成のハードルが大幅に下がっています。
