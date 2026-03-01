---
title: "CI/CD設計書 - GitHub Actionsによる自動デプロイ & AI投稿"
description: "GitHub Actionsを活用したCI/CDパイプラインの設計書。自動ビルド・デプロイからAI記事自動生成まで、ワークフロー設計の全体像を解説します。"
pubDate: 2026-03-03
tags: ["設計書", "CICD", "GitHub Actions", "自動化"]
category: "設計書"
draft: false
aiGenerated: false
---

## はじめに

本記事は、ブログシステムのCI/CD設計書をブログ記事として公開するものです。GitHub Actionsを中心としたパイプライン設計、AI自動投稿ワークフロー、セキュリティ設計について解説します。

## パイプライン概要

### ワークフロー一覧

| ワークフロー | トリガー | 目的 |
|-------------|---------|------|
| `deploy-modern.yml` | push (blog-modern/**) | Blog Modernのビルド・デプロイ |
| `deploy-magazine.yml` | push (blog-magazine/**) | Blog Magazineのビルド・デプロイ |
| `ai-auto-post.yml` | schedule / workflow_dispatch | AI記事自動生成・投稿 |

### パイプラインフロー

```
コード変更 (push)
    │
    ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Checkout   │────▶│  Astro Build │────▶│  Upload     │
│  (actions/  │     │  (withastro/ │     │  Artifact   │
│   checkout) │     │   action)    │     │             │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
                                                ▼
                                         ┌─────────────┐
                                         │  Deploy to  │
                                         │  GitHub     │
                                         │  Pages      │
                                         └─────────────┘
```

## デプロイワークフロー詳細

### トリガー設定

```yaml
on:
  push:
    branches: [main]
    paths: ['blog-modern/**']
```

パスフィルターにより、該当ブログディレクトリの変更時のみワークフローが実行されます。

### ジョブ構成

**build ジョブ:**
1. `actions/checkout@v4` - リポジトリのチェックアウト
2. `withastro/action@v5` - Astroのビルド（パッケージインストール、ビルド、アーティファクトアップロードを一括実行）

**deploy ジョブ:**
1. `actions/deploy-pages@v4` - GitHub Pagesへのデプロイ

### 環境設定

```yaml
permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false
```

- **permissions**: OIDC トークンを使用した安全なデプロイ
- **concurrency**: デプロイの競合を防止（進行中のデプロイはキャンセルしない）

## AI自動投稿ワークフロー

### スケジュール設定

```yaml
on:
  schedule:
    - cron: '0 9 1,15 * *'  # 毎月1日・15日 18:00 JST
  workflow_dispatch:
    inputs:
      blog:
        type: choice
        options: [modern, magazine]
      topic:
        type: string
        required: false
      provider:
        type: choice
        options: [claude, openai]
```

### 生成プロセスフロー

```
┌───────────────┐
│ トリガー発火   │
│ (cron/手動)   │
└───────┬───────┘
        ▼
┌───────────────┐     ┌──────────────┐
│ トピック選択   │────▶│ AI API呼び出し│
│ (auto/指定)   │     │ (Claude/GPT) │
└───────────────┘     └──────┬───────┘
                             ▼
                      ┌──────────────┐
                      │ Markdown生成 │
                      │ (frontmatter │
                      │  + 本文)     │
                      └──────┬───────┘
                             ▼
                      ┌──────────────┐     ┌─────────────┐
                      │ ファイル保存  │────▶│ git commit  │
                      │ (content/    │     │ & push      │
                      │  blog/)      │     └──────┬──────┘
                      └──────────────┘            │
                                                  ▼
                                           ┌─────────────┐
                                           │ デプロイ     │
                                           │ ワークフロー │
                                           │ 自動発火     │
                                           └─────────────┘
```

### トピック管理

`scripts/topics.json` でトピックのキューを管理：

```json
{
  "topics": [
    {
      "title": "トピック名",
      "slug": "topic-slug",
      "category": "AI入門",
      "tags": ["AI", "入門"],
      "targetAudience": "新卒IT未経験者",
      "used": false
    }
  ]
}
```

`--auto` フラグ指定時、`used: false` のトピックを先頭から順に選択し、生成後に `used: true` に更新します。

### フォールバック戦略

1. **Claude API** を最初に試行
2. 失敗時は **OpenAI API** にフォールバック
3. 両方失敗時はワークフローをエラー終了

## Claude Code連携

### /blog-post スキル

Claude Codeから手動で記事を投稿するためのスキルを用意：

```
ユーザー: 「今日の作業まとめてブログに上げといて」
    │
    ▼
Claude Code: /blog-post スキル実行
    │
    ├── 1. ユーザー指示を解析
    ├── 2. カテゴリ・タグを自動判定
    ├── 3. Markdown記事を生成
    ├── 4. src/content/blog/ に保存
    └── 5. git add → commit → push
            │
            ▼
    GitHub Actions: 自動デプロイ発火
```

### 手動投稿 vs 自動投稿

| 項目 | 手動（Claude Code） | 自動（GitHub Actions） |
|------|-------------------|---------------------|
| トリガー | ユーザーの指示 | cron スケジュール |
| トピック | ユーザー指定 | topics.json から自動選択 |
| 対象読者 | 状況による | 新卒IT未経験者（固定） |
| 投稿頻度 | 随時 | 月2回 |

## ブランチ戦略

個人ブログのため、**main直接運用**を採用：

```
main ─────●────●────●────●────●────▶
           │    │    │    │    │
          手動  AI   手動  AI   CI
          投稿  自動  投稿  自動  修正
```

- 大きな変更時のみ `feature/xxx` ブランチを作成
- mainへのpushで自動デプロイが発火

## シークレット管理

| シークレット名 | 用途 | 必須 |
|---------------|------|------|
| `ANTHROPIC_API_KEY` | Claude API呼び出し | ○ |
| `OPENAI_API_KEY` | OpenAI API（フォールバック） | △ |

- GitHub Secretsで管理（リポジトリ設定 → Secrets and variables → Actions）
- ワークフロー内で `${{ secrets.XXX }}` として参照
- コードやログに露出しない設計

## 監視・通知

### GitHub標準通知

- ワークフロー失敗時にメール通知（GitHub設定に準拠）
- Actions タブでワークフロー実行履歴を確認可能

### 監視対象

| 項目 | 確認方法 |
|------|---------|
| ビルド成功率 | Actions → ワークフロー実行履歴 |
| デプロイ状態 | GitHub Pages設定画面 |
| AI投稿成功率 | ai-auto-post ワークフローログ |
| API使用量 | Anthropic/OpenAIダッシュボード |

## 障害対応

### ビルド失敗時

1. Actionsログでエラー内容を確認
2. ローカルで `npm run build` を実行し再現確認
3. コード修正 → push → 自動リビルド

### AI API失敗時

1. API キーの有効性を確認
2. API の利用制限を確認
3. フォールバックプロバイダーの状態を確認
4. 必要に応じて手動で `workflow_dispatch` から再実行

## まとめ

本CI/CD設計は、GitHub Actionsの機能を最大限活用し、「push → 自動ビルド → 自動デプロイ」と「スケジュール → AI記事生成 → 自動投稿 → 自動デプロイ」の2つのパイプラインを実現します。運用コストゼロで、完全自動化されたブログ運用基盤を提供します。
