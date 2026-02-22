---
name: coding-conventions
description: 当プロジェクト（ヒットアンドブロー）のコーディング規約を参照・確認する。コード実装前、実装後に呼び出すこと。
---

# コーディング規約

このプロジェクト（ヒットアンドブロー）のコーディング規約を以下に示す。

コード実装時は、`vercel-react-best-practices` と合わせ、当コーディング規約に必ずこの規約に従うこと。

`vercel-react-best-practices` と競合する場合、より正当性がある方を採用する。

---

## 基本原則

### 1. シンプルさ優先

- 過度な抽象化を避ける
- 読みやすさ > 短いコード
- 明示的 > 暗黙的

### 2. 型安全性の確保

- `any` 型の使用禁止
- 可能な限り型推論を活用
- Zod でランタイムバリデーション

### 3. 保守性の確保

- 単一責任の原則
- Pure Component の徹底
- 副作用の分離

---

## パスエイリアス

`@/` を `src/` にマッピングして使用する（`tsconfig.json` および `vite.config.ts` で設定済み）。

```typescript
// ✅ 良い例
import { Button } from '@/components/Button/Button';
import { GAME_MODES } from '@/consts/modes';

// ❌ 悪い例
import { Button } from '../../components/Button/Button';
```

---

## TypeScript コーディング規約

### 命名規則

#### ファイル名

```
// ✅ 良い例
components/Button/Button.tsx
components/Button/Button.test.tsx
features/game/CoinFlip3D/CoinFlip3D.tsx

// ❌ 悪い例
components/Button/index.tsx // 検索性が低い
components/button.tsx // パスカルケースを使う
```

#### 変数・関数名

```typescript
// ✅ 良い例: キャメルケース
const gameMode = 'tenRounds';
const currentScore = 10;
const calculateScore = () => {};

// ❌ 悪い例
const game_mode = 'tenRounds'; // スネークケース不可
const GameMode = 'tenRounds'; // 変数は小文字始まり
```

#### 型・インターフェース名

```typescript
// ✅ 良い例: パスカルケース
type GameMode = 'tenRounds' | 'survival';
interface GameState {
  score: number;
}

// ❌ 悪い例
type gameMode = 'tenRounds' | 'survival'; // 小文字始まり不可
interface IGameState {} // Iプレフィックス不要
```

#### 定数名

```typescript
// ✅ 良い例: UPPER_SNAKE_CASE（グローバル定数）
const MAX_SCORE = 100;
const STORAGE_KEY = 'hitAndBlowGame';

// ✅ 良い例: キャメルケース（ローカル定数）
const defaultStorageData = {
  /* ... */
};

// ✅ 良い例: as const でリテラル型
const MODE_NAMES = {
  tenRounds: '10回モード',
  survival: 'サバイバルモード',
} as const;
```

#### コンポーネント名

```typescript
// ✅ 良い例: パスカルケース、function宣言
export function Button() {}
export function CoinFlip3D() {}

// ❌ 悪い例
export const button = () => {}; // 小文字始まり不可
export const Button = () => {}; // コンポーネントはfunctionを使用
export default function Button() {} // named export を優先
```

---

### 関数定義

#### 通常の関数（アロー関数）

```typescript
// ✅ 良い例: const + アロー関数
export const calculateScore = (mode: GameMode, correct: number): number => {
  return mode === 'tenRounds' ? correct : correct;
};

// ❌ 悪い例: function宣言
export function calculateScore(mode: GameMode, correct: number): number {
  return mode === 'tenRounds' ? correct : correct;
}
```

#### React コンポーネント（function宣言）

```typescript
// ✅ 良い例: function宣言
export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ 悪い例: アロー関数
export const Button = ({ label, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};
```

---

### 型定義

#### 型インポート（`consistent-type-imports` ルール対応）

