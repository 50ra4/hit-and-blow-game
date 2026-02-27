# [FIX-R1] 結果画面への試行履歴トグル追加

## 意図（なぜ必要か）

ゲーム終了後の結果画面（`ResultDisplay`）に推測履歴が表示されず、プレイの振り返りができない。
モックデザイン（`docs/06_mock_design.html`）では「試行履歴を見る ▼」トグルで開閉できるアコーディオンUIが定義されており、実装が漏れている。

関連 Issue: #55

---

## 変更ファイル一覧

| ファイル                                            | 変更種別 | 内容                                                   |
| --------------------------------------------------- | -------- | ------------------------------------------------------ |
| `src/i18n/locales/ja.json`                          | 修正     | `result.historyOpen` / `result.historyClose` キー追加  |
| `src/i18n/locales/en.json`                          | 修正     | 同上（英語）                                           |
| `src/features/game/ResultDisplay/ResultDisplay.tsx` | 修正     | `guesses` prop 追加、トグルUI・`GuessHistory` 組み込み |
| `src/pages/FreeGamePage/FreeGamePage.tsx`           | 修正     | `guesses` を `ResultDisplay` に渡す                    |
| `src/pages/DailyGamePage/DailyGamePage.tsx`         | 修正     | `guesses` を `ResultDisplay` に渡す                    |

---

## タスク分割とコミット計画

### Task 1: i18n キー追加

**受け入れ条件**

- `ja.json` の `result` セクションに以下を追加する
  - `"historyOpen": "試行履歴を見る ▼"`
  - `"historyClose": "閉じる ▲"`
- `en.json` の `result` セクションに以下を追加する
  - `"historyOpen": "View History ▼"`
  - `"historyClose": "Close ▲"`

**コミットメッセージ例**

```
feat: 結果画面の試行履歴トグル用 i18n キーを追加

結果画面に試行履歴を開閉するUIを追加するにあたり、
ボタンラベル用の翻訳キーを ja/en 両言語に追加する。
```

---

### Task 2: ResultDisplay に guesses prop とトグルUIを追加

**選択理由**

- `GuessHistory` は既存コンポーネントをそのまま利用（再発明しない）
- 開閉状態は `ResultDisplay` 内の `useState<boolean>(false)` で管理（呼び出し元の関心事ではない）
- アニメーションは Tailwind の `overflow-hidden` + `max-h` トランジションで実装（CSS ファイル追加不要）

**実装内容**

```tsx
// 追加する型
type ResultDisplayProps = {
  isWon: boolean;
  attempts: number;
  answer: Tile[];
  guesses: Guess[]; // ← 追加
  mode: GameMode;
  playType: PlayType;
  onRestart: () => void;
};

// コンポーネント内
const [isHistoryOpen, setIsHistoryOpen] = useState(false);

// JSX（アクションボタンの前に挿入）
<div className="mb-4">
  <button
    onClick={() => setIsHistoryOpen((prev) => !prev)}
    className="w-full rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10"
  >
    {isHistoryOpen ? t('result.historyClose') : t('result.historyOpen')}
  </button>
  <div
    className={`overflow-hidden transition-all duration-300 ${
      isHistoryOpen ? 'mt-3 max-h-screen' : 'max-h-0'
    }`}
  >
    <GuessHistory guesses={guesses} />
  </div>
</div>;
```

**受け入れ条件**

- `ResultDisplayProps` に `guesses: Guess[]` が追加される
- デフォルト折りたたみ（`isHistoryOpen = false`）でボタンに「試行履歴を見る ▼」が表示される
- ボタンクリックで `GuessHistory` が展開し、テキストが「閉じる ▲」に変わる
- 再クリックで折りたたまれる
- 勝利・敗北ともに動作する

**コミットメッセージ例**

```
feat: ResultDisplay に試行履歴トグルを追加

結果画面でプレイの振り返りができないため、
GuessHistory をアコーディオンUIで表示するトグルボタンを追加する。
```

---

### Task 3: 呼び出し元（FreeGamePage / DailyGamePage）から guesses を渡す

**実装内容**

`FreeGamePage.tsx`（87行目付近）:

```tsx
<ResultDisplay
  isWon={isWon}
  attempts={attempts}
  answer={answer}
  guesses={guesses} // ← 追加
  mode={mode}
  playType={PLAY_TYPE_IDS.FREE}
  onRestart={handleRestart}
/>
```

`DailyGamePage.tsx`（135行目付近）:

```tsx
<ResultDisplay
  isWon={isWon}
  attempts={attempts}
  answer={answer}
  guesses={guesses} // ← 追加
  mode={DAILY_MODE}
  playType={PLAY_TYPE_IDS.DAILY}
  onRestart={handleRestart}
/>
```

**受け入れ条件**

- 両ページで型エラーなく `guesses` が渡される
- TypeScript のビルドが通る

**コミットメッセージ例**

```
fix: FreeGamePage と DailyGamePage から ResultDisplay に guesses を渡す

Task 2 で追加した guesses prop が必須になったため、
両ゲームページの ResultDisplay 呼び出しに guesses を追加する。
```

---

## 注意事項

- `GuessHistory` の props は `guesses: Guess[]` のみ（`maxAttempts` は不要）
- i18n キーは `result.historyOpen` / `result.historyClose` で統一
- Tailwind `max-h-screen` の使用：コンテンツ量がビューポートを超えない前提で許容（代替: `max-h-[9999px]`）
