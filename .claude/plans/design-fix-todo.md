# デザイン修正 TODO リスト

モックデザインとの差異（`docs/07_design_gap_analysis.md`）を元に、修正すべき項目を優先度順に整理。

> 作成日: 2026-02-26

---

## 優先度: 高

### [ ] FIX-G8: ゲームページのヘッダー二重表示を解消

- **問題**: `AppLayout` の共通ヘッダーと `GameHeader` が同時に表示されている
- **対応**: ゲームページ（`DailyGamePage` / `FreeGamePage`）では共通ヘッダーを非表示にする。または `AppLayout` に `hideHeader` prop を追加してゲームページで使用
- **参照**: `src/layouts/AppLayout/AppLayout.tsx`, `src/features/game/GameHeader/GameHeader.tsx`

### [ ] FIX-G1: 試行回数を円形プログレスバーで表示

- **問題**: 試行残回数がテキスト（`current / max`）のみで視覚的な訴求力がない
- **対応**: `GameHeader` または `GameBoard` に円形プログレスバーコンポーネントを追加。残り回数に応じて色が変化（通常=白、残り少=黄、最終=赤）
- **参照**: `src/features/game/GameHeader/GameHeader.tsx`

### [ ] FIX-G2: ゲーム画面のレイアウト順をモックに合わせる

- **問題**: 現在「入力エリア → 履歴」の順だが、モックは「ゲーム情報 → 履歴 → 入力エリア」
- **対応**: `GameBoard` のレイアウトを変更。ゲーム情報パネル（G-3 対応後に統合）を最上部、推測履歴を中段、入力エリアを最下部に配置
- **参照**: `src/features/game/GameBoard/GameBoard.tsx`

### [ ] FIX-R1: 結果画面に試行履歴の折りたたみ表示を追加

- **問題**: 結果画面に推測履歴が表示されず、プレイの振り返りができない
- **対応**: `ResultDisplay` に `GuessHistory` を内包するアコーディオンUIを追加。「試行履歴を見る ▼」トグルで開閉
- **参照**: `src/features/game/ResultDisplay/ResultDisplay.tsx`, `src/features/game/GuessHistory/GuessHistory.tsx`

---

## 優先度: 中

### [ ] FIX-H2: デイリーカードにカウントダウンタイマーとルール詳細を追加

- **問題**: デイリーチャレンジカードに残り時間と当日のルール情報がない
- **対応**: `HomePage` のデイリーカード内に「次のチャレンジまで XX:XX:XX」のカウントダウンと、「ノーマルモード｜4桁・重複なし・8回まで」のルール表示を追加
- **参照**: `src/pages/HomePage/HomePage.tsx`

### [ ] FIX-G3: ゲームヘッダーにモード/桁数/重複情報を表示

- **問題**: プレイ中にゲームルール（モード・桁数・重複可否）が確認できない
- **対応**: `GameHeader` またはゲーム情報パネルに3項目を横並びで表示
- **参照**: `src/features/game/GameHeader/GameHeader.tsx`

### [ ] FIX-H3: ホームに「遊んだ記録」クイック統計カードを追加

- **問題**: ホーム画面からプレイ状況が確認できない（統計ページに遷移が必要）
- **対応**: `HomePage` に `StatsPanel` の一部（総プレイ数・勝利数・勝率）をカードとして表示。クリックで `/stats` に遷移
- **参照**: `src/pages/HomePage/HomePage.tsx`, `src/features/stats/StatsPanel/StatsPanel.tsx`

### [ ] FIX-H4: モードカードに難易度バッジ・色分けボーダー・解説文を追加

- **問題**: モード選択画面でモードの特徴が視覚的に伝わらない
- **対応**: モードカードに難易度バッジ（EASY〜MASTER）・カラーボーダー（モード別）・一言解説テキストを追加
- **参照**: `src/pages/HomePage/HomePage.tsx`

### [ ] FIX-R2: 勝利時も正解タイルを表示

- **問題**: 勝利時に正解タイルが表示されず、確認できない
- **対応**: `ResultDisplay` の勝利時表示にも正解タイルを追加（「正解」ラベル付き）
- **参照**: `src/features/game/ResultDisplay/ResultDisplay.tsx`

### [ ] FIX-R3: 結果スタッツにモード名を追加

- **問題**: 結果画面に試行回数のみで、どのモードでプレイしたか表示されない
- **対応**: 試行回数のスタッツボックスに加えて、モード名のスタッツボックスを横並びで追加
- **参照**: `src/features/game/ResultDisplay/ResultDisplay.tsx`

### [ ] FIX-R6: 結果ボタンをモックに合わせて横並びに変更

- **問題**: 「ホームに戻る」「もう一度」が縦並び、デイリーはホームボタンのみ
- **対応**: 2ボタンを横並び（`flex` + `gap`）に変更。デイリー結果の「もう一度」は「フリープレイで遊ぶ」として表示
- **参照**: `src/features/game/ResultDisplay/ResultDisplay.tsx`

