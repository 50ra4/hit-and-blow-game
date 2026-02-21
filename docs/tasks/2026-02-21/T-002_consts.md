# T-002: 定数定義（consts/）

## 目的

アプリケーション全体で使用する定数を `src/consts/` 配下に定義する。Zodスキーマや各機能が参照する基盤となる定数群。

## 背景

- `docs/02_architecture.md` セクション4「定数定義（consts/）」に全ファイルのコードが記載

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/consts/tiles.ts` | タイルID・タイル定義（8種類のシンボル） |
| `src/consts/modes.ts` | ゲームモードID・モード設定（5種類） |
| `src/consts/playTypes.ts` | プレイタイプID（free / daily） |
| `src/consts/languages.ts` | 言語ID（ja / en） |
| `src/consts/themes.ts` | テーマID（light / dark / system） |
| `src/consts/storageKeys.ts` | localStorageキー定数 |
| `src/consts/config.ts` | アプリ設定（名前、バージョン、環境変数） |

### 変更ファイル

なし

### 実装詳細

各ファイルの内容は `docs/02_architecture.md` セクション4に記載のコードをそのまま実装する。

#### tiles.ts

- `TILE_IDS`: 8つのタイルID（star, circle, triangle, square, diamond, spade, heart, club）を `as const` で定義
- `TILE_ID_VALUES`: `Object.values(TILE_IDS)` でZod enum用の配列を生成
- `TILES`: 各タイルのID・色・SVGパスを持つオブジェクト
- `AVAILABLE_TILES`: `Object.values(TILES)` でタイル配列を生成

#### modes.ts

- `GAME_MODE_IDS`: 5つのモードID（beginner, normal, hard, expert, master）を `as const` で定義
- `GAME_MODE_ID_VALUES`: Zod enum用の配列
- `GAME_MODES`: 各モードの設定（id, nameKey, length, allowDuplicates, maxAttempts, unlockCondition）

| モード | length | allowDuplicates | maxAttempts | unlockCondition |
|--------|--------|-----------------|-------------|-----------------|
| beginner | 3 | false | 6 | なし |
| normal | 4 | false | 8 | なし |
| hard | 4 | true | 10 | なし |
| expert | 8 | false | 12 | normal |
| master | 8 | true | 15 | expert |

#### playTypes.ts

- `PLAY_TYPE_IDS`: `{ FREE: 'free', DAILY: 'daily' } as const`
- `PLAY_TYPE_ID_VALUES`: Zod enum用の配列

#### languages.ts

- `LANGUAGE_IDS`: `{ JA: 'ja', EN: 'en' } as const`
- `LANGUAGE_ID_VALUES`: Zod enum用の配列

#### themes.ts

- `THEME_IDS`: `{ LIGHT: 'light', DARK: 'dark', SYSTEM: 'system' } as const`
- `THEME_ID_VALUES`: Zod enum用の配列

#### storageKeys.ts

- `STORAGE_KEYS`: `{ STATS: 'tile-hab-stats', SETTINGS: 'tile-hab-settings', DAILY_PLAYED: 'tile-hab-daily-played' } as const`

#### config.ts

- `APP_CONFIG`: アプリ名、バージョン、LIFF_ID、ADSENSE設定
- 環境変数は `import.meta.env.VITE_*` から取得（デフォルト値は空文字）
- ゲームのシェアURLは `window.location.origin + import.meta.env.BASE_URL` で実行時に動的生成するため、config.ts には含めない

## 入出力仕様

- Input: なし（定数定義のみ）
- Output: 他のモジュールからインポート可能な定数オブジェクト・配列

## 受け入れ条件（Definition of Done）

- [ ] 7つの定数ファイルが `src/consts/` に作成されている
- [ ] 各ファイルが `as const` で型安全に定義されている
- [ ] `TILE_IDS`, `GAME_MODE_IDS`, `PLAY_TYPE_IDS` 等の値が仕様書と一致する
- [ ] `GAME_MODES` の各モード設定値（桁数、重複、回数、解放条件）が仕様書と一致する
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: 各定数が正しい値を持つこと
- 正常系: `AVAILABLE_TILES` が8要素の配列であること
- 正常系: `GAME_MODE_ID_VALUES` が5要素の配列であること
- 正常系: `GAME_MODES.expert.unlockCondition` が `'normal'` であること
- 正常系: `GAME_MODES.master.unlockCondition` が `'expert'` であること

## 依存タスク

- T-001（プロジェクト初期セットアップ）

## 要確認事項

- ~~REPOSITORY URL~~ → **確定: config.ts に REPOSITORY は含めない。シェアURLは `window.location.origin + import.meta.env.BASE_URL` で実行時に動的生成する（T-019参照）。**
