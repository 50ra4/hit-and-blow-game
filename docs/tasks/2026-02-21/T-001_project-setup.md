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
| `package.json` | プロジェクト設定・依存パッケージ定義 |
| `vite.config.ts` | Viteビルド設定（`@`エイリアス、GitHub Pagesベースパス、コード分割） |
| `tsconfig.json` | TypeScript設定（strict: true、パスエイリアス） |
| `tsconfig.node.json` | Node用TypeScript設定 |
| `tailwind.config.js` | Tailwind CSS設定 |
| `postcss.config.js` | PostCSS設定（Tailwind用） |
| `eslint.config.js` | ESLint設定 |
| `.prettierrc` | Prettier設定 |
| `.nvmrc` | Node.jsバージョン指定 |
| `.env.example` | 環境変数サンプル |
| `.gitignore` | Git除外設定（node_modules, dist, .env等） |
| `index.html` | HTMLエントリーポイント |
| `src/main.tsx` | Reactエントリーポイント（空のApp描画のみ） |
| `src/App.tsx` | ルートコンポーネント（プレースホルダー） |
| `src/vite-env.d.ts` | Vite型定義参照 |
| `src/styles/index.css` | Tailwindディレクティブ |

### 変更ファイル

なし（新規プロジェクト）

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
| `react` | `^19.0.0` | UIフレームワーク |
| `react-dom` | `^19.0.0` | React DOM描画 |
| `react-router-dom` | `^7.0.0` | ルーティング |
| `react-i18next` | `^15.0.0` | 多言語対応 |
| `i18next` | `^24.0.0` | i18nコア |
| `zod` | `^3.24.0` | スキーマバリデーション |

**依存パッケージ（devDependencies）:**

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| `vite` | `^6.0.0` | ビルドツール |
| `@vitejs/plugin-react` | `^4.0.0` | React用Viteプラグイン |
| `typescript` | `^5.7.0` | TypeScript |
| `@types/react` | `^19.0.0` | React型定義 |
| `@types/react-dom` | `^19.0.0` | ReactDOM型定義 |
| `tailwindcss` | `^3.4.0` | CSSフレームワーク |
| `postcss` | `^8.0.0` | PostCSS |
| `autoprefixer` | `^10.0.0` | ベンダープレフィックス自動付与 |
| `eslint` | `^9.0.0` | リンター |
| `@eslint/js` | `latest` | ESLint基本設定 |
| `typescript-eslint` | `latest` | TypeScript用ESLint |
| `eslint-plugin-react-hooks` | `latest` | React Hooks用ESLintルール |

> **注意**: html2canvas, @liff/liff-sdk, @playwright/test は該当タスク（T-019, T-021等）で追加する。

#### vite.config.ts

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

#### tailwind.config.js

- `content`: `["./index.html", "./src/**/*.{ts,tsx}"]`
- ダークモード: `class`
- カスタムカラー: `mock_design.html` のグラデーション背景色（`#1a1a2e`, `#16213e`, `#0f3460`）をカスタムカラーとして追加

#### src/styles/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

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

- [ ] `pnpm install` が正常完了する
- [ ] `pnpm dev` で開発サーバーが起動し、ブラウザに表示される
- [ ] `pnpm build` でビルドが成功する（`dist/`に出力される）
- [ ] `pnpm type-check` でTypeScriptの型チェックが通る
- [ ] `pnpm lint` でESLintが実行される
- [ ] `@`エイリアスが正しく解決される（`import xxx from '@/App'` が動作する）
- [ ] Tailwind CSSのクラスが適用される
- [ ] `.env.example` が存在する

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
