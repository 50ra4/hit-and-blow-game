# T-020: 広告機能（AdBanner）

## 目的

Google AdSenseのバナー広告をゲーム終了後に表示する機能を実装する。

## 背景

- `docs/01_requirements.md` セクション2.7「広告機能」
- `docs/04_api.md` セクション4「Google AdSense」
- `docs/02_architecture.md` セクション2「features/ad/」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/features/ad/AdBanner/AdBanner.tsx` | 広告バナーコンポーネント |

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/features/game/ResultDisplay/ResultDisplay.tsx` | AdBannerを組み込み |
| `index.html` | AdSense スクリプトタグ追加 |

### 実装詳細

#### AdBanner.tsx

`docs/04_api.md` セクション4.3 のコードに従う。

```typescript
type AdBannerProps = {
  show: boolean;
};

export function AdBanner({ show }: AdBannerProps) {
  useEffect(() => {
    if (show && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense読み込み失敗時は無視
      }
    }
  }, [show]);

  if (!show) return null;
  if (!APP_CONFIG.ADSENSE_CLIENT_ID) return null; // 環境変数未設定時は非表示

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={APP_CONFIG.ADSENSE_CLIENT_ID}
        data-ad-slot={APP_CONFIG.ADSENSE_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

**TypeScript型定義（window.adsbygoogle）:**

```typescript
// src/vite-env.d.ts に追加
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}
```

#### index.html の変更

AdSenseスクリプトを `<head>` に追加:

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  crossorigin="anonymous"
></script>
```

**表示タイミング（`docs/04_api.md` セクション4.4）:**
- ゲーム終了時（`isGameOver === true`）に自動表示
- リスタート時は非表示 → 次回ゲーム終了時に再表示

## 入出力仕様

- Input: `show: boolean`（表示/非表示フラグ）
- Output: AdSenseバナー広告のReact要素（または `null`）

## 受け入れ条件（Definition of Done）

- [ ] `show=true` の場合にAdSense広告コードが描画される
- [ ] `show=false` の場合に `null` が返される
- [ ] 環境変数（ADSENSE_CLIENT_ID）未設定時に `null` が返される
- [ ] AdSenseスクリプト読み込み失敗時にエラーが発生しない
- [ ] `ResultDisplay` にAdBannerが組み込まれている
- [ ] `index.html` にAdSenseスクリプトタグが追加されている
- [ ] `window.adsbygoogle` のTypeScript型定義が追加されている
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: `show=true` でAdSense広告コードが表示される
- 正常系: `show=false` で何も表示されない
- 正常系: 環境変数未設定時に何も表示されない
- 異常系: AdSenseスクリプト読み込み失敗時にアプリがクラッシュしない

## 依存タスク

- T-015（ゲームページ — `ResultDisplay` に組み込み）

## 要確認事項

- **前提: 開発中は `VITE_ADSENSE_CLIENT_ID` を空にして広告を非表示にする。AdSense審査完了後に Secrets に設定する。**
- ~~AdSense ID の実際の値~~ → **確定: GitHub Secrets（`VITE_ADSENSE_CLIENT_ID`, `VITE_ADSENSE_SLOT_ID`）で管理する（T-023参照）。未設定時は `AdBanner` が `null` を返す。**
