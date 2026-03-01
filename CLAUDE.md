# プロジェクト設定

## プロジェクト概要
<!-- 1-2文でプロジェクトの目的を書く。Claude が文脈を把握するのに使います。 -->
<!-- 例: ECサイトのフロントエンド。商品検索・カート・決済機能を提供する。 -->

## 技術スタック
<!-- 使っている技術を列挙。エージェントはここを最優先で参照します。 -->
<!-- ここに書いた内容がエージェントのデフォルト挙動を上書きします。 -->
<!-- 例: Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, Prisma -->

## コマンド
<!-- プロジェクトでよく使うコマンド。Claude が自動でテスト・ビルドする際に参照します。 -->
<!-- 例:
- dev: npm run dev
- test: npm run test
- lint: npm run lint
- build: npm run build
-->

## 規約
- コミット: Conventional Commits (feat:, fix:, refactor:, docs:)
- ブランチ: feature/xxx, fix/xxx
- PR前: lint + typecheck + test を必ず通す

## プロジェクト固有のルール
<!-- エージェントの挙動を上書きしたい場合はここに記載。 -->
<!-- 例: 「Ollama に委譲しない」「テストは Vitest のみ使用」 -->
