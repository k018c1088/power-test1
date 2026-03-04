# 引継ぎ資料 - power-test1 社内ブログシステム

> **最終更新**: 2026-03-02 セッション2終了時
> **更新ルール**: セッション変更時・仕様変更時・構成変更時に必ず更新すること

---

## 1. プロジェクト概要

評価シートの成果目標達成のためのGitHub Pages社内ブログシステム。

| 目標 | 内容 | ウェイト | 達成条件 |
|------|------|---------|---------|
| 成果目標2 | 基本設計書・CI/CD設計書をブログ公開 | 0.2 | 設計書をブログ記事として公開 |
| 成果目標3 | ブログ構築 + 記事10件以上 | 0.3 | 10件以上公開済み |

## 2. 現在のステータス

### 完了済み
- [x] Blog Modern (テック系) 構築完了
- [x] Blog Magazine (マガジン風) 構築完了
- [x] 設計書2件作成 (docs/)
- [x] 記事12件 + ダウンロード素材2件作成
- [x] GitHub リポジトリ作成・デプロイ成功
- [x] GoatCounter 設定済み (アカウント: lacue)
- [x] Giscus コメント機能設定済み
- [x] GitHub Secrets 設定済み (ANTHROPIC_API_KEY, OPENAI_API_KEY)
- [x] ライトモードテキスト表示修正
- [x] カテゴリタブによるジャンルフィルタ実装
- [x] AI生成/手動投稿バッジ追加
- [x] 記事ドラフト化 (順次公開対応)

### 未完了・保留
- [x] **設計書コードブロック**: ダークモード視認性改善済み（セッション3冒頭で修正・デプロイ済み）
- [ ] **記事レビュー・公開**: 11記事が draft: true のまま。ユーザーのレビュー後に順次 `draft: false` に変更して公開
- [ ] **AI自動投稿テスト**: `scripts/generate-post.ts` の実稼働テスト未実施
- [x] **GoatCounter閲覧数取得**: クライアントサイドJS `/counter/TOTAL.json` で取得・表示済み（セッション3）
- [ ] **OG画像自動生成**: satori + resvg-js による自動生成未実装

## 3. リポジトリ情報

| 項目 | 値 |
|------|-----|
| GitHub | `k018c1088/power-test1` (public) |
| URL (Modern) | `https://k018c1088.github.io/power-test1/blog-modern/` |
| URL (Magazine) | `https://k018c1088.github.io/power-test1/blog-magazine/` |
| ブランチ | `main` |
| デプロイ | GitHub Pages (GitHub Actions経由) |
| GoatCounter | `https://lacue.goatcounter.com` |

## 4. ディレクトリ構成

```
power-test1/
├── docs/                        # 設計書・ドキュメント
│   ├── basic-design.md          # 基本設計書
│   ├── cicd-design.md           # CI/CD設計書
│   ├── chat-log-session1-2.md   # セッション1-2チャットログ
│   └── handover.md              # 本ファイル（引継ぎ資料）
├── blog-modern/                 # テック系モダンブログ (Astro)
│   ├── astro.config.mjs         # site: k018c1088.github.io, base: /power-test1/blog-modern
│   ├── src/
│   │   ├── content/
│   │   │   ├── blog/            # 記事12件 (1件公開, 11件ドラフト)
│   │   │   └── downloads/       # DL素材2件
│   │   ├── components/          # UIコンポーネント
│   │   ├── layouts/             # BaseLayout, BlogPost
│   │   ├── pages/               # 全ページ
│   │   ├── styles/global.css    # デザインシステム (@custom-variant dark 必須)
│   │   └── utils/               # posts.ts, date.ts
│   │   └── content.config.ts    # Content Collections スキーマ
│   └── package.json
├── blog-magazine/               # マガジン/ポートフォリオブログ (Astro)
│   └── (blog-modernと同構造、デザインが異なる)
├── scripts/                     # AI自動投稿スクリプト
│   ├── generate-post.ts
│   └── topics.json
├── .github/workflows/
│   ├── deploy.yml               # 統合デプロイ (両ブログ同時)
│   ├── ai-post-modern.yml       # AI自動投稿 (Modern)
│   └── ai-post-magazine.yml     # AI自動投稿 (Magazine)
└── .claude/skills/blog-post/    # /blog-post スキル
    └── SKILL.md
```

## 5. 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Astro | 5.x | SSG フレームワーク |
| Tailwind CSS | 4 | スタイリング (`@tailwindcss/vite` 経由) |
| MDX | - | 記事フォーマット |
| Pagefind | - | 静的サイト検索 |
| Giscus | - | GitHub Discussions コメント |
| GoatCounter | - | アクセス解析 |
| Shiki | - | シンタックスハイライト (dual theme) |

## 6. 重要な技術的注意点

