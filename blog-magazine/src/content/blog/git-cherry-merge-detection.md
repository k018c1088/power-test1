---
title: "Git Cherryで見つけるマージ漏れ - 検知スクリプト解説"
description: "git cherryコマンドを活用したマージ漏れ検知スクリプトの仕組みと実装方法を解説します。"
pubDate: 2026-03-03
tags: ["Git", "スクリプト", "CICD", "品質管理"]
category: "ツール紹介"
draft: true
aiGenerated: false
---

## はじめに

リリースブランチへのマージ漏れは、本番環境での障害に直結する重大な問題です。`git cherry`コマンドを活用すれば、マージ漏れを自動検知するスクリプトを構築できます。

## git cherryとは

`git cherry`は、2つのブランチ間でチェリーピックされていないコミットを見つけるコマンドです。

```bash
# develop にあって main にないコミットを検出
git cherry -v main develop
```

出力例：
```
+ abc1234 feat: add new feature
- def5678 fix: bug fix (already in main)
+ ghi9012 refactor: update logic
```

- `+` : まだマージされていないコミット（**マージ漏れ候補**）
- `-` : すでにマージ済みのコミット

## 検知スクリプトの設計

### 要件

1. developブランチのコミットがreleaseブランチに漏れなく含まれているか検証
2. 結果をわかりやすく出力
3. CI/CDパイプラインに組み込み可能（exit codeで判定）

### 実装

```bash
#!/bin/bash
# merge-check.sh - マージ漏れ検知スクリプト

SOURCE_BRANCH="${1:-develop}"
TARGET_BRANCH="${2:-release}"

echo "=== Merge Check ==="
echo "Source: $SOURCE_BRANCH"
echo "Target: $TARGET_BRANCH"
echo ""

# マージ漏れコミットを検出
MISSING=$(git cherry -v "$TARGET_BRANCH" "$SOURCE_BRANCH" | grep "^+")

if [ -z "$MISSING" ]; then
    echo "✓ No missing commits found."
    exit 0
else
    echo "✗ Missing commits detected:"
    echo "$MISSING"
    echo ""
    echo "Total: $(echo "$MISSING" | wc -l) commit(s)"
    exit 1
fi
```

### 使い方

```bash
# 基本実行
./merge-check.sh develop release

# CI/CDでの使用
./merge-check.sh develop release || echo "WARN: Merge leak detected!"
```

## CI/CDへの組み込み

GitHub Actionsでリリース前チェックとして実行できます：

```yaml
- name: Check for merge leaks
  run: |
    chmod +x ./scripts/merge-check.sh
    ./scripts/merge-check.sh develop main
```

## まとめ

`git cherry`はシンプルながら強力なコマンドです。マージ漏れ検知スクリプトをリリース前チェックに組み込むことで、ヒューマンエラーによるマージ漏れを未然に防ぐことができます。
