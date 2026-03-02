# Issue #102: ゲーム難易度調整

## 意図

難易度ハード以降は運要素が強くクリアがシビアなため、ゲームルールを軟化させてより多くのユーザーに親しみやすい仕様へ変更する。

## 変更内容

### 難易度設定の変更

| モード       | 変更前（桁数/回数） | 変更後（桁数/回数） |
|------------|-------------|-------------|
| ビギナー     | 3桁 / 6回    | 3桁 / **8回**  |
| ノーマル     | 4桁 / 8回    | 4桁 / **10回** |
| ハード       | 4桁 / 10回   | 4桁 / **12回** |
| エキスパート  | 8桁 / 12回   | **6桁** / **16回** |
| マスター     | 8桁 / 15回   | **6桁** / **24回** |

### 解放条件（変更なし）

- ビギナー・ノーマル・ハード: 最初から利用可能
- エキスパート: ノーマルクリア後に解放
- マスター: エキスパートクリア後に解放

## 選択理由

- 変更が必要なのはデータ定数のみであり、ゲームロジックへの修正は不要
- `src/consts/modes.ts` の `GAME_MODES` 定数を変更すれば、参照先（UI表示・ゲームロジック）に自動で反映される
- i18n の説明文は定数から自動生成されておらずハードコードされているため、別途更新が必要

## 変更ファイル一覧

### タスク1: 定数の更新

**`src/consts/modes.ts`**

- `GAME_MODES.beginner.maxAttempts`: 6 → 8
- `GAME_MODES.normal.maxAttempts`: 8 → 10
- `GAME_MODES.hard.maxAttempts`: 10 → 12
- `GAME_MODES.expert.length`: 8 → 6、`maxAttempts`: 12 → 16
- `GAME_MODES.master.length`: 8 → 6、`maxAttempts`: 15 → 24

### タスク2: i18n 日本語テキストの更新

**`src/i18n/locales/ja.json`**

- `mode.beginner_description`: "3桁・重複なし・6回まで。初心者におすすめ" → "3桁・重複なし・8回まで。初心者におすすめ"
- `mode.normal_description`: "4桁・重複なし・8回まで。標準的な難易度" → "4桁・重複なし・10回まで。標準的な難易度"
- `mode.hard_description`: "4桁・重複あり・10回まで。推理力が試される" → "4桁・重複あり・12回まで。推理力が試される"
- `mode.expert_description`: "8桁・重複なし・12回まで" → "6桁・重複なし・16回まで"
- `mode.master_description`: "8桁・重複あり・15回まで" → "6桁・重複あり・24回まで"
- `tutorial.step4Desc`: "3桁・6回まで。やってみよう！" → "3桁・8回まで。やってみよう！" （チュートリアルはビギナーモードを使用するため）

### タスク3: i18n 英語テキストの更新

**`src/i18n/locales/en.json`**

- `mode.beginner_description`: "... 6 tries. ..." → "... 8 tries. ..."
- `mode.normal_description`: "... 8 tries. ..." → "... 10 tries. ..."
- `mode.hard_description`: "... 10 tries. ..." → "... 12 tries. ..."
- `mode.expert_description`: "8 digits, no duplicates, 12 tries" → "6 digits, no duplicates, 16 tries"
- `mode.master_description`: "8 digits, duplicates allowed, 15 tries" → "6 digits, duplicates allowed, 24 tries"
- `tutorial.step4Desc`: "3 tiles, 6 attempts. Give it a try!" → "3 tiles, 8 attempts. Give it a try!"

### タスク4: 要件定義ドキュメントの更新

**`docs/01_requirements.md`**

- 難易度テーブル（line 43-47）を To-Be の値に更新

## 受け入れ条件

- [ ] `src/consts/modes.ts` の各モードの `length` と `maxAttempts` がTo-Beの値になっている
- [ ] `ja.json` と `en.json` のモード説明文がTo-Beの値を反映している
- [ ] チュートリアルの `step4Desc` がビギナーモードの新しい回数（8回）を反映している
- [ ] `docs/01_requirements.md` の難易度テーブルがTo-Beの値になっている
- [ ] `pnpm type-check` が通る
- [ ] `pnpm lint` が通る

## 注意事項

- ゲームロジック（`gameLogic.ts`）への変更は不要（`length` と `maxAttempts` を参照するだけ）
- テストファイルへの変更は不要（モードのIDや構造を参照しており、数値は参照していない）
- `docs/01_requirements.md` line 74 「3桁・3回の簡易版ゲーム」はドキュメントの記述誤りだが、本Issueのスコープ外のため変更しない
