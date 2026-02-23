import { useCallback } from 'react';
import { format } from 'date-fns';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/consts/storageKeys';

type UseDailyPlayedReturn = {
  hasPlayedToday: () => boolean;
  markPlayedToday: () => void;
};

const getTodayString = (): string => format(new Date(), 'yyyy-MM-dd');

export const useDailyPlayed = (): UseDailyPlayedReturn => {
  const [dailyPlayed, setDailyPlayed] = useLocalStorage<string>(
    STORAGE_KEYS.DAILY_PLAYED,
    '',
  );

  const hasPlayedToday = useCallback((): boolean => {
    return dailyPlayed === getTodayString();
  }, [dailyPlayed]);

  const markPlayedToday = useCallback((): void => {
    setDailyPlayed(getTodayString());
  }, [setDailyPlayed]);

  return { hasPlayedToday, markPlayedToday };
};
