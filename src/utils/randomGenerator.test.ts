import { describe, it, expect } from 'vitest';
import { createSeededRandom, getDailySeed } from './randomGenerator';

describe('getDailySeed', () => {
  it('YYYY-MM-DD形式の文字列を返す', () => {
    const seed = getDailySeed();
    expect(seed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('createSeededRandom', () => {
  it('同じシードから同じ乱数列を生成する', () => {
    const rand1 = createSeededRandom('test-seed');
    const rand2 = createSeededRandom('test-seed');
    expect(rand1()).toBe(rand2());
    expect(rand1()).toBe(rand2());
    expect(rand1()).toBe(rand2());
  });

  it('異なるシードからは異なる乱数列を生成する', () => {
    const rand1 = createSeededRandom('seed-a');
    const rand2 = createSeededRandom('seed-b');
    // 最初の値が異なることを確認（衝突の可能性はあるが実用上問題ない）
    const values1 = [rand1(), rand1(), rand1()];
    const values2 = [rand2(), rand2(), rand2()];
    expect(values1).not.toEqual(values2);
  });

  it('生成される値は0以上1未満の範囲に収まる', () => {
    const rand = createSeededRandom('range-test');
    for (let i = 0; i < 100; i++) {
      const value = rand();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