```typescript
// ✅ 良い例: 型のみの場合は import type を使用
import type { GameMode } from '@/consts/game';
import type { StorageData } from '@/features/storage/storage.schema';

// ✅ 良い例: 値と型を同時にインポートする場合
import { GAME_MODES } from '@/consts/game';
import type { GameMode } from '@/consts/game';

// ❌ 悪い例: 型に import type を使わない
import { GameMode } from '@/consts/game'; // consistent-type-imports エラー
```

#### Zod スキーマとの連携

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

#### 定数から Zod スキーマを派生させる

```typescript
// ✅ 良い例: 定数（src/consts/）から Zod スキーマを派生させる
import type { GameMode } from '@/consts/game';
import { GAME_MODES } from '@/consts/game';

const gameModeValues = Object.values(GAME_MODES) as [GameMode, ...GameMode[]];
export const GameModeSchema = z.enum(gameModeValues);

// 型は z.output で取得（z.infer ではなく z.output を使用）
export type GameState = z.output<typeof GameStateSchema>;
```

#### Literal Union 型の活用

```typescript
// ✅ 良い例: Literal Union 型
type GameMode = 'tenRounds' | 'survival';

// ❌ 悪い例: string 型
type GameMode = string; // 型安全性が低い
```

#### enum の禁止、オブジェクトマップを使用

```typescript
// ❌ 禁止: enum
enum GameMode {
  TenRounds = 'tenRounds',
  Survival = 'survival',
}

// ✅ 良い例: オブジェクトマップ + as const
const GAME_MODES = {
  tenRounds: 'tenRounds',
  survival: 'survival',
} as const;

type GameMode = (typeof GAME_MODES)[keyof typeof GAME_MODES];
```

#### 定数オブジェクトの不変性

```typescript
// ✅ 良い例: as const satisfies で型チェック + 不変性を両立
export const defaultStorageData = {
  topScores: { tenRounds: [], survival: [] },
  preferences: { darkMode: false, soundEnabled: true },
} as const satisfies StorageData;
```

#### オプショナル型の表現

```typescript
// ✅ 良い例: ? 演算子
type Props = {
  title: string;
  subtitle?: string; // undefined を許容
};

// ✅ 良い例: null 許容（明示的な「値なし」）
type GameState = {
  result: Symbol | null;
};

// ❌ 悪い例: undefined と null の混在
type GameState = {
  result: Symbol | null | undefined; // 混乱を招く
};
```

#### 関数の型定義

```typescript
// ✅ 良い例: アロー関数型
type OnClick = (event: React.MouseEvent) => void;

// ✅ 良い例: 戻り値の型を明示
export const calculateScore = (mode: GameMode, correct: number): number => {
  return mode === 'tenRounds' ? correct : correct;
};

// ❌ 悪い例: 戻り値の型省略（複雑な関数）
export const complexCalculation = (a: number, b: number) => {
  // 戻り値の型を明示すること
  return a + b * 2;
};
```

---

### イミュータブル操作

#### 配列操作

```typescript
// ✅ 良い例: イミュータブルメソッド
const sorted = scores.toSorted((a, b) => b - a);
const reversed = items.toReversed();
const sliced = items.toSpliced(0, 1, newItem);

// ❌ 悪い例: ミューテーション
scores.sort((a, b) => b - a); // 元の配列を変更
items.reverse();
```

#### オブジェクト操作

```typescript
// ✅ 良い例: スプレッド構文
const updated = { ...state, score: state.score + 1 };

// ❌ 悪い例: 直接変更
state.score += 1; // 元のオブジェクトを変更
```

#### ネストしたオブジェクトの更新

```typescript
// ✅ 良い例
const updated = {
  ...data,
  topScores: {
    ...data.topScores,
    tenRounds: [...data.topScores.tenRounds, newScore],
  },
};

// ❌ 悪い例
data.topScores.tenRounds.push(newScore); // ミューテーション
```

---

### 制御構文

#### 早期リターン（else 句を避ける）

