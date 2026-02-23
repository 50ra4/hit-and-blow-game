# T-015: ゲームページ

## GitHub Issue

https://github.com/50ra4/hit-and-blow-game/issues/20

## 目的

フリープレイおよびデイリーチャレンジのゲームプレイ画面を実装する。モード選択に応じたゲーム進行を提供する。

## 背景

- `docs/05_sitemap.md` セクション「2. フリープレイ」「3. デイリーチャレンジ」
- `docs/02_architecture.md` セクション6.1「GamePage.tsx」
- `docs/01_requirements.md` セクション2.1〜2.3
- `docs/06_mock_design.html` — ゲーム画面デザイン

## 実装内容

### 追加ファイル

| ファイル                 | 内容                       |
| ------------------------ | -------------------------- |
| `src/pages/GamePage.tsx` | ゲームページコンポーネント |

### 変更ファイル

なし（T-013で作成したプレースホルダーを置き換え）

### 実装詳細

#### GamePage.tsx

```typescript
export default function GamePage() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // playType判定
  const playType: PlayType = pathname.includes('/daily') ? 'daily' : 'free';

  // mode取得（フリープレイのみ）
  const modeParam = searchParams.get('mode') || 'normal';
  const mode: GameMode =
    playType === 'daily' ? 'normal' : (modeParam as GameMode);

  // ゲーム状態
  const game = useGame(mode, playType);
  const { stats, recordGame } = useStats();
  const { hasPlayedToday, markPlayedToday } = useDailyPlayed();
  const { isModeUnlocked } = useStats();

  // ...
}
```

**処理フロー:**

1. **バリデーション:**
   - フリープレイ: モードが未解放の場合 → `window.alert` でメッセージ表示後、ホームにリダイレクト
   - フリープレイ: 存在しないモードの場合 → `normal` にフォールバック
   - デイリーチャレンジ: プレイ済みの場合 → 結果表示画面を表示

2. **ゲーム中:**
   - `GameHeader` でモード名・残り回数を表示
   - `GameBoard` でタイル選択・推測送信
   - 戻るボタン押下時: 確認ダイアログ表示（「ゲームを中断しますか？」）

3. **ゲーム終了時:**
   - `recordGame()` で統計を記録
   - デイリーの場合: `markPlayedToday()` を呼び出し
   - `ResultDisplay` で結果を表示
   - シェアボタン表示（T-019で実装、本タスクではスロットのみ）
   - 広告表示（T-020で実装、本タスクではスロットのみ）

4. **リスタート（フリープレイのみ）:**
   - `game.resetGame()` を呼び出し

**表示構成:**

```
┌─────────────────────────────┐
│ GameHeader                  │
│ (戻る / モード名 / 残り回数)  │
├─────────────────────────────┤
│ GameBoard                   │
│ ├ 現在の入力エリア            │
│ ├ TilePicker                │
│ ├ 送信ボタン                 │
│ └ GuessHistory              │
├─────────────────────────────┤
│ ResultDisplay（終了時のみ）   │
│ ├ 結果表示                   │
│ ├ シェアボタン（T-019）       │
│ ├ 広告（T-020）              │
│ ├ もう一度プレイ              │
│ └ ホームに戻る               │
└─────────────────────────────┘
```

## 入出力仕様

- Input: URLパス（`/games/free?mode=normal` or `/games/daily`）
- Output: ゲーム画面のReact要素

## 受け入れ条件（Definition of Done）

- [ ] フリープレイで各モードのゲームがプレイできる
- [ ] デイリーチャレンジがプレイできる
- [ ] クエリパラメータ `mode` で指定したモードでゲームが開始される
- [ ] 未解放モードへのアクセスでホームにリダイレクトされる
- [ ] 存在しないモード指定でノーマルにフォールバックされる
- [ ] デイリーチャレンジがプレイ済みの場合、結果画面が表示される
- [ ] ゲーム終了時に統計が記録される
- [ ] ゲーム終了時に結果画面が表示される
- [ ] 戻るボタンで確認ダイアログが表示される
- [ ] フリープレイで「もう一度プレイ」が機能する
- [ ] レスポンシブデザインに対応する
- [ ] `pnpm type-check` でエラーがないこと

## テスト観点

- 正常系: `/games/free?mode=beginner` → ビギナーモード（3桁）のゲーム開始
- 正常系: `/games/free?mode=normal` → ノーマルモード（4桁）のゲーム開始
- 正常系: `/games/daily` → デイリーチャレンジ（ノーマル固定）のゲーム開始
- 正常系: タイル選択→送信→ヒット・ブロー表示
- 正常系: 全ヒットで勝利画面表示
- 正常系: 最大回数到達で敗北画面表示
- 正常系: ゲーム終了後に統計が更新される
- 正常系: デイリープレイ済みで結果画面表示
- 異常系: 未解放モードへのアクセスでリダイレクト
- 異常系: 不正なモード値でノーマルにフォールバック

## 依存タスク

- T-008（ゲーム状態管理フック — `useGame` を使用）
- T-012（ゲームUI — `GameBoard`, `GameHeader`, `ResultDisplay` 等を使用）
- T-013（ルーティング — ルーティング設定が必要）

## 要確認事項

- ~~ゲーム中断ダイアログのテキスト~~ → **確定: 「ゲームを中断しますか？進行中のデータは失われます。」**
- ~~未解放モードアクセス時の通知~~ → **確定: `window.alert("このモードはまだ解放されていません")` 表示後、ホームにリダイレクト**
