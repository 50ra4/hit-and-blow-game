import { AVAILABLE_TILES } from '@/consts/tiles';
import { createSeededRandom } from '@/utils/randomGenerator';
import type { Tile, Guess } from './game.schema';

/**
 * 答えのタイル配列を生成する
 *
 * @param length - 桁数（3, 4, 8）
 * @param allowDuplicates - 重複を許可するか
 * @param seed - シード文字列（デイリーチャレンジ用、省略時はMath.random使用）
 * @returns Tile[] - 答えのタイル配列
 */
export const generateAnswer = (
  length: number,
  allowDuplicates: boolean,
  seed?: string,
): Tile[] => {
  const random = seed ? createSeededRandom(seed) : Math.random;

  if (allowDuplicates) {
    // 重複を許可：各桁で独立に選択
    return Array.from({ length }, () => {
      const index = Math.floor(random() * AVAILABLE_TILES.length);
      return AVAILABLE_TILES[index];
    });
  }

  // 重複なし：Fisher-Yates シャッフル
  const shuffled = [...AVAILABLE_TILES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, length);
};

/**
 * 推測に対するヒット数・ブロー数を計算する
 *
 * @param guess - プレイヤーの推測タイル配列
 * @param answer - 正解のタイル配列
 * @returns { hits: number; blows: number }
 */
export const checkGuess = (
  guess: Tile[],
  answer: Tile[],
): { hits: number; blows: number } => {
  // ヒット判定：同じ位置にある同じタイル
  const hits = guess.reduce((count, tile, index) => {
    return answer[index]?.id === tile.id ? count + 1 : count;
  }, 0);

  // ブロー計算用：ヒット分を除外したタイルIDの出現回数
  const answerIdCounts = new Map<string, number>();
  const guessIdCounts = new Map<string, number>();

  // 答え側のカウント（ヒット分を除外）
  answer.forEach((tile, index) => {
    if (guess[index]?.id !== tile.id) {
      answerIdCounts.set(tile.id, (answerIdCounts.get(tile.id) ?? 0) + 1);
    }
  });

  // 推測側のカウント（ヒット分を除外）
  guess.forEach((tile, index) => {
    if (answer[index]?.id !== tile.id) {
      guessIdCounts.set(tile.id, (guessIdCounts.get(tile.id) ?? 0) + 1);
    }
  });

  // ブロー数：各タイルIDについて min(答え側の出現回数, 推測側の出現回数) を合計
  const blows = Array.from(guessIdCounts.entries()).reduce(
    (total, [tileId, guessCount]) => {
      const answerCount = answerIdCounts.get(tileId) ?? 0;
      return total + Math.min(answerCount, guessCount);
    },
    0,
  );

  return { hits, blows };
};

/**
 * ゲーム終了判定
 *
 * @param guesses - これまでの推測一覧
 * @param maxAttempts - 最大試行回数
 * @param answerLength - 答えの桁数
 * @returns { isFinished: boolean; isWon: boolean }
 */
export const isGameFinished = (
  guesses: Guess[],
  maxAttempts: number,
  answerLength: number,
): { isFinished: boolean; isWon: boolean } => {
  if (guesses.length === 0) {
    return { isFinished: false, isWon: false };
  }

  // 最新の推測のヒット数が answerLength と一致すれば勝利
  const lastGuess = guesses.at(-1);
  if (lastGuess && lastGuess.hits === answerLength) {
    return { isFinished: true, isWon: true };
  }

  // 推測数が maxAttempts に達していれば敗北
  if (guesses.length >= maxAttempts) {
    return { isFinished: true, isWon: false };
  }

  return { isFinished: false, isWon: false };
};
