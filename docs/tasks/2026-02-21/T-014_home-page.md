# T-014: ホームページ

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/19

## 目的

ゲームのエントリーポイントとなるホームページを実装する。モード選択、デイリーチャレンジへの導線、統計・チュートリアルへのリンクを提供する。

## 背景

- `docs/05_sitemap.md` セクション「1. ホーム（`/`）」
- `docs/01_requirements.md` セクション2.2「ゲームモード」— モード解放条件
- `docs/mock_design.html` — ホーム画面デザイン

## 実装内容

### 追加ファイル

| ファイル | 内容 |
|---------|------|
| `src/pages/HomePage.tsx` | ホームページコンポーネント |

### 変更ファイル

なし（T-013で作成したプレースホルダーを置き換え）

### 実装詳細

#### HomePage.tsx

```typescript
export default function HomePage() {
  const { t } = useTranslation();
  const { stats, isModeUnlocked } = useStats();
  const { settings } = useSettings();
  const { hasPlayedToday } = useDailyPlayed();
  const navigate = useNavigate();

  // ...
}
```

**表示要素（`docs/05_sitemap.md` 参照）:**

**メインコンテンツ:**

1. **ゲームタイトル**（中央大きく表示）
   - `t('common.title')` → 「タイルヒットアンドブロー」

2. **チュートリアルボタン**（初回のみ上部に大きく表示）
   - `settings.tutorialCompleted === false` の場合のみ表示
   - 「はじめてプレイする方へ」テキスト付き
   - クリック → `/tutorial` に遷移

3. **デイリーチャレンジボタン**（目立つデザイン）
   - プレイ前: `📅 今日の問題に挑戦！`
   - プレイ済み: `✅ 今日の問題（クリア済み）`
   - クリック → `/games/daily` に遷移

4. **モード選択ボタン**（グリッドレイアウト）

   | モード | アイコン | 解放条件 |
   |--------|---------|---------|
   | ビギナー | ⭐ | 常時 |
   | ノーマル | ⭐⭐ | 常時 |
   | ハード | ⭐⭐⭐ | 常時 |
   | エキスパート | ⭐⭐⭐⭐ | ノーマルクリア |
   | マスター | ⭐⭐⭐⭐⭐ | エキスパートクリア |

   - 解放済み: クリック → `/games/free?mode={mode}` に遷移
   - 未解放: ロック表示（🔒）+ 解放条件テキスト（`t('mode.locked', { condition: ... })`）
   - 各ボタンに最高記録表示（任意 — `stats.modeStats[mode]?.bestAttempts`）

**フッター:**
- 統計ボタン `📊 統計を見る` → `/stats`
- チュートリアルボタン `❓ 遊び方` → `/tutorial`
- 利用規約リンク → `/terms`
- プライバシーポリシーリンク → `/privacy`

**初回起動時の挙動（`docs/05_sitemap.md` 画面遷移フロー）:**
- `settings.tutorialCompleted === false` の場合、`/tutorial` にリダイレクト

## 入出力仕様

- Input: なし（localStorageから統計・設定を取得）
- Output: ホーム画面のReact要素

## 受け入れ条件（Definition of Done）

- [ ] ゲームタイトルが表示される
- [ ] 5つのモード選択ボタンが表示される
- [ ] 未解放モードにロックアイコンと解放条件が表示される
- [ ] 解放済みモードのクリックでゲームページに遷移する
- [ ] 未解放モードのクリックでは遷移しない
- [ ] デイリーチャレンジボタンが表示される
- [ ] デイリーチャレンジのプレイ済み状態が反映される
- [ ] フッターに統計・チュートリアル・利用規約・プライバシーポリシーのリンクがある
- [ ] 初回起動時（`tutorialCompleted === false`）にチュートリアルページへリダイレクトする
- [ ] レスポンシブデザイン（スマホ・タブレット・PC）に対応する
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: ホームページが正しく表示される
- 正常系: ビギナー・ノーマル・ハードがクリック可能
- 正常系: エキスパートが未解放時にロック表示される
- 正常系: ノーマルクリア後にエキスパートが解放される
- 正常系: デイリーチャレンジボタンクリックで `/games/daily` に遷移
- 正常系: モードボタンクリックで `/games/free?mode=beginner` 等に遷移
- 正常系: 初回起動で `/tutorial` にリダイレクト
- 正常系: チュートリアル完了後はリダイレクトしない

## 依存タスク

- T-009（統計・設定フック — `useStats`, `useSettings`, `useDailyPlayed` を使用）
- T-011（共通UI — `Button`, `Card` を使用）
- T-013（ルーティング — ルーティング設定が必要）

## 要確認事項

- ~~モード選択グリッド列数~~ → **確定: mock_design.html の通りに実装する**
- ~~最高記録表示~~ → **確定: 統計データがあれば表示する**
