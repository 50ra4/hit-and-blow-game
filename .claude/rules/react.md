---
paths:
  - src/**/*.tsx
---

# React コーディング規約

## コンポーネント設計

### Pure Component（`components/`）

- 状態なし、副作用なし、`function` 宣言
- `useState` 禁止
- アロー関数でのコンポーネント定義禁止

### props への参照渡しによる再レンダリング防止

- オブジェクト・関数をインラインで props に渡さない
- 状態に依存しない値はモジュールレベルの定数として定義（UPPER_SNAKE_CASE）
- props を持たないコンポーネントは `React.memo` で囲む

```typescript
// ✅
const ANIMATE_CONFIG = { rotateY: 1800, scale: [1, 1.2, 1] };
export function CoinAnimation() {
  return <motion.div animate={ANIMATE_CONFIG} />;
}

// ❌
<motion.div animate={{ rotateY: 1800 }} />
```

### Feature Component（`features/`）

- カスタムフックでロジックを分離、`function` 宣言

### Page Component（`pages/`）

- 状態管理と子コンポーネントへの props 配布

## Props の型定義

- `type` エイリアスを使用（`interface` 禁止）
- デフォルト値は分割代入で指定

```typescript
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) { ... }
```

## Hooks 使用規約

### useState

- 初期値で型推論。必要なら明示的な型パラメータ。
- 関数型更新 `setScore((prev) => prev + 1)` を使用。

### useEffect - 原則禁止、最終手段

許容されるケース: 外部 API との同期、DOM 操作、サブスクリプション（クリーンアップ必須）

避けるパターン:
| ❌ useEffect で避ける | ✅ 代替 |
|---|---|
| 派生状態の計算 | `useMemo` |
| イベント駆動の処理 | イベントハンドラ |
| 初期化 | `useState(() => loadInitialData())` |

### useCallback / useMemo

- 子コンポーネントに渡す関数は `useCallback`
- 重い計算のメモ化は `useMemo`
- 単純な文字列等の不要なメモ化は禁止

### カスタムフック

- `use` プレフィックス、単一責任
- 複数の責任を1つのフックに混在させない

## イベントハンドラ

- 適切な型定義（`any` 禁止）
- アロー関数で定義

## 条件付きレンダリング

```typescript
// ✅ true のみ: && 演算子
{isNewRecord && <NewRecordAnimation />}

// ✅ true/false 両方: 三項演算子
{isCorrect ? <CorrectIcon /> : <IncorrectIcon />}

// ✅ 早期リターン
if (!result) return <Navigate to="/" replace />;

// ❌ 三項演算子 + null → && を使う
// ❌ show prop でコンポーネント内部に表示制御 → 呼び出し元で条件付きレンダー
```

## リストのレンダリング

- 安定した key を使用（一意な ID 優先、なければ複合キー）
- index のみを key にするのは並び替えがない場合のみ

## パフォーマンス最適化

- 動的インポート: `lazy(() => import('./pages/GamePage'))`
- `React.memo` で不要な再レンダリング防止

## ルーティング規約

- 副作用のない単純な遷移: `<Link>` / `<ButtonLink>`
- 遷移前に副作用がある場合のみ: `useNavigate`

```typescript
// ✅ 単純な遷移
<Link to="/">{t('result.backToHome')}</Link>
// ✅ 副作用あり
const handleComplete = () => { completeTutorial(); navigate('/'); };
// ❌ 副作用なしに useNavigate
```

## セキュリティ

- XSS: React のデフォルトエスケープを利用。`dangerouslySetInnerHTML` 禁止。
- 外部リンク: `rel="noopener noreferrer"` 必須。
