# 03_database.md - データストレージ設計書

## 1. データストレージ概要

### 1.1 ストレージ方式

**localStorage（ブラウザローカルストレージ）**を使用

#### 選定理由
- サーバー不要（月額費用ゼロ）
- 認証不要（個人情報を扱わない）
- オフライン動作可能
- シンプルな実装

#### 制約
- 容量制限：5MB程度（ブラウザ依存）
- ドメイン単位で分離（クロスオリジン不可）
- データ永続性：ユーザーがブラウザキャッシュを削除すると消失

---

## 2. データ構造設計

### 2.1 ストレージキー一覧

| キー | 型 | 内容 | スキーマ |
|------|------|------|----------|
| `tile-hab-stats` | `Stats` | 統計情報（プレイ記録・モード解放状況） | `StatsSchema` |
| `tile-hab-settings` | `Settings` | ユーザー設定（言語・テーマ・チュートリアル完了） | `SettingsSchema` |
| `tile-hab-daily-played` | `string` | デイリーチャレンジの最終プレイ日（YYYY-MM-DD形式） | - |

### 2.2 Stats データ構造

#### スキーマ定義（Zod）

```typescript
// features/stats/stats.schema.ts
import { z } from 'zod';
import { GameModeSchema } from '@/features/game/game.schema';

// ModeStats スキーマ
export const ModeStatsSchema = z.object({
  plays: z.number().int().min(0).default(0),
  wins: z.number().int().min(0).default(0),
  winRate: z.number().min(0).max(100).default(0),
  averageAttempts: z.number().min(0).default(0),
  bestAttempts: z.number().int().min(0).default(0)
});

// DailyRecord スキーマ
export const DailyRecordSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mode: GameModeSchema,
  isWon: z.boolean(),
  attempts: z.number().int().min(1)
});

// Stats スキーマ
export const StatsSchema = z.object({
  version: z.string().default('1.0'),
  totalPlays: z.number().int().min(0).default(0),
  totalWins: z.number().int().min(0).default(0),
  winRate: z.number().min(0).max(100).default(0),
  averageAttempts: z.number().min(0).default(0),
  bestAttempts: z.number().int().min(0).default(0),
  modeStats: z.record(GameModeSchema, ModeStatsSchema).default({}),
  unlockedModes: z.array(GameModeSchema).default(['beginner', 'normal', 'hard']),
  dailyHistory: z.array(DailyRecordSchema).max(30).default([]),
  lastPlayed: z.string().default('')
});

// 型推論
export type ModeStats = z.output<typeof ModeStatsSchema>;
export type DailyRecord = z.output<typeof DailyRecordSchema>;
export type Stats = z.output<typeof StatsSchema>;
```

#### データ例

```json
{
  "version": "1.0",
  "totalPlays": 50,
  "totalWins": 35,
  "winRate": 70.0,
  "averageAttempts": 6.5,
  "bestAttempts": 3,
  "modeStats": {
    "beginner": {
      "plays": 10,
      "wins": 9,
      "winRate": 90.0,
      "averageAttempts": 4.2,
      "bestAttempts": 3
    },
    "normal": {
      "plays": 25,
      "wins": 18,
      "winRate": 72.0,
      "averageAttempts": 6.1,
      "bestAttempts": 4
    }
  },
  "unlockedModes": ["beginner", "normal", "hard", "expert"],
  "dailyHistory": [
    {
      "date": "2025-01-15",
      "mode": "normal",
      "isWon": true,
      "attempts": 6
    }
  ],
  "lastPlayed": "2025-01-15T14:30:00.000Z"
}
```

### 2.3 Settings データ構造

#### スキーマ定義（Zod）

```typescript
// i18n/i18n.schema.ts
import { z } from 'zod';
import { LANGUAGE_ID_VALUES } from '@/consts/languages';
import { THEME_ID_VALUES } from '@/consts/themes';

// Settings スキーマ
export const SettingsSchema = z.object({
  language: z.enum(LANGUAGE_ID_VALUES as [string, ...string[]]).default('ja'),
  theme: z.enum(THEME_ID_VALUES as [string, ...string[]]).default('system'),
  soundEnabled: z.boolean().default(true),
  tutorialCompleted: z.boolean().default(false)
});

// 型推論
export type Settings = z.output<typeof SettingsSchema>;
```

#### データ例

```json
{
  "language": "ja",
  "theme": "dark",
  "soundEnabled": false,
  "tutorialCompleted": true
}
```

### 2.4 DailyPlayed データ構造

#### 型定義

```typescript
export type DailyPlayed = string; // YYYY-MM-DD形式
```

#### データ例

```json
"2025-01-15"
```

---

## 3. データ操作設計

### 3.1 useLocalStorage フック

```typescript
// services/storage/useLocalStorage.ts
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  schema?: z.ZodSchema<T>,
  migrate?: (data: any) => T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  // 初期化時
  // 1. localStorage から読み込み
  // 2. マイグレーション実行（migrate 関数があれば）
  // 3. Zod バリデーション（schema があれば）
  // 4. エラー時：モーダル表示 → データ削除 → initialValue 返却
  
  // （実装は略）
};
```

### 3.2 useStats フック

