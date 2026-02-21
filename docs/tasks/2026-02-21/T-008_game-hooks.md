# T-008: ゲーム状態管理フック（useGame）

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/13

## 目的

ゲームの状態管理（答え生成、推測の追加・判定、ゲーム終了処理）を行うカスタムフック `useGame` を実装する。

## 背景

- `docs/02_architecture.md` セクション6.2「features/game/useGame.ts」
- `docs/01_requirements.md` セクション2.1〜2.3（ゲームルール・モード・プレイタイプ）
- `docs/05_sitemap.md` セクション「フリープレイ」「デイリーチャレンジ」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/features/game/useGame.ts` | ゲーム状態管理フック |

### 変更ファイル

なし

### 実装詳細

#### useGame.ts

```typescript
import type { GameMode, PlayType, Tile, Guess } from './game.schema';

export function useGame(mode: GameMode, playType: PlayType): {
  answer: Tile[];
  guesses: Guess[];
  currentGuess: Tile[];
  isGameOver: boolean;
  isWon: boolean;
  attempts: number;
  maxAttempts: number;
  submitGuess: () => void;
  addTile: (tile: Tile) => void;
  removeTile: (index: number) => void;
  resetCurrentGuess: () => void;
  resetGame: () => void;
}
```

**内部状態:**

| 状態 | 型 | 初期値 |
|------|------|--------|
| `answer` | `Tile[]` | `generateAnswer(length, allowDuplicates, seed?)` |
| `guesses` | `Guess[]` | `[]` |
| `currentGuess` | `Tile[]` | `[]` |
| `isGameOver` | `boolean` | `false` |
| `isWon` | `boolean` | `false` |

**処理フロー:**

1. **初期化**: `mode` から `GAME_MODES[mode]` で設定取得 → `generateAnswer()` で答え生成
   - `playType === 'daily'` の場合: `getDailySeed()` をシードに使用
   - `playType === 'free'` の場合: シードなし（`Math.random`）
2. **addTile(tile)**: `currentGuess` に `tile` を追加（最大 `length` 個まで）
   - `allowDuplicates === false` の場合: 既に選択済みのタイルは追加不可
3. **removeTile(index)**: `currentGuess` の `index` 番目を削除
4. **resetCurrentGuess()**: `currentGuess` を空配列にリセット
5. **submitGuess()**:
   - `currentGuess.length !== length` の場合は無視
   - `checkGuess(currentGuess, answer)` でヒット・ブロー計算
   - `Guess` オブジェクトを作成し `guesses` に追加
   - `isGameFinished()` で終了判定 → `isGameOver`, `isWon` を更新
   - `currentGuess` をリセット
6. **resetGame()**: 全状態を初期化（新しい答えを生成）

**デイリーチャレンジ固有の処理:**
- デイリーチャレンジは `docs/05_sitemap.md` に記載のとおり**ノーマルモード固定**
- `playType === 'daily'` の場合、`mode` パラメータを `'normal'` として扱う

## 入出力仕様

- Input: `mode: GameMode`, `playType: PlayType`
- Output: ゲーム状態と操作関数を含むオブジェクト（上記シグネチャ参照）

## 受け入れ条件（Definition of Done）

- [ ] `useGame` フックが正しくゲーム状態を管理する
- [ ] 初期化時に `generateAnswer` で答えが生成される
- [ ] デイリーチャレンジ時にシード付き乱数で答えが生成される
- [ ] `addTile` でタイルが `currentGuess` に追加される
- [ ] `allowDuplicates === false` のとき、同じタイルの重複追加が拒否される
- [ ] `removeTile` で指定位置のタイルが削除される
- [ ] `submitGuess` で正しくヒット・ブロー判定が行われる
- [ ] ゲーム終了判定が正しく動作する（勝利・敗北）
- [ ] `resetGame` で全状態がリセットされ、新しい答えが生成される
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: フリープレイ・ノーマルモードで初期化 → 4桁の答えが生成される
- 正常系: タイルを4つ追加して `submitGuess` → `guesses` に1件追加される
- 正常系: 全ヒットの推測を送信 → `isGameOver: true, isWon: true`
- 正常系: 最大試行回数まで推測送信 → `isGameOver: true, isWon: false`
- 正常系: `resetGame` → 新しいゲームが開始される
- 正常系: デイリーチャレンジ → 同じ日に同じ答えが生成される
- 異常系: `currentGuess` が未完了（桁数不足）で `submitGuess` → 何も起きない
- 正常系: `allowDuplicates === false` で同一タイル追加 → 追加されない

## 依存タスク

- T-006（localStorageサービス — デイリーチャレンジのプレイ済み判定で将来使用）
- T-007（ゲームコアロジック — `generateAnswer`, `checkGuess`, `isGameFinished` を使用）

## 要確認事項

- ~~デイリーチャレンジのモード~~ → **確定: ノーマルモード固定**
- ~~途中状態の保存~~ → **確定: 保存しない。ブラウザを閉じると状態は失われる。**
