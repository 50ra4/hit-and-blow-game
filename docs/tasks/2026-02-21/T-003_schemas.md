# T-003: Zodスキーマ定義

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/8

## 目的

Zodによるスキーマ定義と型推論を行い、アプリ全体で使用する型の基盤を構築する。

## 背景

- `docs/02_architecture.md` セクション5「スキーマ設計（Zod）」
- `docs/03_database.md` セクション2「データ構造設計」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/features/game/game.schema.ts` | ゲーム関連のZodスキーマ・型定義 |
| `src/features/stats/stats.schema.ts` | 統計関連のZodスキーマ・型定義 |
| `src/i18n/i18n.schema.ts` | 設定関連のZodスキーマ・型定義 |

### 変更ファイル

なし

### 実装詳細

#### game.schema.ts

`docs/02_architecture.md` セクション5.1 のコードを実装する。

**スキーマ一覧:**

| スキーマ名 | フィールド | 備考 |
|-----------|-----------|------|
| `TileSchema` | `id`, `color`, `svgPath` | タイル定義 |
| `GameModeSchema` | enum値 | `GAME_MODE_ID_VALUES` からenum生成 |
| `PlayTypeSchema` | enum値 | `PLAY_TYPE_ID_VALUES` からenum生成 |
| `GuessSchema` | `tiles`, `hits`, `blows`, `timestamp` | 1回の推測結果 |
| `GameStateSchema` | `mode`, `playType`, `answer`, `guesses`, `currentGuess`, `isGameOver`, `isWon`, `attempts`, `maxAttempts` | ゲーム状態 |
| `GameResultSchema` | `mode`, `playType`, `isWon`, `attempts`, `timestamp` | ゲーム結果 |
| `ModeConfigSchema` | `id`, `nameKey`, `length`, `allowDuplicates`, `maxAttempts`, `unlockCondition?` | モード設定 |

**エクスポートする型:**

```typescript
export type Tile = z.output<typeof TileSchema>;
export type GameMode = z.output<typeof GameModeSchema>;
export type PlayType = z.output<typeof PlayTypeSchema>;
export type Guess = z.output<typeof GuessSchema>;
export type GameState = z.output<typeof GameStateSchema>;
export type GameResult = z.output<typeof GameResultSchema>;
export type ModeConfig = z.output<typeof ModeConfigSchema>;
```

#### stats.schema.ts

`docs/02_architecture.md` セクション5.2 および `docs/03_database.md` セクション2.2 のコードを実装する。

**スキーマ一覧:**

| スキーマ名 | フィールド | 備考 |
|-----------|-----------|------|
| `ModeStatsSchema` | `plays`, `wins`, `winRate`, `averageAttempts`, `bestAttempts` | モード別統計 |
| `DailyRecordSchema` | `date`, `mode`, `isWon`, `attempts` | デイリー記録 |
| `StatsSchema` | `version`, `totalPlays`, `totalWins`, `winRate`, `averageAttempts`, `bestAttempts`, `modeStats`, `unlockedModes`, `dailyHistory`, `lastPlayed` | 統計全体 |

**注意:**
- `docs/02_architecture.md` では `dailyHistory` の `max` が `7` だが、`docs/03_database.md` では `max` が `30`。`docs/03_database.md` の `30` を採用すること（データベース設計書が優先）。
- 各フィールドに `.default()` を設定し、初期値を明示する。
- `unlockedModes` のデフォルトは `['beginner', 'normal', 'hard']`。

**エクスポートする型:**

```typescript
export type ModeStats = z.output<typeof ModeStatsSchema>;
export type DailyRecord = z.output<typeof DailyRecordSchema>;
export type Stats = z.output<typeof StatsSchema>;
```

#### i18n.schema.ts

`docs/02_architecture.md` セクション5.3 のコードを実装する。

**スキーマ一覧:**

| スキーマ名 | フィールド | 備考 |
|-----------|-----------|------|
| `SettingsSchema` | `language`, `theme`, `soundEnabled`, `tutorialCompleted` | ユーザー設定 |

**エクスポートする型:**

```typescript
export type Settings = z.output<typeof SettingsSchema>;
```

## 入出力仕様

- Input: `@/consts/` の定数値（`TILE_ID_VALUES`, `GAME_MODE_ID_VALUES` 等）
- Output: ZodスキーマオブジェクトおよびTypeScript型

## 受け入れ条件（Definition of Done）

- [ ] 3つのスキーマファイルが作成されている
- [ ] 全スキーマがZodで正しく定義されている
- [ ] `z.output` / `z.input` による型推論が正しくエクスポートされている
- [ ] `StatsSchema` のデフォルト値が `docs/03_database.md` と一致する
- [ ] `dailyHistory` の `max` が `30` である
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: 正しいデータをparseしてエラーが出ないこと
- 異常系: 不正なデータをparseしてZodErrorが発生すること
- 正常系: デフォルト値が正しく適用されること（`StatsSchema.parse({})` でデフォルト値が入ること）

## 依存タスク

- T-002（定数定義 — `TILE_ID_VALUES`, `GAME_MODE_ID_VALUES` 等を使用）

## 要確認事項

- ~~dailyHistory 最大件数の不一致~~ → **確定: 30件（docs/03_database.md を優先）**
- ~~ModeStatsSchema の .default(0) 有無~~ → **確定: `.default(0)` を付ける（docs/03_database.md を優先）**
