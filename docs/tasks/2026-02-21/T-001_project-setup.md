# T-001: プロジェクト初期セットアップ

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/6

## 目的

Vite + React 19 + TypeScript + Tailwind CSS の開発環境を構築し、ビルド・開発サーバーが動作する状態にする。

## 背景

- `docs/02_architecture.md` セクション3「技術スタック詳細」
- `docs/02_architecture.md` セクション8「ビルド・デプロイ設計」
- `docs/02_architecture.md` セクション11「品質管理」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| ファイル | 内容 |
|---------|------|
| `package.json` | プロジェクト設定・依存パッケージ定義 |
| `vite.config.ts` | Viteビルド設定（`@`エイリアス、GitHub Pagesベースパス、コード分割、@tailwindcss/viteプラグイン） |
| `tsconfig.json` | TypeScript設定（strict: true、パスエイリアス） |
| `tsconfig.node.json` | Node用TypeScript設定 |
| `eslint.config.js` | ESLint設定 |
| `.prettierrc` | Prettier設定 |
| `.nvmrc` | Node.jsバージョン指定 |
| `.env.example` | 環境変数サンプル |
| `.gitignore` | Git除外設定（node_modules, dist, .env等） |
| `index.html` | HTMLエントリーポイント |
| `src/main.tsx` | Reactエントリーポイント（空のApp描画のみ） |
| `src/App.tsx` | ルートコンポーネント（プレースホルダー） |
| `src/vite-env.d.ts` | Vite型定義参照 |
| `src/styles/index.css` | Tailwind CSS v4 CSS-First設定 |

### 変更ファイル

なし（新規プロジェクト）

### 削除ファイル

Tailwind CSS v4 は CSS-First approach を採用するため、以下のファイルは不要：

| ファイル | 理由 |
|---------|------|
| `tailwind.config.js` | CSS `@theme` ブロックで置き換え |
| `postcss.config.js` | `@tailwindcss/vite` プラグイン使用により不要 |

### 実装詳細

#### package.json

```json
{
  "name": "tile-hit-and-blow",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```

**依存パッケージ（dependencies）:**

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| `react` | `19.2.4` | UIフレームワーク |
| `react-dom` | `19.2.4` | React DOM描画 |
| `react-router-dom` | `7.13.0` | ルーティング |
| `react-i18next` | `15.7.4` | 多言語対応 |
| `i18next` | `24.2.3` | i18nコア |
| `zod` | `4.3.6` | スキーマバリデーション |

**依存パッケージ（devDependencies）:**

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| `vite` | `7.3.1` | ビルドツール |
| `@vitejs/plugin-react` | `4.7.0` | React用Viteプラグイン |
| `typescript` | `5.9.3` | TypeScript |
| `@types/react` | `19.2.14` | React型定義 |
| `@types/react-dom` | `19.2.3` | ReactDOM型定義 |
| `tailwindcss` | `4.2.0` | CSSフレームワーク（CSS-First approach） |
| `@tailwindcss/vite` | `4.2.0` | Tailwind CSS v4用Viteプラグイン |
| `eslint` | `9.39.2` | リンター |
| `@eslint/js` | `9.39.2` | ESLint基本設定 |
| `typescript-eslint` | `8.56.0` | TypeScript用ESLint |
| `eslint-plugin-react-hooks` | `7.0.1` | React Hooks用ESLintルール |

> **注記**: postcss と autoprefixer は Tailwind CSS v4 の @tailwindcss/vite プラグイン使用により不要となった。

> **注意**: html2canvas, @liff/liff-sdk, @playwright/test は該当タスク（T-019, T-021等）で追加する。

#### vite.config.ts

- `@tailwindcss/vite` プラグインを追加
- `@`エイリアスを`./src`に設定
- `base`を`/tile-hit-and-blow/`に設定（GitHub Pages用）
- `build.outDir`を`dist`に設定
- `build.sourcemap`を`true`に設定
- `rollupOptions.output.manualChunks`でvendor/i18n/utilsのチャンク分割設定

#### tsconfig.json

- `target`: `ES2020`
- `lib`: `["ES2020", "DOM", "DOM.Iterable"]`
- `module`: `ESNext`
- `moduleResolution`: `bundler`
- `jsx`: `react-jsx`
- `strict`: `true`
- `paths`: `{ "@/*": ["./src/*"] }`

#### src/styles/index.css

Tailwind CSS v4 CSS-First approach:

```css
@import "tailwindcss";

@theme {
  --color-gradient-dark-1: #1a1a2e;
  --color-gradient-dark-2: #16213e;
  --color-gradient-dark-3: #0f3460;
}
```

上記の CSS 変数定義により、以下のクラスが利用可能：
- `bg-gradient-dark-1`, `bg-gradient-dark-2`, `bg-gradient-dark-3`

#### index.html

- `lang="ja"`
- `<meta charset="UTF-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `<title>タイルヒットアンドブロー</title>`
- `<div id="root"></div>`
- `<script type="module" src="/src/main.tsx"></script>`

#### .env.example

```bash
VITE_LIFF_ID=your-liff-id
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxx
VITE_ADSENSE_SLOT_ID=xxxxxxxxxx
```

## 入出力仕様

- Input: なし
- Output: `pnpm dev` でVite開発サーバーが起動し、ブラウザに空のReactアプリが表示される

## 受け入れ条件（Definition of Done）

- [x] `pnpm install` が正常完了する
- [x] `pnpm dev` で開発サーバーが起動し、ブラウザに表示される
- [x] `pnpm build` でビルドが成功する（`dist/`に出力される）
- [x] `pnpm type-check` でTypeScriptの型チェックが通る
- [x] `pnpm lint` でESLintが実行される（エラーなし）
- [x] `@`エイリアスが正しく解決される（`import xxx from '@/App'` が動作する）
- [x] Tailwind CSSのクラスが適用される（カスタムカラー含む）
- [x] `.env.example` が存在する

## テスト観点

- 正常系: `pnpm dev` → ブラウザで空のアプリ表示を確認
- 正常系: `pnpm build` → `dist/` ディレクトリにビルド成果物が生成される
- 異常系: `pnpm type-check` で型エラーがないことを確認

## 依存タスク

なし（最初のタスク）

## 要確認事項

- ~~プロジェクト名の不一致~~ → **確定: `/tile-hit-and-blow/` を使用する**
- ~~React バージョン~~ → **確定: `pnpm install` 実行時点での最新安定版（`react@^19`）を使用する**
- ~~pnpm バージョン~~ → **確定: `pnpm install` 実行時点での最新安定版（`pnpm@^10`）を使用する。`package.json` の `packageManager` フィールドにインストールしたバージョンを記録する。**
