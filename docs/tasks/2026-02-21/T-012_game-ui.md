# T-012: ゲームUIコンポーネント

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/17

## 目的

ゲーム画面を構成する機能固有のUIコンポーネント（TilePicker, GuessHistory, GameHeader, GameBoard, ResultDisplay）を実装する。

## 背景

- `docs/02_architecture.md` セクション6.2「Features Layer」— GameBoard, TilePicker, GuessHistory, GameHeader, ResultDisplay
- `docs/05_sitemap.md` セクション「フリープレイ」「デイリーチャレンジ」— 表示要素の仕様
- `docs/06_mock_design.html` — ビジュアルデザイン

## 実装内容

### 追加ファイル

| ファイル                                            | 内容                               |
| --------------------------------------------------- | ---------------------------------- |
| `src/features/game/TilePicker/TilePicker.tsx`       | タイル選択パレット                 |
| `src/features/game/GuessHistory/GuessHistory.tsx`   | 推測履歴表示                       |
| `src/features/game/GameHeader/GameHeader.tsx`       | ゲームヘッダー                     |
| `src/features/game/GameBoard/GameBoard.tsx`         | ゲームボード（統合コンポーネント） |
| `src/features/game/ResultDisplay/ResultDisplay.tsx` | ゲーム結果表示                     |

### 変更ファイル

なし

### 実装詳細

#### TilePicker.tsx

```typescript
type TilePickerProps = {
  selected: Tile[];
  onSelect: (tile: Tile) => void;
  maxLength: number;
  disabled?: boolean;
  allowDuplicates: boolean;
};

export const TilePicker = memo(function TilePicker(props: TilePickerProps) {
  // ...
});
```

**表示内容:**

- 8種類のタイルを横並びで表示
- 各タイルはSVGアイコン + 背景色
- `selected` に含まれるタイルは選択済み表示
- `allowDuplicates === false` のとき、選択済みタイルはグレーアウト（`docs/tasks/20260219-01.md` #3）
- `disabled === true` のとき全体を無効化
- `maxLength` に達している場合、新規選択を無効化
- タイルクリックで `onSelect` 呼び出し

**アクセシビリティ（`docs/tasks/20260219-01.md` #8, #9）:**

- 各タイルに `role="button"`, `aria-label`（タイル名）, `aria-pressed`（選択状態）を設定
- キーボード操作対応（Enter/Spaceで選択、矢印キーでフォーカス移動）

#### GuessHistory.tsx

```typescript
type GuessHistoryProps = {
  guesses: Guess[];
  answerLength: number;
  maxAttempts: number;
};

export function GuessHistory(props: GuessHistoryProps) {
  // ...
}
```

**表示内容:**

- 推測履歴を上から順に表示
- 各行: タイル配列 + ヒット数 + ブロー数
- 空のスロットを表示（`docs/tasks/20260219-01.md` #1 — 未入力のスロットは空のプレースホルダーで表示）
- ヒット: 緑色、ブロー: 黄色で視覚的に区別

#### GameHeader.tsx

```typescript
type GameHeaderProps = {
  modeName: string;
  attempts: number;
  maxAttempts: number;
  playType: PlayType;
  onBack: () => void;
};

export function GameHeader(props: GameHeaderProps) {
  // ...
}
```

**表示内容:**

- 左: 戻るボタン（`← ホーム`）
- 中央: モード名（デイリーの場合: `📅 今日の問題（ノーマル）`）
- 右: 残り回数表示（`3 / 8回目`）

#### GameBoard.tsx

```typescript
type GameBoardProps = {
  guesses: Guess[];
  currentGuess: Tile[];
  answerLength: number;
  maxAttempts: number;
  onTileSelect: (tile: Tile) => void;
  onTileRemove: (index: number) => void;
  onSubmit: () => void;
  onResetGuess: () => void;
  isGameOver: boolean;
  allowDuplicates: boolean;
};

export function GameBoard(props: GameBoardProps) {
  // ...
}
```

**表示内容:**

- 現在の入力エリア（選択されたタイル + 空スロット）
- 各タイルは個別に削除可能（`docs/tasks/20260219-01.md` #2）
- TilePicker（タイル選択パレット）
- 送信ボタン（「回答する」）
- リセットボタン（現在の入力をクリア）
- GuessHistory（推測履歴）

#### ResultDisplay.tsx

```typescript
type ResultDisplayProps = {
  isWon: boolean;
  attempts: number;
  answer: Tile[];
  mode: GameMode;
  playType: PlayType;
  onRestart: () => void;
  onGoHome: () => void;
};

export function ResultDisplay(props: ResultDisplayProps) {
  // ...
}
```

**表示内容:**

- 勝利時: 「クリア！」 + クリア回数
- 敗北時: 「ゲームオーバー」 + 正解のタイル表示
- 「もう一度プレイ」ボタン（フリープレイのみ）
- 「ホームに戻る」ボタン
- シェアボタン用スロット（T-019で実装）
- 広告表示用スロット（T-020で実装）

## 入出力仕様

- Input: 各コンポーネントのprops（上記参照）
- Output: React要素（JSX）

## 受け入れ条件（Definition of Done）

- [ ] 5つのコンポーネントが `src/features/game/` に作成されている
- [ ] `TilePicker` が8種類のタイルを表示し、クリックで選択できる
- [ ] `TilePicker` が `allowDuplicates=false` で選択済みタイルをグレーアウトする
- [ ] `GuessHistory` が推測履歴をヒット・ブロー付きで表示する
- [ ] `GuessHistory` が空スロットを表示する
- [ ] `GameHeader` がモード名・試行回数を表示する
- [ ] `GameBoard` が入力エリア・タイルパレット・送信ボタン・履歴を統合して表示する
- [ ] `GameBoard` で個別タイル削除が動作する
- [ ] `ResultDisplay` が勝利/敗北の結果を表示する
- [ ] ARIA属性・キーボード操作が実装されている
- [ ] `TilePicker` が `memo` でメモ化されている
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: `TilePicker` でタイルをクリック → `onSelect` が呼ばれる
- 正常系: `TilePicker` で `disabled=true` → タイル選択不可
- 正常系: `GuessHistory` で推測履歴が表示される
- 正常系: `ResultDisplay` で勝利時に「クリア！」が表示される
- 正常系: `ResultDisplay` で敗北時に「ゲームオーバー」と正解が表示される
- 正常系: キーボード操作でタイル選択ができる

## 依存タスク

- T-002（定数定義 — `TILES`, `AVAILABLE_TILES` を使用）
- T-003（Zodスキーマ — `Tile`, `Guess`, `GameMode`, `PlayType` 型を使用）

## 要確認事項

- ~~SVGタイル未作成~~ → **確定: 各タイルの色付き円（`consts/tiles.ts` の `color` 値を使用）でプレースホルダーを実装する。T-022のSVG作成後に `<img src="/assets/tiles/{id}.svg">` に差し替える構造にすること。**
- ~~デザイン再現度~~ → **確定: 06_mock_design.html を忠実に再現する（T-011参照）**
