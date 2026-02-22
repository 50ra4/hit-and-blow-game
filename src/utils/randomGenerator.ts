/**
 * デイリーシード生成
 * 当日の日付（YYYY-MM-DD形式）を返す
 */
export function getDailySeed(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // "2026-02-21"
}

/**
 * シード付き乱数生成器
 * 同じシードからは常に同じ乱数列を生成する（Pure Function）
 *
 * アルゴリズム: mulberry32（32bit）を使用
 * シード文字列をハッシュ値に変換してから乱数生成
 */
export function createSeededRandom(seed: string): () => number {
  // シード文字列を数値に変換（簡易ハッシュ）
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }

  // mulberry32 アルゴリズム
  return function () {
    h |= 0;
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