```typescript
// ✅ 良い例: 早期リターンで else を避ける
export const getLabel = (score: number): string => {
  if (score === 0) return '未プレイ';
  return `${String(score)}点`;
};

// ❌ 悪い例: else 句
export const getLabel = (score: number): string => {
  if (score === 0) {
    return '未プレイ';
  } else {
    return `${String(score)}点`;
  }
};
```

#### 配列のインデックスアクセス

```typescript
// ✅ 良い例: Array.at() を使用
const first = scores.at(0);
const last = scores.at(-1);

// ❌ 悪い例: ブラケットによるインデックスアクセス
const first = scores[0];
const last = scores[scores.length - 1];
```

#### Literal Union 型の分岐

```typescript
// ✅ 良い例: オブジェクトマップ
const MODE_NAMES = {
  tenRounds: '10回モード',
  survival: 'サバイバルモード',
} as const;

const modeName = MODE_NAMES[mode];

// ❌ 悪い例: if-else チェーン
let modeName: string;
if (mode === 'tenRounds') {
  modeName = '10回モード';
} else if (mode === 'survival') {
  modeName = 'サバイバルモード';
}
```

#### 三項演算子の使用

```typescript
// ✅ 良い例: シンプルな条件
const label = isCorrect ? "正解" : "不正解";

// ✅ 良い例: JSX での条件レンダリング
{isNewRecord && <NewRecordAnimation />}

// ❌ 悪い例: ネストした三項演算子
const label = isCorrect
  ? score > 10
    ? "素晴らしい"
    : "良い"
  : "残念";  // 読みにくい
```

---

### エラーハンドリング

```typescript
// ✅ 良い例: try-catch
export const loadStorageData = (): StorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStorageData;

    const parsed = JSON.parse(raw);
    const validated = StorageDataSchema.parse(parsed);
    return validated;
  } catch (error) {
    console.error('LocalStorage データ読み込みエラー:', error);
    return defaultStorageData;
  }
};

// ✅ 良い例: 構造化ログ
console.error('データ保存エラー:', {
  key: STORAGE_KEY,
  error: error instanceof Error ? error.message : String(error),
});

// ❌ 悪い例: 情報不足
console.error('エラー'); // 何のエラーか不明
```

---

### Async/Await

```typescript
// ✅ 良い例: async/await
export const shareResult = async (text: string): Promise<void> => {
  try {
    await navigator.share({ text });
  } catch (error) {
    console.error('シェアエラー:', error);
    throw error;
  }
};

// ❌ 悪い例: Promise チェーン
export const shareResult = (text: string): Promise<void> => {
  return navigator.share({ text }).catch((error) => {
    console.error('シェアエラー:', error);
    throw error;
  });
};
```

#### Floating Promises（`no-floating-promises` ルール対応）

```typescript
// ✅ 良い例: void 演算子で意図的に戻り値を無視
const handleShare = () => {
  void shareResult(text);
};

// ✅ 良い例: await で待機
const handleShare = async () => {
  await shareResult(text);
};

// ❌ 悪い例: Promise を無視（ESLint エラー）
const handleShare = () => {
  shareResult(text); // @typescript-eslint/no-floating-promises
};
```

---

## React コーディング規約

### コンポーネント設計

#### Pure Component（`components/`）

```typescript
// ✅ 良い例: 状態なし、副作用なし、function宣言
type Props = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function Button({ label, onClick, disabled = false }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="coin-btn"
    >
      {label}
    </button>
  );
}

// ❌ 悪い例: useState を使用
export function Button({ label, onClick }: Props) {
  const [clicked, setClicked] = useState(false);  // Pure Component で状態を持たない
  // ...
}

// ❌ 悪い例: アロー関数
export const Button = ({ label, onClick }: Props) => {
  return <button onClick={onClick}>{label}</button>;
};
```

#### props への参照渡しによる再レンダリング防止