### Tailwind CSS 4 のダークモード
**必須**: `global.css` に以下を記載しないと `.dark` クラスベースのダークモードが機能しない:
```css
@custom-variant dark (&:where(.dark, .dark *));
```
Tailwind CSS 4 はデフォルトで `prefers-color-scheme` メディアクエリを使用するため、この設定がないとライトモードで `dark:` ユーティリティが適用されてしまう。

### Content Collections
- `src/content.config.ts` (NOT `src/content/config.ts`) に定義
- glob loader を使用: `loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" })`
- `aiGenerated: z.boolean().default(false)` フィールドで AI/手動を区別

### ベースパス
全てのリンクは `/power-test1/blog-modern/` (または `/power-test1/blog-magazine/`) をプレフィックスとして持つ。ハードコードされたリンクが51箇所あるため、変更時は一括置換が必要。

### タグ名の制約
タグ名に `/` を含めるとAstroビルドが失敗する（パス区切りと誤認）。"CI/CD" → "CICD" のように変換済み。

### 両ブログの同期
blog-modern と blog-magazine は同じ Content Collections スキーマ・ユーティリティ関数を使用。片方を変更したら必ずもう片方も同様に変更すること。

## 7. 記事一覧と公開状態

| ファイル | タイトル | カテゴリ | AI生成 | draft |
|----------|--------|---------|--------|-------|
| hello-world.md | ブログシステム構築記 | 技術解説 | false | **false** (公開中) |
| basic-design-document.md | 基本設計書 | 設計書 | false | true |
| cicd-design-document.md | CI/CD設計書 | 設計書 | false | true |
| ai-auto-posting.md | AI自動投稿の仕組み | 技術解説 | false | true |
| ai-intro-for-beginners.md | 生成AIとは？ | AI入門 | true | true |
| github-beginner-guide.md | GitHubの使い方 | AI入門 | true | true |
| power-automate-intro.md | Power Automate | 技術解説 | false | true |
| git-cherry-merge-detection.md | Git Cherry | ツール紹介 | false | true |
| copilot-code-review.md | Copilotレビュー | ツール紹介 | false | true |
| programming-roadmap-2026.md | 学習ロードマップ | AI入門 | true | true |
| markdown-complete-guide.md | Markdown完全ガイド | 技術解説 | true | true |
| ai-learning-methods.md | AI学習方法 | AI入門 | true | true |

### 記事公開手順
1. 該当記事の `.md` ファイルを開く
2. frontmatter の `draft: false` に変更
3. 両ブログ (blog-modern, blog-magazine) の同じファイルを変更
4. コミット & プッシュ → GitHub Actions が自動デプロイ

## 8. 外部サービス設定

### GoatCounter
- アカウント: `lacue`
- ダッシュボード: `https://lacue.goatcounter.com`
- 設定箇所: `BaseLayout.astro` の `<script data-goatcounter="...">`
- パスワード/メール: ユーザー管理

### Giscus
- リポジトリ: `k018c1088/power-test1`
- repo-id: `R_kgDORb3TYw`
- カテゴリ: Announcements
- category-id: `DIC_kwDORb3TY84C3eYT`
- 設定箇所: `BlogPost.astro`

### GitHub Secrets
- `ANTHROPIC_API_KEY`: AI自動投稿用 (Claude API)
- `OPENAI_API_KEY`: AI自動投稿フォールバック用

## 9. よくある操作

### 記事を公開する
```bash
# blog-modern と blog-magazine の両方で draft: false に変更
# 例: basic-design-document.md を公開
sed -i 's/draft: true/draft: false/' blog-modern/src/content/blog/basic-design-document.md
sed -i 's/draft: true/draft: false/' blog-magazine/src/content/blog/basic-design-document.md
git add -A && git commit -m "docs: publish basic-design-document" && git push
```

### 新しい記事を追加する
Claude Code の `/blog-post` スキルを使用するか、手動で `.md` ファイルを作成。frontmatter テンプレート:
```yaml
---
title: "記事タイトル"
description: "説明文"
pubDate: 2026-03-15
tags: ["タグ1", "タグ2"]
category: "技術解説"
heroImage: ""
draft: false
aiGenerated: false
---
```

### ローカルで確認
```bash
cd blog-modern && npm run dev    # http://localhost:4321
cd blog-magazine && npm run dev  # http://localhost:4321
```

### ビルドテスト
```bash
cd blog-modern && npm run build  # dist/ に出力
cd blog-magazine && npm run build
```

## 10. 次のセッションでやるべきこと

1. **ユーザーの記事レビュー結果を反映**: レビュー完了した記事から順次 draft: false に変更
2. **設計書コードブロックのダークモード改善**: ユーザーから「見づらい」との報告あり
3. **記事10件公開の達成**: 成果目標3の評価5には10件以上の公開済み記事が必要
4. **必要に応じて追加記事作成**: 12件あるが、レビューで不合格になる記事がある場合
5. **AI自動投稿のテスト実行**: scripts/generate-post.ts の動作確認

---

## 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-03-02 | 初版作成（セッション2終了時） |
