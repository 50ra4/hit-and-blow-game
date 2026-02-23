import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { FIXME } from '@/utils/utilityTypes';
import { useMediaQuery } from './useMediaQuery';

const createMockMatchMedia = (matches: boolean) =>
  vi.fn((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })) as FIXME;

describe('useMediaQuery', () => {
  beforeEach(() => {
    // jsdom にはデフォルトで matchMedia がないため、プロパティ定義でモックを設定
    // window.matchMedia = ... の直接代入は jsdom では read-only のため Object.defineProperty を使用
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: createMockMatchMedia(false),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('初期値としてクエリのマッチ状態を返す', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(typeof result.current).toBe('boolean');
  });

  it('matchMedia が false を返す場合 false が返される', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('matchMedia のマッチ状態を返す', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: createMockMatchMedia(true),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('クエリが変わったときにリスナーを更新', () => {
    const addEventListenerSpy = vi.fn();
    const removeEventListenerSpy = vi.fn();

    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: true,
      media: '(min-width: 768px)',
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
    };

    vi.mocked(window.matchMedia).mockReturnValue(
      mockMediaQueryList as MediaQueryList,
    );

    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(min-width: 768px)' },
    });

    rerender({ query: '(max-width: 480px)' });

    expect(addEventListenerSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('アンマウント時にリスナーを削除', () => {
    const removeEventListenerSpy = vi.fn();
    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: true,
      media: '(min-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerSpy,
    };

    vi.mocked(window.matchMedia).mockReturnValue(
      mockMediaQueryList as MediaQueryList,
    );

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
