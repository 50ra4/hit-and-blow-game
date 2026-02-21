# T-013: ルーティング・App統合

## 目的

React Routerによるルーティング設定とAppコンポーネントの統合を行い、全ページへの導線を構築する。

## 背景

- `docs/02_architecture.md` セクション9.1「Code Splitting」— lazy import + Suspense
- `docs/05_sitemap.md` セクション「ルーティング設計」
- `docs/05_sitemap.md` セクション「ナビゲーション設計」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/AppRouter.tsx` | ルーティング定義 |
| `src/layouts/AppLayout.tsx` | 共通レイアウト（ヘッダー・フッター） |

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/App.tsx` | AppRouterとi18n初期化、ダークモード適用を統合 |
| `src/main.tsx` | i18nインポート追加 |

### 実装詳細

#### AppRouter.tsx

`docs/05_sitemap.md` のルーティング定義に従う。

```typescript
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Loading } from '@/components/Loading/Loading';

const HomePage = lazy(() => import('@/pages/HomePage'));
const GamePage = lazy(() => import('@/pages/GamePage'));
const StatsPage = lazy(() => import('@/pages/StatsPage'));
const TutorialPage = lazy(() => import('@/pages/TutorialPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
```

**ルーティング定義:**

| パス | コンポーネント | 備考 |
|------|--------------|------|
| `/` | `HomePage` | ホーム画面 |
| `/games/free` | `GamePage` | フリープレイ（`playType="free"`） |
| `/games/daily` | `GamePage` | デイリーチャレンジ（`playType="daily"`） |
| `/stats` | `StatsPage` | 統計画面 |
| `/tutorial` | `TutorialPage` | チュートリアル |
| `/terms` | `TermsPage` | 利用規約 |
| `/privacy` | `PrivacyPage` | プライバシーポリシー |
| `*` | `NotFoundPage` | 404 |

- `basename` は GitHub Pages 用に設定（T-001の `vite.config.ts` の `base` と一致させる）
- `Suspense` の `fallback` に `Loading` コンポーネントを使用

#### AppLayout.tsx

全ページ共通のレイアウトコンポーネント。

```typescript
type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  // ヘッダー: ロゴ/戻るボタン、ページタイトル、言語切替、設定ボタン
  // メインコンテンツ: children
  // フッター: ホームのみ表示
}
```

**ヘッダー構成（`docs/05_sitemap.md` ナビゲーション設計）:**

```
┌─────────────────────────────────────────┐
│ [ロゴ/戻る]    [ページタイトル]    [🌐 JA ▼] [⚙️] │
└─────────────────────────────────────────┘
```

- 左側: ホームではゲームロゴ、その他ページでは戻るボタン `←`
- 中央: ページタイトル
- 右側: 言語切替ドロップダウン + 設定ボタン

**言語切替:**
- ドロップダウンで日本語/英語を切替
- `useSettings` の `updateLanguage` を呼び出し

**設定モーダル（`docs/05_sitemap.md` 設定モーダル）:**
- トリガー: ヘッダー右上の `⚙️` ボタン
- テーマ設定（ライト/ダーク/システム）
- 効果音（ON/OFF）
- 利用規約・プライバシーポリシーへのリンク

#### App.tsx の変更

```typescript
import '@/i18n';
import { AppRouter } from '@/AppRouter';
import { useSettings } from '@/i18n/useSettings';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function App() {
  const { settings } = useSettings();
  useDarkMode(settings.theme);

  return <AppRouter />;
}
```

#### main.tsx の変更

```typescript
import '@/i18n';  // i18n初期化
```

## 入出力仕様

- Input: URLパス
- Output: 対応するページコンポーネントの描画

## 受け入れ条件（Definition of Done）

- [ ] 全ルートが定義され、対応するページに遷移できる
- [ ] `lazy` + `Suspense` によるコード分割が機能する
- [ ] ヘッダーが全ページに表示される
- [ ] 言語切替が機能する
- [ ] 設定モーダルが開閉する
- [ ] ダークモードが設定に応じて適用される
- [ ] 存在しないパスで404ページが表示される
- [ ] `basename` がGitHub Pages用に正しく設定されている
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: `/` にアクセス → ホームページが表示される
- 正常系: `/games/free` にアクセス → ゲームページが表示される
- 正常系: `/games/daily` にアクセス → デイリーチャレンジページが表示される
- 正常系: `/stats` にアクセス → 統計ページが表示される
- 正常系: `/unknown` にアクセス → 404ページが表示される
- 正常系: 言語切替で表示テキストが変わる
- 正常系: 設定モーダルの開閉

## 依存タスク

- T-004（i18n — `useTranslation` を使用）
- T-010（汎用フック — `useDarkMode` を使用）
- T-011（共通UI — `Loading`, `Modal`, `Button` を使用）

## 要確認事項

- ~~createBrowserRouter vs BrowserRouter~~ → **確定: `createBrowserRouter` を使用する（React Router v7推奨）**
- ~~basename の不一致~~ → **確定: `/tile-hit-and-blow/` を使用する（T-001参照）**
- ページコンポーネントはT-014〜T-018で実装するため、本タスクでは各ページファイルに仮の `export default` コンポーネント（プレースホルダー）を配置する。