オブジェクトや関数をインラインで props に渡すと、毎レンダリングで新しい参照が生成され再レンダリングの原因になる。

```typescript
// ✅ 良い例: オブジェクトをモジュールレベルで大文字スネークケースの定数に
const ANIMATE_CONFIG = { rotateY: 1800, scale: [1, 1.2, 1] };
const TRANSITION_CONFIG = { duration: 2, ease: "easeInOut" as const };

export function CoinAnimation() {
  return <motion.div animate={ANIMATE_CONFIG} transition={TRANSITION_CONFIG} />;
}

// ✅ 良い例: 状態に依存しない関数もモジュールレベルの大文字スネークケースで定義
const STOP_PROPAGATION = (e: React.MouseEvent) => {
  e.stopPropagation();
};

// ✅ 良い例: props を持たないコンポーネントは React.memo で囲む
export const ConfettiEffect = memo(function ConfettiEffect() {
  return <div>{/* ... */}</div>;
});

// ❌ 悪い例: インラインオブジェクト・関数を props に渡す
<motion.div animate={{ rotateY: 1800 }} />
<div onClick={(e) => e.stopPropagation()} />
```

#### Feature Component（`features/`）

```typescript
// ✅ 良い例: カスタムフックでロジックを分離、function宣言
export function GameBoard() {
  const { gameState, submitGuess } = useGameLogic();

  // useEffectは最終手段（このケースは必要）
  useEffect(() => {
    if (gameState.isFinished) {
      playSound("complete");
    }
  }, [gameState.isFinished]);

  return <div>{/* ゲームUI */}</div>;
}
```

#### Page Component（`pages/`）

```typescript
// ✅ 良い例: 状態管理と子コンポーネントへの props 配布
export function GamePage() {
  const { mode } = useParams<{ mode: GameMode }>();
  const { gameState, submitGuess, reset } = useGameLogic(mode);
  const navigate = useNavigate();

  const handleGameEnd = (result: GameResult) => {
    navigate("/result", { state: result });
  };

  return (
    <div className="game-container">
      <ScoreDisplay score={gameState.score} />
      <GuessInput onSubmit={submitGuess} />
    </div>
  );
}
```

---

### Hooks の使用

#### useState

```typescript
// ✅ 良い例: 初期値の型推論
const [score, setScore] = useState(0); // number 型
const [mode, setMode] = useState<GameMode>('beginner'); // 明示的な型

// ✅ 良い例: 関数型更新
setScore((prev) => prev + 1);

// ❌ 悪い例: 直接更新（prevが必要な場合）
setScore(score + 1); // クロージャの罠
```

#### useEffect - 原則禁止、最終手段

```typescript
// ⚠️ 使用は最終手段: 副作用の同期が必須の場合のみ許可
// 例: 外部APIとの同期、DOM操作、サブスクリプション

// ✅ 許容される例: クリーンアップが必要
useEffect(() => {
  const timer = setTimeout(() => {
    navigate('/result');
  }, 2000);

  return () => clearTimeout(timer);
}, [navigate]);

// ❌ 避けるべき: 状態の派生計算
useEffect(() => {
  setTotalScore(score + bonus); // 代わりに useMemo を使用
}, [score, bonus]);

// ✅ 改善: useMemo で置き換え
const totalScore = useMemo(() => score + bonus, [score, bonus]);

// ❌ 避けるべき: イベントハンドラで十分な場合
useEffect(() => {
  if (isGameEnd) {
    navigate('/result');
  }
}, [isGameEnd, navigate]);

// ✅ 改善: イベントハンドラで処理
const handleGameEnd = () => {
  navigate('/result');
};
```

#### useEffect を避けるパターン

