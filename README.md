# ヒットアンドブロー

8種類のシンボル（タイル）を使った推理ゲーム。コンピュータが選んだシンボルの並びを「ヒット」「ブロー」の判定を頼りに推理する。

## セットアップ

```bash
# Node.js v24（.nvmrc 参照）
nvm use

# 依存インストール
pnpm install

# 開発サーバー起動
pnpm dev
```

## コマンド

| コマンド          | 説明                           |
| ----------------- | ------------------------------ |
| `pnpm dev`        | 開発サーバー起動               |
| `pnpm build`      | 本番ビルド（tsc + vite build） |
| `pnpm preview`    | ビルド済みプレビュー           |
| `pnpm lint`       | ESLint                         |
| `pnpm type-check` | 型チェック                     |

## 技術スタック

- React 19 / TypeScript / Vite 7
- Tailwind CSS v4 / Zod v4
- react-i18next（日本語・英語）
- pnpm 10 / Node.js v24
- GitHub Pages（ホスティング）
- Husky + lint-staged（コミット時の自動Lint/Format）

## ドキュメント

仕様書は `docs/` 配下を参照。

| ファイル             | 内容               |
| -------------------- | ------------------ |
| `01_requirements.md` | 要件定義           |
| `02_architecture.md` | アーキテクチャ設計 |
| `03_database.md`     | LocalStorage設計   |
| `04_api.md`          | 外部API連携        |
| `05_sitemap.md`      | サイトマップ       |
| `mock_design.html`   | ワイヤーフレーム   |
