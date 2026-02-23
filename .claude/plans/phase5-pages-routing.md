# Phase 5 実装計画: ページ・ルーティング

## Context

Phase 1〜4でゲームのコアロジック・フック・UIコンポーネントが完成した。
Phase 5 では、それらを統合してユーザーが実際にゲームをプレイできるよう、ルーティングと各ページを実装する。
現在 `App.tsx` には仮のタイトル表示しかなく、ナビゲーションが存在しない状態。

---

## 作業ブランチ

```
git checkout main && git pull && git checkout -b feature/phase5-pages-routing
```

---

## タスク実装順序

依存関係に従い以下の順序でコミットを切る:

1. **T-013** AppRouter + AppLayout
2. **T-014** HomePage
3. **T-015** GamePage
4. **T-016** StatsPage
5. **T-017** TutorialPage
6. **T-018** TermsPage / PrivacyPage / NotFoundPage

---

## T-013: ルーティング・App統合

### 目的

React Router v7 でルーティングを確立し、ゲームページ以外の共通レイアウトを提供する。

### 新規ファイル

#### `src/AppRouter.tsx`

- `BrowserRouter` で全体を包む
- `lazy` + `Suspense` でコード分割（fallback: `<Loading />`）
- ルート定義:
  - `/` → `HomePage`
  - `/games/free` → `GamePage` (playType="free")
  - `/games/daily` → `GamePage` (playType="daily")
  - `/stats` → `StatsPage`
  - `/tutorial` → `TutorialPage`
  - `/terms` → `TermsPage`
  - `/privacy` → `PrivacyPage`
  - `*` → `NotFoundPage`
- `AppLayout` は `/games/*` 以外のルートに適用（`Route` の `element` として）
  - ゲームページは `GameHeader` を使うため `AppLayout` から除外

#### `src/layouts/AppLayout/AppLayout.tsx`

- ヘッダー: ロゴ（`common.title`）、言語切替ボタン（ja/en）、設定モーダル（テーマ切替）
- メインコンテンツ: `children`（`<Outlet />`）
- フッター: ホームページ（`/`）のみ表示 → `useLocation` で判定
  - リンク: 統計・チュートリアル・利用規約・プライバシーポリシー
- `useDarkMode(settings.theme)` で dark クラスを適用
- `useSettings` で言語・テーマを管理

#### `src/App.tsx` 更新

- `<AppRouter />` を返すように変更

### i18n キー追加

```json
// ja.json / en.json 追加:
"nav": {
  "home": "ホーム",            // Home
  "stats": "統計",             // Stats
  "tutorial": "遊び方",        // How to Play
  "terms": "利用規約",         // Terms of Service
  "privacy": "プライバシー"    // Privacy Policy
},
"settings": {
  "title": "設定",             // Settings
  "theme": "テーマ",           // Theme
  "language": "言語",          // Language
  "sound": "サウンド"          // Sound
},
"theme": {
  "light": "ライト",           // Light
  "dark": "ダーク",            // Dark
  "system": "システム"         // System
}
```

---

## T-014: ホームページ

### 目的

ゲームへのエントリーポイント。初回はチュートリアルへリダイレクト。モード選択で各ゲームページに遷移。

### 新規ファイル: `src/pages/HomePage/HomePage.tsx`

- `useSettings` → `tutorialCompleted` が `false` なら `<Navigate to="/tutorial" replace />`
- `useStats` → `isModeUnlocked(mode)` でモード解放状態を確認
- 表示要素:
  1. ゲームタイトル（大）
  2. デイリーチャレンジボタン（`/games/daily` へ遷移）
  3. モード選択グリッド（5モード）
     - 解放済み: クリックで `/games/free?mode=<id>` へ
     - 未解放: ロック表示（`mode.locked` + unlock条件のモード名）
  4. フッター内に統計・チュートリアル・利用規約・プライバシーリンク（AppLayout フッターと重複しないよう AppLayout 側で表示）

### i18n キー追加

```json
"home": {
  "dailyChallenge": "デイリーチャレンジ",      // Daily Challenge
  "selectMode": "モードを選んでプレイ",         // Select a Mode
  "dailyDesc": "今日の問題に挑戦！",            // Today's Challenge!
  "tutorial": "チュートリアルを見る"            // View Tutorial
}
```

---

## T-015: ゲームページ

### 目的

フリープレイ・デイリーチャレンジのゲームプレイ画面。useGame と既存のゲームUIコンポーネントを統合する。

### 新規ファイル: `src/pages/GamePage/GamePage.tsx`

