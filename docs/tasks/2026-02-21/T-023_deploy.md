# T-023: GitHub Actionsデプロイ設定

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/28

## 目的

GitHub Actionsを使用してGitHub Pagesへの自動デプロイパイプラインを構築する。

## 背景

- `docs/01_requirements.md` セクション4.2「ホスティング」— GitHub Pages + GitHub Actions
- `docs/02_architecture.md` セクション8「ビルド・デプロイ設計」
- `docs/05_sitemap.md` セクション「404ページ」— GitHub Pages SPA対応

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `.github/workflows/deploy.yml` | GitHub Actionsデプロイワークフロー |
| `public/404.html` | GitHub Pages用SPAリダイレクト |

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `index.html` | GitHub Pages用リダイレクト処理スクリプト追加 |

### 実装詳細

#### deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm type-check
      - run: pnpm lint
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**環境変数の設定:**
- GitHub Secrets に `VITE_LIFF_ID`, `VITE_ADSENSE_CLIENT_ID`, `VITE_ADSENSE_SLOT_ID` を設定
- ビルドステップで環境変数を渡す:

```yaml
- run: pnpm build
  env:
    VITE_LIFF_ID: ${{ secrets.VITE_LIFF_ID }}
    VITE_ADSENSE_CLIENT_ID: ${{ secrets.VITE_ADSENSE_CLIENT_ID }}
    VITE_ADSENSE_SLOT_ID: ${{ secrets.VITE_ADSENSE_SLOT_ID }}
```

#### 404.html（GitHub Pages SPA対応）

`docs/05_sitemap.md` セクション「GitHub Pages対応」に従う。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <script>
    sessionStorage.setItem('redirectPath', location.pathname);
    location.replace('/tile-hit-and-blow/');
  </script>
</head>
<body></body>
</html>
```

> **注意**: `location.replace` のパスは `vite.config.ts` の `base` と一致させること。

#### index.html のリダイレクト処理追加

```html
<script>
  (function() {
    const redirect = sessionStorage.getItem('redirectPath');
    if (redirect) {
      sessionStorage.removeItem('redirectPath');
      history.replaceState(null, null, redirect);
    }
  })();
</script>
```

## 入出力仕様

- Input: `main` ブランチへのプッシュ
- Output: GitHub Pagesへの自動デプロイ

## 受け入れ条件（Definition of Done）

- [ ] `.github/workflows/deploy.yml` が作成されている
- [ ] `main` ブランチへのプッシュでワークフローがトリガーされる
- [ ] ワークフローで `pnpm install` → `type-check` → `lint` → `build` が順次実行される
- [ ] ビルド成果物が GitHub Pages にデプロイされる
- [ ] `public/404.html` が作成されている
- [ ] SPA対応のリダイレクト処理が `index.html` に追加されている
- [ ] 環境変数がGitHub Secretsから渡される設定になっている

## テスト観点

- 正常系: `main` へのプッシュでデプロイワークフローが実行される
- 正常系: デプロイ後、GitHub PagesのURLでアプリにアクセスできる
- 正常系: `/games/free` 等のサブパスに直接アクセスしてもSPA対応で正しいページが表示される
- 異常系: ビルドエラー時にデプロイが実行されない

## 依存タスク

- T-001（プロジェクト初期セットアップ — `package.json`, `vite.config.ts`）

## 要確認事項

- **手動作業: GitHub Pages の Settings > Pages > Source を「GitHub Actions」に設定すること**
- **手動作業: GitHub Secrets に `VITE_LIFF_ID`, `VITE_ADSENSE_CLIENT_ID`, `VITE_ADSENSE_SLOT_ID` を設定すること（空値でも可）**
- ~~pnpm バージョン固定~~ → **確定: `package.json` の `packageManager` フィールドと `pnpm/action-setup` の `version` を一致させる（T-001でpackage.jsonに`packageManager: "pnpm@9.x.x"`を設定する）**
- ~~404.html リダイレクト先パスの確認~~ → **確定: `/tile-hit-and-blow/` を使用する（T-001参照）**
