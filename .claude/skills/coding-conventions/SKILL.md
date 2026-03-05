---
name: coding-conventions
description: 当プロジェクト（ヒットアンドブロー）のコーディング規約を参照・確認する。コード実装前、実装後に呼び出すこと。
---

# コーディング規約

コーディング規約は `.claude/rules/` 配下のルールファイルに定義されている。

## ルールファイル一覧

| ファイル | 内容 | 適用条件 |
|---|---|---|
| `response-style.md` | 回答スタイル | 常時 |
| `work-rules.md` | 作業ルール・Plan Mode | 常時 |
| `typescript.md` | TypeScript 基本規約 | `src/**/*.{ts,tsx}` |
| `react.md` | React 規約 | `src/**/*.tsx` |
| `tailwind.md` | Tailwind CSS 規約 | `src/**/*.{tsx,css}` |
| `testing.md` | テスト規約 | `src/**/*.test.*` |
| `git-commit.md` | Git コミットメッセージ規約 | 常時 |
| `i18n.md` | 国際化規約 | `src/**/*.tsx`, `src/i18n/**` |

## 使い方

- パスベースのルールは、対象ファイル編集時に自動注入される
- 常時ルールは、全てのセッションで自動注入される
- 個別のルールを確認したい場合は、該当ファイルを直接参照する

`vercel-react-best-practices` スキルと競合する場合、より正当性がある方を採用する。
