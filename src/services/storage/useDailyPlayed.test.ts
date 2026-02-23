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

    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('tile-hab-daily-played');
    expect(stored).toBe(today);
  });
});