```typescript
// パターン1: 派生状態 → useMemo
// ❌
const [filteredItems, setFilteredItems] = useState([]);
useEffect(() => {
  setFilteredItems(items.filter((item) => item.active));
}, [items]);

// ✅
const filteredItems = useMemo(() => items.filter((item) => item.active), [items]);

// パターン2: イベント駆動 → イベントハンドラ
// ❌
useEffect(() => {
  if (shouldSubmit) {
    submitForm();
  }
}, [shouldSubmit]);

// ✅
const handleSubmit = () => {
  submitForm();
};

// パターン3: 初期化 → 直接実行
// ❌
useEffect(() => {
  setData(loadInitialData());
}, []);

// ✅
const [data] = useState(() => loadInitialData());
```

#### useCallback / useMemo

```typescript
// ✅ 良い例: 子コンポーネントに渡す関数
const handleSubmit = useCallback(
  (guess: Symbol[]) => {
    submitGuess(guess);
  },
  [submitGuess]
);

// ✅ 良い例: 重い計算のメモ化
const sortedScores = useMemo(() => {
  return scores.toSorted((a, b) => b - a);
}, [scores]);

// ❌ 悪い例: 不要なメモ化
const label = useMemo(() => 'ボタン', []); // 単純な文字列は不要
```

#### カスタムフック

```typescript
// ✅ 良い例: use プレフィックス、単一責任
export const useGameStorage = () => {
  const [data, setData] = useState<StorageData>(loadStorageData);

  const updateTopScores = useCallback((mode: GameMode, score: number) => {
    setData((prev) => {
      const result = updateTopScoresLogic(prev, mode, score);
      saveStorageData(result.data);
      return result.data;
    });
  }, []);

  return { data, updateTopScores };
};

// ❌ 悪い例: 複数の責任
export const useGame = () => {
  // ゲームロジック、ストレージ、サウンドが混在
};
```

---

### Props の型定義

```typescript
// ✅ 良い例: type エイリアス
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  // ...
}

// ✅ 良い例: children の型
type CardProps = {
  title: string;
  children: React.ReactNode;
};

// ❌ 悪い例: インターフェース（type を優先）
interface ButtonProps {
  // type を使う
  label: string;
}
```

---

### イベントハンドラ

```typescript
// ✅ 良い例: 適切な型定義、アロー関数
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  onClick();
};

// ✅ 良い例: 引数なしの場合
const handleReset = () => {
  setScore(0);
};

// ❌ 悪い例: any 型
const handleClick = (event: any) => {
  // 型を明示すること
};
```

---

### 条件付きレンダリング

```typescript
// ✅ 良い例: && 演算子（true の場合のみ）
{isNewRecord && <NewRecordAnimation rank={rank} />}

// ✅ 良い例: 三項演算子（true/false 両方）
{isCorrect ? <CorrectIcon /> : <IncorrectIcon />}

// ✅ 良い例: 早期リターン
if (!result) {
  return <Navigate to="/" replace />;
}

return <ResultDisplay result={result} />;

// ❌ 悪い例: 三項演算子の null
{isNewRecord ? <NewRecordAnimation /> : null}  // && を使う
```

---

### リストのレンダリング

```typescript
// ✅ 良い例: 安定した key
{topScores.map((item, index) => (
  <ScoreItem key={`${item.score}-${index}`} score={item.score} rank={index + 1} />
))}

// ✅ 良い例: 一意なIDがある場合
{items.map((item) => (
  <Item key={item.id} {...item} />
))}

// ❌ 悪い例: index のみを key に使用（並び替えがある場合）
{items.map((item, index) => (
  <Item key={index} {...item} />  // 並び替え時に問題
))}
```

---

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

---

## Tailwind CSS コーディング規約

### 基本方針

```typescript
// ✅ 良い例: Tailwind のユーティリティクラス優先
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg">
  クリック
</button>

// ❌ 悪い例: カスタムCSSを多用
<button className="custom-button">  // Tailwind で表現できる
  クリック
</button>
```

### クラス名の順序

