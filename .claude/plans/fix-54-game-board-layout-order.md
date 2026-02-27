# [FIX-G2] ゲーム画面のレイアウト順修正

## 意図（なぜ必要か）

`GameBoard.tsx` の JSX 内の要素順序が、モックデザイン（`docs/06_mock_design.html`）と逆になっている。現状は「入力エリア → タイルパレット → 推測履歴」の順だが、モックでは「推測履歴 → 現在の入力エリア → タイルパレット → アクション」の順が意図されている。

ユーザーが過去の推測を見ながら次の予測を立てるという操作フローとして、履歴が上方に蓄積され、入力エリアが画面下部にあるのが自然。

## 選択理由

### モックデザインの確認

`docs/06_mock_design.html` のゲーム画面（`#gameScreen`）では：

```html
<div class="game-board">
  <div class="guess-history">...</div>
  <!-- 1. 推測履歴 -->
  <div class="current-guess">...</div>
  <!-- 2. 現在の入力スロット -->
  <div class="tile-palette">...</div>
  <!-- 3. タイルパレット -->
  <div class="game-actions">...</div>
  <!-- 4. アクションボタン -->
</div>
```

### スクロール動作について

モックの `.current-guess` / `.tile-palette` / `.game-actions` に `position: sticky` / `position: fixed` は設定されていない。ページ全体がスクロールする設計。`FreeGamePage` / `DailyGamePage` の `flex-1 overflow-y-auto` も通常スクロールで問題なし。sticky 対応は本 Issue のスコープ外とし、対応しない。

## 変更対象ファイル

- `src/features/game/GameBoard/GameBoard.tsx`

## タスク

### Task 1: GameBoard.tsx の要素順序を変更

**変更前（現在）：**

```tsx
<div className="space-y-6">
  {/* 現在の入力エリア（入力スロット + TilePicker + アクションボタン） */}
  {!isGameOver && (
    <div>
      <CurrentGuessSlots />
      <TilePicker />
      <ActionButtons />
    </div>
  )}
  {/* 推測履歴 */}
  <GuessHistory />
</div>
```

**変更後（モックに合わせる）：**

```tsx
<div className="space-y-6">
  {/* 推測履歴 */}
  <GuessHistory />
  {/* 現在の入力エリア（入力スロット + TilePicker + アクションボタン） */}
  {!isGameOver && (
    <div>
      <CurrentGuessSlots />
      <TilePicker />
      <ActionButtons />
    </div>
  )}
</div>
```

## 受け入れ条件

- [ ] ゲーム画面で「推測履歴 → 入力スロット → タイルパレット → アクションボタン」の順に表示される
- [ ] ゲームオーバー時（`isGameOver === true`）は入力エリアが非表示になり、履歴のみ表示される
- [ ] フリープレイ・デイリーチャレンジ両方で動作確認

## スコープ外

- sticky / fixed bottom の実装（別 Issue で対応）
- `GameInfoPanel` の位置変更（既に FreeGamePage / DailyGamePage で最上部に配置済み）
