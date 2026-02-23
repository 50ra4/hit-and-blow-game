# T-017: チュートリアルページ

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/22

## 目的

ゲームルール・操作方法を説明するインタラクティブチュートリアルページを実装する。

## 背景

- `docs/05_sitemap.md` セクション「5. チュートリアル（`/tutorial`）」
- `docs/01_requirements.md` セクション2.4「チュートリアル機能」
- `docs/02_architecture.md` セクション2「features/tutorial/」
- `docs/06_mock_design.html` — チュートリアル画面デザイン

## 実装内容

### 追加ファイル

| ファイル                                              | 内容                               |
| ----------------------------------------------------- | ---------------------------------- |
| `src/pages/TutorialPage.tsx`                          | チュートリアルページコンポーネント |
| `src/features/tutorial/useTutorial.ts`                | チュートリアル状態管理フック       |
| `src/features/tutorial/TutorialStep/TutorialStep.tsx` | 各ステップのコンポーネント         |

### 変更ファイル

| ファイル                   | 変更内容                     |
| -------------------------- | ---------------------------- |
| `src/i18n/locales/ja.json` | チュートリアル用翻訳キー追加 |
| `src/i18n/locales/en.json` | チュートリアル用翻訳キー追加 |

### 実装詳細

#### TutorialPage.tsx

```typescript
export default function TutorialPage() {
  const { currentStep, totalSteps, nextStep, prevStep, isLastStep } =
    useTutorial();
  const { completeTutorial } = useSettings();
  const navigate = useNavigate();

  const handleComplete = () => {
    completeTutorial();
    navigate('/');
  };

  const handleSkip = () => {
    completeTutorial();
    navigate('/');
  };

  // ...
}
```

#### useTutorial.ts

```typescript
export function useTutorial(): {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};
```

**ステップ構成（`docs/05_sitemap.md` + `docs/01_requirements.md` セクション2.4）:**

| Step | 内容                                 | 表示                  |
| ---- | ------------------------------------ | --------------------- |
| 1    | ゲームの目的（タイルの並びを推理）   | テキスト + イラスト   |
| 2    | ヒット・ブローの説明（図解付き）     | テキスト + 具体例     |
| 3    | タイルの種類紹介（8種類のアイコン）  | タイル一覧            |
| 4    | モード・プレイタイプの説明           | テキスト + モード一覧 |
| 5    | 実際に試してみよう（簡易ゲーム体験） | インタラクティブ      |

#### TutorialStep.tsx

```typescript
type TutorialStepProps = {
  step: number;
};

export function TutorialStep({ step }: TutorialStepProps) {
  // stepに応じた内容を表示
}
```

**ステップ5（簡易ゲーム体験）の仕様（`docs/01_requirements.md` セクション2.4）:**

- 3桁・3回の簡易版ゲーム
- ヒントあり: ゲームボードの上部に「タイルを3つ選んで「回答する」を押してみましょう！ヒット＝正解タイルが正しい位置、ブロー＝正解タイルが別の位置にある、です。」のようなガイドテキストを表示
- `useGame` フックを `mode='beginner'` 相当で使用（ただし maxAttempts=3）

**UI要素:**

- 「次へ」ボタン（最後のステップでは「完了」）
- 「前へ」ボタン（最初のステップでは非表示）
- 「スキップしてホームへ」ボタン
- ページネーションドット（現在のステップを示す）

## 入出力仕様

- Input: なし
- Output: チュートリアル画面のReact要素

## 受け入れ条件（Definition of Done）

- [ ] 5つのステップが表示できる
- [ ] 「次へ」「前へ」でステップ間を遷移できる
- [ ] 最後のステップで「完了」ボタンが表示される
- [ ] 「完了」クリックで `tutorialCompleted = true` になりホームに遷移する
- [ ] 「スキップ」クリックで `tutorialCompleted = true` になりホームに遷移する
- [ ] ステップ5でインタラクティブな簡易ゲームが体験できる
- [ ] ページネーションドットが現在のステップを示す
- [ ] チュートリアル用の翻訳キーが `ja.json`, `en.json` に追加されている
- [ ] レスポンシブデザインに対応する
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: 各ステップが正しく表示される
- 正常系: 「次へ」で次のステップに進む
- 正常系: 「前へ」で前のステップに戻る
- 正常系: ステップ5で簡易ゲームがプレイできる
- 正常系: 「完了」でホームに遷移し、tutorialCompletedがtrueになる
- 正常系: 「スキップ」でホームに遷移する

## 依存タスク

- T-009（設定フック — `useSettings` の `completeTutorial` を使用）
- T-011（共通UI — `Button` を使用）
- T-013（ルーティング）

## 要確認事項

- ~~ステップ5のヒント内容~~ → **確定: ゲームボード上部にガイドテキストを表示する（実装詳細参照）**
- ~~ステップ図解・イラスト~~ → **確定: テキストベースの説明で実装する（SVGイラストは作成しない）**
- ~~ステップ5の maxAttempts~~ → **確定: `GAME_MODES` には追加せず、`useGame` の `mode='beginner'` を呼び出した後に別途 `maxAttempts=3` を上書きする形で対応する（またはチュートリアル専用のモード設定定数を `T-017` 内にローカル定義する）**
