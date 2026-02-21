# T-022: 静的アセット（SVG・PWAマニフェスト・OGP）

## 目的

ゲームで使用するSVGタイルアイコン、PWAマニフェスト、OGP設定などの静的アセットを作成する。

## 背景

- `docs/02_architecture.md` セクション2「ディレクトリ構成」— `public/` 配下
- `docs/01_requirements.md` セクション2.1「シンボル仕様」— 8種類のSVGアイコン
- `docs/05_sitemap.md` セクション「OGP設定」
- `docs/04_api.md` セクション7「Web App Manifest（PWA）」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `public/assets/tiles/star.svg` | 星（黄: #FBBF24） |
| `public/assets/tiles/circle.svg` | 丸（赤: #EF4444） |
| `public/assets/tiles/triangle.svg` | 三角（青: #3B82F6） |
| `public/assets/tiles/square.svg` | 四角（緑: #10B981） |
| `public/assets/tiles/diamond.svg` | ダイヤ（紫: #8B5CF6） |
| `public/assets/tiles/spade.svg` | スペード（黒: #1F2937） |
| `public/assets/tiles/heart.svg` | ハート（ピンク: #EC4899） |
| `public/assets/tiles/club.svg` | クラブ（オレンジ: #F97316） |
| `public/manifest.json` | PWAマニフェスト |
| `public/robots.txt` | クローラー設定 |
| `public/icons/icon-192.png` | PWAアイコン（192x192） |
| `public/icons/icon-512.png` | PWAアイコン（512x512） |

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `index.html` | OGPメタタグ追加、manifestリンク追加、apple-touch-icon追加 |

### 実装詳細

#### SVGタイル

各SVGファイルは以下の仕様で作成:

| ファイル | シンボル | 色 | 形状 |
|---------|---------|------|------|
| `star.svg` | ★ | #FBBF24（黄） | 5角星 |
| `circle.svg` | ● | #EF4444（赤） | 円 |
| `triangle.svg` | ▲ | #3B82F6（青） | 正三角形 |
| `square.svg` | ■ | #10B981（緑） | 正方形 |
| `diamond.svg` | ◆ | #8B5CF6（紫） | ひし形 |
| `spade.svg` | ♠ | #1F2937（黒） | スペード |
| `heart.svg` | ♥ | #EC4899（ピンク） | ハート |
| `club.svg` | ♣ | #F97316（オレンジ） | クラブ |

**SVG仕様:**
- viewBox: `0 0 64 64`
- 塗りつぶし色: 上記の色
- ストロークなし
- シンプルなパスで構成

#### manifest.json

`docs/04_api.md` セクション7.2 に従う。

```json
{
  "name": "タイルヒットアンドブロー",
  "short_name": "タイルH&B",
  "description": "シンボルを使った推理ゲーム",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

#### index.html OGP設定

`docs/05_sitemap.md` セクション「OGP設定」に従う。

```html
<head>
  <!-- PWA -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#3B82F6">
  <link rel="apple-touch-icon" href="/icons/icon-192.png">

  <!-- OGP -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="タイルヒットアンドブロー | タイル推理ゲーム" />
  <meta property="og:description" content="8種類のタイルを使った推理ゲーム。毎日新しい問題に挑戦しよう！" />
  <meta property="og:image" content="https://..." />
  <meta property="og:locale" content="ja_JP" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="タイルヒットアンドブロー | タイル推理ゲーム" />
  <meta name="twitter:description" content="8種類のタイルを使った推理ゲーム。毎日新しい問題に挑戦しよう！" />
</head>
```

## 入出力仕様

- Input: なし（静的ファイル）
- Output: ブラウザで使用可能なSVG画像・PWA設定・OGPメタ情報

## 受け入れ条件（Definition of Done）

- [ ] 8つのSVGファイルが `public/assets/tiles/` に作成されている
- [ ] 各SVGが正しい色・形状で表示される
- [ ] `manifest.json` が `public/` に作成されている
- [ ] PWAアイコン（192x192, 512x512）が作成されている
- [ ] `index.html` にOGPメタタグが追加されている
- [ ] `index.html` にmanifestリンクが追加されている
- [ ] `robots.txt` が作成されている
- [ ] `pnpm build` で静的アセットが `dist/` に含まれる

## テスト観点

- 正常系: 各SVGファイルがブラウザで正しく表示される
- 正常系: `manifest.json` が正しいJSON形式である
- 正常系: OGPメタタグが正しく設定されている

## 依存タスク

- T-001（プロジェクト初期セットアップ — `public/` ディレクトリ、`index.html`）

## 要確認事項

- ~~OGP URL~~ → **確定: `og:url` は `window.location.origin + import.meta.env.BASE_URL` で動的生成。`og:image` は後で差し替え可能なプレースホルダーを設定（空値でも可）。**
- ~~PWAアイコンデザイン~~ → **確定: 青（#3B82F6）背景にシンプルなタイルシルエットのプレースホルダーアイコンを作成する。後で差し替え可能。**
- ~~アプリ表示名の不一致~~ → **確定: 「タイルヒットアンドブロー」を使用する**
