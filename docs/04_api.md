# 04_api.md - API設計書

## 1. API概要

本プロジェクトは **フロントエンドのみのSPA** であり、独自のバックエンドAPIは持たない。  
以下の外部サービス・ブラウザAPIと連携する。

| サービス/API | 用途 | Phase |
|-------------|------|-------|
| **Web Share API** | SNSシェア機能 | Phase 1 |
| **LINE Liff SDK** | LINE内ブラウザでの動作・シェア | Phase 1 |
| **Google AdSense** | 広告表示 | Phase 1 |
| **html2canvas** | 結果画像生成 | Phase 2 |
| **Service Worker** | PWAキャッシュ・オフライン動作 | Phase 2 |
| **Web App Manifest** | PWAインストール | Phase 2 |

---

## 2. Web Share API

### 2.1 概要

ネイティブのシェア機能を利用してSNSへ共有

### 2.2 対応ブラウザ

- iOS Safari（iOS 12.2+）
- Android Chrome（Chrome 61+）
- デスクトップ版は一部非対応

### 2.3 実装設計

```typescript
// features/share/useShare.ts
export const useShare = (): {
  canShare: boolean;
  shareText: (data: ShareTextData) => Promise<void>;
  shareImage: (data: ShareImageData) => Promise<void>;
} => {
  const canShare = typeof navigator.share !== 'undefined';

  const shareText = async (data: ShareTextData) => {
    // Web Share API でテキストを共有
    // 引数: { mode: GameMode; attempts: number; playType: PlayType }
    // （実装は略）
  };

  const shareImage = async (data: ShareImageData) => {
    // Web Share API で画像付きで共有（Phase 2）
    // 引数: { canvas: HTMLCanvasElement; mode: GameMode; attempts: number }
    // （実装は略）
  };

  return { canShare, shareText, shareImage };
};
```

#### ShareTextData型

```typescript
// features/share/share.schema.ts
import { z } from 'zod';
import { GameModeSchema, PlayTypeSchema } from '@/features/game/game.schema';

export const ShareTextDataSchema = z.object({
  mode: GameModeSchema,
  attempts: z.number().int().min(1),
  playType: PlayTypeSchema
});

export type ShareTextData = z.output<typeof ShareTextDataSchema>;
```

#### ShareImageData型

```typescript
// features/share/share.schema.ts
export const ShareImageDataSchema = z.object({
  canvas: z.instanceof(HTMLCanvasElement),
  mode: GameModeSchema,
  attempts: z.number().int().min(1)
});

export type ShareImageData = z.output<typeof ShareImageDataSchema>;
```

### 2.4 シェアテキスト生成

```typescript
// features/share/shareHelper.ts
export const generateShareText = (data: ShareTextData): string => {
  // 日本語版シェアテキスト生成
  // 例: 「シンボルヒットアンドブロー【ノーマル】を5回でクリア！ #タイルヒットアンドブロー https://...」
  // （実装は略）
};

export const generateShareTextEn = (data: ShareTextData): string => {
  // 英語版シェアテキスト生成
  // （実装は略）
};
```

### 2.5 フォールバック実装

Web Share API 非対応時の代替手段

```typescript
// features/share/useFallbackShare.ts
export const useFallbackShare = (): {
  copyToClipboard: (text: string) => Promise<void>;
  openTwitterShare: (text: string) => void;
  openLineShare: (text: string) => void;
  openThreadsShare: (text: string) => void;
} => {
  const copyToClipboard = async (text: string) => {
    // Clipboard API でテキストをコピー
    // （実装は略）
  };

  const openTwitterShare = (text: string) => {
    // X(Twitter)のシェアURLを開く
    // https://twitter.com/intent/tweet?text=...
    // （実装は略）
  };

  const openLineShare = (text: string) => {
    // LINEのシェアURLを開く（モバイルのみ）
    // https://line.me/R/share?text=...
    // （実装は略）
  };

  const openThreadsShare = (text: string) => {
    // ThreadsのシェアURLを開く
    // https://threads.net/intent/post?text=...
    // （実装は略）
  };

  return {
    copyToClipboard,
    openTwitterShare,
    openLineShare,
    openThreadsShare
  };
};
```

---

## 3. LINE Liff SDK

### 3.1 概要

LINE内ブラウザでの動作とLINEへのシェア機能

### 3.2 Liff ID設定

```bash
# .env
VITE_LIFF_ID=your-liff-id-here
```

```typescript
// consts/config.ts
export const APP_CONFIG = {
  // ...
  LIFF_ID: import.meta.env.VITE_LIFF_ID || '',
} as const;
```

