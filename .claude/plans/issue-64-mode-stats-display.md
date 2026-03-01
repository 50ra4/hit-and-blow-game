# Issue #64 実装計画: モード別統計の表示項目追加

## 概要

統計画面のモード別統計カードに「勝利数・平均試行回数・勝率バー」が表示されていない問題を修正する。

## 意図（なぜ必要か）

モックデザイン（`docs/06_mock_design.html`）では「プレイ数・勝利数・勝率+バー・平均試行回数」の4項目が定義されているが、
現在の実装は3項目（プレイ数・勝率・ベスト試行回数）のみを表示している。
ユーザーが各モードの上達度を把握するために必要な情報が欠落しており、設計との乖離を解消する必要がある。

## 現状分析

### データ層（変更不要）

- `stats.schema.ts` の `ModeStatsSchema`: `plays / wins / winRate / averageAttempts / bestAttempts` をすべて定義済み
- `useStats.ts` の `recordGame`: すべての値を正しく計算・保存済み

### UI層（変更対象）

`src/features/stats/StatsPanel/StatsPanel.tsx` のモード別カード部分が3項目のみ表示：

```tsx
// 現在（不足）
<span>{t('stats.totalPlays')}: {modeStat.plays}</span>
<span>{t('stats.winRate')}: {modeStat.winRate.toFixed(1)}%</span>
<span>{t('stats.bestAttempts')}: {modeStat.bestAttempts ?? t('stats.noData')}</span>
```

### i18n（変更不要）

既存キーで対応可能:

- `stats.totalPlays` / `stats.totalWins` / `stats.winRate` / `stats.avgAttempts` / `stats.noData`

## 選択理由

- `useStats.ts` / `stats.schema.ts` は変更しない → 既にデータが揃っているため変更は過剰
- `bestAttempts` はモード別カードから除外 → 受け入れ条件の4項目（plays/wins/winRate/avgAttempts）に含まれていないため
- i18n ファイルは変更しない → 既存キーで賄える

## 変更ファイル

| ファイル                                       | 変更内容                   |
| ---------------------------------------------- | -------------------------- |
| `src/features/stats/StatsPanel/StatsPanel.tsx` | モード別カードのUI修正のみ |

## タスク

### Task 1: StatsPanel のモード別カードUI修正

**変更前**（flex wrap、3項目）:

```tsx
<div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/70">
  <span>
    {t('stats.totalPlays')}: {modeStat.plays}
  </span>
  <span>
    {t('stats.winRate')}: {modeStat.winRate.toFixed(1)}%
  </span>
  <span>
    {t('stats.bestAttempts')}: {modeStat.bestAttempts ?? t('stats.noData')}
  </span>
</div>
```

**変更後**（grid 2列、4項目 + 勝率バー）:

```tsx
<div className="space-y-2 text-sm text-white/70">
  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
    <span>
      {t('stats.totalPlays')}: {modeStat.plays}
    </span>
    <span>
      {t('stats.totalWins')}: {modeStat.wins}
    </span>
    <span>
      {t('stats.avgAttempts')}:{' '}
      {modeStat.wins === 0
        ? t('stats.noData')
        : `${modeStat.averageAttempts.toFixed(1)}${t('stats.attempts', { count: 1 }).replace('1', '')}`}
    </span>
  </div>
  {/* 勝率 + プログレスバー */}
  <div>
    <div className="mb-1 flex justify-between">
      <span>{t('stats.winRate')}</span>
      <span>
        {modeStat.plays === 0
          ? t('stats.noData')
          : `${modeStat.winRate.toFixed(1)}%`}
      </span>
    </div>
    <div className="h-2 w-full rounded-full bg-white/10">
      <div
        className="h-2 rounded-full bg-indigo-400 transition-all"
        style={{ width: `${modeStat.winRate}%` }}
      />
    </div>
  </div>
</div>
```

**補足**: `style={{ width }}` はサンプル。0〜100%までを10%ごとに1の位切り捨てで表示。

### コミット

```
fix: [ISSUE 64] モード別統計カードに勝利数・平均試行・勝率バーを追加

モード別統計カードが設計書（docs/06_mock_design.html）の4項目
（プレイ数・勝利数・勝率+バー・平均試行回数）を表示していなかった。
データ層（useStats / ModeStatsSchema）はすでに値を保持しているため、
UI側のみ修正する。
```

## 受け入れ条件

- [ ] モード別統計カードに「プレイ数・勝利数・勝率・平均試行回数」の4項目が表示される
- [ ] 勝率の下に水平プログレスバーが表示され、勝率に応じた幅で塗りつぶされる
- [ ] プレイ実績がないモードは「未プレイ」状態として表示される（ゼロ除算しない）
- [ ] 平均試行回数は小数点1桁で表示される（例: 「5.3」）
