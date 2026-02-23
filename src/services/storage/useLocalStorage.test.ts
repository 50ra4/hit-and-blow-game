import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { z } from 'zod';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('localStorage が空の場合 initialValue が返される', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0 }),
    );

    expect(result.current[0]).toEqual({ count: 0 });
  });

  it('localStorage に正しいデータがある場合 パース済みの値が返される', () => {
    const data = { count: 5, name: 'test' };
    localStorage.setItem('test-key', JSON.stringify(data));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0, name: 'default' }),
    );

    expect(result.current[0]).toEqual(data);
  });

  it('Zod バリデーション通過：正しいデータはそのまま返される', () => {
    const schema = z.object({ count: z.number().int() });
    const data = { count: 10 };
    localStorage.setItem('test-key', JSON.stringify(data));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0 }, schema),
    );

    expect(result.current[0]).toEqual(data);
  });

  it('Zod バリデーション失敗時 initialValue が返される', () => {
    const schema = z.object({ count: z.number().int() });
    const invalidData = { count: 'not a number' };
    localStorage.setItem('test-key', JSON.stringify(invalidData));

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0 }, schema),
    );

    expect(result.current[0]).toEqual({ count: 0 });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('JSON.parse エラー時 initialValue が返される', () => {
    localStorage.setItem('test-key', '{invalid json}');

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0 }),
    );

    expect(result.current[0]).toEqual({ count: 0 });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('migrate 関数が適用される', () => {
    const oldData = { score: 5 };
    localStorage.setItem('test-key', JSON.stringify(oldData));

    const migrate = (data: unknown) => {
      const old = data as { score: number };
      return { points: old.score * 10 };
    };

    const { result } = renderHook(() =>
      useLocalStorage('test-key', { points: 0 }, undefined, migrate),
    );

    expect(result.current[0]).toEqual({ points: 50 });
  });

  it('setValue で値が更新され localStorage に保存される', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0 }),
    );

    act(() => {
      result.current[1]({ count: 5 });
    });

    expect(result.current[0]).toEqual({ count: 5 });
    expect(JSON.parse(localStorage.getItem('test-key') ?? '')).toEqual({
      count: 5,
    });
  });

  it('setValue に関数渡しで更新される', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0 }),
    );

    act(() => {
      result.current[1]((prev) => ({ count: prev.count + 1 }));
    });

    expect(result.current[0]).toEqual({ count: 1 });

    act(() => {
      result.current[1]((prev) => ({ count: prev.count + 1 }));
    });

    expect(result.current[0]).toEqual({ count: 2 });
  });

  it('clearValue で localStorage からキーが削除される', () => {
    localStorage.setItem('test-key', JSON.stringify({ count: 5 }));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0 }),
    );

    expect(result.current[0]).toEqual({ count: 5 });

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toEqual({ count: 0 });
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('setValue エラー時でも状態は更新される', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0 }),
    );

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Storage full');
      });

    act(() => {
      result.current[1]({ count: 5 });
    });

    expect(result.current[0]).toEqual({ count: 5 });
    expect(spy).toHaveBeenCalled();

    setItemSpy.mockRestore();
    spy.mockRestore();
  });

  it('複数キーで独立して動作', () => {
    const { result: result1 } = renderHook(() =>
      useLocalStorage('key1', { value: 1 }),
    );
    const { result: result2 } = renderHook(() =>
      useLocalStorage('key2', { value: 2 }),
    );

    expect(result1.current[0]).toEqual({ value: 1 });
    expect(result2.current[0]).toEqual({ value: 2 });

    act(() => {
      result1.current[1]({ value: 10 });
    });

    expect(result1.current[0]).toEqual({ value: 10 });
    expect(result2.current[0]).toEqual({ value: 2 });
  });
});
