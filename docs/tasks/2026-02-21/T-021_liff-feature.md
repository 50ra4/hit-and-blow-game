# T-021: LINE Liff連携

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/26

## 目的

LINE Liff SDKを導入し、LINE内ブラウザでの動作とLINEへのシェア機能を実装する。

## 背景

- `docs/04_api.md` セクション3「LINE Liff SDK」
- `docs/02_architecture.md` セクション6.3「services/liff/useLiff.ts」
- `docs/01_requirements.md` セクション3.1「LINEアプリ」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/services/liff/useLiff.ts` | LINE Liffフック |

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `package.json` | `@liff/liff-sdk` を依存パッケージに追加 |
| `src/features/share/ShareButton/ShareButton.tsx` | LINE Liff環境時のシェアボタン追加 |

### 実装詳細

#### useLiff.ts

`docs/04_api.md` セクション3.3 の設計に従う。

```typescript
type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

export function useLiff(): {
  isLiff: boolean;
  isReady: boolean;
  profile: LiffProfile | null;
  shareToLine: (message: string) => Promise<void>;
}
```

**処理フロー:**

1. **初期化:**
   - `APP_CONFIG.LIFF_ID` が空の場合は初期化をスキップ
   - `liff.init({ liffId: APP_CONFIG.LIFF_ID })` を実行
   - 成功時: `isReady = true`
   - `liff.isInClient()` で Liff環境かを判定 → `isLiff`
   - Liff環境の場合: `liff.getProfile()` でプロフィール取得（オプション）

2. **shareToLine:**
   - `liff.shareTargetPicker()` を使用してLINEにテキストメッセージを送信
   - Phase 1: テキストのみ（`docs/04_api.md` セクション3.4 Phase 1）

**LINEシェアメッセージ（Phase 1）:**

```json
{
  "type": "text",
  "text": "タイルヒットアンドブロー【ノーマル】を5回でクリア！\n#タイルヒットアンドブロー\nhttps://..."
}
```

#### ShareButton.tsx の変更

- `useLiff` の `isLiff` を確認
- Liff環境の場合: 「LINEでシェア」ボタンを追加
- ボタンクリック時: `shareToLine()` を呼び出し

## 入出力仕様

### useLiff

- Input: なし（`APP_CONFIG.LIFF_ID` を環境変数から取得）
- Output: Liff状態・プロフィール・シェア関数

## 受け入れ条件（Definition of Done）

- [ ] `@liff/liff-sdk` がインストールされている
- [ ] `useLiff` フックがLiff SDKを初期化する
- [ ] LIFF_ID未設定時にSDK初期化をスキップしてエラーが発生しない
- [ ] `isLiff` がLINE内ブラウザで `true` を返す
- [ ] `shareToLine` がテキストメッセージをLINEに送信する
- [ ] ShareButtonにLINEシェアボタンが追加されている（Liff環境時のみ）
- [ ] Liff初期化失敗時にアプリがクラッシュしない
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: 通常ブラウザで `isLiff = false`、アプリが正常動作する
- 正常系: LIFF_ID未設定時にSDK初期化がスキップされる
- 異常系: Liff初期化失敗時にエラーが適切にハンドリングされる
- 正常系: LINE内ブラウザで `isLiff = true`（LINE Developersでのテストが必要）

## 依存タスク

- T-013（ルーティング — アプリの基本構成が必要）

## 要確認事項

- **手動作業: LINE Developers でアプリ登録・LIFF ID取得が必要。未登録の場合はLIFF_IDを空にして機能をスキップ（アプリはクラッシュしない）。**
- ~~@liff/liff-sdk バージョン~~ → **確定: インストール時の最新安定版を使用する**
- ~~通常ブラウザでの liff.init() の挙動~~ → **確定: 通常ブラウザでも初期化は成功し、`liff.isInClient()` が `false` を返す。`isLiff = false` の場合はLINEシェアボタンを非表示にする。**
