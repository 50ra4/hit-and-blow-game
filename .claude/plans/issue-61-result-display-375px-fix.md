# 実装計画: 結果画面スタッツボックスの375px表示崩れ修正

## なぜ必要か

Issue #61 の実装でスタッツボックスを横並び2ボックスレイアウトに変更したが、
画面幅375px（iPhone SE等）でモード名「ビギナー」が「ビギ」「ナー」と2行に折り返される表示崩れが発生している。

---

## 原因分析

375px幅での利用可能幅の計算:

```
375px (画面幅)
- 32px (コンテナ左右 px-4: 16px × 2)
- 64px (カード内 p-8: 32px × 2)
= 279px (2ボックス全体の利用可能幅)

gap-8 = 32px を引くと:
279px - 32px = 247px → 各ボックス 123.5px

各ボックスの px-6 (24px × 2 = 48px) を引くと:
123.5px - 48px = 75.5px (テキスト領域)
```

`text-3xl`（約30px/文字）で全角4文字「ビギナー」は **約120px** 必要 → **75.5px に収まらず2行折り返し**。

---

## 実装方針

### 選択理由

モックデザイン（`docs/06_mock_design.html`）の `font-size: 2rem`（Tailwind `text-3xl` に相当）を守りつつ、
**ボックス内余白（padding）とgapを削減する最小変更**で対応する。

各ボックスに `flex-1` を付けて利用可能幅を等分し、テキストに `whitespace-nowrap` で折り返しを防ぐ設計も検討したが、
長いモード名（例: 将来追加された場合）でははみ出す可能性がある。

→ **パディング・gap縮小 + フォントサイズ調整**の組み合わせを採用。

### 変更箇所

`src/features/game/ResultDisplay/ResultDisplay.tsx` の L58〜69 のみ。

| 変更前 | 変更後 | 理由 |
|---|---|---|
| `gap-8` | `gap-4` | ボックス間隔を32px→16pxに縮小 |
| `px-6 py-4` | `px-4 py-3` | ボックスの横パディングを24px→16pxに縮小 |
| `text-3xl` | `text-2xl` | 折り返しなし最低フォントサイズに調整（24px相当） |

修正後の利用可能幅計算:

```
279px (2ボックス全体の利用可能幅)
- gap-4(16px) = 263px → 各ボックス 131.5px
- px-4(16px × 2 = 32px) = 99.5px (テキスト領域)

text-2xl (24px/文字) × 4文字「ビギナー」= 96px ≦ 99.5px ✅
```

---

## タスク詳細

### Task 1: スタッツボックスのレイアウト調整（1コミット）

**変更ファイル**: `src/features/game/ResultDisplay/ResultDisplay.tsx`

```tsx
// 変更前
<div className="mb-3 flex justify-center gap-8">
  <div className="rounded-xl bg-black/30 px-6 py-4 text-center">
    <p className="text-3xl font-bold text-white">
      {t('result.attemptsCount', { count: attempts })}
    </p>
    <p className="mt-1 text-xs text-white/60">{t('result.attemptsLabel')}</p>
  </div>
  <div className="rounded-xl bg-black/30 px-6 py-4 text-center">
    <p className="text-3xl font-bold text-white">{modeName}</p>
    <p className="mt-1 text-xs text-white/60">{t('result.modeLabel')}</p>
  </div>
</div>

// 変更後
<div className="mb-3 flex justify-center gap-4">
  <div className="rounded-xl bg-black/30 px-4 py-3 text-center">
    <p className="text-2xl font-bold text-white">
      {t('result.attemptsCount', { count: attempts })}
    </p>
    <p className="mt-1 text-xs text-white/60">{t('result.attemptsLabel')}</p>
  </div>
  <div className="rounded-xl bg-black/30 px-4 py-3 text-center">
    <p className="text-2xl font-bold text-white">{modeName}</p>
    <p className="mt-1 text-xs text-white/60">{t('result.modeLabel')}</p>
  </div>
</div>
```

---

## 受け入れ条件

- [ ] 画面幅375pxで「ビギナー」が1行で表示される（折り返しなし）
- [ ] 画面幅375pxで試行回数が1行で表示される（折り返しなし）
- [ ] より長いモード名「エキスパート」（5文字）も1行で表示される
- [ ] 広い画面幅（768px以上）での表示に影響がない
