// テーマID定数
export const THEME_IDS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// テーマID配列（Zod enum用）
export const THEME_ID_VALUES = Object.values(THEME_IDS) as [
  (typeof THEME_IDS)[keyof typeof THEME_IDS],
  ...(typeof THEME_IDS)[keyof typeof THEME_IDS][],
];
