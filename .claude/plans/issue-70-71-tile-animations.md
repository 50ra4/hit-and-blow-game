# 実装計画: Issue #70 / #71 タイル視覚フィードバック改善

作成日: 2026-02-28
ブランチ: `feature/issue-70-71`

---

## 意図（なぜ必要か）

モックデザイン（`docs/06_mock_design.html`）で定義されている視覚フィードバックが未実装のため、インタラクションの質がデザイン仕様を下回っている。

- **#70**: タイル選択時にバウンスアニメーションがなく、クリックした感触が薄い
- **#71**: タイルに光沢オーバーレイがなく、平面的な見た目になっている

---

## タスク一覧

### タスク1: Issue #71 — TileChip コンポーネントを新設し光沢オーバーレイを実装

**変更ファイル**:
- `src/components/TileIcon/TileIcon.tsx`（元に戻す）
- `src/components/TileChip/TileChip.tsx`（新規作成）

**選択理由**:
当初 `TileIcon`（SVGシンボル部分のみ、h-8 w-8 程度）に光沢を追加したが、シンボルの小さな面積にしか乗らず、タイルの大半を占めるグラデーション背景には効果がなかった。

`TileChip` として「グラデーション背景＋光沢オーバーレイ＋シンボルアイコン」を一体化することで、タイル全体に光沢がかかる正しい実装になる。`TileIcon` は純粋な SVG コンポーネントとして責務を分離する。

**TileIcon の変更内容（元に戻す）**:
```tsx
export function TileIcon({ tileId, className }: TileIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {TILE_SVG_CONTENTS[tileId]}
    </svg>
  );
}
```

**TileChip の実装内容**:
```tsx
// src/components/TileChip/TileChip.tsx
import { TILE_GRADIENT_STYLES, type TileId } from '@/features/game/tileDisplay';
import { TileIcon } from '@/components/TileIcon/TileIcon';

type TileChipProps = {
  tileId: TileId;
  className?: string;
};

export function TileChip({ tileId, className }: TileChipProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden ${className ?? ''}`}
      style={TILE_GRADIENT_STYLES[tileId]}
    >
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
        }}
      />
      <TileIcon tileId={tileId} className="relative w-[57%] h-[57%]" />
    </div>
  );
}
```

**アイコンサイズ**: 各呼び出し箇所のコンテナとアイコン比率は一貫して約57%のため `w-[57%] h-[57%]` を使用する（h-8/h-14=57%、h-7/h-12=58%、h-6/h-10=60%）。

**受け入れ条件**:
- [ ] タイルの上半分に白の半透明グラデーションが表示される
- [ ] 光沢オーバーレイがインタラクションの妨げにならない（`pointer-events-none`）
- [ ] TileIcon が元の純粋な SVG コンポーネントに戻っている

---

### タスク2: 全呼び出し元を TileChip に置き換え

**変更ファイル**:
- `src/features/game/GuessHistory/GuessHistory.tsx`
- `src/features/game/ResultDisplay/ResultDisplay.tsx`
- `src/pages/TutorialPage/TutorialPage.tsx`
- `src/features/game/GameInputArea/GameInputArea.tsx`
- `src/features/game/TilePicker/TilePicker.tsx`

**選択理由**:
TileChip が「タイル全体」の表現を担うため、各呼び出し元では `style={TILE_GRADIENT_STYLES[...]}` を持つラッパー要素を TileChip に置き換える。

**各ファイルの変更内容**:

#### GuessHistory.tsx
```tsx
// Before
<div
  style={TILE_GRADIENT_STYLES[tile.id]}
  className="inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-md"
>
  <TileIcon tileId={tile.id} className="h-6 w-6" />
</div>

// After
<TileChip tileId={tile.id} className="h-10 w-10 rounded-xl shadow-md" />
```

#### ResultDisplay.tsx
```tsx
// Before
<div
  style={TILE_GRADIENT_STYLES[tile.id]}
  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
>
  <TileIcon tileId={tile.id} className="h-8 w-8" />
</div>

// After
<TileChip tileId={tile.id} className="h-14 w-14 rounded-2xl shadow-md" />
```

#### TutorialPage.tsx（Step1 答え/推測の例）
```tsx
// Before
<div style={TILE_GRADIENT_STYLES[id]} className="flex h-12 w-12 items-center justify-center rounded-xl">
  <TileIcon tileId={id} className="h-7 w-7" />
</div>

// After
<TileChip tileId={id} className="h-12 w-12 rounded-xl" />
```

#### TutorialPage.tsx（Step2 タイル一覧）
```tsx
// Before
<div style={TILE_GRADIENT_STYLES[id]} className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-md">
  <TileIcon tileId={id} className="h-8 w-8" />
</div>

// After
<TileChip tileId={id} className="h-14 w-14 rounded-2xl shadow-md" />
```

#### GameInputArea.tsx（入力スロット）
```tsx
// Before（buttonのstyleを削除し、TileChipを子要素にする）
<button
  ...
  style={TILE_GRADIENT_STYLES[tile.id]}  // 削除
  className="inline-flex h-14 w-14 ... rounded-2xl overflow-hidden ..."
>
  <TileIcon tileId={tile.id} className="h-8 w-8" />  // 削除

// After
<button
  ...
  className="inline-flex h-14 w-14 ... rounded-2xl overflow-hidden ..."
>
  <TileChip tileId={tile.id} className="h-full w-full" />
</button>
```

#### TilePicker.tsx（有効タイルのみ TileChip、無効タイルは従来通り）
```tsx
// ボタンに overflow-hidden を追加し、styleを削除
<button
  ...
  style={undefined}  // 削除（TILE_GRADIENT_STYLES はTileChipが内部で管理）
  className={`... rounded-2xl overflow-hidden ... ${
    tileDisabled
      ? 'cursor-not-allowed bg-gray-600 text-gray-400 opacity-30'
      : 'cursor-pointer ...'
  } ...`}
>
  {tileDisabled ? (
    <TileIcon tileId={tile.id} className="h-8 w-8 sm:h-9 sm:w-9" />
  ) : (
    <TileChip tileId={tile.id} className="h-full w-full" />
  )}
</button>
```

**注意**: TilePicker の disabled タイルは従来の見た目（グレー背景）を維持するため、TileChip を使わず TileIcon を直接レンダーする。

**受け入れ条件**:
- [ ] タイルパレット・入力スロット・推測履歴・結果表示・チュートリアルの全ての表示箇所でタイル全体に光沢が表示される
- [ ] TilePicker の無効タイルは従来通りグレー表示を維持する

---

### タスク3: Issue #70 — TilePicker にバウンスアニメーションを追加（既実装・確認のみ）

バウンスアニメーション（Issue #70）はタスク2以前に実装済み。タスク2の TilePicker 変更後も以下の動作を確認する。

**受け入れ条件**:
- [ ] タイルをクリックしたとき 0.25秒のバウンスアニメーションが再生される
- [ ] アニメーション終了後に `scale(1)` の通常状態に戻る
- [ ] 連続でタイルをクリックしても各タイルで独立してアニメーションが動作する
- [ ] アニメーション中も選択ロジック（スロットへの追加）は即時実行される

---

## 実装順序の選択理由

タスク1（TileChip 新設）→ タスク2（全呼び出し元の置き換え）の順で実装する。

TileChip が存在してからでないと呼び出し元を変更できないため。
