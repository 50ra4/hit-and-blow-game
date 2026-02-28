import { useState, useEffect } from 'react';
import { startOfTomorrow, differenceInSeconds } from 'date-fns';

const formatSeconds = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const useCountdown = (): string => {
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    const updateCountdown = (): void => {
      const now = new Date();
      // startOfTomorrow() は常に「次の深夜0時」を返す。
      // differenceInSeconds が負になることは実質ないが、念のため Math.max で保護する。
      const remainingSeconds = Math.max(
        0,
        differenceInSeconds(startOfTomorrow(), now),
      );
      setCountdown(formatSeconds(remainingSeconds));
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
