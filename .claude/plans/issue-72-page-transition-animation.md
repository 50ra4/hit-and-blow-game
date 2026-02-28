# Issue #72: ページ遷移アニメーションを追加

## 意図（なぜ必要か）

現状はページ遷移が即時切り替えのため、UX として画面の切り替わりが唐突に感じられる。
モックデザイン（`docs/06_mock_design.html`）では `fadeInUp` アニメーションが定義されており、
実装を揃えることで設計意図通りのユーザー体験を提供できる。

## 変更ファイル

- `src/styles/index.css`
- `src/pages/HomePage/HomePage.tsx`
- `src/pages/FreeGamePage/FreeGamePage.tsx`
- `src/pages/DailyGamePage/DailyGamePage.tsx`
- `src/pages/StatsPage/StatsPage.tsx`
- `src/pages/TutorialPage/TutorialPage.tsx`
- `src/pages/TermsPage/TermsPage.tsx`
- `src/pages/PrivacyPage/PrivacyPage.tsx`
- `src/pages/NotFoundPage/NotFoundPage.tsx`

## 選択理由

### なぜ各ページのルート要素にクラスを付与するか（key ラッパー方式を採用しない理由）

`key` 付きラッパーを `SuspenseWrapper` に置く方法は、ルート変更時に div がフルリマウントされる。
これは React の内部ツリーを余計に破棄・再生成するため、不要なコストが発生する。

各ページコンポーネントは React Router のルート変更によって自然にマウント・アンマウントされる。
ルート要素の `className` に `hab-fade-in-up` を追加するだけで、コンポーネントマウント時に
CSS アニメーションが自然に実行される。`AppRouter.tsx` は変更不要。

### なぜ `.hab-fade-in-up` のプレフィックスを `hab-` にするか

プロジェクトのカスタムクラス命名規則に準拠（`hab-` プレフィックス + ケバブケース）。

## 実装手順

### タスク 1: CSS にアニメーションを追加（`src/styles/index.css`）

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@layer utilities {
  .hab-fade-in-up {
    animation: fadeInUp 0.35s ease forwards;
  }
}
```

アニメーション時間は 0.35s（受け入れ条件の 0.3〜0.5s 以内）。

### タスク 2: 全ページのルート要素に `hab-fade-in-up` を付与

各ページの return 文の最外 `<div>` の className に `hab-fade-in-up` を追加する。

| ファイル | 変更前の className |
|---|---|
| `HomePage.tsx` | `mx-auto max-w-2xl px-4 py-8` |
| `FreeGamePage.tsx` | `bg-gradient-dark-1 flex h-screen flex-col` |
| `DailyGamePage.tsx` | `bg-gradient-dark-1 flex h-screen flex-col`（`key` 属性は既存のまま残す） |
| `StatsPage.tsx` | `mx-auto max-w-2xl px-4 py-8` |
| `TutorialPage.tsx` | `mx-auto max-w-2xl px-4 py-8` |
| `TermsPage.tsx` | `mx-auto max-w-2xl px-4 py-8` |
| `PrivacyPage.tsx` | `mx-auto max-w-2xl px-4 py-8` |
| `NotFoundPage.tsx` | `flex min-h-[60vh] flex-col items-center justify-center px-4 text-center` |

## 受け入れ条件

- [ ] ページ遷移時に画面が下からフェードインするアニメーションが再生される
- [ ] アニメーション時間は 0.3〜0.5秒以内（0.35s で設定）
- [ ] ホーム・ゲーム・統計・チュートリアル全ての遷移で動作する
- [ ] アニメーション中も操作可能（`pointer-events` をブロックしない）
