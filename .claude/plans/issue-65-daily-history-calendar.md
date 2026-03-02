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

#### 利用する date-fns 関数

```ts
import {
  format,           // 日付を 'yyyy-MM-dd' / 'EEEEE' フォーマット
  subDays,          // 今日から N 日前の Date を生成
  eachDayOfInterval, // 開始〜終了の Date[] を生成
  isToday,          // Date が今日かどうか判定
} from 'date-fns';
import { ja, enUS } from 'date-fns/locale'; // 曜日名のロケール
```

#### 実装手順

1. 上記 `date-fns` 関数と `date-fns/locale` を import に追加する

2. `dailyHistory` 配列を日付キーのルックアップマップに変換するロジックを追加する
   ```ts
   // dailyHistory は DailyRecord[] なので、日付をキーとしたマップに変換
   const historyMap = Object.fromEntries(
     stats.dailyHistory.map((record) => [record.date, record]),
   );
   ```

3. 直近 28 日分（今日含む）の日付配列を `eachDayOfInterval` で生成する
   ```ts
   const today = new Date();
   const days = eachDayOfInterval({
     start: subDays(today, 27),
     end: today,
   });
   // → Date[] 28要素（today-27日 〜 today）
   ```
   - **選択理由**: `eachDayOfInterval` は開始〜終了の全日付を Date[] で返すため、`Array.from` + 手動での日付計算が不要で意図が明確になる

4. 曜日ヘッダーラベルを `days.slice(0, 7)` と `format(day, 'EEEEE', { locale })` で生成する
   ```ts
   // i18next の言語設定に合わせたロケールを選択
   const locale = i18n.language === 'ja' ? ja : enUS;

   // days の最初の7要素の曜日名がそのまま列ヘッダーになる
   // （28日 = 4週間ちょうどなので、先頭7日が列順序と一致）
   const weekdayLabels = days.slice(0, 7).map((day) =>
     format(day, 'EEEEE', { locale }),
   );
   ```
   - **選択理由**: `days[0]` の曜日が左端列の曜日と一致するため、`slice(0, 7)` で導出できる。`Intl.DateTimeFormat` を使わず `date-fns` に統一することで、日付操作ライブラリを一本化できる

5. グリッドのセルカラーを判定するロジックを追加する
   ```ts
   // isToday() で今日判定（date-fns）
   const getDayCellClass = (day: Date, record: DailyRecord | undefined): string => {
     if (record) return record.isWon ? 'bg-green-500' : 'bg-red-500';
     if (isToday(day)) return 'bg-white/10 border border-white/40';
     return 'bg-white/10';
   };
   ```

6. デイリー履歴セクションのレンダリングを変更する
   - 既存のリスト（`sortedDailyHistory.map(...)` 部分）を削除
   - 以下のグリッドに置き換える:
     ```tsx
     {/* 曜日ヘッダー */}
     <div className="mb-1 grid grid-cols-7 gap-1">
       {weekdayLabels.map((label) => (
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
         const titleText = record
           ? `${dayKey} ${record.isWon ? t('result.win') : t('result.lose')} ${t('stats.attempts', { count: record.attempts })}`
           : dayKey;
         return (
           <div
             key={dayKey}
             title={titleText}
             className={`h-6 w-full rounded-sm ${getDayCellClass(day, record)}`}
           />
         );
       })}
     </div>
     ```

7. 表示条件の変更
   - 現在: `sortedDailyHistory.length > 0` の場合のみ表示
   - 変更後: **常に表示**（28 日分のグリッドを常時表示し、未プレイ日はグレーで表示する）
   - 理由: カレンダーグリッドはデータがなくてもカレンダーとして有意義な情報（直近の活動ゼロ）を提示できるため

#### 注意事項

- `DailyRecord.isWon` フィールド名を使用すること（Issue サンプルの `record.isWin` は誤り）
- `w-6`（固定幅）ではなく `w-full`（グリッドセル幅に合わせる）を使用すること
- インラインスタイル禁止（規約準拠）
- `weekdayLabels` はロケール依存のためモジュールレベル定数にしないこと。コンポーネント関数の先頭で `i18n.language` を参照して生成すること
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
- [ ] 曜日ヘッダーが実際の列と対応した曜日で表示される
- [ ] TypeScript 型エラーなし（`pnpm type-check` が通る）
- [ ] Lint エラーなし（`pnpm lint` が通る）