### 3.3 実装設計

```typescript
// services/liff/useLiff.ts
type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

export const useLiff = (): {
  isLiff: boolean;
  isReady: boolean;
  profile: LiffProfile | null;
  shareToLine: (message: string) => Promise<void>;
  shareImageToLine: (imageUrl: string, message: string) => Promise<void>;
} => {
  const isLiff = liff.isInClient();
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);

  useEffect(() => {
    // liff.init() を実行
    // プロフィール情報を取得（オプション）
    // （実装は略）
  }, []);

  const shareToLine = async (message: string) => {
    // Phase 1: テキストのみ送信
    // liff.shareTargetPicker() を使用
    // （実装は略）
  };

  const shareImageToLine = async (imageUrl: string, message: string) => {
    // Phase 2: 画像付きメッセージ送信
    // Flex Message を使用
    // （実装は略）
  };

  return {
    isLiff,
    isReady,
    profile,
    shareToLine,
    shareImageToLine
  };
};
```

### 3.4 LINE シェアメッセージ仕様

#### Phase 1: テキストのみ

```json
{
  "type": "text",
  "text": "シンボルヒットアンドブロー【ノーマル】を5回でクリア！\n#タイルヒットアンドブロー\nhttps://..."
}
```

#### Phase 2: Flex Message（画像付き）

```json
{
  "type": "flex",
  "altText": "ゲーム結果をシェアしました",
  "contents": {
    "type": "bubble",
    "hero": {
      "type": "image",
      "url": "https://...",
      "size": "full"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "ノーマルを5回でクリア！",
          "weight": "bold",
          "size": "xl"
        }
      ]
    }
  }
}
```

---

## 4. Google AdSense

### 4.1 概要

ゲーム終了後にバナー広告を自動表示

### 4.2 AdSense設定

```bash
# .env
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxx
VITE_ADSENSE_SLOT_ID=xxxxxxxxxx
```

```typescript
// consts/config.ts
export const APP_CONFIG = {
  // ...
  ADSENSE_CLIENT_ID: import.meta.env.VITE_ADSENSE_CLIENT_ID || '',
  ADSENSE_SLOT_ID: import.meta.env.VITE_ADSENSE_SLOT_ID || '',
} as const;
```

### 4.3 実装設計

```typescript
// features/ad/AdBanner/AdBanner.tsx
export const AdBanner: React.FC<{
  show: boolean;
}> = ({ show }) => {
  useEffect(() => {
    if (show && typeof window !== 'undefined') {
      // Google AdSense スクリプトの動的読み込み
      // (adsbygoogle = window.adsbygoogle || []).push({});
      // （実装は略）
    }
  }, [show]);

  if (!show) return null;

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
};
```

### 4.4 表示タイミング

- ゲーム終了時（`isGameOver === true`）に自動表示
- リスタート時は非表示→次回ゲーム終了時に再表示

---

## 5. html2canvas（結果画像生成）

### 5.1 概要

ゲーム結果画面をキャンバスに変換してシェア用画像を生成（Phase 2）

### 5.2 実装設計

```typescript
// utils/imageGenerator.ts
export const generateResultImage = async (
  element: HTMLElement
): Promise<HTMLCanvasElement> => {
  // html2canvas でHTML要素をキャンバスに変換
  // （実装は略）
};

export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  // Canvas を Blob に変換
  // （実装は略）
};

export const canvasToDataURL = (canvas: HTMLCanvasElement): string => {
  // Canvas を Data URL に変換
  // （実装は略）
};
```

### 5.3 画像仕様

| 項目 | 値 |
|------|-----|
| **サイズ** | 1200x630px（OGP推奨） |
| **形式** | PNG |
| **内容** | モード名、試行回数、ロゴ |
| **背景** | テーマカラー |

### 5.4 使用例

```typescript
// features/share/ResultImage/ResultImage.tsx
export const ResultImage: React.FC<{
  mode: GameMode;
  attempts: number;
}> = ({ mode, attempts }) => {
  const imageRef = useRef<HTMLDivElement>(null);

  const handleGenerateImage = async () => {
    if (!imageRef.current) return;
    const canvas = await generateResultImage(imageRef.current);
    // canvas を使ってシェア
    // （実装は略）
  };

  return (
    <div ref={imageRef} className="result-image">
      {/* モード名、試行回数などを表示 */}
    </div>
  );
};
```

---

## 6. Service Worker（PWA）

### 6.1 概要

