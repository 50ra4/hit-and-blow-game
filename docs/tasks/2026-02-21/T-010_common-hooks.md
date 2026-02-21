# T-010: 汎用カスタムフック

## 目的

テーマ切替（ダークモード）やメディアクエリなど、アプリ全体で再利用される汎用的なカスタムフックを実装する。

## 背景

- `docs/02_architecture.md` セクション6.6「Hooks Layer」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/hooks/useDarkMode.ts` | ダークモード管理フック |
| `src/hooks/useMediaQuery.ts` | メディアクエリ判定フック |

### 変更ファイル

なし

### 実装詳細

#### useDarkMode.ts

```typescript
export function useDarkMode(): {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}
```

**処理:**
1. テーマ設定を参照（`useSettings` から `theme` を取得する、またはpropsで受け取る）
2. `theme === 'system'` の場合: `prefers-color-scheme: dark` メディアクエリで判定
3. `theme === 'dark'` の場合: `isDark = true`
4. `theme === 'light'` の場合: `isDark = false`
5. `isDark` の値に応じて `document.documentElement.classList` に `dark` クラスを追加/削除
6. `toggle()`: ダークモードをトグル
7. `setDark(dark)`: 明示的にダークモードを設定

> **注意**: `useSettings` はT-009で実装される。`useDarkMode` は `theme` の値（`'light' | 'dark' | 'system'`）を引数として受け取る設計にし、`useSettings` への直接依存を避ける。

```typescript
export function useDarkMode(theme: 'light' | 'dark' | 'system'): {
  isDark: boolean;
}
```

**シンプルな実装案（useSettingsへの依存を避ける）:**

```typescript
export function useDarkMode(theme: 'light' | 'dark' | 'system'): {
  isDark: boolean;
} {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return { isDark };
}
```

#### useMediaQuery.ts

```typescript
export function useMediaQuery(query: string): boolean
```

**処理:**
1. `window.matchMedia(query)` でメディアクエリを評価
2. `addEventListener('change', ...)` でリアルタイム更新をリッスン
3. コンポーネントのアンマウント時にリスナーをクリーンアップ
4. SSR対応: `typeof window === 'undefined'` の場合は `false` を返す

## 入出力仕様

### useDarkMode

- Input: `theme: 'light' | 'dark' | 'system'`
- Output: `{ isDark: boolean }`

### useMediaQuery

- Input: `query: string`（CSS メディアクエリ文字列）
- Output: `boolean`（クエリがマッチしているか）

## 受け入れ条件（Definition of Done）

- [ ] `useMediaQuery` がメディアクエリの一致状態を返す
- [ ] `useMediaQuery` がリアルタイムで変化を検知する
- [ ] `useDarkMode` が `theme` 値に応じて `isDark` を返す
- [ ] `useDarkMode` が `document.documentElement` に `dark` クラスを追加/削除する
- [ ] `theme === 'system'` のとき、OSの設定に追従する
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: `useMediaQuery('(min-width: 768px)')` がブラウザ幅に応じた値を返す
- 正常系: `useDarkMode('dark')` → `isDark: true`、`dark` クラスが追加される
- 正常系: `useDarkMode('light')` → `isDark: false`、`dark` クラスが削除される
- 正常系: `useDarkMode('system')` → OSのダークモード設定に追従する

## 依存タスク

- T-001（プロジェクト初期セットアップ）

## 要確認事項

- ~~useDarkMode の設計~~ → **確定: `useDarkMode(theme)` が `{ isDark: boolean }` を返すだけのシンプル設計。`toggle()` / `setDark()` は実装しない。テーマ変更は `useSettings` 経由で行う。**
