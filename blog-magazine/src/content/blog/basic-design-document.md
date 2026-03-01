---
title: "基本設計書 - 社内ブログシステム"
description: "Astro + GitHub Pagesで構築した社内マイブログシステムの基本設計書。システム構成、技術スタック選定理由、機能仕様、データ設計、セキュリティ設計を網羅します。"
pubDate: 2026-03-02
tags: ["設計書", "Astro", "GitHub Pages", "アーキテクチャ"]
category: "設計書"
draft: true
aiGenerated: false
---

## はじめに

本記事は、社内マイブログシステムの基本設計書をブログ記事として公開するものです。完全な設計書は [docs/basic-design.md](https://github.com/) で管理しています。

## システム概要

### 目的

社内エンジニアが技術知識を蓄積・共有するための個人ブログプラットフォームを構築します。GitHub Pages上に静的サイトとしてデプロイし、AI駆動の記事自動生成・投稿機能を備えます。

### スコープ

| # | 機能 | 説明 |
|---|------|------|
| 1 | Blog Modern | テック系モダンデザインのブログサイト |
| 2 | Blog Magazine | マガジン/ポートフォリオ風デザインのブログサイト |
| 3 | AI自動投稿 | Claude API / OpenAI APIによる記事自動生成 |
| 4 | CI/CD | GitHub Actionsによる自動ビルド・デプロイ |
| 5 | 配布物管理 | スクリプト・ツール・テンプレートのダウンロード機能 |

## システム構成

### アーキテクチャ概要

```
┌─────────────────────────────────────────────┐
│               ユーザー環境                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ ブラウザ  │  │Claude Code│  │ GitHub UI │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
└───────┼──────────────┼──────────────┼────────┘
        │              │              │
┌───────┼──────────────┼──────────────┼────────┐
│       ▼     GitHub Platform         ▼        │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  GitHub   │  │  GitHub   │  │ GitHub    │  │
│  │  Pages    │  │  Actions  │  │ Repo      │  │
│  └──────────┘  └──────────┘  └───────────┘  │
└──────────────────────────────────────────────┘
        │              │
┌───────┼──────────────┼───────────────────────┐
│       ▼     外部サービス                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │GoatCounter│  │  Giscus  │  │ Claude/   │  │
│  │(閲覧数)   │  │(コメント) │  │ OpenAI API│  │
│  └──────────┘  └──────────┘  └───────────┘  │
└──────────────────────────────────────────────┘
```

### 技術スタック

| カテゴリ | 技術 | バージョン | 選定理由 |
|----------|------|-----------|---------|
| SSG | Astro | 5.x | ゼロJS出力、Content Collections、View Transitions |
| スタイル | Tailwind CSS | 4.x | `@theme`ブロック、Viteプラグイン統合 |
| コンテンツ | MDX | - | コンポーネント埋め込み、Content Collections統合 |
| 検索 | Pagefind | 1.x | ビルド時インデックス、依存ゼロ、静的サイト最適 |
| コメント | Giscus | - | GitHub Discussions連携、無料 |
| 分析 | GoatCounter | - | プライバシー重視、API経由データ取得 |
| ハイライト | Shiki | 内蔵 | デュアルテーマ対応 |
| デプロイ | GitHub Pages | - | 無料、GitHub Actions連携 |

## 機能仕様

### 記事管理

Content Collectionsにより型安全なフロントマター管理を実現：

```typescript
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('general'),
    draft: z.boolean().default(false),
    aiGenerated: z.boolean().default(false),
  }),
});
```

### 検索機能

Pagefindによるビルド時インデックス生成で、フロントエンドのみで全文検索を実現します。Ctrl+K ショートカットにも対応。

### ダークモード

CSS `prefers-color-scheme` とlocalStorageの組み合わせで、ユーザー選択を永続化。View Transitions時にも状態を維持します。

### AI自動投稿

- **スケジュール投稿**: GitHub Actions cron（毎月1日・15日）
- **手動投稿**: Claude Codeの `/blog-post` スキルで即時生成
- **プロバイダー**: Claude API（主）/ OpenAI API（フォールバック）

## データ設計

### ディレクトリ構成

```
blog-modern/
├── src/
│   ├── content/
│   │   ├── blog/          # ブログ記事 (*.md, *.mdx)
│   │   └── downloads/     # 配布物定義 (*.md)
│   ├── components/        # UIコンポーネント
│   ├── layouts/           # ページレイアウト
│   ├── pages/             # ルーティング
│   ├── styles/            # グローバルCSS
│   └── utils/             # ユーティリティ関数
├── public/                # 静的アセット
└── astro.config.mjs       # Astro設定
```

## セキュリティ設計

### 静的サイトの構造的メリット

- サーバーサイドコードが存在しないため、SQLi / RCE / セッションハイジャックの脅威を構造的に排除
- APIキーはGitHub Secretsで管理、クライアントに露出しない
- GitHub Actionsの権限は `contents: write` のみの最小権限設計

### クライアントサイドセキュリティ

- 外部スクリプト（GoatCounter, Giscus）は信頼されたドメインからのみ読み込み
- Pagefindはビルド時生成のためXSSリスクなし

## 非機能要件

| 項目 | 目標値 |
|------|--------|
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 95+ |
| Lighthouse SEO | 100 |
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| 可用性 | 99.9%（GitHub Pages SLA準拠） |

## まとめ

本設計は「静的サイト + AI駆動運用 + 無料サービス組み合わせ」により、運用コストゼロで高品質なブログプラットフォームを実現します。詳細は完全版の設計書を参照してください。
