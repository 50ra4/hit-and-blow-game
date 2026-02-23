import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { FIXME } from '@/utils/utilityTypes';
import { useDarkMode } from './useDarkMode';

const createMockMatchMedia = (matches: boolean) =>
  vi.fn((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })) as FIXME;

describe('useDarkMode', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    // jsdom にはデフォルトで matchMedia がないため、プロパティ定義でモックを設定
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: createMockMatchMedia(false),
    });
  });

  afterEach(() => {
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
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: createMockMatchMedia(true),
    });

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
    const { rerender } = renderHook(
      ({ theme }: { theme: 'light' | 'dark' | 'system' }) => useDarkMode(theme),
      {
        initialProps: { theme: 'dark' as 'light' | 'dark' | 'system' },
      },
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    rerender({ theme: 'light' as 'light' | 'dark' | 'system' });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
