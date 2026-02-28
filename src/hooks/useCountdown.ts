import { useState, useEffect } from 'react';
import { startOfTomorrow, differenceInSeconds } from 'date-fns';

export const useCountdown = (): string => {
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    const updateCountdown = (): void => {
      const now = new Date();
      const nextMidnight = startOfTomorrow();
      const remainingSeconds = differenceInSeconds(nextMidnight, now);

      if (remainingSeconds <= 0) {
        // 残り時間が0以下の場合、次の翌日を対象にして再計算
        const nextNextMidnight = startOfTomorrow();
        nextNextMidnight.setDate(nextNextMidnight.getDate() + 1);
        const newRemainingSeconds = differenceInSeconds(nextNextMidnight, now);
        const hours = Math.floor(newRemainingSeconds / 3600);
        const minutes = Math.floor((newRemainingSeconds % 3600) / 60);
        const seconds = newRemainingSeconds % 60;
        setCountdown(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        );
      } else {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        setCountdown(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        );
      }
    };

    // 初回の即座実行
    updateCountdown();

    // 毎秒更新
    const intervalId = setInterval(updateCountdown, 1000);

    // クリーンアップ
    return () => clearInterval(intervalId);
  }, []);

  return countdown;
};
