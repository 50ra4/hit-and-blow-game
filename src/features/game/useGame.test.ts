import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';
import { AVAILABLE_TILES } from '@/consts/tiles';

describe('useGame', () => {
  beforeEach(() => {
    // Reset any state between tests
  });

  it('フリープレイ・ノーマルモードで初期化 → 4桁の答えと全nullスロットが生成される', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    expect(result.current.answer).toHaveLength(4);
    expect(result.current.guesses).toHaveLength(0);
    expect(result.current.currentGuess).toHaveLength(4);
    expect(result.current.currentGuess.every((t) => t === null)).toBe(true);
    expect(result.current.isGameOver).toBe(false);
    expect(result.current.isWon).toBe(false);
    expect(result.current.attempts).toBe(0);
    expect(result.current.maxAttempts).toBe(10);
    expect(result.current.activeSlotIndex).toBeNull();
  });

  it('addTile で最初の空きスロットにタイルが設定される', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const tile = AVAILABLE_TILES.at(0)!;

    act(() => {
      result.current.addTile(tile);
    });

    expect(result.current.currentGuess.at(0)).toEqual(tile);
    expect(result.current.currentGuess.at(1)).toBeNull();
    expect(result.current.currentGuess.at(2)).toBeNull();
    expect(result.current.currentGuess.at(3)).toBeNull();
  });

  it('resetCurrentGuess で全スロットがnullにリセットされる', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));

    act(() => {
      result.current.addTile(AVAILABLE_TILES.at(0)!);
    });

    expect(result.current.currentGuess.at(0)).not.toBeNull();

    act(() => {
      result.current.resetCurrentGuess();
    });

    expect(result.current.currentGuess).toHaveLength(4);
    expect(result.current.currentGuess.every((t) => t === null)).toBe(true);
    expect(result.current.activeSlotIndex).toBeNull();
  });

  it('allowDuplicates === false のとき、同じタイルの重複追加が拒否される', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const tile = AVAILABLE_TILES.at(0)!;

    act(() => {
      result.current.addTile(tile);
      result.current.addTile(tile);
    });

    const filledCount = result.current.currentGuess.filter(
      (t) => t !== null,
    ).length;
    expect(filledCount).toBe(1);
  });

  it('currentGuess が未完了（桁数不足）で submitGuess → 何も起きない', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));

    act(() => {
      result.current.addTile(AVAILABLE_TILES.at(0)!);
      result.current.addTile(AVAILABLE_TILES.at(1)!);
    });

    act(() => {
      result.current.submitGuess();
    });

    expect(result.current.guesses).toHaveLength(0);
    const filledCount = result.current.currentGuess.filter(
      (t) => t !== null,
    ).length;
    expect(filledCount).toBe(2);
  });

  it('タイルを4つ追加して submitGuess → guesses に1件追加、全スロットnull', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));

    act(() => {
      result.current.addTile(AVAILABLE_TILES.at(0)!);
      result.current.addTile(AVAILABLE_TILES.at(1)!);
      result.current.addTile(AVAILABLE_TILES.at(2)!);
      result.current.addTile(AVAILABLE_TILES.at(3)!);
    });

    act(() => {
      result.current.submitGuess();
    });

    expect(result.current.guesses).toHaveLength(1);
    expect(result.current.attempts).toBe(1);
    expect(result.current.currentGuess).toHaveLength(4);
    expect(result.current.currentGuess.every((t) => t === null)).toBe(true);
    expect(result.current.activeSlotIndex).toBeNull();
  });

  it('resetGame で全状態がリセットされ、新しい答えが生成される', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const originalAnswer = result.current.answer;

    act(() => {
      result.current.addTile(AVAILABLE_TILES.at(0)!);
      result.current.resetGame();
    });

    expect(result.current.answer).toHaveLength(4);
    expect(result.current.guesses).toHaveLength(0);
    expect(result.current.currentGuess).toHaveLength(4);
    expect(result.current.currentGuess.every((t) => t === null)).toBe(true);
    expect(result.current.isGameOver).toBe(false);
    expect(result.current.isWon).toBe(false);
    expect(result.current.activeSlotIndex).toBeNull();
    // 乱数生成なので異なる答えが生成される確率が高い
    expect(result.current.answer).not.toEqual(originalAnswer);
  });

  it('デイリーチャレンジでノーマルモード固定になる', () => {
    const { result } = renderHook(() => useGame('hard', 'daily'));
    // ノーマルモードは4桁
    expect(result.current.answer).toHaveLength(4);
    expect(result.current.maxAttempts).toBe(10);
  });

  it('デイリーチャレンジ → 同じ日に同じ答えが生成される', () => {
    const { result: result1 } = renderHook(() => useGame('normal', 'daily'));
    const answer1 = JSON.stringify(result1.current.answer.map((t) => t.id));

    const { result: result2 } = renderHook(() => useGame('normal', 'daily'));
    const answer2 = JSON.stringify(result2.current.answer.map((t) => t.id));

    expect(answer1).toBe(answer2);
  });

  it('全ヒットの推測を送信 → isGameOver: true, isWon: true', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const answer = result.current.answer;

    act(() => {
      answer.forEach((tile) => result.current.addTile(tile));
    });

    act(() => {
      result.current.submitGuess();
    });

    expect(result.current.isGameOver).toBe(true);
    expect(result.current.isWon).toBe(true);
  });

  it('最大試行回数まで推測送信 → isGameOver: true, isWon: false', () => {
    // beginner モード: length=3, maxAttempts=8, allowDuplicates=false
    const { result } = renderHook(() => useGame('beginner', 'free'));
    const answer = result.current.answer;

    // 答えに含まれないタイルで外れ推測を作成（0ヒット保証）
    const wrongTiles = AVAILABLE_TILES.filter(
      (t) => !answer.some((a) => a.id === t.id),
    );
    const wrongGuess = wrongTiles.slice(0, 3);

    for (let i = 0; i < 8; i++) {
      act(() => {
        wrongGuess.forEach((tile) => result.current.addTile(tile));
      });
      act(() => {
        result.current.submitGuess();
      });
    }

    expect(result.current.isGameOver).toBe(true);
    expect(result.current.isWon).toBe(false);
    expect(result.current.guesses).toHaveLength(8);
  });

  // --- handleSlotTap テスト ---

  it('handleSlotTap でスロットが選択中になる', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));

    act(() => {
      result.current.handleSlotTap(1);
    });

    expect(result.current.activeSlotIndex).toBe(1);
  });

  it('handleSlotTap で同じスロットを再タップ → 選択解除', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));

    act(() => {
      result.current.handleSlotTap(1);
    });

    expect(result.current.activeSlotIndex).toBe(1);

    act(() => {
      result.current.handleSlotTap(1);
    });

    expect(result.current.activeSlotIndex).toBeNull();
  });

  it('handleSlotTap で異なるスロットをタップ → スワップ', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const tile0 = AVAILABLE_TILES.at(0)!;
    const tile1 = AVAILABLE_TILES.at(1)!;

    act(() => {
      result.current.addTile(tile0);
      result.current.addTile(tile1);
    });

    // スロット0: tile0, スロット1: tile1
    expect(result.current.currentGuess.at(0)).toEqual(tile0);
    expect(result.current.currentGuess.at(1)).toEqual(tile1);

    // スロット0を選択 → スロット1をタップ → スワップ
    act(() => {
      result.current.handleSlotTap(0);
    });

    act(() => {
      result.current.handleSlotTap(1);
    });

    expect(result.current.currentGuess.at(0)).toEqual(tile1);
    expect(result.current.currentGuess.at(1)).toEqual(tile0);
    expect(result.current.activeSlotIndex).toBeNull();
  });

  it('activeSlotIndex 指定時に addTile → 選択中スロットに上書き', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const tile0 = AVAILABLE_TILES.at(0)!;
    const tile1 = AVAILABLE_TILES.at(1)!;

    act(() => {
      result.current.addTile(tile0);
    });

    // スロット0を選択
    act(() => {
      result.current.handleSlotTap(0);
    });

    expect(result.current.activeSlotIndex).toBe(0);

    // 別タイルで上書き
    act(() => {
      result.current.addTile(tile1);
    });

    expect(result.current.currentGuess.at(0)).toEqual(tile1);
    expect(result.current.activeSlotIndex).toBeNull();
  });

  it('addTile 上書き時の重複チェック（上書き対象を除外）', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const tile0 = AVAILABLE_TILES.at(0)!;
    const tile1 = AVAILABLE_TILES.at(1)!;

    act(() => {
      result.current.addTile(tile0);
      result.current.addTile(tile1);
    });

    // スロット0(tile0)を選択し、tile0で上書き → 自分自身なので許可
    act(() => {
      result.current.handleSlotTap(0);
    });

    act(() => {
      result.current.addTile(tile0);
    });

    expect(result.current.currentGuess.at(0)).toEqual(tile0);

    // スロット0(tile0)を選択し、tile1で上書き → スロット1に既にtile1がある → 拒否
    act(() => {
      result.current.handleSlotTap(0);
    });

    act(() => {
      result.current.addTile(tile1);
    });

    // tile1はスロット1に既にあるため上書き拒否、tile0のまま
    expect(result.current.currentGuess.at(0)).toEqual(tile0);
  });

  it('リセット時に activeSlotIndex が null になる', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));

    act(() => {
      result.current.addTile(AVAILABLE_TILES.at(0)!);
      result.current.handleSlotTap(0);
    });

    expect(result.current.activeSlotIndex).toBe(0);

    act(() => {
      result.current.resetCurrentGuess();
    });

    expect(result.current.activeSlotIndex).toBeNull();
  });

  it('提出時に activeSlotIndex が null になる', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));
    const answer = result.current.answer;

    act(() => {
      answer.forEach((tile) => result.current.addTile(tile));
    });

    act(() => {
      result.current.handleSlotTap(0);
    });

    expect(result.current.activeSlotIndex).toBe(0);

    act(() => {
      result.current.submitGuess();
    });

    expect(result.current.activeSlotIndex).toBeNull();
  });

  it('空スロット同士のスワップ', () => {
    const { result } = renderHook(() => useGame('normal', 'free'));

    // 全スロット空の状態でスワップ
    act(() => {
      result.current.handleSlotTap(0);
    });

    act(() => {
      result.current.handleSlotTap(2);
    });

    // 空同士のスワップは正常に完了（全てnullのまま）
    expect(result.current.currentGuess.every((t) => t === null)).toBe(true);
    expect(result.current.activeSlotIndex).toBeNull();
  });
});
