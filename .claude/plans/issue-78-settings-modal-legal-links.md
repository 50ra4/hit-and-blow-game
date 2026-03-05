# Issue #78: 設定モーダルに利用規約・プライバシーポリシーリンクを追加

## 概要

設定モーダルの最下部に「利用規約」「プライバシーポリシー」のリンクを追加する。

**意図（なぜ必要か）**: モックデザイン（`docs/06_mock_design.html`）ではモーダル下部に規約リンクが存在するが実装に含まれていない。ユーザーが設定画面から直接規約・プライバシーポリシーにアクセスできる導線を提供するため。

**選択理由**: `Link` コンポーネント（react-router-dom）はすでに `AppLayout.tsx` でインポート済みで流用可能。i18n キー `nav.terms`・`nav.privacy` も ja/en 両言語に定義済みのため新規追加不要。`useNavigate` ではなく `Link` + `onClick` を選択するのは、リンクとしての意味論とモーダルクローズの副作用を両立できるため（Reactルーティング規約に準拠）。

---

## 変更ファイル

| ファイル | 変更内容 |
| --- | --- |
| `src/layouts/AppLayout/AppLayout.tsx` | 設定モーダルコンテンツ末尾に規約リンクブロックを追加 |

---

## タスク

### Task 1: 設定モーダルに規約リンクを追加

#### 受け入れ条件

- [ ] 設定モーダルの下部に「利用規約」「プライバシーポリシー」のリンクが横並びで表示される
- [ ] リンクをクリックするとモーダルが閉じ、該当ページへ遷移する
- [ ] リンクは控えめなスタイル（小さな文字・グレー系）で表示される

#### 実装詳細

**ファイル**: `src/layouts/AppLayout/AppLayout.tsx`

**変更箇所**: 185〜186行目付近、`</div>` (space-y-6 の閉じタグ) の直前に以下を挿入する。

変更前（185〜186行目）:
```tsx
        </div>
      </Modal>
```

変更後:
```tsx
          {/* 利用規約・プライバシーポリシー */}
          <div className="flex justify-center gap-4 border-t border-white/10 pt-4">
            <Link
              to="/terms"
              onClick={handleCloseSettings}
              className="text-xs text-white/50 underline hover:text-white/80"
            >
              {t('nav.terms')}
            </Link>
            <Link
              to="/privacy"
              onClick={handleCloseSettings}
              className="text-xs text-white/50 underline hover:text-white/80"
            >
              {t('nav.privacy')}
            </Link>
          </div>
        </div>
      </Modal>
```

**注意点**:
- `Link` は 2 行目で既にインポート済みのため追加不要
- `handleCloseSettings` は 30〜32 行目で定義済みのため追加不要
- i18n キーは既存の `nav.terms`・`nav.privacy` を使用（ja.json・en.json 変更不要）

---

## 受け入れ条件

- [ ] 設定モーダルの下部に「利用規約」「プライバシーポリシー」のリンクが表示される
- [ ] リンクをクリックするとモーダルが閉じ、該当ページへ遷移する
- [ ] リンクは目立ちすぎない控えめなスタイルで表示される
- [ ] `pnpm type-check` が通る
- [ ] `pnpm lint` が通る

## 注意事項

- i18n ファイル（ja.json・en.json）の変更は不要（既存キー流用）
- スコープ外: モーダルコンポーネント自体の変更・他ページへの影響なし
