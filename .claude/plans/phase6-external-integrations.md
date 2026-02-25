# Phase 6 実装計画 — 外部連携機能（T-019, T-020, T-021）

## 作成日: 2026-02-25

---

## 概要

Phase 6 はシェア・広告・LINE Liff の 3 タスクで構成される。
各タスクは並列実行可能だが、T-019 の `ShareButton.tsx` は T-021（LINE Liff）が完成してから統合する。

---

## 要確認事項

すべて解消済み。

| #   | 内容                              | 結論                                             |
| --- | --------------------------------- | ------------------------------------------------ |
| 1   | LINE LIFF SDK の npm パッケージ名 | `@line/liff`（仕様書の `@liff/liff-sdk` は誤記） |

---

## T-019: シェア機能

### 意図

ゲーム結果を SNS にシェアする手段を提供し、口コミによる拡散を促す。

### 選択理由

- Web Share API: モバイルでのネイティブシェアダイアログを使用し UX を最大化
- フォールバック: デスクトップや非対応ブラウザでも個別 SNS ボタンを表示して機能を維持
- `shareHelper.ts` を純粋関数として実装: テスト容易性を確保し、i18n フックへの依存を排除

### 実装ファイル

#### 新規作成

| ファイル                                         | 内容                                                                 |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| `src/features/share/share.schema.ts`             | `ShareTextDataSchema` / `ShareTextData` 型定義                       |
| `src/features/share/shareHelper.ts`              | `generateShareText`（日本語）・`generateShareTextEn`（英語）純粋関数 |
| `src/features/share/useShare.ts`                 | Web Share API フック（`canShare`, `shareText`）                      |
| `src/features/share/useFallbackShare.ts`         | フォールバックシェアフック（X, LINE, Threads, クリップボード）       |
| `src/features/share/ShareButton/ShareButton.tsx` | シェアボタンコンポーネント                                           |

#### 変更ファイル

| ファイル                                            | 変更内容                                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/features/game/ResultDisplay/ResultDisplay.tsx` | `ShareButton` を組み込み（`isWon` 時のみ表示）。`mode` を destructure に追加 |

※ `ja.json` / `en.json` は既に `result.share`・`error.share.*`・`error.liff.*` のキーが存在するため変更不要。

### 実装詳細

#### share.schema.ts

```typescript
import { z } from 'zod';
import { GameModeSchema, PlayTypeSchema } from '@/features/game/game.schema';

export const ShareTextDataSchema = z.object({
  mode: GameModeSchema,
  attempts: z.number().int().min(1),
  playType: PlayTypeSchema,
});

export type ShareTextData = z.output<typeof ShareTextDataSchema>;
```

#### shareHelper.ts

- モード名は i18n フックを使わず、ファイル内ローカル定数でマッピング（純粋関数のため）
- デイリーチャレンジ時: 「今日の問題 YYYY/MM/DD」形式の日付を含める（`date-fns` の `format` 使用）
- URL: `window.location.origin + import.meta.env.BASE_URL` で動的生成

```typescript
const MODE_NAMES_JA = {
  beginner: 'ビギナー',
  normal: 'ノーマル',
  hard: 'ハード',
  expert: 'エキスパート',
  master: 'マスター',
} as const satisfies Record<GameMode, string>;

const MODE_NAMES_EN = {
  beginner: 'Beginner',
  normal: 'Normal',
  hard: 'Hard',
  expert: 'Expert',
  master: 'Master',
} as const satisfies Record<GameMode, string>;
```

#### useShare.ts

```typescript
export const useShare = (): {
  canShare: boolean;
  shareText: (data: ShareTextData) => Promise<void>;
} => { ... }
```

- `canShare`: `typeof navigator.share !== 'undefined'`
- `shareText`: `navigator.share({ text, url })` → 失敗時は `console.error` + `throw`

#### useFallbackShare.ts

```typescript
export const useFallbackShare = (): {
  copyToClipboard: (text: string) => Promise<void>;
  openTwitterShare: (text: string) => void;
  openLineShare: (text: string) => void;
  openThreadsShare: (text: string) => void;
} => { ... }
```

- X: `https://twitter.com/intent/tweet?text=...`
- LINE: `https://line.me/R/share?text=...`
- Threads: `https://threads.net/intent/post?text=...`
- `window.open(url, '_blank', 'noopener,noreferrer')`

#### ShareButton.tsx