```typescript
// ✅ 良い例: 機能別にグループ化
<div className="
  // レイアウト
  flex items-center justify-between
  // スペーシング
  p-4 gap-2
  // サイズ
  w-full h-12
  // 背景・ボーダー
  bg-white dark:bg-gray-800 border border-gray-200 rounded-lg
  // テキスト
  text-lg font-bold text-gray-900 dark:text-white
  // エフェクト
  shadow-md hover:shadow-lg
  // トランジション
  transition-all duration-300
">
  コンテンツ
</div>
```

### レスポンシブ対応

```typescript
// ✅ 良い例: モバイルファースト
<div className="
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6 lg:gap-8
  p-4 md:p-6 lg:p-8
">
  {/* コンテンツ */}
</div>
```

### ダークモード対応

```typescript
// ✅ 良い例: dark: プレフィックス
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  コンテンツ
</div>
```

### カスタムクラスの定義

```css
/* globals.css */

/* ✅ 良い例: Tailwind で表現できないもののみ */
@keyframes symbol-reveal {
  0% {
    transform: scale(0) rotateY(0deg);
  }
  100% {
    transform: scale(1) rotateY(360deg);
  }
}

/* ❌ 悪い例: Tailwind で表現できるもの */
.my-button {
  padding: 1rem;
  background-color: blue;
  border-radius: 0.5rem;
}
/* → className="px-4 py-2 bg-blue-500 rounded-lg" で十分 */
```

### カスタムクラスの命名規則

```css
/* ✅ 良い例: プロジェクト固有プレフィックス + ケバブケース */
.hab-symbol-flip
.hab-tile-glow
.hab-card-hover

/* ❌ 悪い例 */
.flipAnimation        /* キャメルケース不可 */
.glow                 /* プレフィックスなし */
.symbol_flip          /* スネークケース不可 */
```

### @apply の使用

```css
/* ✅ 良い例: 繰り返しの多いパターン */
.hab-btn {
  @apply rounded-lg px-6 py-3 font-bold;
  @apply transition-all duration-300;
  @apply shadow-md hover:shadow-lg;
}

/* ❌ 悪い例: 1箇所でしか使わないスタイル */
.one-time-use {
  @apply bg-white p-4; /* 直接 className に書く */
}
```

---

## ディレクトリ・ファイル配置

| 種別                                       | 配置先                            |
| ------------------------------------------ | --------------------------------- |
| 再利用可能なUIコンポーネント（副作用なし） | `src/components/<ComponentName>/` |
| 機能固有のコンポーネント・ロジック         | `src/features/<feature>/`         |
| 外部サービス連携（LocalStorage, LIFF）     | `src/services/`                   |
| 汎用カスタムフック                         | `src/hooks/`                      |
| 純粋関数（副作用なし）                     | `src/utils/`                      |
| 定数                                       | `src/consts/`                     |
| ページコンポーネント                       | `src/pages/`                      |

各コンポーネントはディレクトリ内に同名の `.tsx` ファイルを作成する（例：`Button/Button.tsx`）。

## 定数定義（consts/）

- 定数はすべて `src/consts/` に集約する
- `as const` で不変にし、型は `typeof` から派生させる
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

## スキーマ配置

機能固有のスキーマは `features/<feature>/<feature>.schema.ts` に配置する。

```
src/features/game/game.schema.ts   → ゲーム関連の型・スキーマ
src/features/stats/stats.schema.ts → 統計関連の型・スキーマ
src/i18n/i18n.schema.ts            → 設定（言語・テーマ）の型・スキーマ
```

---

## テストコーディング規約

### テストファイルの配置

```
components/Button/
├── Button.tsx
└── Button.test.tsx

features/game/useGameLogic/
├── useGameLogic.ts
└── useGameLogic.test.ts
```

### テストの構造

