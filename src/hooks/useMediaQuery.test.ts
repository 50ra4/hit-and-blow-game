import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('初期値としてクエリのマッチ状態を返す', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(typeof result.current).toBe('boolean');
  });

  it('window が undefined の場合 false を返す', () => {
    const originalWindow = global.window;
    // @ts-expect-error: テスト用に undefined にする
    delete global.window;

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    global.window = originalWindow;
  });

  it('matchMedia のマッチ状態を返す', () => {
    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    vi.spyOn(window, 'matchMedia').mockReturnValue(
      mockMediaQueryList as MediaQueryList,
    );

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('クエリが変わったときにリスナーを更新', () => {
    const addEventListenerSpy = vi.fn();
    const removeEventListenerSpy = vi.fn();

    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: true,
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
    };

    vi.spyOn(window, 'matchMedia').mockReturnValue(
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
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerSpy,
    };

    vi.spyOn(window, 'matchMedia').mockReturnValue(
      mockMediaQueryList as MediaQueryList,
    );

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
