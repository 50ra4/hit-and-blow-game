# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

常に日本語で回答してください。

## プロジェクト概要

8種類のシンボル（タイル）を使ったヒットアンドブロー推理ゲーム。コンピュータが選んだシンボルの並びを推理し、「ヒット（位置・種類一致）」「ブロー（種類のみ一致）」の判定を頼りに正解を目指す。5つの難易度モード、フリープレイ・デイリーチャレンジの2種類のプレイタイプ、SNSシェア機能を備えた個人開発のWebアプリ。サーバーレス構成でlocalStorageにデータを保存する。

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: React 19 + React Router v7
- **ビルド**: Vite 7
- **スタイリング**: Tailwind CSS v4（`@tailwindcss/vite` プラグイン）
- **バリデーション**: Zod v4
- **i18n**: i18next + react-i18next
- **パッケージマネージャー**: pnpm 10（`packageManager` フィールドで固定）
- **Node.js**: v24（`.nvmrc` で指定）
- **ホスティング**: GitHub Pages
- **Lint**: ESLint 9（flat config）+ typescript-eslint + eslint-plugin-react-hooks

## 開発コマンド

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # tsc + vite build（本番ビルド）
pnpm preview      # ビルド済みファイルのプレビュー
pnpm lint         # ESLint実行
pnpm type-check   # TypeScript型チェック（tsc --noEmit）
```

## ディレクトリ構成

```
src/
├── main.tsx            # エントリーポイント
├── App.tsx             # ルートコンポーネント
├── components/         # 共通UIコンポーネント（Pure）
├── features/           # 機能固有のロジック・UI（game, stats, tutorial, share, ad）
├── services/           # 外部サービス連携（storage, liff）
├── hooks/              # 汎用カスタムフック
├── utils/              # 純粋関数ユーティリティ
├── consts/             # 定数定義
├── i18n/               # 国際化（ja/en）
├── pages/              # ページコンポーネント
└── styles/             # グローバルスタイル
```

詳細は `docs/02_architecture.md` のディレクトリ構成を参照。

## 仕様書

詳細な仕様は `docs/` 配下のファイルを参照:

| ファイル | 内容 |
|---------|------|
| `01_requirements.md` | 要件定義（ゲームルール、モード仕様、機能要件） |
| `02_architecture.md` | アーキテクチャ設計（レイヤー構成、Zodスキーマ、コンポーネント設計） |
| `03_database.md` | LocalStorageデータ設計 |
| `04_api.md` | 外部API連携（SNS/AdSense/LIFF） |
| `05_sitemap.md` | サイトマップ・ルーティング設計 |
| `mock_design.html` | ワイヤーフレーム |

## 開発フロー

- **Issue対応時**: タスクの実行前に新しいブランチを作成してから対応する
- **タスク分割時**: タスクごとにコミットを行い、コミット前にはユーザーに確認を求める
- **PR作成時**: `.github/pull_request_template.md` のフォーマットに従って作成する

### Git

- Conventional Commits 形式（`feat:`, `fix:`, `docs:` 等）
- Husky + lint-staged は今後導入予定

## コーディング規約

- パスエイリアス `@/` を使用（`src/` にマッピング）
- Zodスキーマから型を推論（`z.output<typeof Schema>` パターン）
- 定数は `consts/` に集約し、Zod enum用の配列も同ファイルで定義
- コンポーネントは `function` 宣言（アロー関数ではなく）
- 翻訳キーは `i18n/locales/` のJSONファイルで管理
