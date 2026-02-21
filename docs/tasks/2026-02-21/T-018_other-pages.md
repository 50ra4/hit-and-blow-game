# T-018: その他ページ（利用規約・プライバシーポリシー・404）

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/23

## 目的

利用規約、プライバシーポリシー、404（Not Found）の3ページを実装する。

## 背景

- `docs/05_sitemap.md` セクション「6. 利用規約」「7. プライバシーポリシー」「8. 404ページ」
- `docs/04_api.md` セクション9「セキュリティ・プライバシー」

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/pages/TermsPage.tsx` | 利用規約ページ |
| `src/pages/PrivacyPage.tsx` | プライバシーポリシーページ |
| `src/pages/NotFoundPage.tsx` | 404ページ |

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/i18n/locales/ja.json` | 利用規約・プライバシー・404の翻訳キー追加 |
| `src/i18n/locales/en.json` | 利用規約・プライバシー・404の翻訳キー追加 |

### 実装詳細

#### TermsPage.tsx

```typescript
export default function TermsPage() {
  const { t } = useTranslation();
  // 利用規約テキストを表示
}
```

**表示内容（`docs/05_sitemap.md` 参照）:**

以下の内容を日本語で表示する。英語ページは省略し、日本語のみで実装する。

1. **サービスの目的**: 個人が開発・提供する無料のブラウザゲームであること
2. **禁止事項**: 本サービスへの不正アクセス、リバースエンジニアリング、他ユーザーへの迷惑行為
3. **免責事項**: サービスの正確性・継続性を保証しない。利用によって生じた損害について責任を負わない
4. **規約の変更**: 予告なく変更する場合がある
5. **準拠法**: 日本法に準拠する

#### PrivacyPage.tsx

```typescript
export default function PrivacyPage() {
  const { t } = useTranslation();
  // プライバシーポリシーテキストを表示
}
```

**表示内容（`docs/05_sitemap.md` + `docs/04_api.md` セクション9 参照）:**

以下の内容を日本語で表示する。

1. **収集する情報**: ブラウザのlocalStorageにゲームの統計・設定データを保存する。サーバーへの個人情報送信は行わない
2. **Google AdSense**: 広告配信のため、Googleがブラウザに関する情報を収集する場合がある。詳細は [Googleのプライバシーポリシー](https://policies.google.com/privacy) を参照
3. **Cookieの使用**: Google AdSenseの広告表示のためにCookieが使用される
4. **お問い合わせ**: GitHub Issues（リポジトリのURLへのリンクを表示）

#### NotFoundPage.tsx

```typescript
export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // 404エラー画面を表示
}
```

**表示内容（`docs/05_sitemap.md` 参照）:**
- エラーメッセージ: `404 - ページが見つかりません`
- 補足テキスト: `お探しのページは存在しないか、移動した可能性があります。`
- ホームに戻るボタン（大きく目立つ）

## 入出力仕様

- Input: なし
- Output: 各ページのReact要素

## 受け入れ条件（Definition of Done）

- [ ] 利用規約ページが `/terms` で表示される
- [ ] プライバシーポリシーページが `/privacy` で表示される
- [ ] 404ページが未定義パスで表示される
- [ ] 404ページの「ホームに戻る」ボタンで `/` に遷移する
- [ ] 各ページの翻訳キーが `ja.json`, `en.json` に追加されている
- [ ] レスポンシブデザインに対応する
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: `/terms` で利用規約が表示される
- 正常系: `/privacy` でプライバシーポリシーが表示される
- 正常系: `/unknown-path` で404ページが表示される
- 正常系: 404ページのホームボタンで `/` に遷移する

## 依存タスク

- T-011（共通UI — `Button` を使用）
- T-013（ルーティング）

## 要確認事項

- ~~利用規約の本文~~ → **確定: 実装詳細の内容で実装する**
- ~~プライバシーポリシーの本文~~ → **確定: 実装詳細の内容で実装する（Google AdSense記載あり）**
- ~~お問い合わせ先~~ → **確定: GitHub Issuesページへのリンクを記載する**
