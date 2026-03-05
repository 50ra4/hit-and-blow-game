---
globs: src/**/*.ts, src/**/*.tsx
---

# TypeScript コーディング規約

## 基本原則

- **シンプルさ優先**: 過度な抽象化を避ける。読みやすさ > 短いコード。明示的 > 暗黙的。
- **型安全性の確保**: `any` 型禁止。可能な限り型推論を活用。Zod でランタイムバリデーション。
- **保守性の確保**: 単一責任の原則。Pure Component の徹底。副作用の分離。

## パスエイリアス

`@/` を `src/` にマッピング（`tsconfig.json` および `vite.config.ts` で設定済み）。

```typescript
// ✅
import { Button } from '@/components/Button/Button';
// ❌
import { Button } from '../../components/Button/Button';
```

## 命名規則

| 対象                   | ルール                                 | 例                            |
| ---------------------- | -------------------------------------- | ----------------------------- |
| ファイル名             | パスカルケース、`index.tsx` 禁止       | `Button/Button.tsx`           |
| 変数・関数名           | キャメルケース                         | `gameMode`, `calculateScore`  |
| 型・インターフェース名 | パスカルケース、`I` プレフィックス不要 | `GameMode`, `GameState`       |
| グローバル定数         | UPPER_SNAKE_CASE                       | `MAX_SCORE`, `STORAGE_KEY`    |
| ローカル定数           | キャメルケース                         | `defaultStorageData`          |
| コンポーネント名       | パスカルケース、function 宣言          | `export function Button() {}` |

## 関数定義

- **通常の関数**: `const` + アロー関数
- **React コンポーネント**: `function` 宣言

```typescript
// 通常の関数
export const calculateScore = (mode: GameMode, correct: number): number => { ... };

// コンポーネント
export function Button({ label, onClick }: ButtonProps) { ... }
```

## 型定義

- 配列型: `number[]`（`Array<number>` は禁止）
- 型インポート: `import type { GameMode }` を使用（`consistent-type-imports` 対応）
- Zod スキーマ連携: `z.output<typeof Schema>` で型推論。手書き型定義は禁止。
- 定数から Zod スキーマを派生: `Object.values()` → `z.enum()`
- Literal Union 型を活用、`string` 型は避ける
- `enum` 禁止 → オブジェクトマップ + `as const`
- `as const satisfies` で型チェック + 不変性を両立
- オプショナル: `?` 演算子。`undefined` と `null` の混在禁止
- 関数の戻り値の型は複雑な関数では明示する

## イミュータブル操作

```typescript
// ✅ 配列: toSorted(), toReversed(), toSpliced()
// ✅ オブジェクト: スプレッド構文 { ...state, key: value }
// ❌ ミューテーション: sort(), reverse(), push(), 直接代入
```

## 制御構文

- **早期リターン**: else 句を避ける
- **配列アクセス**: `Array.at()` を使用（ブラケット `[]` 禁止）
- **分岐**: Literal Union 型にはオブジェクトマップ（if-else チェーン禁止）
- **三項演算子**: ネスト禁止

## エラーハンドリング

- try-catch で適切にハンドリング
- 構造化ログ: `console.error('エラー内容:', { key, error: error instanceof Error ? error.message : String(error) })`

## Async/Await

- `async/await` を使用（Promise チェーン禁止）
- Floating Promises: `void` 演算子で意図的に無視するか `await` で待機

## 禁止事項

| 禁止                                         | 代替                            |
| -------------------------------------------- | ------------------------------- |
| `any`                                        | `unknown` + 型ガード            |
| `var`                                        | `const` / `let`                 |
| `enum`                                       | オブジェクトマップ + `as const` |
| 配列・オブジェクトのミューテーション         | イミュータブル操作              |
| デフォルトエクスポート（コンポーネント以外） | Named Export                    |
| 通常関数の `function` 宣言                   | アロー関数                      |

## ディレクトリ・ファイル配置

| 種別                                         | 配置先                            |
| -------------------------------------------- | --------------------------------- |
| 再利用可能な UI コンポーネント（副作用なし） | `src/components/<ComponentName>/` |
| 機能固有のコンポーネント・ロジック           | `src/features/<feature>/`         |
| 外部サービス連携                             | `src/services/`                   |
| 汎用カスタムフック                           | `src/hooks/`                      |
| 純粋関数（副作用なし）                       | `src/utils/`                      |
| 定数                                         | `src/consts/`                     |
| ページコンポーネント                         | `src/pages/`                      |

各コンポーネントはディレクトリ内に同名の `.tsx` ファイルを作成（例：`Button/Button.tsx`）。

## 定数定義（consts/）

- `src/consts/` に集約。`as const` で不変。型は `typeof` から派生。
- Zod `enum()` 用配列も同ファイルで `Object.values()` から生成。

## スキーマ配置

機能固有のスキーマは `features/<feature>/<feature>.schema.ts` に配置。

## export する定数・関数の命名

名前は利用側ではなく**定義側のコンテキスト**を反映した具体的な名前にする。

```typescript
// ❌ export const VARIANT_CLASSES = { ... };
// ✅ export const BUTTON_VARIANT_CLASSES = { ... };
```
