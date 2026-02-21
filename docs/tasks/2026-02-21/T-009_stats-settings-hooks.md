# T-009: 統計・設定フック

## 目的

ゲーム統計（useStats）、ユーザー設定（useSettings）、デイリープレイ記録（useDailyPlayed）の状態管理フックを実装する。

## 背景

- `docs/03_database.md` セクション3.2「useStats フック」
- `docs/03_database.md` セクション3.3「useSettings フック」
- `docs/03_database.md` セクション3.4「useDailyPlayed フック」
- `docs/02_architecture.md` セクション6.2「features/stats/useStats.ts」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/features/stats/useStats.ts` | 統計管理フック |
| `src/i18n/useSettings.ts` | ユーザー設定管理フック |
| `src/services/storage/useDailyPlayed.ts` | デイリープレイ記録フック |

### 変更ファイル

なし

### 実装詳細

#### useStats.ts

`docs/03_database.md` セクション3.2 の設計に従う。

```typescript
export function useStats(): {
  stats: Stats;
  recordGame: (result: GameResult) => void;
  unlockMode: (mode: GameMode) => void;
  isModeUnlocked: (mode: GameMode) => boolean;
  clearStats: () => void;
}
```

**内部実装:**
- `useLocalStorage` を使用（key: `STORAGE_KEYS.STATS`, schema: `StatsSchema`, migrate: `migrateStats`）
- デフォルト値: `StatsSchema.parse({})` で生成

**recordGame の処理:**

1. `totalPlays` を +1
2. 勝利時: `totalWins` を +1
3. `winRate` を再計算（`totalWins / totalPlays * 100`）
4. 勝利時: `averageAttempts` を再計算
5. 勝利時: `bestAttempts` を更新（最小値を保持）
6. `modeStats[mode]` を更新（plays, wins, winRate, averageAttempts, bestAttempts）
7. デイリーチャレンジの場合: `dailyHistory` に追加（最大30件、古いものから削除）
8. `lastPlayed` を現在時刻のISO文字列で更新
9. 勝利時: `GAME_MODES` の `unlockCondition` を確認し、解放条件を満たしたモードを自動解放

**unlockMode の処理:**
- `unlockedModes` 配列にモードを追加（重複チェック）

**isModeUnlocked の処理:**
- `stats.unlockedModes.includes(mode)` を返す

#### useSettings.ts

`docs/03_database.md` セクション3.3 の設計に従う。

```typescript
export function useSettings(): {
  settings: Settings;
  updateLanguage: (language: Settings['language']) => void;
  updateTheme: (theme: Settings['theme']) => void;
  toggleSound: () => void;
  completeTutorial: () => void;
}
```

**内部実装:**
- `useLocalStorage` を使用（key: `STORAGE_KEYS.SETTINGS`, schema: `SettingsSchema`）
- デフォルト値: `SettingsSchema.parse({})` で生成

**updateLanguage:**
- `i18n.changeLanguage(language)` も呼び出す

**updateTheme:**
- 設定を更新するのみ（実際のテーマ適用はT-010の`useDarkMode`で行う）

**toggleSound:**
- `soundEnabled` をトグル

**completeTutorial:**
- `tutorialCompleted` を `true` に設定

#### useDailyPlayed.ts

`docs/03_database.md` セクション3.4 の設計に従う。

```typescript
export function useDailyPlayed(): {
  hasPlayedToday: () => boolean;
  markPlayedToday: () => void;
}
```

**内部実装:**
- `useLocalStorage` を使用（key: `STORAGE_KEYS.DAILY_PLAYED`）
- `hasPlayedToday()`: 保存された日付が今日と一致するか確認
- `markPlayedToday()`: 今日の日付（YYYY-MM-DD）を保存

## 入出力仕様

### useStats

- Input: なし（localStorageから自動読み込み）
- Output: 統計オブジェクトと操作関数

### useSettings

- Input: なし（localStorageから自動読み込み）
- Output: 設定オブジェクトと操作関数

### useDailyPlayed

- Input: なし（localStorageから自動読み込み）
- Output: プレイ済み判定関数とマーク関数

## 受け入れ条件（Definition of Done）

- [ ] `useStats` がlocalStorageから統計情報を読み書きできる
- [ ] `recordGame` で総プレイ回数・勝利数が正しく更新される
- [ ] `recordGame` でモード別統計が正しく更新される
- [ ] `recordGame` で平均クリア回数・最短クリア回数が正しく計算される
- [ ] `recordGame` でデイリー履歴が正しく追加される（最大30件）
- [ ] `recordGame` でモード解放条件が自動判定される（ノーマルクリア→エキスパート解放、エキスパートクリア→マスター解放）
- [ ] `useSettings` がlocalStorageから設定を読み書きできる
- [ ] `updateLanguage` でi18nの言語が切り替わる
- [ ] `completeTutorial` で `tutorialCompleted` が `true` になる
- [ ] `useDailyPlayed` が今日プレイ済みかどうかを正しく判定する
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

### useStats

- 正常系: 初回読み込みでデフォルト統計が返される
- 正常系: `recordGame` で勝利記録 → totalPlays +1, totalWins +1
- 正常系: `recordGame` で敗北記録 → totalPlays +1, totalWins 変化なし
- 正常系: 勝率が正しく計算される
- 正常系: モード別統計が正しく分離される
- 正常系: ノーマルモードクリア後にエキスパートが解放される
- 正常系: `clearStats` で全統計がリセットされる

### useSettings

- 正常系: デフォルト設定（ja, system, true, false）が返される
- 正常系: `updateLanguage('en')` で言語が切り替わる
- 正常系: `completeTutorial()` で `tutorialCompleted` が `true` になる

### useDailyPlayed

- 正常系: 初回は `hasPlayedToday()` が `false`
- 正常系: `markPlayedToday()` 後に `hasPlayedToday()` が `true`

## 依存タスク

- T-003（Zodスキーマ — `StatsSchema`, `GameResultSchema`, `SettingsSchema` を使用）
- T-004（i18n — `i18n.changeLanguage` を使用）
- T-006（localStorageサービス — `useLocalStorage` を使用）

## 要確認事項

- ~~モード解放の「クリア」定義~~ → **確定: 1回でも勝利すれば次のモードが解放される**
- ~~averageAttempts の計算対象~~ → **確定: 勝利時のみ（敗北ゲームは除外）**
