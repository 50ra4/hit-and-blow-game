# T-011: 共通UIコンポーネント

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/16

## 目的

アプリ全体で再利用される汎用UIコンポーネント（Button, Modal, Loading, Card）を実装する。

## 背景

- `docs/02_architecture.md` セクション6.4「Components Layer（Pure UI）」
- `docs/06_mock_design.html` — 各コンポーネントのビジュアルデザイン

## 実装内容

### 追加ファイル

| ファイル                             | 内容                           |
| ------------------------------------ | ------------------------------ |
| `src/components/Button/Button.tsx`   | 汎用ボタンコンポーネント       |
| `src/components/Modal/Modal.tsx`     | モーダルコンポーネント         |
| `src/components/Loading/Loading.tsx` | ローディング表示コンポーネント |
| `src/components/Card/Card.tsx`       | カードコンポーネント           |

### 変更ファイル

なし

### 実装詳細

#### Button.tsx

```typescript
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
};

export function Button(props: ButtonProps) {
  /* ... */
}
```

**デザイン要件（06_mock_design.html参照）:**

- `primary`: 青系グラデーション背景、白文字
- `secondary`: グレー系背景、白文字
- `danger`: 赤系背景、白文字
- `disabled`: opacity低下、pointer-events: none
- ホバー時: 明度変化
- Tailwind CSSでスタイリング
- `className` propsでカスタムクラスの追加が可能

#### Modal.tsx

```typescript
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

export function Modal(props: ModalProps) {
  /* ... */
}
```

**デザイン要件:**

- `isOpen === false` のとき非表示
- オーバーレイ（半透明黒背景）
- 中央配置のモーダルコンテンツ
- タイトル表示（任意）
- 閉じるボタン（`×`）
- オーバーレイクリックで閉じる
- ESCキーで閉じる
- `body` のスクロールを無効化（`overflow: hidden`）

#### Loading.tsx

```typescript
export function Loading() {
  /* ... */
}
```

**デザイン要件:**

- 中央配置のスピナー
- アニメーション（CSSアニメーション）
- `Suspense` の `fallback` として使用

#### Card.tsx

```typescript
type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card(props: CardProps) {
  /* ... */
}
```

**デザイン要件:**

- 角丸、シャドウ
- パディング付き
- 背景色はテーマに応じて変化（ダークモード対応）

## 入出力仕様

- Input: 各コンポーネントのprops
- Output: React要素（JSX）

## 受け入れ条件（Definition of Done）

- [ ] 4つのコンポーネントが `src/components/` に作成されている
- [ ] `Button` が3つのバリアント（primary, secondary, danger）をサポートする
- [ ] `Button` が `disabled` 状態を正しく表示する
- [ ] `Modal` が `isOpen` に応じて表示/非表示を切り替える
- [ ] `Modal` がオーバーレイクリック・ESCキーで閉じる
- [ ] `Loading` がスピナーアニメーションを表示する
- [ ] `Card` が角丸・シャドウで表示される
- [ ] 全コンポーネントがダークモード対応している（Tailwindの `dark:` プレフィックス）
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: `Button` の各variantが正しいスタイルで表示される
- 正常系: `Button` クリックで `onClick` が呼ばれる
- 正常系: `Button` が `disabled` のとき `onClick` が呼ばれない
- 正常系: `Modal` が `isOpen=true` で表示される
- 正常系: `Modal` が `isOpen=false` で非表示になる
- 正常系: `Modal` のオーバーレイクリックで `onClose` が呼ばれる
- 正常系: `Loading` がスピナーを表示する

## 依存タスク

- T-001（プロジェクト初期セットアップ — React, Tailwind CSS）

## 要確認事項

- ~~デザイン再現度~~ → **確定: 06_mock_design.html を忠実に再現する。ダークグラデーション背景（#1a1a2e〜#0f3460）等はTailwindのカスタムカラーとして `tailwind.config.js` に追加すること。**
