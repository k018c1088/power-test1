---
title: "【新卒向け】GitHubの使い方 - 初めてのバージョン管理"
description: "Git/GitHubを初めて触る新卒エンジニア向けに、基本的な使い方をステップバイステップで解説します。"
pubDate: 2026-03-06
tags: ["GitHub", "Git", "入門"]
category: "AI入門"
draft: true
aiGenerated: true
---

## はじめに

エンジニアとして仕事をする上で、Gitとバージョン管理は避けて通れないスキルです。この記事では、Git/GitHubを初めて触る方向けに、基本的な使い方をわかりやすく解説します。

## Gitとは

Gitは「バージョン管理システム」です。ファイルの変更履歴を記録し、いつでも過去の状態に戻すことができます。

### なぜバージョン管理が必要？

- コードの変更履歴を追跡できる
- 間違えても元に戻せる
- チームで同じコードを安全に編集できる

## GitHubとは

GitHubはGitのリポジトリ（プロジェクト）をインターネット上でホスティングするサービスです。チーム開発のプラットフォームとして世界中で使われています。

## 基本操作

### 1. リポジトリのクローン

```bash
git clone https://github.com/username/repo.git
cd repo
```

### 2. ブランチの作成

```bash
git checkout -b feature/my-feature
```

### 3. ファイルの編集とコミット

```bash
# ファイルを編集した後
git add .
git commit -m "feat: add new feature"
```

### 4. プッシュ

```bash
git push origin feature/my-feature
```

### 5. Pull Requestの作成

GitHub上でPull Requestを作成し、レビューを依頼します。

## コミットメッセージの書き方

良いコミットメッセージはチーム開発で重要です：

```
feat: 新機能を追加
fix: バグを修正
docs: ドキュメントを更新
refactor: コードをリファクタリング
```

## よくあるトラブルと対処法

### コンフリクト（競合）が発生した

複数人が同じファイルを編集した場合に起こります。
該当箇所を手動で編集して解決します。

### 間違えてコミットした

```bash
# 直前のコミットを取り消し（変更内容は保持）
git reset --soft HEAD~1
```

## まとめ

Git/GitHubは最初は難しく感じるかもしれませんが、基本的な操作は`clone → branch → edit → commit → push → PR`の流れです。実際にプロジェクトで使いながら慣れていきましょう。
