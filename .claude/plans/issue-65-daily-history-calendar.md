# Issue #65: デイリー履歴カレンダーグリッド表示

## 概要

統計画面のデイリー履歴を、日付テキストのリスト表示から 7 列カレンダーグリッドに変更する。

**意図（なぜ必要か）**: 現在のリスト形式では日付が並ぶだけで時系列の把握が困難。カレンダー形式にすることで、過去のプレイ状況をひと目で把握できる。

**選択理由**: モックデザイン（`docs/06_mock_design.html`）の仕様に準拠。既存の Tailwind CSS グリッド機能（`grid-cols-7`）で実現可能なため、追加ライブラリ不要。

---

## 変更ファイル

| ファイル | 変更内容 |
|--------|---------|
| `src/features/stats/StatsPanel/StatsPanel.tsx` | デイリー履歴セクションをカレンダーグリッドに変更 |

---

## タスク

### Task 1: StatsPanel.tsx のデイリー履歴をカレンダーグリッドに変更

#### 実装手順

1. `date-fns` の `format` を `import` に追加する
2. `dailyHistory` 配列を日付キーのルックアップマップに変換するロジックを追加する
   ```ts
   // dailyHistory は DailyRecord[] なので、日付をキーとしたマップに変換
   const historyMap = Object.fromEntries(
     stats.dailyHistory.map((record) => [record.date, record]),
   );
   ```
3. 直近 28 日分（今日含む）の日付配列を生成するロジックを追加する
   ```ts
   const today = new Date();
   const todayKey = format(today, 'yyyy-MM-dd');
   const days = Array.from({ length: 28 }, (_, i) => {
     const d = new Date(today);
     d.setDate(today.getDate() - (27 - i));
     return d;
   });
   ```
4. 曜日ヘッダーを `Intl.DateTimeFormat` で生成するロジックを追加する
   - i18n ファイルへの追加不要（ブラウザのロケールで自動生成）
   - `i18n.language` を利用してアプリの言語に合わせた曜日名を取得する
   ```ts
   // 2023-01-01（日曜始まり）から7日分の曜日名を生成
   const WEEKDAY_LABELS = Array.from({ length: 7 }, (_, i) => {
     const d = new Date(2023, 0, 1 + i); // 2023-01-01 = 日曜
     return new Intl.DateTimeFormat(i18n.language, { weekday: 'narrow' }).format(d);
   });
   ```
   - **選択理由**: `Intl.DateTimeFormat` を使うことで ja/en 両ロケールの曜日名が i18n キー追加なしに自動対応できる

5. グリッドのセルカラーを判定するロジックを追加する
   ```ts
   // 各セルのクラスを判定
   const getDayCellClass = (dayKey: string, record: DailyRecord | undefined): string => {
     if (record) return record.isWon ? 'bg-green-500' : 'bg-red-500';
     if (dayKey === todayKey) return 'bg-white/10 border border-white/40';
     return 'bg-white/10';
   };
   ```
6. デイリー履歴セクションのレンダリングを変更する
   - 既存のリスト（`sortedDailyHistory.map(...)` 部分）を削除
   - 以下のグリッドに置き換える:
     ```tsx
     {/* 曜日ヘッダー */}
     <div className="grid grid-cols-7 gap-1 mb-1">
       {WEEKDAY_LABELS.map((label) => (
         <div key={label} className="text-center text-xs text-white/40">
           {label}
         </div>
       ))}
     </div>
     {/* 日付グリッド */}
     <div className="grid grid-cols-7 gap-1">
       {days.map((day) => {
         const dayKey = format(day, 'yyyy-MM-dd');
         const record = historyMap[dayKey];
         return (
           <div
             key={dayKey}
             title={/* 日付 + 結果テキスト */}
             className={`h-6 w-full rounded-sm ${getDayCellClass(dayKey, record)}`}
           />
         );
       })}
     </div>
     ```
   - `title` 属性には `t()` を使って日付と結果を表示する
     - 未プレイ: `dayKey` のみ
     - プレイ済み: `` `${dayKey} ${record.isWon ? t('result.win') : t('result.lose')} ${t('stats.attempts', { count: record.attempts })}` ``
7. 表示条件の変更
   - 現在: `sortedDailyHistory.length > 0` の場合のみ表示
   - 変更後: **常に表示**（28 日分のグリッドを常時表示し、未プレイ日はグレーで表示する）
   - 理由: カレンダーグリッドはデータがなくてもカレンダーとして有意義な情報（直近の活動ゼロ）を提示できるため

#### 注意事項

- `DailyRecord.isWon` フィールド名を使用すること（Issue サンプルの `record.isWin` は誤り）
- `w-6`（固定幅）ではなく `w-full`（グリッドセル幅に合わせる）を使用すること
- インラインスタイル禁止（規約準拠）
- `WEEKDAY_LABELS` はモジュールレベルの定数として定義してしまうと言語が固定されるため、コンポーネント内で `i18n.language` を使って生成する
- 既存の `sortedDailyHistory` 変数は削除する（不要になる）

---

## 受け入れ条件

- [ ] デイリー履歴が7列カレンダーグリッドで表示される
- [ ] 勝利日のセルが緑（`bg-green-500`）で表示される
- [ ] 敗北日のセルが赤（`bg-red-500`）で表示される
- [ ] 未プレイ日のセルがグレー（`bg-white/10`）で表示される
- [ ] 今日（未プレイ）が白枠（`border-white/40`）で表示される
- [ ] セルにホバー（またはタッチ）したとき日付と結果が `title` で確認できる
- [ ] 直近28日分（4週間）が表示される
- [ ] 曜日ヘッダー（日〜土）が表示される
- [ ] TypeScript 型エラーなし（`pnpm type-check` が通る）
- [ ] Lint エラーなし（`pnpm lint` が通る）
