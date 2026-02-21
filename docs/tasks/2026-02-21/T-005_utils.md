# T-005: ユーティリティ関数

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/10

## 目的

ゲームロジックで使用するシード付き乱数生成器とデイリーシード生成関数を実装する。純粋関数として副作用なしで動作する。

## 背景

- `docs/02_architecture.md` セクション6.5「Utils Layer」
- `docs/01_requirements.md` セクション2.3「今日の問題（デイリーチャレンジ）」— 日付をシード値とした疑似乱数生成で実装

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/utils/randomGenerator.ts` | デイリーシード生成・シード付き乱数生成器 |

### 変更ファイル

なし

### 実装詳細

#### randomGenerator.ts

```typescript
/**
 * デイリーシード生成
 * 当日の日付（YYYY-MM-DD形式）を返す
 */
export function getDailySeed(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // "2026-02-21"
}

/**
 * シード付き乱数生成器
 * 同じシードからは常に同じ乱数列を生成する（Pure Function）
 *
 * アルゴリズム: mulberry32（32bit）を使用
 * シード文字列をハッシュ値に変換してから乱数生成
 */
export function createSeededRandom(seed: string): () => number {
  // シード文字列を数値に変換（簡易ハッシュ）
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }

  // mulberry32 アルゴリズム
  return function() {
    h |= 0;
    h = h + 0x6D2B79F5 | 0;
    let t = Math.imul(h ^ h >>> 15, 1 | h);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```

## 入出力仕様

### getDailySeed

- Input: なし
- Output: `string`（`"YYYY-MM-DD"` 形式）

### createSeededRandom

- Input: `seed: string`（任意のシード文字列）
- Output: `() => number`（0以上1未満の疑似乱数を返す関数）

## 受け入れ条件（Definition of Done）

- [ ] `src/utils/randomGenerator.ts` が作成されている
- [ ] `getDailySeed()` が `YYYY-MM-DD` 形式の文字列を返す
- [ ] `createSeededRandom(seed)` が同じシードに対して常に同じ乱数列を返す
- [ ] 生成される乱数が 0 以上 1 未満の範囲内である
- [ ] 純粋関数として実装されている（外部状態に依存しない — getDailySeedのDateを除く）
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: `getDailySeed()` が今日の日付を `YYYY-MM-DD` 形式で返す
- 正常系: 同じシードで `createSeededRandom` を2回呼び出し、同じ乱数列が生成されることを確認
- 正常系: 異なるシードで異なる乱数列が生成されることを確認
- 正常系: 生成される乱数が `0 <= x < 1` の範囲内であることを1000回繰り返して確認
- 正常系: 空文字列のシードでもエラーにならないこと

## 依存タスク

- T-001（プロジェクト初期セットアップ）

## 要確認事項

- ~~乱数生成アルゴリズム~~ → **確定: mulberry32 を使用する**
