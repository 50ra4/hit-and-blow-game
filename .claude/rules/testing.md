---
paths:
  - src/**/*.test.*
---

# テストコーディング規約

## テストファイルの配置

テスト対象ファイルと同じディレクトリに配置する。

```
components/Button/
├── Button.tsx
└── Button.test.tsx
```

## テストの構造

`describe` / `it` / `expect` で構成（vitest + @testing-library/react）。

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Button", () => {
  it("ラベルが正しく表示される", () => {
    render(<Button label="クリック" onClick={() => {}} />);
    expect(screen.getByText("クリック")).toBeInTheDocument();
  });
});
```

## テストの命名

テストコードは **What（何を保証するか）** を表現する。

- `describe`: テスト対象
- `it`: 「どの条件でどうなるか」を日本語で具体的に表現

```typescript
// ✅
it('正解時にヒット数が正しくカウントされる', () => {});
it('全ての位置が一致した場合にゲームが終了する', () => {});

// ❌
it('works correctly', () => {});
it('test1', () => {});
```