PWAのオフライン動作とキャッシュ管理（Phase 2）

### 6.2 キャッシュ戦略

| リソース | 戦略 | 理由 |
|---------|------|------|
| **HTML** | Stale While Revalidate | 速度と更新のバランス |
| **JS/CSS** | Cache First | Viteのハッシュ付きファイル名で管理 |
| **SVG画像** | Cache First | 静的リソース（変更なし） |
| **外部API** | Network Only | AdSense、Liffは常に最新 |

### 6.3 実装設計

```typescript
// public/sw.js
const CACHE_NAME = 'tile-hab-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/tiles/star.svg',
  '/assets/tiles/circle.svg',
  // ... 他のSVGファイル
];

self.addEventListener('install', (event) => {
  // キャッシュにリソースを保存
  // （実装は略）
});

self.addEventListener('fetch', (event) => {
  // リソースタイプに応じたキャッシュ戦略を適用
  // HTML: Stale While Revalidate
  // JS/CSS: Cache First
  // SVG: Cache First
  // 外部API: Network Only
  // （実装は略）
});
```

### 6.4 Service Worker登録

```typescript
// src/main.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
      });
  });
}
```

### 6.5 オフライン時の動作

- **ゲームプレイ**: 完全動作OK（localStorageで統計管理）
- **広告表示**: 非表示（ネットワーク必須）
- **シェア機能**: 無効化（オフライン警告表示）
- **デイリーチャレンジ**: 動作OK（日付はローカル時刻で判定）

---

## 7. Web App Manifest（PWA）

### 7.1 概要

PWAとしてホーム画面に追加可能にする設定（Phase 2）

### 7.2 manifest.json

```json
// public/manifest.json
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

### 7.3 HTML設定

```html
<!-- public/index.html -->
<head>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#3B82F6">
  <link rel="apple-touch-icon" href="/icons/icon-192.png">
</head>
```

---

## 8. エラーハンドリング

### 8.1 ネットワークエラー

```typescript
// services/errorHandler.ts
export const handleNetworkError = (error: Error): void => {
  // オフライン検知
  if (!navigator.onLine) {
    // オフライン警告表示
    // （実装は略）
  }
  
  // その他のネットワークエラー
  console.error('Network error:', error);
};
```

### 8.2 API呼び出しエラー

| API | エラー時の動作 |
|-----|-------------|
| **Web Share API** | フォールバックUI表示（コピー・個別SNSボタン） |
| **LINE Liff** | エラーモーダル表示、通常シェア機能へフォールバック |
| **AdSense** | 広告非表示（ゲームは続行可能） |
| **html2canvas** | 画像生成失敗モーダル、テキストシェアのみ可能 |

### 8.3 エラーメッセージ（i18n）

```json
// i18n/locales/ja.json
{
  "error": {
    "network": {
      "offline": "オフラインです。一部機能が制限されます。",
      "shareUnavailable": "シェア機能はオンライン時のみ利用可能です。"
    },
    "share": {
      "failed": "シェアに失敗しました。",
      "imageGenerationFailed": "画像の生成に失敗しました。"
    },
    "liff": {
      "initFailed": "LINE連携の初期化に失敗しました。"
    }
  }
}
```

---

## 9. セキュリティ・プライバシー

### 9.1 データ収集

- **収集しないデータ**: 個人情報、位置情報、デバイス情報
- **収集するデータ**: なし（localStorageのみ使用）

### 9.2 外部サービスのプライバシー

| サービス | データ送信 | プライバシーポリシー |
|---------|----------|-------------------|
| **Google AdSense** | Cookie、閲覧履歴 | [Google Privacy Policy](https://policies.google.com/privacy) |
| **LINE Liff** | ユーザーID（オプション） | [LINE Privacy Policy](https://line.me/ja/terms/policy/) |

### 9.3 環境変数の管理

- `.env` ファイルは `.gitignore` に追加
- `.env.example` を用意してサンプルを提供
- GitHub Secrets で本番環境の環境変数を管理

---

## 10. API利用制限・費用

| サービス | 無料枠 | 超過時の費用 | 想定利用量 |
|---------|-------|------------|----------|
| **Google AdSense** | 無料 | - | 無制限 |
| **LINE Liff** | 無料 | - | 無制限 |
| **Web Share API** | 無料（ブラウザ標準） | - | 無制限 |
| **Service Worker** | 無料（ブラウザ標準） | - | 無制限 |

**月額費用合計: 0円**

---

**作成日**：2025年1月  
**バージョン**：1.0