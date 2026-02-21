# T-007: ゲームコアロジック

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/12

## 目的

ゲームの核となるロジック（答え生成、ヒット・ブロー判定、ゲーム終了判定）を純粋関数として実装する。

## 背景

- `docs/02_architecture.md` セクション6.2「features/game/gameLogic.ts」
- `docs/01_requirements.md` セクション2.1「ゲームルール」
- `docs/01_requirements.md` セクション2.2「ゲームモード」
- `docs/01_requirements.md` セクション2.3「プレイタイプ」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/features/game/gameLogic.ts` | ゲームコアロジック（純粋関数群） |

### 変更ファイル

なし

### 実装詳細

#### generateAnswer

```typescript
/**
 * 答えのタイル配列を生成する
 *
 * @param length - 桁数（3, 4, 8）
 * @param allowDuplicates - 重複を許可するか
 * @param seed - シード文字列（デイリーチャレンジ用、省略時はMath.random使用）
 * @returns Tile[] - 答えのタイル配列
 */
export function generateAnswer(
  length: number,
  allowDuplicates: boolean,
  seed?: string
): Tile[]
```

**処理:**
1. `seed` が指定されている場合は `createSeededRandom(seed)` を使用、なければ `Math.random` を使用
2. `AVAILABLE_TILES`（8種類）からランダムに `length` 個を選択
3. `allowDuplicates === false` の場合、重複しないように選択（Fisher-Yatesシャッフルの先頭n個を使用）
4. `allowDuplicates === true` の場合、各桁で独立にランダム選択

#### checkGuess

```typescript
/**
 * 推測に対するヒット数・ブロー数を計算する
 *
 * @param guess - プレイヤーの推測タイル配列
 * @param answer - 正解のタイル配列
 * @returns { hits: number; blows: number }
 */
export function checkGuess(
  guess: Tile[],
  answer: Tile[]
): { hits: number; blows: number }
```

**処理:**
1. **ヒット判定**: 同じ位置にある同じタイル（`guess[i].id === answer[i].id`）をカウント
2. **ブロー判定**: タイルは正解に含まれるが位置が違うものをカウント
   - ヒット分を除外してカウント
   - 重複タイルを正しく処理すること（例: 答え[A,B,A]で推測[A,A,B]の場合、1H2B）

**ヒット・ブロー計算アルゴリズム:**

```
1. ヒットをカウント（位置一致）
2. 答えと推測のタイルID出現回数をカウント（ヒット分を除外）
3. 各タイルIDについて min(答え側の出現回数, 推測側の出現回数) を合計 → ブロー数
```

#### isGameFinished

```typescript
/**
 * ゲーム終了判定
 *
 * @param guesses - これまでの推測一覧
 * @param maxAttempts - 最大試行回数
 * @param answerLength - 答えの桁数
 * @returns { isFinished: boolean; isWon: boolean }
 */
export function isGameFinished(
  guesses: Guess[],
  maxAttempts: number,
  answerLength: number
): { isFinished: boolean; isWon: boolean }
```

**処理:**
1. 最新の推測のヒット数が `answerLength` と一致すれば勝利（`isWon: true`, `isFinished: true`）
2. 推測数が `maxAttempts` に達していれば敗北（`isWon: false`, `isFinished: true`）
3. それ以外は未終了（`isFinished: false`, `isWon: false`）

## 入出力仕様

### generateAnswer

| 項目 | 詳細 |
|------|------|
| Input | `length: number`, `allowDuplicates: boolean`, `seed?: string` |
| Output | `Tile[]`（長さ `length`） |

### checkGuess

| 項目 | 詳細 |
|------|------|
| Input | `guess: Tile[]`, `answer: Tile[]` |
| Output | `{ hits: number; blows: number }` |

### isGameFinished

| 項目 | 詳細 |
|------|------|
| Input | `guesses: Guess[]`, `maxAttempts: number`, `answerLength: number` |
| Output | `{ isFinished: boolean; isWon: boolean }` |

## 受け入れ条件（Definition of Done）

- [ ] `generateAnswer` が指定桁数のタイル配列を返す
- [ ] `allowDuplicates === false` のとき、重複のないタイル配列を返す
- [ ] `allowDuplicates === true` のとき、重複を許容する
- [ ] 同じシードで `generateAnswer` を呼び出すと同じ結果になる
- [ ] `checkGuess` が正しいヒット数・ブロー数を返す
- [ ] 重複タイルがある場合のヒット・ブロー計算が正しい
- [ ] `isGameFinished` が全ヒットで勝利と判定する
- [ ] `isGameFinished` が最大試行回数到達で敗北と判定する
- [ ] すべての関数が純粋関数である（副作用なし）
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

### generateAnswer

- 正常系: `generateAnswer(3, false)` → 長さ3、重複なしのタイル配列
- 正常系: `generateAnswer(4, false)` → 長さ4、重複なし
- 正常系: `generateAnswer(4, true)` → 長さ4（重複可能）
- 正常系: `generateAnswer(8, false)` → 長さ8、重複なし（全8種類）
- 正常系: `generateAnswer(8, true)` → 長さ8（重複可能）
- 正常系: `generateAnswer(4, false, "2026-02-21")` を2回呼び出し → 同じ結果
- 正常系: 異なるシードで異なる結果が生成される

### checkGuess

- 正常系: 全ヒット → `{ hits: 4, blows: 0 }`
- 正常系: 全ブロー → `{ hits: 0, blows: 4 }`
- 正常系: ヒット・ブロー混在 → 正しい値
- 正常系: 0ヒット0ブロー → `{ hits: 0, blows: 0 }`
- 正常系: 重複ありモードでの正しい計算

### isGameFinished

- 正常系: 全ヒットの推測 → `{ isFinished: true, isWon: true }`
- 正常系: 最大試行回数到達 → `{ isFinished: true, isWon: false }`
- 正常系: ゲーム続行中 → `{ isFinished: false, isWon: false }`
- 正常系: 推測が0件 → `{ isFinished: false, isWon: false }`

## 依存タスク

- T-002（定数定義 — `AVAILABLE_TILES` を使用）
- T-003（Zodスキーマ — `Tile`, `Guess` 型を使用）
- T-005（ユーティリティ — `createSeededRandom` を使用）

## 要確認事項

なし（仕様書に十分な情報がある）
