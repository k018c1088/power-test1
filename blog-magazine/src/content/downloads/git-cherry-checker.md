---
title: "Git Cherry マージ漏れ検知スクリプト"
description: "git cherryコマンドを活用して、ブランチ間のマージ漏れコミットを自動検知するスクリプト。Bash/PowerShell両対応。CI/CDパイプラインにも組み込み可能。"
type: "script"
fileName: "merge-check.sh / merge-check.ps1"
version: "1.1.0"
pubDate: 2026-03-03
tags: ["Git", "Bash", "PowerShell", "CI/CD", "自動化"]
fileSize: "4.2 KB"
---

## 概要

`git cherry` コマンドを活用して、developブランチからmainブランチへのマージ漏れコミットを自動検知するスクリプトです。Bash (Linux/Mac) と PowerShell (Windows) の両方に対応しています。

## 機能

- ブランチ間のマージ漏れコミットを検出
- 検出結果をレポート形式で出力
- GitHub Actions への組み込みに対応
- 除外パターンの指定が可能
- Strict モード（マージ漏れで exit 1）

## 使い方

```bash
# Bash（Linux / Mac / Git Bash）
./merge-check.sh main develop
./merge-check.sh main develop --exclude="WIP|fixup"
./merge-check.sh main develop --strict
```

```powershell
# PowerShell（Windows）
.\merge-check.ps1 -TargetBranch main -SourceBranch develop
.\merge-check.ps1 main develop -Exclude "WIP|fixup"
.\merge-check.ps1 main develop -Strict
```

## 関連記事

詳しい解説は [Git Cherryで見つけるマージ漏れ](/power-test1/blog-magazine/blog/git-cherry-merge-detection/) をご覧ください。
