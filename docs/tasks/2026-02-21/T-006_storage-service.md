# T-006: localStorageサービス

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/11

## 目的

localStorageの読み書き・Zodバリデーション・マイグレーション・エラーハンドリングを担う汎用サービス層を実装する。

## 背景

- `docs/02_architecture.md` セクション6.3「Services Layer」
- `docs/03_database.md` セクション3「データ操作設計」
- `docs/03_database.md` セクション4「データマイグレーション設計」
- `docs/03_database.md` セクション5「エラーハンドリング設計」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/services/storage/useLocalStorage.ts` | localStorage汎用フック |
| `src/services/storage/migrations.ts` | データマイグレーション関数 |
| `src/services/storage/storageErrorHandler.ts` | ストレージエラーログ出力 |

### 変更ファイル

なし

### 実装詳細

#### useLocalStorage.ts

`docs/03_database.md` セクション3.1 の設計に従う。

**シグネチャ:**

```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  schema?: z.ZodSchema<T>,
  migrate?: (data: unknown) => T
): [T, (value: T | ((prev: T) => T)) => void, () => void]
```

**処理フロー:**

1. `useState` で状態管理
2. 初期化時:
   - `localStorage.getItem(key)` で読み込み
   - `JSON.parse()` でパース
   - `migrate` 関数があればマイグレーション実行
   - `schema` があれば `schema.parse()` でバリデーション
   - エラー時: `console.error(key, error)` でログ出力 → `initialValue` を返却（ユーザー通知なし）
3. 値の更新時:
   - 関数渡し `(prev) => newValue` に対応
   - `JSON.stringify()` して `localStorage.setItem(key, value)` で保存
4. クリア関数:
   - `localStorage.removeItem(key)` で削除
   - 状態を `initialValue` にリセット

**戻り値:**

| インデックス | 型 | 説明 |
|------------|------|------|
| `[0]` | `T` | 現在の値 |
| `[1]` | `(value: T \| ((prev: T) => T)) => void` | 値の更新関数 |
| `[2]` | `() => void` | データクリア関数 |

#### migrations.ts

`docs/03_database.md` セクション4 の設計に従う。

```typescript
type MigrationFunction = (oldData: unknown) => Stats;

const migrations: Record<string, MigrationFunction> = {
  '1.0': (data) => data as Stats,
};

export function migrateStats(data: unknown): Stats {
  // バージョンを確認し、必要に応じてマイグレーション実行
  // 現在はv1.0のみなのでそのまま返却
}
```

#### storageErrorHandler.ts

エラーを `console.error` でログ出力するだけのシンプルな関数。UIへの通知は行わない。

```typescript
export function logStorageError(key: string, error: unknown): void {
  console.error(`[Storage] Error for key "${key}":`, error);
}
```

**エラー対応方針:**

| エラー種別 | 対応 |
|-----------|------|
| JSON.parseエラー | `console.error` → `initialValue` で継続 |
| Zodバリデーションエラー | `console.error` → `initialValue` で継続 |
| 容量超過エラー | `console.error` → サイレント失敗 |
| 読み込み不可（プライベートモード等） | `console.error` → `initialValue` で継続 |

## 入出力仕様

### useLocalStorage

- Input: `key` (ストレージキー), `initialValue` (初期値), `schema?` (Zodスキーマ), `migrate?` (マイグレーション関数)
- Output: `[value, setValue, clearValue]`

## 受け入れ条件（Definition of Done）

- [ ] `useLocalStorage` フックがlocalStorageの読み書きを正しく行う
- [ ] Zodスキーマによるバリデーションが機能する（正常データはパス、不正データはエラー）
- [ ] `migrate` 関数によるマイグレーションが機能する
- [ ] JSON.parseエラー時に `initialValue` が返却される
- [ ] Zodバリデーションエラー時に `initialValue` が返却される
- [ ] `clearValue` でlocalStorageからデータが削除される
- [ ] 関数渡し `setValue(prev => newValue)` が動作する
- [ ] エラー時に `console.error` でログが出力される
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: localStorageに値を保存・読み込みできる
- 正常系: Zodバリデーションを通過する正しいデータがそのまま返される
- 正常系: マイグレーション関数が適用される
- 異常系: 不正なJSON文字列がlocalStorageにある場合、initialValueが返される
- 異常系: Zodバリデーション失敗時、initialValueが返される
- 正常系: clearValue実行後、localStorageからキーが削除される

## 依存タスク

- T-003（Zodスキーマ定義 — バリデーション用スキーマを使用）

## 要確認事項

- ~~storageErrorHandler の実装方式~~ → **確定: `console.error` のみ。UIへの通知なし（サイレント失敗）。React Contextは不要。**
