import { describe, it, expect } from 'vitest';
import { generateAnswer, checkGuess, isGameFinished } from './gameLogic';
import { AVAILABLE_TILES } from '@/consts/tiles';
import type { Tile, Guess } from './game.schema';

describe('generateAnswer', () => {
  it('長さ3、重複なしのタイル配列を返す', () => {
    const answer = generateAnswer(3, false);

    expect(answer).toHaveLength(3);
    expect(new Set(answer.map((t) => t.id)).size).toBe(3);
  });

  it('長さ4、重複なしのタイル配列を返す', () => {
    const answer = generateAnswer(4, false);

    expect(answer).toHaveLength(4);
    expect(new Set(answer.map((t) => t.id)).size).toBe(4);
  });

  it('長さ4、重複を許容', () => {
    const answer = generateAnswer(4, true);

    expect(answer).toHaveLength(4);
    // 重複がないことが保証されないため、単に長さが4であることを確認
  });

  it('長さ8、重複を許容', () => {
    const answer = generateAnswer(8, true);

    expect(answer).toHaveLength(8);
    // AVAILABLE_TILES から選択したタイルのみを使用
    answer.forEach((tile) => {
      const found = AVAILABLE_TILES.find((t) => t.id === tile.id);
      expect(found).toBeDefined();
    });
  });

  it('長さ8、重複なし（全8種類）', () => {
    const answer = generateAnswer(8, false);

    expect(answer).toHaveLength(8);
    expect(new Set(answer.map((t) => t.id)).size).toBe(8);
  });

  it('同じシードで同じ結果を生成', () => {
    const seed = '2026-02-21';
    const answer1 = generateAnswer(4, false, seed);
    const answer2 = generateAnswer(4, false, seed);

    expect(answer1).toEqual(answer2);
  });

  it('異なるシードで異なる結果を生成', () => {
    const answer1 = generateAnswer(4, false, 'seed-1');
    const answer2 = generateAnswer(4, false, 'seed-2');

    expect(answer1).not.toEqual(answer2);
  });

  it('AVAILABLE_TILES から取得したタイルを返す', () => {
    const answer = generateAnswer(3, false);

    answer.forEach((tile) => {
      const found = AVAILABLE_TILES.find((t) => t.id === tile.id);
      expect(found).toBeDefined();
    });
  });
});

describe('checkGuess', () => {
  it('全ヒット（4桁）', () => {
    const answer: Tile[] = AVAILABLE_TILES.slice(0, 4);
    const guess: Tile[] = AVAILABLE_TILES.slice(0, 4);

    const result = checkGuess(guess, answer);

    expect(result).toEqual({ hits: 4, blows: 0 });
  });

  it('全ブロー（4桁、位置がすべて異なる）', () => {
    const [A, B, C, D] = AVAILABLE_TILES;

    const answer: Tile[] = [A, B, C, D];
    const guess: Tile[] = [B, C, D, A];

    const result = checkGuess(guess, answer);

    expect(result.hits).toBe(0);
    expect(result.blows).toBe(4);
  });

  it('複雑なパターン：一部ヒット・一部ブロー・一部無し', () => {
    const tiles = AVAILABLE_TILES;

    const answer: Tile[] = [tiles[0], tiles[1], tiles[2], tiles[3]];
    const guess: Tile[] = [tiles[0], tiles[2], tiles[3], tiles[4]];

    const result = checkGuess(guess, answer);

    expect(result.hits).toBe(1); // pos 0
    expect(result.blows).toBe(2); // pos 1 and 2 have correct values in wrong positions
  });

  it('0ヒット0ブロー', () => {
    const answer: Tile[] = AVAILABLE_TILES.slice(0, 4);
    const guess: Tile[] = AVAILABLE_TILES.slice(4, 8);

    const result = checkGuess(guess, answer);

    expect(result).toEqual({ hits: 0, blows: 0 });
  });

  it('重複タイルのケース：[A,B,A]vs[A,A,B] → 1H2B', () => {
    const [A, B] = AVAILABLE_TILES;

    const answer: Tile[] = [A, B, A];
    const guess: Tile[] = [A, A, B];

    const result = checkGuess(guess, answer);

    expect(result).toEqual({ hits: 1, blows: 2 });
  });

  it('ヒット・ブロー混在', () => {
    const [A, B, C, D] = AVAILABLE_TILES;

    const answer: Tile[] = [A, B, C, D];
    const guess: Tile[] = [A, C, B, D]; // pos0 hit, pos1 blow, pos2 blow, pos3 hit

    const result = checkGuess(guess, answer);

    expect(result).toEqual({ hits: 2, blows: 2 });
  });

  it('複雑な重複ケース', () => {
    const [A, B, C] = AVAILABLE_TILES;

    const answer: Tile[] = [A, A, B, C];
    const guess: Tile[] = [A, B, A, C]; // pos0 hit, pos1 blow, pos2 blow, pos3 hit

    const result = checkGuess(guess, answer);

    expect(result.hits).toBe(2); // pos 0 and 3
    expect(result.blows).toBe(2); // B at pos 1 in guess, A at pos 2 in guess
  });
});

describe('isGameFinished', () => {
  const createGuess = (hits: number, blows: number): Guess => ({
    tiles: AVAILABLE_TILES.slice(0, 4),
    hits,
    blows,
    timestamp: Date.now(),
  });

  it('推測が0件の場合は未終了', () => {
    const result = isGameFinished([], 8, 4);

    expect(result).toEqual({ isFinished: false, isWon: false });
  });

  it('全ヒットの推測は勝利', () => {
    const guesses: Guess[] = [createGuess(2, 1), createGuess(4, 0)];

    const result = isGameFinished(guesses, 8, 4);

    expect(result).toEqual({ isFinished: true, isWon: true });
  });

  it('最大試行回数到達で敗北', () => {
    const guesses: Guess[] = Array.from({ length: 8 }, (_, i) =>
      createGuess(i < 7 ? 2 : 3, 1),
    );

    const result = isGameFinished(guesses, 8, 4);

    expect(result).toEqual({ isFinished: true, isWon: false });
  });

  it('ゲーム続行中（非終了）', () => {
    const guesses: Guess[] = [createGuess(2, 1), createGuess(3, 0)];

    const result = isGameFinished(guesses, 8, 4);

    expect(result).toEqual({ isFinished: false, isWon: false });
  });

  it('1推測で全ヒット（即勝利）', () => {
    const guesses: Guess[] = [createGuess(4, 0)];

    const result = isGameFinished(guesses, 8, 4);

    expect(result).toEqual({ isFinished: true, isWon: true });
  });
});
