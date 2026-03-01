---
title: "Git Cherry マージ漏れ検知スクリプト"
description: "git cherryコマンドを活用して、ブランチ間のマージ漏れコミットを自動検知するBashスクリプト。CI/CDパイプラインにも組み込み可能。"
type: "script"
fileName: "git-cherry-checker.sh"
version: "1.0.0"
pubDate: 2026-03-03
tags: ["Git", "Bash", "CI/CD", "自動化"]
fileSize: "2.4 KB"
---

## 概要

`git cherry` コマンドを活用して、developブランチからmainブランチへのマージ漏れコミットを自動検知するスクリプトです。

## 機能

- ブランチ間のマージ漏れコミットを検出
- 検出結果をレポート形式で出力
- GitHub Actions への組み込みに対応
- 除外パターンの指定が可能

## 使い方

```bash
# 基本的な使い方
./git-cherry-checker.sh main develop

# 除外パターン指定
./git-cherry-checker.sh main develop --exclude="WIP|fixup"

# CI/CDモード（マージ漏れがあると exit 1）
./git-cherry-checker.sh main develop --strict
```

## 関連記事

詳しい解説は [Git Cherryで見つけるマージ漏れ](/blog-modern/blog/git-cherry-merge-detection/) をご覧ください。
