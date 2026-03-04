---
name: design-review
description: "UI/UX design review using Playwright. Auto-triggers on design review, UI audit, accessibility check, or UX analysis requests."
---
UI/UX デザインレビューを実行する。対象: $ARGUMENTS (URL またはローカルサーバー)

## 手順

### 1. ページ取得
- Playwright MCP で対象URLに `browser_navigate`
- `browser_take_screenshot` (fullPage) で全体キャプチャ
- `browser_snapshot` でアクセシビリティツリー取得

### 2. DOM 自動解析
`browser_evaluate` で以下を一括取得:

```javascript
async (page) => {
  return await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    const fonts = new Set(), colors = new Set(), sizes = new Set();
    let smallTargets = 0, missingAlt = 0, emptyLinks = 0, emptyButtons = 0;

    all.forEach(el => {
      if (el.offsetWidth === 0 && el.offsetHeight === 0) return;
      const s = getComputedStyle(el);
      fonts.add(s.fontFamily);
      if (s.color !== 'rgba(0, 0, 0, 0)') colors.add(s.color);
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') colors.add(s.backgroundColor);
      sizes.add(s.fontSize);
    });

    document.querySelectorAll('img:not([alt])').forEach(() => missingAlt++);
    document.querySelectorAll('a').forEach(a => {
      if (!a.href || !a.textContent.trim()) emptyLinks++;
    });
    document.querySelectorAll('button, [role="button"], a[role="button"]').forEach(b => {
      if (!b.textContent.trim() && !b.getAttribute('aria-label')) emptyButtons++;
      const r = b.getBoundingClientRect();
      if (r.width < 44 || r.height < 44) smallTargets++;
    });

    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .map(h => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 50) }));

    return {
      fonts: [...fonts], fontCount: fonts.size,
      colors: [...colors].slice(0, 30), colorCount: colors.size,
      fontSizes: [...sizes], fontSizeCount: sizes.size,
      missingAlt, emptyLinks, emptyButtons, smallTargets,
      headings,
      hasViewport: !!document.querySelector('meta[name="viewport"]'),
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      formInputsWithoutLabel: document.querySelectorAll('input:not([aria-label]):not([id])').length,
      horizontalOverflow: document.body.scrollWidth > window.innerWidth
    };
  });
}
```

### 3. レスポンシブチェック (3幅)
`browser_resize` で 375px → 768px → 1280px の順にリサイズし、各幅でスクリーンショット取得

### 4. 分析観点 (Nielsen 10 ヒューリスティック準拠)
- **アクセシビリティ**: alt欠落, コントラスト比, タッチターゲット44px+, フォーム label, 見出し階層
- **ビジュアル一貫性**: フォント種類(3以下), フォントサイズ(5-7以下), カラーパレット統一性
- **レスポンシブ**: viewport meta, 水平スクロール, 各ブレークポイントでの崩れ
- **ユーザビリティ**: 空リンク/ボタン, ナビゲーション構造, エラー防止(required/pattern)
- **パフォーマンス**: 画像 loading="lazy", 巨大画像, レンダリングブロック

### 5. 出力フォーマット

```markdown
# UI/UX デザインレビュー
## 対象: [URL]
## 総合スコア: XX/100

### 🔴 Critical (即修正)
[ID] 問題 — 要素: `selector` — 修正コード

### 🟡 Warning (改善推奨)
[ID] 問題 — 要素: `selector` — 推奨対応

### 🔵 Info (参考)
[ID] 提案内容

### スコア内訳
| カテゴリ | スコア | 指摘数 |
```

日本語で報告。各指摘に具体的な修正コードを含めること。