```typescript
// ✅ 良い例: describe / it / expect
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("ラベルが正しく表示される", () => {
    render(<Button label="クリック" onClick={() => {}} />);
    expect(screen.getByText("クリック")).toBeInTheDocument();
  });

  it("disabled 時はクリックできない", () => {
    const handleClick = vi.fn();
    render(<Button label="クリック" onClick={handleClick} disabled />);

    const button = screen.getByRole("button");
    button.click();

    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### テストの命名

テストコードは **What（何を保証するか）** を表現する。`describe` でテスト対象を、`it` で「どの条件でどうなるか」を明示する。

```typescript
// ✅ 良い例: What を日本語で具体的に表現
describe('useGameLogic', () => {
  it('正解時にヒット数が正しくカウントされる', () => {});
  it('全ての位置が一致した場合にゲームが終了する', () => {});
  it('制限回数を超えた場合にゲームオーバーになる', () => {});
});

// ❌ 悪い例: 何を保証しているか不明
describe('useGameLogic', () => {
  it('works correctly', () => {}); // What が伝わらない
  it('test1', () => {}); // What が伝わらない
});
```

---

## Git コミットメッセージ規約

コミットログは **Why（なぜその変更が必要だったか）** を記録する。subject で「何をしたか」を端的に示し、body で「なぜ必要だったか」の背景・意図を説明する。

### フォーマット

```
<type>: <subject>

<body>  ← Why（変更が必要だった理由・背景）

<footer>
```

### Type 一覧

```
feat:     新機能
fix:      バグ修正
docs:     ドキュメント
style:    フォーマット（コード動作に影響なし）
refactor: リファクタリング
test:     テスト追加・修正
chore:    ビルド・補助ツール関連
```

### 例

```bash
# ✅ 良い例: body で Why を説明
feat: シンボル選択UIコンポーネントを実装

デイリーチャレンジで同じシンボルを誤って複数選択するUXの問題があったため、
選択済みシンボルをグレーアウトして再選択を防ぐタイル型UIを導入した。

Closes #12

# ✅ 良い例: body で Why を説明
fix: LocalStorageのバリデーションエラーを修正

アプリ更新後にスキーマ変更で古いデータがパースできなくなる問題があったため、
Zodスキーマにデフォルト値を設定してマイグレーションなしに後方互換を保つようにした。

# ❌ 悪い例: Why がない
feat: シンボル選択UIを実装  # 何をしたかしか書いていない

# ❌ 悪い例: type なし、抽象的
update code
```

---

## 禁止事項

### 1. `any` 型の使用

```typescript
// ❌ 絶対に禁止
const data: any = {};

// ✅ unknown を使用
const data: unknown = {};
if (typeof data === 'object') {
  // 型ガードで安全に扱う
}
```

### 2. `var` の使用

```typescript
// ❌ 禁止
var score = 0;

// ✅ const / let を使用
const score = 0;
```

### 3. `enum` の使用

```typescript
// ❌ 禁止
enum GameMode {
  Beginner = 'beginner',
  Normal = 'normal',
}

// ✅ オブジェクトマップを使用
const GAME_MODES = {
  beginner: 'beginner',
  normal: 'normal',
} as const;

type GameMode = (typeof GAME_MODES)[keyof typeof GAME_MODES];
```

### 4. 配列・オブジェクトのミューテーション

```typescript
// ❌ 禁止
array.sort();
object.prop = value;

// ✅ イミュータブル操作
const sorted = array.toSorted();
const updated = { ...object, prop: value };
```

### 5. デフォルトエクスポート（コンポーネント以外）

```typescript
// ❌ 禁止（utilsなど）
export default function calculateScore() {}

// ✅ Named Export
export const calculateScore = () => {};

// ✅ 許容（React.lazy で使用するページコンポーネント）
function GamePage() {}
export default GamePage;
```

### 6. インラインスタイル（Tailwind で表現可能な場合）

```typescript
// ❌ 禁止
<div style={{ padding: "1rem", backgroundColor: "white" }}>

