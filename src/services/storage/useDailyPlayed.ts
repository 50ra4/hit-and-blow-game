import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/consts/storageKeys';

type UseDailyPlayedReturn = {
  hasPlayedToday: () => boolean;
  markPlayedToday: () => void;
};

export const useDailyPlayed = (): UseDailyPlayedReturn => {
  const [dailyPlayed, setDailyPlayed] = useLocalStorage<string>(
    STORAGE_KEYS.DAILY_PLAYED,
    '',
  );

  const hasPlayedToday = useCallback((): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return dailyPlayed === today;
  }, [dailyPlayed]);

  const markPlayedToday = useCallback((): void => {
    const today = new Date().toISOString().split('T')[0];
    setDailyPlayed(today);
  }, [setDailyPlayed]);

  return { hasPlayedToday, markPlayedToday };
};
