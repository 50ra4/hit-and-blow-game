# Issue #76 実装計画: チュートリアルのヒット・ブロー説明例をモックに合わせる

## 意図（なぜ必要か）

チュートリアルのStep 1（ヒット・ブロー説明）で使用している例示データが、
モックデザイン（`docs/06_mock_design.html`）と一致していない。
ユーザーがドキュメントやモックを参照した際に混乱を招くため、一致させる。

## 対象ファイル

- `src/pages/TutorialPage/TutorialPage.tsx`

> **注意**: Issue の「変更ファイル」欄には `src/features/tutorial/TutorialStep/TutorialStep.tsx` と
> 記載されているが、`TutorialStep.tsx` はページネーションラッパーのみで例示データを持たない。
> 実際の変更対象は `TutorialPage.tsx` である。

## 変更内容

### 1. 例示データの修正

```tsx
// 変更前
// 答え: star, circle, triangle, square / 推測: star, diamond, triangle, heart
// ヒット2 (star, triangleが位置一致), ブロー0
const EXAMPLE_ANSWER_IDS: TileId[] = ['star', 'circle', 'triangle', 'square'];
const EXAMPLE_GUESS_IDS: TileId[] = ['star', 'diamond', 'triangle', 'heart'];

// 変更後
// 答え: star, circle, triangle, square / 推測: star, heart, circle, square
// ヒット2 (star, squareが位置一致), ブロー1 (circleが含まれるが位置違い)
const EXAMPLE_ANSWER_IDS: TileId[] = ['star', 'circle', 'triangle', 'square'];
const EXAMPLE_GUESS_IDS: TileId[] = ['star', 'heart', 'circle', 'square'];
```

### 2. Blow表示値の修正

Step 1 の JSX 内で Blow カウントと説明テキストを修正する。

```tsx
// 変更前
<span className="text-2xl font-bold text-yellow-400">0</span>
<span className="text-sm font-semibold text-yellow-300">
  {t('tutorial.step1BlowDesc')}
</span>

// 変更後
<span className="text-2xl font-bold text-yellow-400">1</span>
<span className="text-sm font-semibold text-yellow-300">
  {t('tutorial.step1BlowDesc')}
</span>
```

また、推測結果表示部のBlowカウントも修正する。

```tsx
// 変更前
<span className="font-bold text-yellow-400">0</span>

// 変更後
<span className="font-bold text-yellow-400">1</span>
```

## 選択理由

- `TileChip` は内部で `TileIcon` を使用しているため、受け入れ条件「タイルは `TileIcon` コンポーネントを使って描画される」は現状の実装で満たされている。コンポーネントの置き換えは不要。
- 変更は最小限（データ定数とコメント、表示値のみ）とし、既存のスタイル・構造を維持する。

## 受け入れ条件

- [ ] 答えタイルが star・circle・triangle・square の順で表示される
- [ ] 推測タイルが star・heart・circle・square の順で表示される
- [ ] ヒット数「2」、ブロー数「1」が正しく表示される
- [ ] タイルは `TileIcon` コンポーネントを使って描画される（`TileChip` 経由で充足）

## タスク

1タスクのみ（変更が1ファイル・最小限のため分割不要）。

| # | 内容 | ファイル |
|---|------|---------|
| 1 | 例示データとBlowカウント表示を修正 | `src/pages/TutorialPage/TutorialPage.tsx` |
