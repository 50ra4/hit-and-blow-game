import { useCallback } from 'react';
import { useLocalStorage } from '@/services/storage/useLocalStorage';
import { STORAGE_KEYS } from '@/consts/storageKeys';
import { GAME_MODES } from '@/consts/modes';
import type { GameMode, GameResult } from '@/features/game/game.schema';
import { StatsSchema, type Stats, ModeStatsSchema } from './stats.schema';
import { migrateStats } from '@/services/storage/migrations';

const DEFAULT_STATS: Stats = StatsSchema.parse({});

type UseStatsReturn = {
  stats: Stats;
  recordGame: (result: GameResult) => void;
  unlockMode: (mode: GameMode) => void;
  isModeUnlocked: (mode: GameMode) => boolean;
  clearStats: () => void;
};

export const useStats = (): UseStatsReturn => {
  const [stats, setStats, clearStats] = useLocalStorage<Stats>(
    STORAGE_KEYS.STATS,
    DEFAULT_STATS,
    StatsSchema,
    migrateStats,
  );

  const recordGame = useCallback((result: GameResult): void => {
     
    setStats((prev) => {
      const { mode, playType, isWon, attempts, timestamp } = result;

      // 1. totalPlays を +1
      const newTotalPlays = prev.totalPlays + 1;

      // 2. 勝利時: totalWins を +1
      const newTotalWins = isWon ? prev.totalWins + 1 : prev.totalWins;

      // 3. winRate を再計算
      const newWinRate = (newTotalWins / newTotalPlays) * 100;

      // 4. 勝利時: averageAttempts を再計算
      const newAverageAttempts = isWon
        ? (prev.averageAttempts * prev.totalWins + attempts) / newTotalWins
        : prev.averageAttempts;

      // 5. 勝利時: bestAttempts を更新
      const newBestAttempts = isWon
        ? prev.bestAttempts === null || attempts < prev.bestAttempts
          ? attempts
          : prev.bestAttempts
        : prev.bestAttempts;

      // 6. modeStats[mode] を更新
      const prevModeStats = prev.modeStats[mode] ?? ModeStatsSchema.parse({});
      const newModePlays = prevModeStats.plays + 1;
      const newModeWins = isWon ? prevModeStats.wins + 1 : prevModeStats.wins;
      const newModeWinRate = (newModeWins / newModePlays) * 100;
      const newModeAverageAttempts = isWon
        ? (prevModeStats.averageAttempts * prevModeStats.wins + attempts) /
          newModeWins
        : prevModeStats.averageAttempts;

      const newModeBestAttempts = isWon
        ? prevModeStats.bestAttempts === null ||
          attempts < prevModeStats.bestAttempts
          ? attempts
          : prevModeStats.bestAttempts
        : prevModeStats.bestAttempts;

      const newModeStats = {
        ...prev.modeStats,
        [mode]: {
          plays: newModePlays,
          wins: newModeWins,
          winRate: newModeWinRate,
          averageAttempts: newModeAverageAttempts,
          bestAttempts: newModeBestAttempts,
        },
      };

      // 7. デイリーチャレンジ履歴の追加（最大30件）
      const date = new Date(timestamp).toISOString().split('T')[0];
      const newDailyHistory =
        playType === 'daily'
          ? [...prev.dailyHistory, { date, mode, isWon, attempts }].slice(-30)
          : prev.dailyHistory;

      // 8. lastPlayed を更新
      const newLastPlayed = new Date(timestamp).toISOString();

      // 9. モード解放条件チェック
      let newUnlockedModes = [...prev.unlockedModes];
      if (isWon) {
        Object.values(GAME_MODES).forEach((modeConfig) => {
          if (
            modeConfig.unlockCondition === mode &&
            !newUnlockedModes.includes(modeConfig.id)
          ) {
            newUnlockedModes = [...newUnlockedModes, modeConfig.id];
          }
        });
      }

      return {
        ...prev,
        totalPlays: newTotalPlays,
        totalWins: newTotalWins,
        winRate: newWinRate,
        averageAttempts: newAverageAttempts,
        bestAttempts: newBestAttempts,
        modeStats: newModeStats,
        unlockedModes: newUnlockedModes,
        dailyHistory: newDailyHistory,
        lastPlayed: newLastPlayed,
      };
    });
  }, []);

  const unlockMode = useCallback((mode: GameMode): void => {
     
    setStats((prev) => {
      if (prev.unlockedModes.includes(mode)) {
        return prev;
      }
      return {
        ...prev,
        unlockedModes: [...prev.unlockedModes, mode],
      };
    });
  }, []);

  const isModeUnlocked = useCallback(
    (mode: GameMode): boolean => {
      return stats.unlockedModes.includes(mode);
    },
    [stats.unlockedModes],
  );

  return {
    stats,
    recordGame,
    unlockMode,
    isModeUnlocked,
    clearStats,
  };
};
