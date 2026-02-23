import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';
import { AVAILABLE_TILES } from '@/consts/tiles';

describe('useGame', () => {
  beforeEach(() => {
    // Reset any state between tests
  });

  it('フリープレイ・ノーマルモードで初期化 → 4桁の答えが生成される', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    expect(result.current.answer).toHaveLength(4);
    expect(result.current.guesses).toHaveLength(0);
    expect(result.current.currentGuess).toHaveLength(0);
    expect(result.current.isGameOver).toBe(false);
    expect(result.current.isWon).toBe(false);
    expect(result.current.attempts).toBe(0);
    expect(result.current.maxAttempts).toBe(8);
  });

  it('addTile でタイルが currentGuess に追加される', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const tile = AVAILABLE_TILES[0];

    act(() => {
      result.current.addTile(tile);
    });

    expect(result.current.currentGuess).toHaveLength(1);
    expect(result.current.currentGuess[0]).toEqual(tile);
  });

  it('removeTile で指定位置のタイルが削除される', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const tile1 = AVAILABLE_TILES[0];
    const tile2 = AVAILABLE_TILES[1];

    act(() => {
      result.current.addTile(tile1);
      result.current.addTile(tile2);
    });

    expect(result.current.currentGuess).toHaveLength(2);

    act(() => {
      result.current.removeTile(0);
    });

    expect(result.current.currentGuess).toHaveLength(1);
    expect(result.current.currentGuess[0]).toEqual(tile2);
  });

  it('resetCurrentGuess で currentGuess が空配列にリセット', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));

    act(() => {
      result.current.addTile(AVAILABLE_TILES[0]);
    });

    expect(result.current.currentGuess).toHaveLength(1);

    act(() => {
      result.current.resetCurrentGuess();
    });

    expect(result.current.currentGuess).toHaveLength(0);
  });

  it('allowDuplicates === false のとき、同じタイルの重複追加が拒否される', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const tile = AVAILABLE_TILES[0];

    act(() => {
      result.current.addTile(tile);
      result.current.addTile(tile);
    });

    expect(result.current.currentGuess).toHaveLength(1);
  });

  it('currentGuess が未完了（桁数不足）で submitGuess → 何も起きない', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));

    act(() => {
      result.current.addTile(AVAILABLE_TILES[0]);
      result.current.addTile(AVAILABLE_TILES[1]);
    });

    act(() => {
      result.current.submitGuess();
    });

    expect(result.current.guesses).toHaveLength(0);
    expect(result.current.currentGuess).toHaveLength(2);
  });

  it('タイルを4つ追加して submitGuess → guesses に1件追加される', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));

    act(() => {
      result.current.addTile(AVAILABLE_TILES[0]);
      result.current.addTile(AVAILABLE_TILES[1]);
      result.current.addTile(AVAILABLE_TILES[2]);
      result.current.addTile(AVAILABLE_TILES[3]);
    });

    act(() => {
      result.current.submitGuess();
    });

    expect(result.current.guesses).toHaveLength(1);
    expect(result.current.attempts).toBe(1);
    expect(result.current.currentGuess).toHaveLength(0);
  });

  it('resetGame で全状態がリセットされ、新しい答えが生成される', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const originalAnswer = result.current.answer;

    act(() => {
      result.current.addTile(AVAILABLE_TILES[0]);
      result.current.resetGame();
    });

    expect(result.current.answer).toHaveLength(4);
    expect(result.current.guesses).toHaveLength(0);
    expect(result.current.currentGuess).toHaveLength(0);
    expect(result.current.isGameOver).toBe(false);
    expect(result.current.isWon).toBe(false);
    // 乱数生成なので異なる答えが生成される確率が高い
    expect(result.current.answer).not.toEqual(originalAnswer);
  });

  it('デイリーチャレンジでノーマルモード固定になる', () => {
    const { result } = renderHook(() => useGame('hard', 'daily'));
    // ノーマルモードは4桁
    expect(result.current.answer).toHaveLength(4);
    expect(result.current.maxAttempts).toBe(8);
  });

  it('デイリーチャレンジ → 同じ日に同じ答えが生成される', () => {
    const { result: result1 } = renderHook(() => useGame('normal', 'daily'));
    const answer1 = JSON.stringify(result1.current.answer.map((t) => t.id));

    const { result: result2 } = renderHook(() => useGame('normal', 'daily'));
    const answer2 = JSON.stringify(result2.current.answer.map((t) => t.id));

    expect(answer1).toBe(answer2);
  });
});
