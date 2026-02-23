import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDailyPlayed } from './useDailyPlayed';

describe('useDailyPlayed', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初回は hasPlayedToday が false', () => {
    const { result } = renderHook(() => useDailyPlayed());
    expect(result.current.hasPlayedToday()).toBe(false);
  });

  it('markPlayedToday 後に hasPlayedToday が true', () => {
    const { result } = renderHook(() => useDailyPlayed());

    act(() => {
      result.current.markPlayedToday();
    });

    expect(result.current.hasPlayedToday()).toBe(true);
  });

  it('今日の日付 YYYY-MM-DD 形式で保存される', () => {
    const { result } = renderHook(() => useDailyPlayed());

    act(() => {
      result.current.markPlayedToday();
    });

    // useLocalStorage は JSON.stringify で保存するため、parse して確認
    const rawStored = localStorage.getItem('tile-hab-daily-played');
    const stored = JSON.parse(rawStored ?? '""') as string;
    // YYYY-MM-DD 形式の日付文字列が保存されていることを確認
    expect(stored).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
