# Issue #58: ホームに「遊んだ記録」クイック統計カードを追加

## 意図（なぜ必要か）

ホーム画面からプレイ実績（総プレイ数・勝利数・勝率）を確認するには統計ページへの画面遷移が必要で、ワンクリックで把握できない。モックデザイン（`docs/06_mock_design.html`）の仕様に合わせ、ホーム画面で直接確認できるようにする。

## 実装方針

### 変更ファイル

| ファイル | 変更種別 |
|---|---|
| `src/pages/HomePage/StatsCard.tsx` | 新規作成 |
| `src/pages/HomePage/HomePage.tsx` | 修正（StatsCard追加） |
| `src/i18n/locales/ja.json` | 修正（翻訳キー追加） |
| `src/i18n/locales/en.json` | 修正（翻訳キー追加） |

### 選択理由

- `StatsCard.tsx` を独立コンポーネントとして切り出すのは、`DailyChallengeCard.tsx` と同様のパターンで単一責任を保つため
- `useStats` は既に `HomePage` で呼び出されているため、props として渡す方式を採用し重複呼び出しを避ける
- i18n キーは既存の `home.*` 名前空間に追加し、統一性を保つ

---

## タスク分割

### Task 1: i18n 翻訳キーを追加

**ファイル**: `src/i18n/locales/ja.json`, `src/i18n/locales/en.json`

**追加キー**:

```json
// ja.json の "home" セクションに追加
"statsCard": "遊んだ記録",
"statsCardEmpty": "まだ記録がありません",
"statsCardTotalPlays": "プレイ数",
"statsCardWins": "勝利数",
"statsCardWinRate": "勝率"
```

```json
// en.json の "home" セクションに追加
"statsCard": "Play Records",
"statsCardEmpty": "No records yet",
"statsCardTotalPlays": "Plays",
"statsCardWins": "Wins",
"statsCardWinRate": "Win Rate"
```

### Task 2: StatsCard コンポーネントを新規作成

**ファイル**: `src/pages/HomePage/StatsCard.tsx`

```tsx
type StatsCardProps = {
  totalPlays: number;
  totalWins: number;
  winRate: number;
};

export function StatsCard({ totalPlays, totalWins, winRate }: StatsCardProps) {
  // ...
}
```

**仕様**:
- `totalPlays === 0` の場合: 空状態メッセージを表示（`home.statsCardEmpty`）
- `totalPlays > 0` の場合: 3列グリッドで総プレイ数・勝利数・勝率（小数1桁%）を表示
- カード全体を `<Link to="/stats">` でラップ
- スタイルは `DailyChallengeCard` に準じたデザイン（`bg-white/10 border border-white/10`）

### Task 3: HomePage に StatsCard を組み込む

**ファイル**: `src/pages/HomePage/HomePage.tsx`

- `useStats()` から `stats` を取得（既存の `isModeUnlocked` 取得部分に追加）
- モード選択セクションの下に `<StatsCard>` を追加

---

## 受け入れ条件

- [ ] ホーム画面に「遊んだ記録」カードが表示される
- [ ] カードに総プレイ数・勝利数・勝率の3項目が表示される
- [ ] プレイ実績がない場合は「まだ記録がありません」等の空状態メッセージが表示される
- [ ] カードをクリックすると `/stats` ページへ遷移する
