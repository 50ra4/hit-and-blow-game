# ヒットアンドブロー

8種類のシンボル（タイル）を使ったヒットアンドブロー推理ゲーム。

コンピュータが選んだシンボルの並びを推理し、「ヒット（位置・種類一致）」「ブロー（種類のみ一致）」の判定を頼りに正解を目指す。

5つの難易度モード、フリープレイ・デイリーチャレンジの2種類のプレイタイプ、SNSシェア機能を備える。

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
| `pnpm lint`       | ESLint実行                     |
| `pnpm type-check` | TypeScript型チェック           |

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: React 19 + React Router v7
- **ビルド**: Vite 7
- **スタイリング**: Tailwind CSS v4（`@tailwindcss/vite` プラグイン）
- **バリデーション**: Zod v4
- **i18n**: i18next + react-i18next（日本語・英語）
- **パッケージマネージャー**: pnpm 10（`packageManager` フィールドで固定）
- **Node.js**: v24（`.nvmrc` で指定）
- **ホスティング**: GitHub Pages
- **Lint**: ESLint 9（flat config）+ typescript-eslint + eslint-plugin-react-hooks

## ディレクトリ構成

```
src/
├── main.tsx            # エントリーポイント
├── App.tsx             # ルートコンポーネント
├── components/         # 共通UIコンポーネント（Pure）
├── features/           # 機能固有のロジック・UI
├── services/           # 外部サービス連携（storage, liff）
├── hooks/              # 汎用カスタムフック
├── utils/              # 純粋関数ユーティリティ
├── consts/             # 定数定義
├── i18n/               # 国際化（ja/en）
├── pages/              # ページコンポーネント
└── styles/             # グローバルスタイル
```

詳細は `docs/02_architecture.md` のディレクトリ構成を参照。

## 開発ドキュメント

仕様書は `docs/` 配下を参照:

| ファイル              | 内容                                                                |
| --------------------- | ------------------------------------------------------------------- |
| `01_requirements.md`  | 要件定義（ゲームルール、モード仕様、機能要件）                      |
| `02_architecture.md`  | アーキテクチャ設計（レイヤー構成、Zodスキーマ、コンポーネント設計） |
| `03_database.md`      | LocalStorageデータ設計                                              |
| `04_api.md`           | 外部API連携（SNS/AdSense/LIFF）                                     |
| `05_sitemap.md`       | サイトマップ・ルーティング設計                                      |
| `06_mock_design.html` | ワイヤーフレーム                                                    |

## Git&Github

- コミット時に Husky + lint-staged を実行
- コミットメッセージ: Conventional Commits 形式（`feat:`, `fix:`, `docs:` 等）
- PR作成: `.github/pull_request_template.md` のフォーマットに従い作成
