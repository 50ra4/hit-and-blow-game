# T-016: 統計ページ

## 目的

プレイ記録・統計情報を表示するページを実装する。

## 背景

- `docs/05_sitemap.md` セクション「4. 統計（`/stats`）」
- `docs/01_requirements.md` セクション2.5「統計・記録機能」
- `docs/02_architecture.md` セクション6.2「features/stats/StatsPanel」
- `docs/mock_design.html` — 統計画面デザイン

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/pages/StatsPage.tsx` | 統計ページコンポーネント |
| `src/features/stats/StatsPanel/StatsPanel.tsx` | 統計パネルコンポーネント |

### 変更ファイル

なし（T-013で作成したプレースホルダーを置き換え）

### 実装詳細

#### StatsPage.tsx

```typescript
export default function StatsPage() {
  const { stats, clearStats } = useStats();
  const { t } = useTranslation();

  return <StatsPanel stats={stats} onClear={clearStats} />;
}
```

#### StatsPanel.tsx

```typescript
type StatsPanelProps = {
  stats: Stats;
  onClear: () => void;
};

export function StatsPanel({ stats, onClear }: StatsPanelProps) {
  // ...
}
```

**表示要素（`docs/05_sitemap.md` 参照）:**

**全体統計セクション:**

| 項目 | 値 | 翻訳キー |
|------|------|---------|
| 総プレイ回数 | `stats.totalPlays` | `stats.totalPlays` |
| 総勝利数 | `stats.totalWins` | — |
| 勝率 | `stats.winRate` % | `stats.winRate` |
| 平均クリア回数 | `stats.averageAttempts` | `stats.avgAttempts` |
| 最短クリア回数 | `stats.bestAttempts` | `stats.bestAttempts` |

**モード別統計セクション:**
- 各モードをカード形式で表示（mock_design.html に従い、枠線付きカード）
- 各モード: プレイ回数、勝率、平均試行回数、最短試行回数

**デイリー履歴セクション:**
- 最大30日分のクリア状況をリスト表示
- 日付・結果（成功/失敗）・試行回数

**フッター:**
- 「統計をクリア」ボタン（確認ダイアログ付き）
  - 確認: 「統計データをすべて削除しますか？この操作は取り消せません。」

## 入出力仕様

- Input: なし（localStorageから統計情報を取得）
- Output: 統計画面のReact要素

## 受け入れ条件（Definition of Done）

- [ ] 全体統計（総プレイ回数、勝率、平均クリア回数、最短クリア回数）が表示される
- [ ] モード別統計がタブまたはアコーディオンで表示される
- [ ] デイリー履歴がリスト形式で表示される
- [ ] 「統計をクリア」ボタンが確認ダイアログ付きで動作する
- [ ] 統計データがない場合のempty stateが表示される
- [ ] レスポンシブデザインに対応する
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: 統計データありの場合、正しく表示される
- 正常系: 統計データなしの場合、empty stateが表示される
- 正常系: モード別統計の切替が動作する
- 正常系: 「統計をクリア」 → 確認ダイアログ → OK → データクリア
- 正常系: 「統計をクリア」 → 確認ダイアログ → キャンセル → データ保持

## 依存タスク

- T-009（統計フック — `useStats` を使用）
- T-011（共通UI — `Card`, `Button` を使用）
- T-013（ルーティング）

## 要確認事項

- ~~デイリー履歴の表示形式~~ → **確定: リスト表示**
- ~~モード別統計の表示形式~~ → **確定: カード表示（mock_design.htmlに従う）。ホーム画面のモード選択カードと同様に枠線（border）を付けること。**
