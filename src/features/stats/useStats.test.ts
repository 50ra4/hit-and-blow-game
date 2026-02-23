import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStats } from './useStats';
import type { GameResult } from '@/features/game/game.schema';

describe('useStats', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初回読み込みでデフォルト統計が返される', () => {
    const { result } = renderHook(() => useStats());
    expect(result.current.stats.totalPlays).toBe(0);
    expect(result.current.stats.totalWins).toBe(0);
    expect(result.current.stats.unlockedModes).toEqual([
      'beginner',
      'normal',
      'hard',
    ]);
  });

  it('recordGame で勝利記録 → totalPlays +1, totalWins +1', () => {
    const { result } = renderHook(() => useStats());
    const gameResult: GameResult = {
      mode: 'normal',
      playType: 'free',
      isWon: true,
      attempts: 5,
      timestamp: Date.now(),
    };

    act(() => {
      result.current.recordGame(gameResult);
    });

    expect(result.current.stats.totalPlays).toBe(1);
    expect(result.current.stats.totalWins).toBe(1);
  });

  it('recordGame で敗北記録 → totalPlays +1, totalWins 変化なし', () => {
    const { result } = renderHook(() => useStats());
    const gameResult: GameResult = {
      mode: 'normal',
      playType: 'free',
      isWon: false,
      attempts: 8,
      timestamp: Date.now(),
    };

    act(() => {
      result.current.recordGame(gameResult);
    });

    expect(result.current.stats.totalPlays).toBe(1);
    expect(result.current.stats.totalWins).toBe(0);
  });

  it('勝率が正しく計算される', () => {
    const { result } = renderHook(() => useStats());

    const win: GameResult = {
      mode: 'beginner',
      playType: 'free',
      isWon: true,
      attempts: 3,
      timestamp: Date.now(),
    };
    const loss: GameResult = {
      mode: 'beginner',
      playType: 'free',
      isWon: false,
      attempts: 6,
      timestamp: Date.now(),
    };

    act(() => {
      result.current.recordGame(win);
      result.current.recordGame(loss);
    });

    expect(result.current.stats.winRate).toBe(50);
  });

  it('bestAttempts が正しく更新される', () => {
    const { result } = renderHook(() => useStats());

    const result1: GameResult = {
      mode: 'normal',
      playType: 'free',
      isWon: true,
      attempts: 5,
      timestamp: Date.now(),
    };

    act(() => {
      result.current.recordGame(result1);
    });

    expect(result.current.stats.bestAttempts).toBe(5);

    const result2: GameResult = {
      mode: 'normal',
      playType: 'free',
      isWon: true,
      attempts: 3,
      timestamp: Date.now(),
    };

    act(() => {
      result.current.recordGame(result2);
    });

    expect(result.current.stats.bestAttempts).toBe(3);
  });

  it('ノーマルモードクリア後にエキスパートが解放される', () => {
    const { result } = renderHook(() => useStats());

    const normalWin: GameResult = {
      mode: 'normal',
      playType: 'free',
      isWon: true,
      attempts: 5,
      timestamp: Date.now(),
    };

    act(() => {
      result.current.recordGame(normalWin);
    });

    expect(result.current.stats.unlockedModes).toContain('expert');
  });

  it('clearStats で全統計がリセットされる', () => {
    const { result } = renderHook(() => useStats());

    const gameResult: GameResult = {
      mode: 'normal',
      playType: 'free',
      isWon: true,
      attempts: 5,
      timestamp: Date.now(),
    };

    act(() => {
      result.current.recordGame(gameResult);
    });

    expect(result.current.stats.totalPlays).toBe(1);

    act(() => {
      result.current.clearStats();
    });

    expect(result.current.stats.totalPlays).toBe(0);
    expect(result.current.stats.totalWins).toBe(0);
  });

  it('isModeUnlocked でモード解放状態を判定', () => {
    const { result } = renderHook(() => useStats());

    expect(result.current.isModeUnlocked('beginner')).toBe(true);
    expect(result.current.isModeUnlocked('expert')).toBe(false);
  });

  it('unlockMode でモードを手動解放', () => {
    const { result } = renderHook(() => useStats());

    expect(result.current.isModeUnlocked('master')).toBe(false);

    act(() => {
      result.current.unlockMode('master');
    });

    expect(result.current.isModeUnlocked('master')).toBe(true);
  });
});
