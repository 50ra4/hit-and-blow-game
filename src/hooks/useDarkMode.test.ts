import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    vi.clearAllMocks();
  });

  it('theme が "dark" の場合 isDark が true', () => {
    const { result } = renderHook(() => useDarkMode('dark'));
    expect(result.current.isDark).toBe(true);
  });

  it('theme が "light" の場合 isDark が false', () => {
    const { result } = renderHook(() => useDarkMode('light'));
    expect(result.current.isDark).toBe(false);
  });

  it('theme が "system" の場合 OS 設定に追従', () => {
    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    vi.spyOn(window, 'matchMedia').mockReturnValue(
      mockMediaQueryList as MediaQueryList,
    );

    const { result } = renderHook(() => useDarkMode('system'));
    expect(result.current.isDark).toBe(true);
  });

  it('isDark が true の場合 document に dark クラスを追加', () => {
    renderHook(() => useDarkMode('dark'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('isDark が false の場合 document から dark クラスを削除', () => {
    document.documentElement.classList.add('dark');
    renderHook(() => useDarkMode('light'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('theme が変更されたときにクラスを更新', () => {
    const { rerender } = renderHook(({ theme }) => useDarkMode(theme), {
      initialProps: { theme: 'dark' as const },
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    rerender({ theme: 'light' as const });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
