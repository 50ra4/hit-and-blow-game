# Issue #68: チュートリアルボタンの視認性を高める

## 意図（なぜ必要か）

ホーム画面のチュートリアルリンクが `text-sm text-white/50` の小さなテキストリンクになっており、
初回ユーザーがチュートリアルの存在を見落とすリスクがある。
視認性の高いボタン形式に変更することで、初回ユーザーの離脱を防ぐ。

## 選択理由

- `ButtonLink` コンポーネントが既存実装として存在しており、再利用するのが適切
- `variant="secondary"` は半透明ホワイトのボーダー付きスタイルで、
  ページの他のグラデーション要素（タイトル・モードカード）を妨げず、かつ視認性を確保できる
- `w-full` で横幅いっぱいに広げることで、小さなテキストリンクより明らかに目立つ

## 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/pages/HomePage/HomePage.tsx` | `<Link>` → `<ButtonLink>` に変更 |
| `src/i18n/locales/ja.json` | `home.tutorial` を "初めての方へ - 遊び方を見る" に更新 |
| `src/i18n/locales/en.json` | `home.tutorial` を "First time? - How to play" に更新 |

## タスク

### タスク 1: i18n 翻訳キーを更新

**変更内容**
- `src/i18n/locales/ja.json`: `home.tutorial` → `"初めての方へ - 遊び方を見る"`
- `src/i18n/locales/en.json`: `home.tutorial` → `"First time? - How to play"`

**受け入れ条件**
- `home.tutorial` キーが両言語ファイルで更新されている

---

### タスク 2: HomePage.tsx のチュートリアルリンクをボタンに変更

**変更内容**

```tsx
// 変更前
import { Navigate, Link } from 'react-router-dom';
...
<div className="mb-6 text-center">
  <Link
    to="/tutorial"
    className="text-sm text-white/50 underline-offset-2 transition-colors hover:text-white/80 hover:underline"
  >
    ❓ {t('home.tutorial')}
  </Link>
</div>

// 変更後
import { Navigate } from 'react-router-dom';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
...
<div className="mb-6">
  <ButtonLink to="/tutorial" variant="secondary" className="w-full">
    ❓ {t('home.tutorial')}
  </ButtonLink>
</div>
```

**受け入れ条件**
- `Link` の代わりに `ButtonLink` コンポーネントを使用している
- `text-center` は `ButtonLink` 側で中央揃えを内包するため不要
- `Link` が他の箇所でも使われている場合は import を残す（今回は他箇所でも使用されているため残す）

---

## 受け入れ条件（Issue より）

- [ ] チュートリアルへのリンクがボタン形式で表示される
- [ ] テキストリンクよりも明らかに視認性が高くなっている
- [ ] クリックで `/tutorial` へ遷移する
