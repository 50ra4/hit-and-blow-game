# Phase 7 実装計画: アセット・デプロイ

## 作成日: 2026-02-25

## 対象 GitHub Issue

- T-022: https://github.com/50ra4/hit-and-blow-game/issues/27
- T-023: https://github.com/50ra4/hit-and-blow-game/issues/28

---

## 意図（なぜ必要か）

- **T-022**: ゲームをPWAとして配信するために、SVGタイルアイコン・マニフェスト・OGPなどの静的アセットが必要。SNSシェア・スマホホーム画面追加に対応する。
- **T-023**: CI/CDパイプラインを整備し、`main` ブランチへのプッシュで自動的にGitHub Pagesへデプロイできるようにする。コード品質チェック（type-check, lint）をデプロイ前に実行することで品質を担保する。

---

## 現状分析

### 既に実装済み（手を加えない）

| ファイル                             | 状態                                                |
| ------------------------------------ | --------------------------------------------------- |
| `public/404.html`                    | ✅ 完成（`__VITE_BASE_URL__` プレースホルダー方式） |
| `index.html` の SPA リダイレクト処理 | ✅ 完成                                             |
| `.github/workflows/ci.yml`           | ✅ 完成（PR時のCI）                                 |

### T-023: deploy.yml の修正が必要

現状の `deploy.yml` は `pnpm type-check` と `pnpm lint` が抜けている。
**選択理由**: ci.yml との一貫性を保つため、デプロイ前にも type-check/lint を実行する。

### T-022: 全て未作成

| ファイル                                | 状態      |
| --------------------------------------- | --------- |
| `public/assets/tiles/*.svg` (8ファイル) | ❌ 未作成 |
| `public/manifest.json`                  | ❌ 未作成 |
| `public/robots.txt`                     | ❌ 未作成 |
| `public/icons/icon-192.png`             | ❌ 未作成 |
| `public/icons/icon-512.png`             | ❌ 未作成 |
| `index.html` の OGP/PWA メタタグ        | ❌ 未追加 |

---

## 実装方針

### SVGタイル (8ファイル)

- viewBox: `0 0 64 64`、各シンボルを指定色で描画
- シンプルなパスで構成（ストロークなし、塗りつぶしのみ）

### PWAアイコン (PNG)

ImageMagick 未インストールのため、**Node.js 組み込み `zlib` モジュールを使った PNG 生成スクリプト**で作成。
スクリプト実行後、生成されたPNGをコミット対象とする（スクリプト自体はコミットしない）。
**選択理由**: 外部パッケージ追加不要、Node.js built-inのみで完結できる。

### OGP URL

- `og:url`: `https://50ra4.github.io/tile-hit-and-blow/`（確定URLを使用）
- `og:image`: `/tile-hit-and-blow/ogp.png`（プレースホルダー、後で差し替え可）
- **選択理由**: `index.html` は静的ファイルのため動的生成は不可。GitHub PagesのURLを直接設定。

---

## タスク分割と実装順序

### Step 1: 作業ブランチ作成

```bash
git checkout main && git pull
git checkout -b feature/phase7-assets-deploy
```

### Step 2: T-023 deploy.yml 修正（コミット1）

`deploy.yml` に `pnpm type-check` と `pnpm lint` ステップを追加。

**変更内容:**

```yaml
- run: pnpm install --frozen-lockfile
+ - run: pnpm type-check
+ - run: pnpm lint
- run: pnpm build
```

### Step 3: T-022 SVGタイルアセット作成（コミット2）

8ファイルを `public/assets/tiles/` に作成：

| ファイル       | シンボル | 色      |
| -------------- | -------- | ------- |
| `star.svg`     | 5角星    | #FBBF24 |
| `circle.svg`   | 円       | #EF4444 |
| `triangle.svg` | 正三角形 | #3B82F6 |
| `square.svg`   | 正方形   | #10B981 |
| `diamond.svg`  | ひし形   | #8B5CF6 |
| `spade.svg`    | スペード | #1F2937 |
| `heart.svg`    | ハート   | #EC4899 |
| `club.svg`     | クラブ   | #F97316 |

### Step 4: T-022 manifest.json・robots.txt 作成（コミット3）

- `public/manifest.json`（タスク仕様通り）
- `public/robots.txt`（全クローラー許可）

### Step 5: T-022 PWAアイコン生成（コミット4）

Node.js スクリプト（一時ファイル）で `public/icons/icon-192.png` と `public/icons/icon-512.png` を生成。
生成後スクリプトを削除し、PNGファイルのみコミット。

### Step 6: T-022 index.html OGP/PWA タグ追加（コミット5）

`index.html` の `<head>` に追加：

- PWA: `<link rel="manifest">`, `<meta name="theme-color">`, `<link rel="apple-touch-icon">`
- OGP: `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:site_name`, `og:locale`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

---

## 受け入れ条件確認

### T-022

- [ ] 8つのSVGファイルが `public/assets/tiles/` に作成されている
- [ ] 各SVGが正しい色・形状で表示される
- [ ] `manifest.json` が `public/` に作成されている
- [ ] PWAアイコン（192x192, 512x512）が作成されている
- [ ] `index.html` にOGPメタタグが追加されている
- [ ] `index.html` にmanifestリンクが追加されている
- [ ] `robots.txt` が作成されている
- [ ] `pnpm build` で静的アセットが `dist/` に含まれる

### T-023

- [ ] `main` ブランチへのプッシュでワークフローがトリガーされる
- [ ] ワークフローで `pnpm install` → `type-check` → `lint` → `build` が順次実行される
- [ ] ビルド成果物が GitHub Pages にデプロイされる

---

## 未実装として残すもの（手動対応が必要）

- GitHub Pages の Settings > Pages > Source を「GitHub Actions」に設定
- GitHub Secrets に `VITE_LIFF_ID`, `VITE_ADSENSE_CLIENT_ID`, `VITE_ADSENSE_SLOT_ID`, `VITE_BASE_URL` を設定
- OGP画像 (`ogp.png`) の実制作（1200x630px）
- PWAアイコンの本番デザイン差し替え
