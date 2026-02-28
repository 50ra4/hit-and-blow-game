# Issue #82 実装計画: 入力エリアの画面外押し出し修正

## 意図（なぜ必要か）

推測を重ねるごとに GuessHistory が縦方向に伸び、入力エリア（スロット・タイルパレット・アクションボタン）が画面外に押し出される。
ユーザーはスクロールしないと入力できない状態が発生し、UX を著しく損なう。
モックデザイン（`docs/06_mock_design.html`）でも入力エリアが常に可視状態であることを意図している。

## 原因

現在のページ構造は以下の通り：

```
div.min-h-screen.flex.flex-col   ← min-h-screen = 高さが可変（コンテンツに追従して伸びる）
  GameHeader
  div.flex-1.overflow-y-auto     ← スクロール領域だが、外側が無制限に伸びるため
    div.mx-auto.max-w-2xl        　 scroll container に確定高さが与えられない
      GameInfoPanel
      GameBoard
        div.space-y-6
          GuessHistory           ← 伸び続ける
          入力エリア              ← GuessHistory の下に押し出される
```

`min-h-screen` + `flex-1 overflow-y-auto` の組み合わせでは、外側コンテナが画面高さを超えて伸びられるため、`flex-1` が viewport の残余高さに収まらない。
結果としてページ全体がスクロールし、`overflow-y-auto` が意味をなさない。

## 解決方針（選択理由）

**`h-screen` + flex chain によるレイアウト再構成**

- 外側コンテナを `h-screen` に変更し、高さを viewport に固定
- flex chain を通じて GameBoard に確定高さを与える
- `GameBoard` 内部で GuessHistory を `flex-1 min-h-0 overflow-y-auto` にして独立スクロール
- 入力エリアは GameBoard の最下部に自然配置（`shrink-0`）

### なぜ `sticky bottom-0` ではなく flex chain か

`sticky bottom-0` はスクロールコンテナの viewport 下端に要素を貼り付けるが、**スクロールが下方向（コンテンツが増える方向）に発生する本件では機能しない**。
`sticky bottom-0` が効くのは「下にスクロールした後、上に戻る途中に要素が下端に貼り付く」ケースであり、今回の用途と異なる。

### なぜ ResultDisplay は flex-1 overflow-y-auto でラップするか

ゲームオーバー後の ResultDisplay は GuessHistory を含む縦長コンテンツ。同じ高さ制約の中でスクロール可能にする必要がある。

## 変更ファイル

### 1. `src/features/game/GameBoard/GameBoard.tsx`

**変更前**: root div が `space-y-6`（GuessHistory と入力エリアが縦並び、高さ無制限）
**変更後**: root div を `flex flex-col overflow-hidden` に変更し、以下を実現：

- GuessHistory wrapper: `flex-1 min-h-0 overflow-y-auto` → スクロール領域
- 入力エリア div: `shrink-0 mt-6` を付加 → 常に下部に表示

`min-h-0` が必須な理由：flex child は `min-height: auto` がデフォルトのため、コンテンツ高さ以下に縮まない。
`min-h-0` を付けることで overflow-y-auto が正常に動作する。

### 2. `src/pages/FreeGamePage/FreeGamePage.tsx`

**変更前**:

```jsx
<div className="bg-gradient-dark-1 flex min-h-screen flex-col">
  <GameHeader ... />
  <div className="flex-1 overflow-y-auto px-4 py-6">
    <div className="mx-auto max-w-2xl">
      <GameInfoPanel ... />
      {isGameOver ? <ResultDisplay ... /> : <GameBoard ... />}
    </div>
  </div>
</div>
```

**変更後**:

```jsx
<div className="bg-gradient-dark-1 flex h-screen flex-col">        {/* min-h → h */}
  <GameHeader ... />
  <div className="flex flex-1 flex-col overflow-hidden px-4 py-6"> {/* overflow-y-auto → flex-col overflow-hidden */}
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden"> {/* flex chain */}
      <GameInfoPanel ... />
      {isGameOver ? (
        <div className="min-h-0 flex-1 overflow-y-auto">            {/* ResultDisplay 用スクロール */}
          <ResultDisplay ... />
        </div>
      ) : (
        <div className="min-h-0 flex-1 flex flex-col overflow-hidden"> {/* GameBoard へ高さを伝播 */}
          <GameBoard ... />
        </div>
      )}
    </div>
  </div>
</div>
```

### 3. `src/pages/DailyGamePage/DailyGamePage.tsx`

FreeGamePage と同様の変更。
「既プレイ」表示の場合は `flex-1 items-center justify-center` のまま変更なし（縦スクロール不要なため）。
メインゲーム画面 (return 末尾) のみ変更する。

## タスク分割

| #   | タスク                       | ファイル            | 受け入れ条件                                        |
| --- | ---------------------------- | ------------------- | --------------------------------------------------- |
| 1   | GameBoard 内部レイアウト修正 | `GameBoard.tsx`     | GuessHistory が独立スクロール、入力エリアが常に可視 |
| 2   | FreeGamePage レイアウト修正  | `FreeGamePage.tsx`  | h-screen + flex chain が正しく機能する              |
| 3   | DailyGamePage レイアウト修正 | `DailyGamePage.tsx` | 同上                                                |

## 受け入れ条件（Issue 準拠）

- [ ] 推測履歴が何件追加されても、入力エリアが常に画面内に表示される
- [ ] GuessHistory エリアがスクロール可能
- [ ] ゲームオーバー時（ResultDisplay）も画面内に収まりスクロール可能
