# Issue #81: GameInfoPanel の表示修正

## 意図（なぜ必要か）

- ヘッダー（GameHeader）にすでに難易度（モード名）が表示されているため、GameInfoPanel での難易度の重複表示はユーザーにとって情報過多
- 桁数はゲームプレイ中に重要な情報だが現在どこにも表示されていないため、GameInfoPanel に桁数を表示する
- CircularProgress が画面中央に表示されていないことで、デザインが崩れて見える問題を修正する

## 変更内容

### タスク 1: GameInfoPanel の「モード」を「桁数」に変更

**対象ファイル:**

- `src/features/game/GameInfoPanel/GameInfoPanel.tsx`
- `src/pages/FreeGamePage/FreeGamePage.tsx`
- `src/pages/DailyGamePage/DailyGamePage.tsx`

**変更内容:**

1. `GameInfoPanelProps` の `modeName: string` を `length: number` に変更
2. モード表示部分を桁数表示に変更
   - ラベル: `t('game.infoModeLabel')` → `t('game.infoDigitsLabel')`
   - 値: `{modeName}` → `{t('game.infoDigits', { count: length })}`
3. 呼び出し元で `modeName` → `modeConfig.length` に変更

**選択理由:**

- i18n に `infoDigitsLabel`（「桁数」）と `infoDigits`（「{{count}}桁」）がすでに定義済みのため、翻訳ファイルの変更は不要
- `length` は `GAME_MODES` の `modeConfig` から直接取得可能

---

### タスク 2: CircularProgress を画面中央にセンタリング

**対象ファイル:**

- `src/features/game/GameInfoPanel/GameInfoPanel.tsx`

**変更内容:**

現在のレイアウト:

```jsx
<div className="flex items-center justify-between gap-4">
  <div className="text-center">  {/* 左: モード - 幅不定 */}
  <CircularProgress />            {/* 中央 - 幅90px固定 */}
  <div className="text-center">  {/* 右: 重複 - 幅不定 */}
</div>
```

左右の要素の幅が一定でないため CircularProgress が視覚的に中央にならない。

修正後:

```jsx
<div className="flex items-center justify-between gap-4">
  <div className="flex-1 text-center">  {/* 左: 桁数 - 均等幅 */}
  <CircularProgress />                   {/* 中央 - 幅90px固定 */}
  <div className="flex-1 text-center">  {/* 右: 重複 - 均等幅 */}
</div>
```

左右に `flex-1` を追加して均等幅にすることで、CircularProgress を正確に中央に配置する。

**選択理由:**

- `flex-1` は最もシンプルで Tailwind に沿った解決策
- `grid` や `absolute` 配置は不要な複雑性を生む

---

## コミット計画

1. `feat: GameInfoPanel の難易度表示を桁数表示に変更 [#81]`
2. `fix: CircularProgress を GameInfoPanel の中央に配置 [#81]`
