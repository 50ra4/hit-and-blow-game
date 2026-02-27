# [FIX-G1] 試行回数を円形プログレスバーで表示

## Issue

[#53](https://github.com/50ra4/hit-and-blow-game/issues/53)

## 意図（なぜ必要か）

現在、試行回数がテキスト `current / max` のみで表示されており、
残り回数の緊張感が視覚的に伝わらない。
モックデザインで定義された円形プログレスバー（残り回数に応じて緑→黄→赤と色変化）を実装し、
プレイヤーが残り試行回数を直感的に把握できるようにする。

---

## モックデザインとの差分確認

`docs/06_mock_design.html` より確認した内容：

- **ヘッダー**：試行回数は表示しない（戻るボタン・ロゴ・タイトルのみ）
- **ゲーム情報パネル**（ヘッダーとゲームボードの間）：モード / 桁数 / 重複 / 円形プログレスバー
- **円形プログレスバー**：SVG（100×100、r=42、strokeWidth=8）、中心に `残り/最大` と `回` を表示
- **色**（モック CSS を正とする）：
  - デフォルト：`#4caf50`（緑）
  - 警告（残り30%以下）：`#ffc107`（黄）
  - 危険（残り1回）：`#f44336`（赤）

---

## 選択理由

- `GameInfoPanel` を独立コンポーネントとして新設し、`GameHeader` の責務を変えない
- `CircularProgress` を純粋なUIコンポーネント（`features/game/` 配下）として実装し再利用性を確保
- ストロークカラーはインラインスタイルで適用（SVG 固有の属性であり、動的値のため）
  - プロジェクト内で既に `TILE_GRADIENT_STYLES` がインラインスタイルを用いている実績あり

---

## 変更ファイル一覧

| #   | 種別 | ファイル                                                  |
| --- | ---- | --------------------------------------------------------- |
| 1   | NEW  | `src/features/game/CircularProgress/CircularProgress.tsx` |
| 2   | NEW  | `src/features/game/GameInfoPanel/GameInfoPanel.tsx`       |
| 3   | EDIT | `src/features/game/GameHeader/GameHeader.tsx`             |
| 4   | EDIT | `src/pages/FreeGamePage/FreeGamePage.tsx`                 |
| 5   | EDIT | `src/pages/DailyGamePage/DailyGamePage.tsx`               |
| 6   | EDIT | `src/i18n/locales/ja.json`                                |
| 7   | EDIT | `src/i18n/locales/en.json`                                |

---

## タスク詳細

### Task 1: i18n キー追加

**対象**: `src/i18n/locales/ja.json` / `src/i18n/locales/en.json`

`game` セクションに以下を追加・削除する。

**追加（ja）**:

```json
"infoModeLabel": "モード",
"infoDigitsLabel": "桁数",
"infoDuplicatesLabel": "重複",
"infoDigits": "{{count}}桁",
"infoDuplicatesOn": "あり",
"infoDuplicatesOff": "なし",
"attemptsUnit": "回"
```

**追加（en）**:

```json
"infoModeLabel": "Mode",
"infoDigitsLabel": "Digits",
"infoDuplicatesLabel": "Dup",
"infoDigits": "{{count}} digits",
"infoDuplicatesOn": "Yes",
"infoDuplicatesOff": "No",
"attemptsUnit": "turns"
```

**削除**: `game.attempts`（`GameHeader` から試行回数表示が消えるため不要）

---

### Task 2: `CircularProgress` コンポーネント新規作成

**対象**: `src/features/game/CircularProgress/CircularProgress.tsx`

```tsx
type Props = {
  current: number; // 現在の試行回数（useGame の attempts）
  max: number;
  size?: number; // SVG サイズ（px）、デフォルト 100
};
```

**実装仕様**:

- SVG: `size × size`、`transform: rotate(-90deg)` で12時から開始
- 背景トラック circle: `fill="none"`, `stroke="rgba(255,255,255,0.1)"`, `strokeWidth=8`
- プログレス circle: `fill="none"`, `strokeLinecap="round"`, strokeWidth=8
  - `r = (size - 8) / 2`（strokeWidth の半分を引いて枠内に収める）
  - `circumference = 2 * Math.PI * r`
  - `remaining = max - current`
  - `strokeDasharray = circumference`
  - `strokeDashoffset = circumference * (1 - remaining / max)`
  - ストロークカラー（インラインスタイルで設定）:
    - `remaining <= 1` → `#f44336`（赤）
    - `remaining / max <= 0.3` → `#ffc107`（黄）
    - それ以外 → `#4caf50`（緑）
- 中心テキスト:
  - `{remaining}/{max}`（fontSize: 1.5rem、font-bold、white）
  - `t('game.attemptsUnit')` (「回」)（fontSize: 0.75rem、text-white/60）
- transition: `strokeDashoffset 0.5s ease, stroke 0.3s ease`

---

### Task 3: `GameInfoPanel` コンポーネント新規作成

**対象**: `src/features/game/GameInfoPanel/GameInfoPanel.tsx`

```tsx
type Props = {
  modeName: string;
  answerLength: number;
  allowDuplicates: boolean;
  attempts: number;
  maxAttempts: number;
};
```

**レイアウト仕様**（モックの `game-info` 相当）:

- 外枠: `rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 mb-6`
- グリッド: `grid grid-cols-3` → 3つの情報アイテム
- 円形プログレスバー: `col-span-3` で全幅
- 情報アイテム（モード / 桁数 / 重複）:
  - ラベル: `text-[0.85rem] text-white/60 mb-2 text-center`
  - 値: `text-2xl font-bold text-white text-center`

---

### Task 4: `GameHeader` 更新

**対象**: `src/features/game/GameHeader/GameHeader.tsx`

- `attempts`, `maxAttempts` props を削除
- `t('game.attempts', ...)` の表示 div を削除
- レイアウトバランス維持のため右側に `min-w-24` の空 div を残す

---

### Task 5: `FreeGamePage` 更新

**対象**: `src/pages/FreeGamePage/FreeGamePage.tsx`

- `GameHeader` から `attempts={attempts}` と `maxAttempts={maxAttempts}` を削除
- `GameInfoPanel` を `import` し、コンテンツエリア先頭（`GameBoard` / `ResultDisplay` の前）に追加
  ```tsx
  <GameInfoPanel
    modeName={modeName}
    answerLength={modeConfig.length}
    allowDuplicates={modeConfig.allowDuplicates}
    attempts={attempts}
    maxAttempts={maxAttempts}
  />
  ```

---

### Task 6: `DailyGamePage` 更新

**対象**: `src/pages/DailyGamePage/DailyGamePage.tsx`

- `GameHeader` から `attempts={attempts}` と `maxAttempts={maxAttempts}` を削除（「既プレイ」分岐含む）
- `GameInfoPanel` を `import` し、アクティブゲーム画面のコンテンツエリア先頭に追加（「既プレイ」分岐には追加しない）
  ```tsx
  <GameInfoPanel
    modeName={modeName}
    answerLength={modeConfig.length}
    allowDuplicates={modeConfig.allowDuplicates}
    attempts={attempts}
    maxAttempts={maxAttempts}
  />
  ```

---

## コミット順序

1. `feat: i18n キーの追加・変更`（Task 1）
2. `feat: CircularProgress コンポーネントを新規作成`（Task 2）
3. `feat: GameInfoPanel コンポーネントを新規作成`（Task 3）
4. `refactor: GameHeader から試行回数表示を削除`（Task 4）
5. `feat: FreeGamePage に GameInfoPanel を追加`（Task 5）
6. `feat: DailyGamePage に GameInfoPanel を追加`（Task 6）
