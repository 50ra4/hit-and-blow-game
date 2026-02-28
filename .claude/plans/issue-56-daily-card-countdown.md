# Issue #56: デイリーカードにカウントダウンタイマーとルール詳細を追加

## 意図

ホーム画面のデイリーチャレンジカードが、モックデザイン（`docs/06_mock_design.html`）に対して以下の情報を欠いている。

- 「全員共通」バッジ
- 当日ルール表示（ノーマルモード｜4桁・重複なし・8回まで）
- 次のチャレンジまでのカウントダウンタイマー（HH:MM:SS、毎秒更新）

ユーザーがデイリーの内容を確認してから参加判断できるよう、これらの情報をカードに追加する。

## 選択理由

- **カウントダウンフック (`useCountdown`) を `src/hooks/` に独立**: `useDailyPlayed` は「プレイ済み判定」の責務を持つため、タイマーロジックを混在させない。汎用フックとして `src/hooks/` に配置。
- **date-fns を使用**: プロジェクトで既に使用しており、`startOfTomorrow` で翌日00:00:00を簡潔に取得できる。
- **ルール表示は `GAME_MODES['normal']` から直接取得**: デイリーは常にノーマルモード固定（`DailyGamePage.tsx` の `DAILY_MODE = 'normal'` と一致）。ハードコードせずに定数から派生。
- **i18n対応**: テキストはすべて翻訳キー経由。ルール説明テキストのみ新規追加、バッジ・タイマーラベルも追加。

## タスク分割

### Task 1: `useCountdown` カスタムフックの作成

- ファイル: `src/hooks/useCountdown.ts`
- 処理: 翌日00:00:00（`date-fns` の `startOfTomorrow`）までの残り時間を `HH:MM:SS` 形式で返す
- `setInterval` で毎秒更新、アンマウント時に `clearInterval` でクリーンアップ
- 深夜0時を過ぎたとき（残り時間 ≤ 0）は再計算して次の翌日を対象にする

### Task 2: i18n翻訳キーの追加

- ファイル: `src/i18n/locales/ja.json`, `src/i18n/locales/en.json`
- 追加キー:
  - `home.dailyAllCommon` → 「全員共通」/ "For Everyone"
  - `home.dailyCountdown` → 「次のチャレンジまで {{time}}」/ "Next challenge in {{time}}"
  - `home.dailyRuleLabel` → ルール説明文（「ノーマルモード｜4桁・重複なし・8回まで」形式）

### Task 3: `HomePage` デイリーカードの更新

- ファイル: `src/pages/HomePage/HomePage.tsx`
- 変更:
  - `useCountdown` フックを利用
  - `GAME_MODES['normal']` からルール情報を取得
  - デイリーカード内に「全員共通」バッジ、ルール表示、カウントダウンを追加

## 受け入れ条件チェックリスト

- [ ] デイリーカードに「全員共通」バッジが表示される
- [ ] 当日のルール（モード名・桁数・重複可否・最大回数）がカード内に表示される
- [ ] 「次のチャレンジまで HH:MM:SS」形式のカウントダウンが毎秒更新される
- [ ] 深夜0時を過ぎるとタイマーがリセットされる（翌日分のカウントダウンに切り替わる）
- [ ] プレイ済みの場合もタイマーとルールは表示される
