---
name: coding-conventions
description: このプロジェクト（ヒットアンドブロー）のコーディング規約を参照・確認する。コード実装前に呼び出すこと。
user-invocable: true
---

# コーディング規約

このプロジェクト（ヒットアンドブロー）のコーディング規約を以下に示す。
コードを書く際は必ずこの規約に従うこと。

## パスエイリアス

`@/` を `src/` にマッピングして使用する（`tsconfig.json` および `vite.config.ts` で設定済み）。

```typescript
// ✅ 良い例
import { Button } from '@/components/Button/Button';
import { GAME_MODES } from '@/consts/modes';

// ❌ 悪い例
import { Button } from '../../components/Button/Button';
```

## 型定義（Zod スキーマ）

型は Zod スキーマから推論する。スキーマと型を同一ファイルで定義する。

```typescript
// ✅ 良い例：z.output<> で型推論
export const GameResultSchema = z.object({ ... });
export type GameResult = z.output<typeof GameResultSchema>;

// Input/Output が異なる場合は両方定義
export type GameResultInput = z.input<typeof GameResultSchema>;
export type GameResultOutput = z.output<typeof GameResultSchema>;

// ❌ 悪い例：手書きの型定義
export type GameResult = {
  mode: string;
  isWon: boolean;
};
```

## 定数定義（consts/）

- 定数はすべて `src/consts/` に集約する
- Zod `enum()` で使う配列も同ファイルで定義する（`Object.values()` で生成）

```typescript
// consts/modes.ts の例
export const GAME_MODE_IDS = {
  BEGINNER: 'beginner',
  NORMAL: 'normal',
} as const;

// Zod enum 用配列（同ファイルに定義）
export const GAME_MODE_ID_VALUES = Object.values(GAME_MODE_IDS);
// → ['beginner', 'normal']
```

## コンポーネント宣言

コンポーネントは `function` 宣言を使用する（アロー関数は使わない）。

```typescript
// ✅ 良い例
export function Button(props: ButtonProps) {
  return <button>{props.children}</button>;
}

// ❌ 悪い例
export const Button = (props: ButtonProps) => {
  return <button>{props.children}</button>;
};
```

## 国際化（i18n）

- テキストはハードコードしない。必ず翻訳キーを使う
- 翻訳キーは `src/i18n/locales/ja.json` と `src/i18n/locales/en.json` の両方に追加する
- キーは階層構造（例：`"game.submit"`, `"mode.beginner"`）

```typescript
// ✅ 良い例
const { t } = useTranslation();
<button>{t('game.submit')}</button>

// ❌ 悪い例
<button>回答する</button>
```

## ディレクトリ・ファイル配置

| 種別 | 配置先 |
|------|--------|
| 再利用可能なUIコンポーネント（副作用なし） | `src/components/<ComponentName>/` |
| 機能固有のコンポーネント・ロジック | `src/features/<feature>/` |
| 外部サービス連携（LocalStorage, LIFF） | `src/services/` |
| 汎用カスタムフック | `src/hooks/` |
| 純粋関数（副作用なし） | `src/utils/` |
| 定数 | `src/consts/` |
| ページコンポーネント | `src/pages/` |

各コンポーネントはディレクトリ内に同名の `.tsx` ファイルを作成する（例：`Button/Button.tsx`）。

## スキーマ配置

機能固有のスキーマは `features/<feature>/<feature>.schema.ts` に配置する。

```
src/features/game/game.schema.ts   → ゲーム関連の型・スキーマ
src/features/stats/stats.schema.ts → 統計関連の型・スキーマ
src/i18n/i18n.schema.ts            → 設定（言語・テーマ）の型・スキーマ
```
