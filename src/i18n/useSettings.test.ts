import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import i18n from '@/i18n/index';
import { useSettings } from './useSettings';

vi.mock('@/i18n/index', () => ({
  default: {
    changeLanguage: vi.fn(),
  },
}));

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('デフォルト設定が返される', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings.language).toBe('ja');
    expect(result.current.settings.theme).toBe('system');
    expect(result.current.settings.soundEnabled).toBe(true);
    expect(result.current.settings.tutorialCompleted).toBe(false);
  });

  it('updateLanguage で言語が切り替わる', () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateLanguage('en');
    });

    expect(result.current.settings.language).toBe('en');
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('updateTheme でテーマが更新される', () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateTheme('dark');
    });

    expect(result.current.settings.theme).toBe('dark');
  });

  it('toggleSound でサウンド設定がトグル', () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.settings.soundEnabled).toBe(true);

    act(() => {
      result.current.toggleSound();
    });

    expect(result.current.settings.soundEnabled).toBe(false);

    act(() => {
      result.current.toggleSound();
    });

    expect(result.current.settings.soundEnabled).toBe(true);
  });

  it('completeTutorial で tutorialCompleted が true になる', () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.settings.tutorialCompleted).toBe(false);

    act(() => {
      result.current.completeTutorial();
    });

    expect(result.current.settings.tutorialCompleted).toBe(true);
  });
});