### [ ] FIX-R7: シェアボタンをサービス別3ボタンに変更

- **問題**: シェアボタンが単一コンポーネントで、X/LINE/Threads を区別できない
- **対応**: `ShareButton` を拡張し、X・LINE・Threads の各ボタンをサービスカラーで横並び表示
- **参照**: `src/features/share/ShareButton/ShareButton.tsx`

### [ ] FIX-S1: 統計画面のモード別統計に勝利数・平均試行・勝率バーを追加

- **問題**: 勝利数と平均試行数が表示されず、勝率バーもない
- **対応**: `StatsPanel` のモード別統計カードに4項目表示 + 水平プログレスバーを追加
- **参照**: `src/features/stats/StatsPanel/StatsPanel.tsx`

### [ ] FIX-S2: デイリー履歴をカレンダーグリッド表示に変更

- **問題**: デイリー履歴が日付リストで表示され、カレンダー形式の視覚的な概覧がない
- **対応**: `StatsPanel` のデイリー履歴セクションを7列カレンダーグリッドに変更（勝利=緑・敗北=赤・未プレイ=グレー）
- **参照**: `src/features/stats/StatsPanel/StatsPanel.tsx`

---

## 優先度: 低

### [ ] FIX-L3: フッターにコピーライト表示を追加

- **対応**: `AppLayout` のフッターに `© 2024 Tile Hit and Blow` を追加
- **参照**: `src/layouts/AppLayout/AppLayout.tsx`

### [ ] FIX-L1: ロゴテキストにグラデーションを適用

- **対応**: ロゴの `text-white` を `bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 to-purple-400` 等に変更
- **参照**: `src/layouts/AppLayout/AppLayout.tsx`

### [ ] FIX-H5: チュートリアルボタンの視認性を高める

- **対応**: テキストリンクをグラデーションボタンに格上げし、ヒーローエリア内に配置
- **参照**: `src/pages/HomePage/HomePage.tsx`

### [ ] FIX-G5: 推測履歴を使用済み行のみ表示に変更

- **対応**: `GuessHistory` で `maxAttempts` 分の空行を描画しない（使用済み行のみ表示）
- **参照**: `src/features/game/GuessHistory/GuessHistory.tsx`

### [ ] FIX-G6: タイル選択時のバウンスアニメーションを追加

- **対応**: タイル選択時に `scale 0→0.9→1.1→1` のバウンスアニメーションを CSS または Tailwind で定義
- **参照**: `src/features/game/TilePicker/TilePicker.tsx`, `src/styles/index.css`

### [ ] FIX-A2: タイルに光沢オーバーレイを追加

- **対応**: `TileIcon` のタイル要素に `::before` 疑似要素でグロスオーバーレイを追加
- **参照**: `src/components/TileIcon/TileIcon.tsx`

### [ ] FIX-A3: ページ遷移アニメーションを追加

- **対応**: ルーターの画面切替時に `fadeInUp` アニメーション（`translateY(20px)→0` + `opacity 0→1`）を適用
- **参照**: `src/AppRouter.tsx`, `src/styles/index.css`

### [ ] FIX-A4: モーダル表示アニメーションを追加

- **対応**: `Modal` コンポーネントの表示時に `translateY(-20px)→0` のスライドインアニメーションを追加
- **参照**: `src/components/Modal/Modal.tsx`

### [ ] FIX-G4: 推測履歴セクションにタイトルを追加

- **対応**: `GuessHistory` に「これまでの推測」ラベルを追加
- **参照**: `src/features/game/GuessHistory/GuessHistory.tsx`

### [ ] FIX-R4: 結果アイコンをモックに合わせる（勝利=🏆、敗北=💧）

- **参照**: `src/features/game/ResultDisplay/ResultDisplay.tsx`

### [ ] FIX-T3: チュートリアルのヒット・ブロー説明例をモックに合わせる

- **参照**: `src/features/tutorial/TutorialStep/TutorialStep.tsx`

### [ ] FIX-M1: 設定モーダルにデイリー通知設定を追加

- **対応**: 通知設定のトグルスイッチを追加（Push通知未対応の場合はグレーアウト）
- **参照**: 設定モーダルコンポーネント

### [ ] FIX-M2: 設定モーダルに利用規約・プライバシーポリシーリンクを追加

- **参照**: 設定モーダルコンポーネント

---

## 対応不要（仕様追加・変更として確定）

| ID  | 内容                                     |
| --- | ---------------------------------------- |
| R-8 | 広告バナー追加（`AdBanner`）             |
| S-3 | 統計データ削除機能                       |
| T-1 | チュートリアルを5ステップに拡充          |
| T-2 | 「前へ」ボタン追加                       |
| L-4 | フッターに「記録」リンク追加             |
| A-1 | タイル描画を Unicode 文字から SVG に変更 |