// ✅ Tailwind を使用
<div className="p-4 bg-white">
```

### 7. 通常の関数での function 宣言

```typescript
// ❌ 禁止（コンポーネント以外）
export function calculateScore(mode: GameMode): number {
  return 0;
}

// ✅ アロー関数を使用
export const calculateScore = (mode: GameMode): number => {
  return 0;
};

// ✅ 許容（Reactコンポーネント）
export function GamePage() {
  return <div>Game</div>;
}
```

### 8. useEffect の安易な使用

```typescript
// ❌ 避ける: 派生状態の計算
useEffect(() => {
  setTotal(a + b);
}, [a, b]);

// ✅ useMemo を使用
const total = useMemo(() => a + b, [a, b]);

// ⚠️ 許容: 外部システムとの同期（最終手段）
useEffect(() => {
  const subscription = externalAPI.subscribe();
  return () => subscription.unsubscribe();
}, []);
```

---

## パフォーマンス最適化

### 1. 動的インポート

```typescript
// ✅ 良い例: ページごとに分割
const GamePage = lazy(() => import('./pages/GamePage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
```

### 2. 不要な再レンダリングの防止

```typescript
// ✅ 良い例: React.memo（Pure Component）
export const ScoreDisplay = React.memo(({ score }: { score: number }) => {
  return <div>{score}</div>;
});
```

---

## セキュリティ

### 1. XSS 対策

```typescript
// ✅ 良い例: React のデフォルトエスケープ
<div>{userInput}</div>  // 自動エスケープ

// ❌ 禁止: dangerouslySetInnerHTML（特別な理由がない限り）
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 2. 外部リンク

```typescript
// ✅ 良い例: rel 属性
<a href={url} target="_blank" rel="noopener noreferrer">
  リンク
</a>
```

---

## ドキュメントコメント

### 基本思想

> **コードには `How`、テストコードには `What`、コミットログには `Why`、コードコメントには `Why not` を書く**

| 場所               | 書くこと    | 説明                                                               |
| ------------------ | ----------- | ------------------------------------------------------------------ |
| **コード**         | **How**     | 「どのように実現するか」は実装そのものが表現する。コメント不要     |
| **テストコード**   | **What**    | 「何を保証するか」をテスト名・構造で明示する                       |
| **コミットログ**   | **Why**     | 「なぜその変更が必要だったか」を記録する                           |
| **コードコメント** | **Why not** | 「なぜ別の方法を取らなかったか」「なぜこの実装が妥当か」を説明する |

### コードコメント（Why not）

コメントは「なぜこの実装を選んだか・他の選択肢を取らなかったか」を書く。

```typescript
// ✅ 良い例: Why not を説明
// Array.at() は Safari 15.4 未満で未サポートだが、本プロジェクトの対象環境では問題ない
const last = scores.at(-1);

// ✅ 良い例: Why not を説明
// useMemo を使わないのは、scores の変更頻度が低く、メモ化のオーバーヘッドが不要なため
const total = scores.reduce((sum, s) => sum + s, 0);

// ✅ 良い例: Why not を説明
// Zodのparseは失敗時に例外を投げる。
// 古いLocalStorageデータとの後方互換性のため、safeParseではなくtry-catchで囲む
const validated = StorageDataSchema.parse(parsed);

// ❌ 悪い例: How（コード自体が説明している）
// スコアに1を加える
setScore((prev) => prev + 1);

// ❌ 悪い例: What（テストに書くべき）
// nullの場合はデフォルト値を返す
if (!data) return defaultStorageData;
```

### 型で自明な場合は省略

```typescript
// ✅ 良い例: コメント不要（Howはコードで十分表現されている）
export const getBestScore = (scores: number[]): number => Math.max(0, ...scores);

// ❌ 悪い例: 冗長なコメント
// スコアの最大値を返す（0以上を保証）
export const getBestScore = (scores: number[]): number => Math.max(0, ...scores);
```
