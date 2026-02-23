import { describe, it, expect } from 'vitest';
import type { Stats } from '@/features/stats/stats.schema';
import { migrateStats } from './migrations';

describe('migrateStats', () => {
  it('version が v1.0 のデータをそのまま返す', () => {
    const data: Stats = {
      version: '1.0',
      totalPlays: 10,
      totalWins: 5,
      winRate: 50,
      averageAttempts: 5,
      bestAttempts: 3,
      modeStats: {},
      unlockedModes: ['beginner', 'normal', 'hard'],
      dailyHistory: [],
      lastPlayed: '',
    };

    const result = migrateStats(data);

    expect(result).toEqual(data);
  });

  it('version フィールドがない場合も v1.0 として処理', () => {
    const data = {
      totalPlays: 10,
      totalWins: 5,
      winRate: 50,
      averageAttempts: 5,
      bestAttempts: 3,
      modeStats: {},
      unlockedModes: ['beginner', 'normal', 'hard'],
      dailyHistory: [],
      lastPlayed: '',
    };

    const result = migrateStats(data);

    expect(result.totalPlays).toBe(10);
    expect(result.totalWins).toBe(5);
  });

  it('null 入力でも v1.0 フォールバック', () => {
    const result = migrateStats(null);

    expect(result).toBeDefined();
  });

  it('不明なバージョンでも v1.0 として処理', () => {
    const data = {
      version: '2.0',
      totalPlays: 20,
      totalWins: 10,
    };

    const result = migrateStats(data);

    expect(result.totalPlays).toBe(20);
  });
});