```typescript
// features/stats/useStats.ts
export const useStats = (): {
  stats: Stats;
  recordGame: (result: GameResult) => void;
  unlockMode: (mode: GameMode) => void;
  isModeUnlocked: (mode: GameMode) => boolean;
  clearStats: () => void;
} => {
  const [stats, setStats, clearStats] = useLocalStorage<Stats>(
    STORAGE_KEYS.STATS,
    DEFAULT_STATS,
    StatsSchema,
    migrateStats
  );

  const recordGame = (result: GameResult) => {
    // 1. 総プレイ回数・総勝利数を更新
    // 2. モード別統計を更新
    // 3. 平均試行回数・最短試行回数を再計算
    // 4. デイリーチャレンジ履歴を更新（最大30日）
    // 5. 最終プレイ日時を更新
    // （実装は略）
  };

  const unlockMode = (mode: GameMode) => {
    // モードを unlockedModes に追加
    // （実装は略）
  };

  const isModeUnlocked = (mode: GameMode): boolean => {
    return stats.unlockedModes.includes(mode);
  };

  return { stats, recordGame, unlockMode, isModeUnlocked, clearStats };
};
```

### 3.3 useSettings フック

```typescript
// i18n/useSettings.ts
export const useSettings = (): {
  settings: Settings;
  updateLanguage: (language: Settings['language']) => void;
  updateTheme: (theme: Settings['theme']) => void;
  toggleSound: () => void;
  completeTutorial: () => void;
} => {
  const [settings, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS,
    SettingsSchema
  );

  const updateLanguage = (language: Settings['language']) => {
    // （実装は略）
  };

  const updateTheme = (theme: Settings['theme']) => {
    // （実装は略）
  };

  const toggleSound = () => {
    // （実装は略）
  };

  const completeTutorial = () => {
    // （実装は略）
  };

  return {
    settings,
    updateLanguage,
    updateTheme,
    toggleSound,
    completeTutorial
  };
};
```

### 3.4 useDailyPlayed フック

```typescript
// services/storage/useDailyPlayed.ts
export const useDailyPlayed = (): {
  hasPlayedToday: () => boolean;
  markPlayedToday: () => void;
} => {
  const [dailyPlayed, setDailyPlayed] = useLocalStorage<string>(
    STORAGE_KEYS.DAILY_PLAYED,
    ''
  );

  const hasPlayedToday = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return dailyPlayed === today;
  };

  const markPlayedToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setDailyPlayed(today);
  };

  return { hasPlayedToday, markPlayedToday };
};
```

---

## 4. データマイグレーション設計

### 4.1 マイグレーション戦略

バージョン番号（`version`）を見て自動マイグレーションを実行

### 4.2 マイグレーション関数

```typescript
// services/storage/migrations.ts
type MigrationFunction = (oldData: any) => Stats;

const migrations: Record<string, MigrationFunction> = {
  '1.0': (data) => data, // 初期バージョン
  
  // 将来的な例：v1.1へのマイグレーション
  // '1.1': (data) => ({
  //   ...data,
  //   version: '1.1',
  //   newField: 'defaultValue'
  // })
};

export const migrateStats = (data: any): Stats => {
  const currentVersion = data.version || '1.0';
  const targetVersion = '1.0'; // 最新バージョン
  
  // バージョン順にマイグレーションを実行
  // （実装は略）
};
```

---

## 5. エラーハンドリング設計

### 5.1 エラー種別と対応方針

| エラー種別 | 原因 | 対応 |
|-----------|------|------|
| **パースエラー** | JSON.parse失敗（データ破損） | モーダル表示 → データ削除 → 初期化 |
| **バリデーションエラー** | Zodスキーマ不一致 | モーダル表示 → データ削除 → 初期化 |
| **容量超過エラー** | localStorage 5MB制限 | モーダル表示 → 古いデータ削除提案 |
| **読み込み不可** | ブラウザのプライベートモード | モーダル表示 → 機能制限モードで続行 |

### 5.2 エラーモーダル用Store

```typescript
// services/storage/storageErrorHandler.ts
type StorageError = {
  key: string;
  error: Error;
  isOpen: boolean;
};

export const showStorageErrorModal = (key: string, error: any): void => {
  // （実装は略）
};

export const useStorageError = (): {
  error: StorageError | null;
  closeError: () => void;
} => {
  // （実装は略）
};
```

### 5.3 エラーメッセージ（i18n）

```json
// i18n/locales/ja.json
{
  "error": {
    "storage": {
      "title": "データ読み込みエラー",
      "message": "保存されたデータ（{{key}}）の読み込みに失敗しました。",
      "description": "データが破損している可能性があります。データを削除して再起動しますか？",
      "clearAndReload": "データを削除して再起動"
    }
  }
}
```

```json
// i18n/locales/en.json
{
  "error": {
    "storage": {
      "title": "Data Loading Error",
      "message": "Failed to load saved data ({{key}}).",
      "description": "The data may be corrupted. Do you want to clear the data and reload?",
      "clearAndReload": "Clear Data and Reload"
    }
  }
}
```

---

## 6. データ容量見積もり

### 6.1 容量計算

| データ | サイズ（概算） |
|--------|--------------|
| **Stats**（30日分のデイリー履歴含む） | 約 3KB |
| **Settings** | 約 200B |
| **DailyPlayed** | 約 20B |
| **合計** | 約 3.5KB |

### 6.2 余裕度
- localStorage制限：約5MB
- 使用量：約3.5KB
- **余裕：99.9%以上**

---

**作成日**：2025年1月  
**バージョン**：1.2


