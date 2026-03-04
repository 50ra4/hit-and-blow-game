# Issue #73: [FIX-A4] モーダル表示時のスライドインアニメーションを追加

## 概要

モーダルが即時表示されているバグを修正し、上から下へのスライドとフェードインのアニメーションを追加する。

**意図（なぜ必要か）**: モックデザイン（`docs/06_mock_design.html`）で定義されたアニメーションが実装されておらず、モーダルが突然出現するため UX が損なわれている。

**選択理由**: CSS `@keyframes` + Tailwind `@layer utilities` で実装するのが本プロジェクトの既存パターン（`fadeInUp`, `slotPulse`, `tileBounce` が同様の方式）に合致する。JavaScript 制御や Framer Motion 等のライブラリは不要。クラス名は既存規約に従い `hab-` プレフィックスを使用する（Issue 本文の `.animate-modal-slide-in` は規約違反のため `hab-modal-slide-in` に変更）。

---

## 変更ファイル

| ファイル                    | 変更内容                                         |
| --------------------------- | ------------------------------------------------ |
| `src/styles/index.css`      | `modalSlideIn` keyframe と `hab-modal-slide-in` ユーティリティクラスを追加 |
| `src/components/Modal/Modal.tsx` | モーダルコンテンツ div に `hab-modal-slide-in` クラスを付与 |

---

## タスク

### Task 1: CSS アニメーション定義の追加

#### 受け入れ条件

- [ ] `src/styles/index.css` に `@keyframes modalSlideIn` が定義されている
- [ ] `from`: `opacity: 0; transform: translateY(-16px) scale(0.97)`
- [ ] `to`: `opacity: 1; transform: translateY(0) scale(1)`
- [ ] `@layer utilities` に `.hab-modal-slide-in` クラスが定義されている
- [ ] アニメーション時間は `0.2s ease forwards`

#### 実装詳細

`src/styles/index.css` の末尾に以下を追加する：

```css
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@layer utilities {
  .hab-modal-slide-in {
    animation: modalSlideIn 0.2s ease forwards;
  }
}
```

---

### Task 2: Modal コンポーネントへのクラス付与

#### 受け入れ条件

- [ ] `src/components/Modal/Modal.tsx` のモーダルコンテンツ div（`relative mx-4 w-full max-w-md ...`）に `hab-modal-slide-in` クラスが追加されている
- [ ] オーバーレイ div（`fixed inset-0 ...`）には付与しない

#### 実装詳細

`Modal.tsx` の内側 div の className に `hab-modal-slide-in` を追加する：

```tsx
<div
  className="relative mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-gray-800/95 shadow-2xl dark:bg-gray-900/95 hab-modal-slide-in"
  onClick={(e) => e.stopPropagation()}
>
```
