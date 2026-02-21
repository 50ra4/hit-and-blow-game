# T-019: シェア機能

## 目的

ゲーム結果をSNS（X, LINE, Threads）やWeb Share APIを通じてシェアする機能を実装する。

## 背景

- `docs/01_requirements.md` セクション2.6「シェア機能」
- `docs/04_api.md` セクション2「Web Share API」
- `docs/04_api.md` セクション2.5「フォールバック実装」
- `docs/02_architecture.md` セクション6.2「features/share/」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/features/share/share.schema.ts` | シェアデータのZodスキーマ |
| `src/features/share/shareHelper.ts` | シェアテキスト生成（純粋関数） |
| `src/features/share/useShare.ts` | Web Share APIフック |
| `src/features/share/useFallbackShare.ts` | フォールバックシェアフック |
| `src/features/share/ShareButton/ShareButton.tsx` | シェアボタンコンポーネント |

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/features/game/ResultDisplay/ResultDisplay.tsx` | ShareButton を組み込み |
| `src/i18n/locales/ja.json` | シェア関連の翻訳キー追加 |
| `src/i18n/locales/en.json` | シェア関連の翻訳キー追加 |

### 実装詳細

#### share.schema.ts

`docs/04_api.md` セクション2 の型定義に従う。

```typescript
export const ShareTextDataSchema = z.object({
  mode: GameModeSchema,
  attempts: z.number().int().min(1),
  playType: PlayTypeSchema
});

export type ShareTextData = z.output<typeof ShareTextDataSchema>;
```

#### shareHelper.ts

`docs/04_api.md` セクション2.4 に従う。

```typescript
/**
 * 日本語版シェアテキスト生成
 * 例: 「タイルヒットアンドブロー【ノーマル】を5回でクリア！
 *      #タイルヒットアンドブロー #ヒットアンドブロー #パズルゲーム
 *      https://...」
 */
export function generateShareText(data: ShareTextData): string

/**
 * 英語版シェアテキスト生成
 */
export function generateShareTextEn(data: ShareTextData): string
```

**シェアテキスト要素（`docs/01_requirements.md` セクション2.6）:**
- ゲーム名 + モード名 + クリア回数
- ハッシュタグ: `#タイルヒットアンドブロー #ヒットアンドブロー #パズルゲーム`
- ゲームURL

**デイリーチャレンジ用テキスト（`docs/05_sitemap.md` デイリーチャレンジ参照）:**
- 「タイルヒットアンドブロー 今日の問題 YYYY/MM/DD クリア！」

#### useShare.ts

`docs/04_api.md` セクション2.3 に従う。

```typescript
export function useShare(): {
  canShare: boolean;
  shareText: (data: ShareTextData) => Promise<void>;
}
```

**処理:**
1. `canShare`: `typeof navigator.share !== 'undefined'` で判定
2. `shareText`: Web Share APIで共有（`navigator.share({ text, url })`）

#### useFallbackShare.ts

`docs/04_api.md` セクション2.5 に従う。

```typescript
export function useFallbackShare(): {
  copyToClipboard: (text: string) => Promise<void>;
  openTwitterShare: (text: string) => void;
  openLineShare: (text: string) => void;
  openThreadsShare: (text: string) => void;
}
```

**各SNSのシェアURL:**
- X(Twitter): `https://twitter.com/intent/tweet?text=...`
- LINE: `https://line.me/R/share?text=...`
- Threads: `https://threads.net/intent/post?text=...`

#### ShareButton.tsx

```typescript
type ShareButtonProps = {
  mode: GameMode;
  attempts: number;
  playType: PlayType;
};

export function ShareButton(props: ShareButtonProps) {
  // Web Share API対応時: 共有ボタン1つ
  // 非対応時: 個別SNSボタン（X, LINE, Threads）+ コピーボタン
}
```

## 入出力仕様

### shareHelper

- Input: `ShareTextData`（mode, attempts, playType）
- Output: シェアテキスト文字列

### useShare

- Input: `ShareTextData`
- Output: Web Share API呼び出し

### useFallbackShare

- Input: テキスト文字列
- Output: クリップボードコピー or SNS共有URL遷移

## 受け入れ条件（Definition of Done）

- [ ] Web Share API対応ブラウザでシェアが機能する
- [ ] Web Share API非対応時にフォールバックUI（個別SNSボタン）が表示される
- [ ] シェアテキストにゲーム名・モード名・クリア回数・ハッシュタグ・URLが含まれる
- [ ] デイリーチャレンジ用のシェアテキストに日付が含まれる
- [ ] クリップボードコピーが機能する
- [ ] X(Twitter)シェアURLが正しく生成される
- [ ] LINEシェアURLが正しく生成される
- [ ] ThreadsシェアURLが正しく生成される
- [ ] ResultDisplayにShareButtonが組み込まれている
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: `generateShareText` が正しいフォーマットのテキストを生成する
- 正常系: デイリーチャレンジ用テキストに日付が含まれる
- 正常系: Web Share API対応時に `navigator.share` が呼ばれる
- 正常系: クリップボードコピーが成功する
- 正常系: 各SNSのシェアURLが正しい
- 異常系: Web Share API失敗時にエラーハンドリングされる

## 依存タスク

- T-003（Zodスキーマ — `GameModeSchema`, `PlayTypeSchema` を使用）
- T-004（i18n — 翻訳テキストを使用）
- T-015（ゲームページ — `ResultDisplay` に組み込み）

## 要確認事項

- ~~ゲームURL~~ → **確定: `window.location.origin + import.meta.env.BASE_URL` で実行時に動的生成する。開発環境では `http://localhost:5173/tile-hit-and-blow/`、本番では `https://<username>.github.io/tile-hit-and-blow/` となる。**
- ~~画像シェア~~ → **確定: Phase 1 ではテキストシェアのみ実装する。画像シェア（html2canvas）は実装しない。**
