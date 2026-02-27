# Issue #59: モードカードに難易度バッジ・色分けボーダー・解説文を追加

## 意図（なぜ必要か）

ホーム画面のモード選択カードが視覚的に単調で、各モードの特徴（難易度・ルール概要）が
一目で伝わらない。モックデザイン（`docs/06_mock_design.html`）では各モードに
難易度バッジ・カラーボーダー・解説文が付いており、実装と乖離している。

## 選択理由

### Tailwind クラスの動的適用

`modes.ts` に Tailwind クラス文字列を**完全なリテラル**で定義することで、
Tailwind v4（`@tailwindcss/vite`）のクラス自動スキャンに確実に検出させる。
テンプレートリテラルや文字列結合は使用しない。

### i18n 対応

コーディング規約に従い、解説テキストは `ja.json` / `en.json` に翻訳キーとして定義。
`modes.ts` には翻訳キー（`descriptionKey`）を持たせ、コンポーネント側で `t()` を使用。

---

## 実装方針

### カラー設計（モックデザインに準拠）

| モード       | バッジ | ボーダー               | バッジスタイル                     |
| ------------ | ------ | ---------------------- | ---------------------------------- |
| ビギナー     | EASY   | `border-green-500/50`  | `bg-green-500/30 text-green-400`   |
| ノーマル     | NORMAL | `border-blue-500/50`   | `bg-blue-500/30 text-blue-400`     |
| ハード       | HARD   | `border-orange-500/50` | `bg-orange-500/30 text-orange-400` |
| エキスパート | EXPERT | `border-purple-500/50` | `bg-purple-500/30 text-purple-400` |
| マスター     | MASTER | `border-red-500/50`    | `bg-red-500/30 text-red-400`       |

---

## タスク一覧

### Task 1: `modes.ts` に難易度情報を追加

**ファイル**: `src/consts/modes.ts`

各モード定義に以下のフィールドを追加：

- `badge`: 難易度ラベル文字列（`'EASY'` など）
- `borderClass`: ボーダーの Tailwind クラス（完全なリテラル）
- `badgeClass`: バッジ背景・テキストの Tailwind クラス（完全なリテラル）
- `descriptionKey`: i18n 翻訳キー（`'mode.beginner_description'` など）

### Task 2: i18n 翻訳キーを追加

**ファイル**: `src/i18n/locales/ja.json`, `src/i18n/locales/en.json`

`mode` セクションに各モードの説明テキストを追加：

```
ja:
  beginner_description: "3桁・重複なし・6回まで。初心者におすすめ"
  normal_description: "4桁・重複なし・8回まで。標準的な難易度"
  hard_description: "4桁・重複あり・10回まで。推理力が試される"
  expert_description: "8桁・重複なし・12回まで"
  master_description: "8桁・重複あり・15回まで"

en:
  beginner_description: "3 digits, no duplicates, 6 tries. Great for beginners"
  normal_description: "4 digits, no duplicates, 8 tries. Standard difficulty"
  hard_description: "4 digits, duplicates allowed, 10 tries. Tests your logic"
  expert_description: "8 digits, no duplicates, 12 tries"
  master_description: "8 digits, duplicates allowed, 15 tries"
```

### Task 3: `HomePage.tsx` のモードカード表示を更新

**ファイル**: `src/pages/HomePage/HomePage.tsx`

- `Link` / `button` の `className` に `modeConfig.borderClass` を追加
- カード内に難易度バッジ（`<span>`）を追加
- カード内に解説文（`t(modeConfig.descriptionKey)`）を追加

---

## 受け入れ条件

- [ ] 各モードカードに難易度バッジ（EASY〜MASTER）が表示される
- [ ] 各モードカードのボーダー色がモードごとに異なる色で表示される
- [ ] 各モードカードに一言解説文が表示される
- [ ] Tailwind の動的クラスが正しく適用される（safelist 不要、静的リテラルで対応）
