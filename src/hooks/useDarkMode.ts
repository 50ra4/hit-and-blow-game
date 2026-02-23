import { useEffect } from 'react';
import { useMediaQuery } from './useMediaQuery';

/**
 * ダークモード管理フック
 *
 * @param theme - テーマ設定（'light' | 'dark' | 'system'）
 * @returns { isDark: boolean }
 */
export const useDarkMode = (
  theme: 'light' | 'dark' | 'system',
): { isDark: boolean } => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return { isDark };
};
