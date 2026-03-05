# Issue #116: エキスパートモード時の入力欄が画面幅によって折り返す

## 概要

小画面端末（iPhone SE: 375px）でエキスパート・マスターモード（6桁）の入力スロットが折り返して表示され、視認性が悪い。

**意図（なぜ必要か）**: 6桁モードでの入力体験を改善する。パッと見で全スロットが一行に並んでいないと直感的に把握しづらい。

**選択理由**: スロットサイズを小画面時に縮小するアプローチを採用。`flex-wrap` を `flex-nowrap` に変更し、タイルサイズをレスポンシブ化する。gap を固定ピクセルからレスポンシブに変えることで、画面幅に応じた最適なサイズに調整できる。

代替案として `@container` クエリや桁数に応じた動的クラスも考えたが、既存の `sm:` ブレークポイントパターンに揃えるのが最もシンプル。

---

## 計算根拠

iPhone SE (375px) の利用可能幅: 375 - 32 (px-4 × 2) - 16 (p-4 × 2: InputAreaの内側padding) = 327px

### 現状（折り返し発生）

- 6 × 56px(h-14) + 5 × 8px(gap-2) = **376px** > 327px

### 修正後（収まる）

- 6 × 44px(h-11) + 5 × 6px(gap-1.5) = **294px** < 327px
- sm(640px)以上: 6 × 56px(h-14) + 5 × 8px(gap-2) = **376px** （余裕あり）

---

## 変更ファイル

| ファイル                                            | 変更内容                                             |
| --------------------------------------------------- | ---------------------------------------------------- |
| `src/features/game/GameInputArea/GameInputArea.tsx` | 入力スロットをレスポンシブサイズ化、flex-nowrap      |
| `src/features/game/TilePicker/TilePicker.tsx`       | タイルパレットのサイズをレスポンシブ化（一貫性確保） |
| `src/features/game/ResultDisplay/ResultDisplay.tsx` | 結果画面の正解表示もレスポンシブ化                   |

---

## タスク

### Task 1: 入力スロットのレスポンシブ対応

#### 受け入れ条件

- [ ] 6桁モードで375px幅でも入力スロットが折り返さない
- [ ] 3〜4桁モードの表示が崩れない

#### 実装詳細

**`src/features/game/GameInputArea/GameInputArea.tsx`**

行38: コンテナのクラスを変更

```diff
- <div className="mb-5 flex flex-wrap justify-center gap-2">
+ <div className="mb-5 flex flex-nowrap justify-center gap-1.5 sm:gap-2">
```

行47: スロットボタンのサイズをレスポンシブ化

```diff
- className={`inline-flex h-14 w-14 cursor-pointer ...
+ className={`inline-flex h-11 w-11 sm:h-14 sm:w-14 cursor-pointer ...
```

### Task 2: タイルパレットのレスポンシブ対応

#### 受け入れ条件

- [ ] タイルパレットが小画面で崩れない
- [ ] スロットとタイルのサイズ感に一貫性がある

#### 実装詳細

**`src/features/game/TilePicker/TilePicker.tsx`**

行87: gap は既に sm 対応済み（`gap-3 sm:gap-4`）、変更不要。

行102: タイルサイズを調整（現在 `h-14 w-14 ... sm:h-16 sm:w-16`）
→ 小画面サイズを `h-11 w-11` に変更して入力スロットと揃える。

```diff
- className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-md ... sm:h-16 sm:w-16
+ className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl overflow-hidden shadow-md ... sm:h-14 sm:w-14
```

行109: アイコンサイズも調整

```diff
- <TileIcon tileId={tile.id} className="h-8 w-8 sm:h-9 sm:w-9" />
+ <TileIcon tileId={tile.id} className="h-6 w-6 sm:h-8 sm:w-8" />
```

タイルパレットの計算:

- 小画面: 4 × 44px + 3 × 12px = **212px** （余裕あり）
- sm以上: 4 × 56px + 3 × 16px = **272px** （余裕あり）

### Task 3: 結果画面の正解表示レスポンシブ対応

#### 受け入れ条件

- [ ] 結果画面の正解タイル表示が6桁でも折り返さない

#### 実装詳細

**`src/features/game/ResultDisplay/ResultDisplay.tsx`**

行83: コンテナ

```diff
- <div className="flex flex-wrap justify-center gap-2">
+ <div className="flex flex-nowrap justify-center gap-1.5 sm:gap-2">
```

行88: タイルサイズ

```diff
- className="h-14 w-14 rounded-2xl shadow-md"
+ className="h-11 w-11 sm:h-14 sm:w-14 rounded-2xl shadow-md"
```

---

## 受け入れ条件

- [ ] iPhone SE (375px) でエキスパート・マスターモード（6桁）の入力スロットが折り返さない
- [ ] 結果画面の正解表示も同様に折り返さない
- [ ] ビギナー〜ハードモード（3〜4桁）の表示が崩れない
- [ ] sm(640px)以上の表示に変化がない（もしくは改善のみ）
- [ ] `pnpm type-check` が通る
- [ ] `pnpm lint` が通る

## 注意事項

- TutorialPageの `h-14 w-14`（行126）はグリッド内の説明用表示で桁数問題に影響しないため対象外