- props なし（パスから `playType` を判定、クエリから `mode` を取得）
- `useLocation` / `useSearchParams` でパラメータ取得
  - `/games/daily` → `playType = 'daily'`、`mode` は無視（useGame 内で 'normal' 固定）
  - `/games/free?mode=normal` → `playType = 'free'`、`mode = 'normal'`
- バリデーション:
  - `mode` が不正 → `<Navigate to="/" replace />`
  - 未解放モード（`isModeUnlocked` が false） → `<Navigate to="/" replace />`
  - デイリーチャレンジ: `hasPlayedToday()` が true → 結果表示（既プレイ済みメッセージ or 最後の結果）
- ゲーム中: `GameHeader` + `GameBoard` を表示
- ゲーム終了時:
  - `recordGame` でstats記録（初回のみ: `!isRecorded` フラグ）
  - デイリーなら `markPlayedToday()`
  - `ResultDisplay` を表示（onGoHome: `/` へ、onRestart: `resetGame()`）
- 使用フック: `useGame`, `useStats`, `useDailyPlayed`, `useSettings`
- 使用コンポーネント: `GameHeader`, `GameBoard`, `ResultDisplay`
- `GAME_MODES[mode]` から `modeName = t(modeConfig.nameKey)` を取得

---

## T-016: 統計ページ

### 目的

プレイ記録・統計情報の表示と統計クリア。

### 新規ファイル

#### `src/pages/StatsPage/StatsPage.tsx`

- `useStats` から `stats`, `clearStats` を取得
- 「統計をクリア」ボタン → `Modal` で確認ダイアログ → `clearStats()`
- `StatsPanel` に `stats` を渡す

#### `src/features/stats/StatsPanel/StatsPanel.tsx`

- 全体統計セクション（totalPlays, totalWins, winRate, averageAttempts, bestAttempts）
- モード別統計セクション（`GAME_MODE_IDS` のキーでループ、`modeStats[mode]` が存在する場合表示）
- デイリー履歴セクション（`dailyHistory` 最大30件を新しい順に表示）

### i18n キー追加

```json
"stats": {
  // 既存キーに追加:
  "totalWins": "クリア回数",         // Total Wins
  "noData": "データなし",            // No Data
  "dailyHistory": "デイリー履歴",    // Daily History
  "confirmClear": "統計をリセットしますか？この操作は取り消せません。",
  "modeStats": "モード別統計"        // Mode Stats
}
```

---

## T-017: チュートリアルページ

### 目的

5ステップのインタラクティブなゲームルール説明と、簡易ゲーム体験を提供する。
完了時に `completeTutorial()` を呼び出し、ホームへリダイレクト。

### 新規ファイル

#### `src/features/tutorial/useTutorial.ts`

- `step: number` (0〜4) の状態管理
- `next()`, `prev()`, `skip()` 関数
- `isFirst`, `isLast` フラグ

#### `src/features/tutorial/TutorialStep/TutorialStep.tsx`

- 各ステップのコンテンツを受け取って表示
- ページネーションドット（5個）

#### `src/pages/TutorialPage/TutorialPage.tsx`

- `useTutorial`, `useSettings` を使用
- 5ステップ:
  - Step 0: ゲームの目的（テキスト説明）
  - Step 1: ヒット・ブローの説明（具体例: タイル並び例+結果を静的表示）
  - Step 2: タイルの種類紹介（8種類のアイコンを表示、`TILE_SYMBOLS` + `TILE_GRADIENT_STYLES` 使用）
  - Step 3: モード・プレイタイプの説明（`GAME_MODES` の情報を表示）
  - Step 4: 簡易ゲーム体験（3桁・3回・`useGame('beginner', 'free')` 使用）
    - `isGameOver` の場合に「ヒント」として Hit/Blow の意味を補足テキスト表示
    - 各試行後に Hit/Blow の意味を補足するテキストを表示
- 「スキップしてホームへ」→ `completeTutorial()` + `navigate('/')`
- 最終ステップ「完了」→ `completeTutorial()` + `navigate('/')`

### i18n キー追加

