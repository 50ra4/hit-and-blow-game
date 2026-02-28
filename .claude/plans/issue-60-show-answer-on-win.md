# Issue #60: 勝利時も正解タイルを結果画面に表示

## 意図（なぜ必要か）

モックデザイン（`docs/06_mock_design.html`）では勝利・敗北ともに正解タイルを表示する仕様。
現在の実装は敗北時のみ正解タイルを表示しており、仕様と乖離している。
勝利後も正解を確認できることで UX が向上する。

## 変更方針と選択理由

### 変更ファイル

| ファイル                                            | 変更内容                     |
| --------------------------------------------------- | ---------------------------- |
| `src/i18n/locales/ja.json`                          | 勝利時ラベル用 i18n キー追加 |
| `src/i18n/locales/en.json`                          | 勝利時ラベル用 i18n キー追加 |
| `src/features/game/ResultDisplay/ResultDisplay.tsx` | 正解タイル表示条件を修正     |

### 選択理由

- **i18n キー追加**：ハードコード文字列を避け、既存の多言語対応パターンに従う。
  - `result.correct`（勝利時ラベル）= `"正解"` (ja) / `"Answer"` (en) を追加
  - 既存 `result.answer`（`"正解："` / `"Answer:"`）は敗北時ラベルとして継続利用
- **表示条件変更**：`{!isWon && (...)}` を除去し、常に正解タイルを表示。ラベルのみ勝利/敗北で出し分ける。

## タスク

### Task 1: i18n キー追加

- `ja.json` と `en.json` に `result.correct` キーを追加
- ja: `"正解"`
- en: `"Answer"`

### Task 2: ResultDisplay コンポーネント修正

現在の実装（56〜75行目）:

```tsx
{isWon ? (
  <p className="text-lg text-white/70">
    {t('result.attempts', { count: attempts })}
  </p>
) : (
  <div>
    <p className="mb-3 text-sm text-white/60">{t('result.answer')}</p>
    <div className="flex flex-wrap justify-center gap-2">
      {answer.map((tile, index) => (...))}
    </div>
  </div>
)}
```

変更後:

```tsx
<div>
  <p className="mb-3 text-lg text-white/70">
    {t('result.attempts', { count: attempts })}
  </p>
  <p className="mb-3 text-sm text-white/60">
    {isWon ? t('result.correct') : t('result.answer')}
  </p>
  <div className="flex flex-wrap justify-center gap-2">
    {answer.map((tile, index) => (...))}
  </div>
</div>
```

## 受け入れ条件

- [ ] 勝利時の結果画面に「正解」ラベルと正解タイルが表示される
- [ ] 敗北時の結果画面に「正解：」ラベルと正解タイルが引き続き表示される
- [ ] フリープレイ・デイリーチャレンジ両方で動作する