```typescript
type ShareButtonProps = {
  mode: GameMode;
  attempts: number;
  playType: PlayType;
};
```

- `canShare === true` → 共有ボタン 1 つ（Web Share API）
- `canShare === false` → X・LINE・Threads・コピーの 4 ボタン
- T-021 実装後: Liff 環境では「LINE でシェア」ボタンを追加（`useLiff` 統合）

---

## T-020: 広告機能（AdBanner）

### 意図

ゲーム終了後に AdSense 広告を表示し、収益化の基盤を作る。

### 選択理由

- `VITE_ADSENSE_CLIENT_ID` 未設定時に `null` を返すことで、開発環境や AdSense 審査前でもアプリがクラッシュしない設計
- `window.adsbygoogle` 型定義を追加し `any` を排除

### 実装ファイル

#### 新規作成

| ファイル                                | 内容                         |
| --------------------------------------- | ---------------------------- |
| `src/features/ad/AdBanner/AdBanner.tsx` | AdSense バナーコンポーネント |

#### 変更ファイル

| ファイル                                            | 変更内容                                                                                                  |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/features/game/ResultDisplay/ResultDisplay.tsx` | `AdBanner` を組み込み（`show={true}` を常時渡す。ResultDisplay はゲーム終了時のみレンダリングされるため） |
| `index.html`                                        | `<head>` に AdSense スクリプトタグを追加                                                                  |
| `src/vite-env.d.ts`                                 | `Window.adsbygoogle` 型定義を追加                                                                         |

### 実装詳細

#### AdBanner.tsx

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
        // AdSense 読み込み失敗時は無視
      }
    }
  }, [show]);

  if (!show) return null;
  if (!APP_CONFIG.ADSENSE_CLIENT_ID) return null;

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

#### vite-env.d.ts の追加

```typescript
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}
```

---

## T-021: LINE Liff 連携

### 意図

LINE 内ブラウザでの動作と LINE へのシェアを可能にし、LINE ユーザー向けの UX を向上させる。

### 選択理由

- `APP_CONFIG.LIFF_ID` が空の場合は初期化をスキップ → LINE Developer 未登録状態でもアプリがクラッシュしない
- `isLiff === false` の場合は LINE シェアボタンを非表示 → 通常ブラウザのユーザー体験に影響しない
- Phase 1 はテキストシェアのみ（`shareTargetPicker` 使用）

### 実装ファイル

#### 新規作成

| ファイル                       | 内容                 |
| ------------------------------ | -------------------- |
| `src/services/liff/useLiff.ts` | LINE Liff SDK フック |

#### 変更ファイル

| ファイル                                         | 変更内容                                                       |
| ------------------------------------------------ | -------------------------------------------------------------- |
| `package.json`                                   | `@line/liff` を dependencies に追加                            |
| `src/features/share/ShareButton/ShareButton.tsx` | `useLiff` を統合し、Liff 環境時に「LINE でシェア」ボタンを追加 |

### 実装詳細

#### useLiff.ts

```typescript
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
} => { ... }
```

**処理フロー:**

1. `APP_CONFIG.LIFF_ID` が空の場合: 初期化スキップ、`isReady = true`（即時）、`isLiff = false`
2. `liff.init({ liffId: APP_CONFIG.LIFF_ID })` を実行
3. 成功: `isReady = true`、`liff.isInClient()` で `isLiff` を設定
4. Liff 環境の場合: `liff.getProfile()` でプロフィール取得
5. 失敗: `console.error` でログ出力、アプリはクラッシュしない

**shareToLine（Phase 1: テキストのみ）:**

```typescript
await liff.shareTargetPicker([{ type: 'text', text: message }]);
```

---

## 実装順序

```
1. T-019 (シェア機能)
   └── share.schema.ts
   └── shareHelper.ts
   └── useShare.ts
   └── useFallbackShare.ts
   └── ShareButton.tsx（useLiff なし版）
   └── ResultDisplay.tsx（ShareButton 組み込み）
   └── コミット

2. T-020 (広告機能)
   └── AdBanner.tsx
   └── ResultDisplay.tsx（AdBanner 組み込み）
   └── index.html（AdSense スクリプト追加）
   └── vite-env.d.ts（型定義追加）
   └── コミット

3. T-021 (LINE Liff)
   └── @line/liff インストール
   └── useLiff.ts
   └── ShareButton.tsx（useLiff 統合）
   └── コミット
```

---

## 作業ブランチ

`feature/phase6-external-integrations`（main から作成）