```json
"tutorial": {
  "title": "遊び方",
  "step": "{{current}} / {{total}}",
  "next": "次へ",
  "prev": "前へ",
  "skip": "スキップしてホームへ",
  "complete": "ゲームを始める",
  "step0Title": "ゲームの目的",
  "step0Desc": "隠されたタイルの並びを推理しよう！",
  "step1Title": "ヒットとブロー",
  "step1HitDesc": "ヒット: 位置も種類も正解！",
  "step1BlowDesc": "ブロー: 種類は合ってるけど位置が違う！",
  "step2Title": "タイルの種類",
  "step2Desc": "8種類のタイルを使います",
  "step3Title": "モードとプレイタイプ",
  "step3FreeDesc": "フリープレイ: 好きなモードで何度でも",
  "step3DailyDesc": "デイリーチャレンジ: 毎日1回だけ挑戦できる問題",
  "step4Title": "実際に試してみよう！",
  "step4Desc": "3桁・3回まで。やってみよう！",
  "step4HintHit": "ヒット = 位置も種類も正解",
  "step4HintBlow": "ブロー = 種類は合っているが位置が違う"
}
```

---

## T-018: その他ページ

### 目的

法的ページ（利用規約・プライバシーポリシー）と404ページの実装。

### 新規ファイル

#### `src/pages/TermsPage/TermsPage.tsx`

- 利用規約のテキストコンテンツ（スクロール可能な静的ページ）

#### `src/pages/PrivacyPage/PrivacyPage.tsx`

- プライバシーポリシーのテキストコンテンツ（LocalStorage・Google AdSense等）

#### `src/pages/NotFoundPage/NotFoundPage.tsx`

- 404メッセージ + `Button` でホームへ戻る

### i18n キー追加

```json
"notFound": {
  "title": "ページが見つかりません",   // Page Not Found
  "desc": "お探しのページは存在しません。",
  "backToHome": "ホームに戻る"
},
"terms": {
  "title": "利用規約"                // Terms of Service
},
"privacy": {
  "title": "プライバシーポリシー"    // Privacy Policy
}
```

---

## 既存ファイルの変更

| ファイル                   | 変更内容                         |
| -------------------------- | -------------------------------- |
| `src/App.tsx`              | `<AppRouter />` を返すように変更 |
| `src/i18n/locales/ja.json` | 新規キーを追加                   |
| `src/i18n/locales/en.json` | 新規キーを追加                   |

---

## ディレクトリ構造（追加分）

```
src/
├── App.tsx                         （更新）
├── AppRouter.tsx                   （新規）
├── layouts/
│   └── AppLayout/
│       └── AppLayout.tsx           （新規）
├── pages/
│   ├── HomePage/
│   │   └── HomePage.tsx            （新規）
│   ├── GamePage/
│   │   └── GamePage.tsx            （新規）
│   ├── StatsPage/
│   │   └── StatsPage.tsx           （新規）
│   ├── TutorialPage/
│   │   └── TutorialPage.tsx        （新規）
│   ├── TermsPage/
│   │   └── TermsPage.tsx           （新規）
│   ├── PrivacyPage/
│   │   └── PrivacyPage.tsx         （新規）
│   └── NotFoundPage/
│       └── NotFoundPage.tsx        （新規）
└── features/
    ├── stats/
    │   └── StatsPanel/
    │       └── StatsPanel.tsx      （新規）
    └── tutorial/
        ├── useTutorial.ts          （新規）
        └── TutorialStep/
            └── TutorialStep.tsx    （新規）
```

---

## 再利用する既存コード

| 用途                   | ファイル                                                                    |
| ---------------------- | --------------------------------------------------------------------------- |
| ゲームロジック         | `src/features/game/useGame.ts`                                              |
| 統計管理               | `src/features/stats/useStats.ts`                                            |
| 設定管理               | `src/i18n/useSettings.ts`                                                   |
| ダークモード           | `src/hooks/useDarkMode.ts`                                                  |
| デイリープレイ         | `src/services/storage/useDailyPlayed.ts`                                    |
| ゲームUIコンポーネント | `GameHeader`, `GameBoard`, `ResultDisplay`                                  |
| 共通UIコンポーネント   | `Button`, `Card`, `Modal`, `Loading`                                        |
| タイル表示             | `src/features/game/tileDisplay.ts` (`TILE_SYMBOLS`, `TILE_GRADIENT_STYLES`) |
| モード定数             | `src/consts/modes.ts` (`GAME_MODES`, `GAME_MODE_IDS`)                       |

---

## 検証方法

1. `npm run dev` でアプリを起動
2. 各ルートにアクセスして表示確認:
   - `/` → ホーム（初回は `/tutorial` にリダイレクト）
   - `/games/free?mode=normal` → ゲームプレイ
   - `/games/daily` → デイリーチャレンジ
   - `/stats` → 統計ページ
   - `/tutorial` → チュートリアル
   - `/terms`, `/privacy` → 法的ページ
   - `/nonexistent` → 404ページ
3. `npm run build` でビルドエラーなし確認
4. TypeScriptエラーなし確認（`npm run typecheck`）
