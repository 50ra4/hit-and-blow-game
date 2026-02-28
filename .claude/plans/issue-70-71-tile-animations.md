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

### タスク1: Issue #71 — TileIcon に光沢オーバーレイを追加

**変更ファイル**: `src/components/TileIcon/TileIcon.tsx`

**選択理由**:
`TileIcon` は `TilePicker`・`GameInputArea`・`GuessHistory`・`ResultDisplay`・`TutorialPage` の全箇所で使用されているため、`TileIcon` 内部で光沢を実装すれば一箇所の変更で全表示箇所に適用される。

CSS の `::before` 疑似要素はインラインスタイル（`style` prop）では使用できないため、JSX の `<span>` で代替する。

**実装内容**:

```tsx
export function TileIcon({ tileId, className }: TileIconProps) {
  return (
    <span className="relative inline-flex rounded-lg overflow-hidden">
      {/* 光沢オーバーレイ: タイルの立体感を演出 */}
      <span
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
        }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="currentColor"
        aria-hidden="true"
        className={className}
      >
        {TILE_SVG_CONTENTS[tileId]}
      </svg>
    </span>
  );
}
```

**注意**: `TileIcon` は現在 SVG のみを返している。ラッパー `<span>` を追加することで、呼び出し元のレイアウトに影響が出ないよう `inline-flex` を使用する。

**受け入れ条件**:
- [ ] タイルの上半分に白の半透明グラデーションが表示される
- [ ] 光沢オーバーレイがインタラクションの妨げにならない（`pointer-events-none`）
- [ ] タイルパレット・入力スロット・推測履歴の全ての表示箇所で適用される

---

### タスク2: Issue #70 — TilePicker にバウンスアニメーションを追加

**変更ファイル**:
- `src/styles/index.css`
- `src/features/game/TilePicker/TilePicker.tsx`

**選択理由**:
Tailwind の標準ユーティリティにはバウンスアニメーション（`scale 0.9 → 1.1 → 1.0`）が存在しないため、`index.css` に `@keyframes` を追加しカスタムユーティリティ `.hab-tile-bounce` として定義する（プロジェクトの命名規則 `hab-` プレフィックスに従う）。

アニメーションのトリガーは `useState` で管理し、`onAnimationEnd` でリセットすることで連続クリック時も各タイルが独立してアニメーションする。

**実装内容 (index.css)**:

```css
@keyframes tileBounce {
  0%   { transform: scale(1); }
  30%  { transform: scale(0.9); }
  70%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@layer utilities {
  .hab-tile-bounce {
    animation: tileBounce 0.25s ease;
  }
}
```

**実装内容 (TilePicker.tsx)**:

```tsx
const [animatingTileId, setAnimatingTileId] = useState<string | null>(null);

const handleSelect = useCallback(
  (tile: Tile) => {
    setAnimatingTileId(tile.id);
    onSelect(tile);
  },
  [onSelect],
);

// ボタン要素
<button
  ...
  className={`... ${animatingTileId === tile.id ? 'hab-tile-bounce' : ''}`}
  onClick={() => handleSelect(tile)}
  onAnimationEnd={() => setAnimatingTileId(null)}
>
```

**受け入れ条件**:
- [ ] タイルをクリックしたとき 0.25秒のバウンスアニメーションが再生される
- [ ] アニメーション終了後に `scale(1)` の通常状態に戻る
- [ ] 連続でタイルをクリックしても各タイルで独立してアニメーションが動作する
- [ ] アニメーション中も選択ロジック（スロットへの追加）は即時実行される

---

## 実装順序の選択理由

タスク1（#71 TileIcon）→ タスク2（#70 TilePicker）の順で実装する。

`TilePicker` は `TileIcon` を内部で使用しているため、タスク1を先に完了させることで、タスク2の実装・確認時に光沢オーバーレイとバウンスアニメーションを合わせて確認できる。
