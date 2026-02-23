import { toNonEmptyArray } from '@/utils/arrayUtils';

// 言語ID定数
export const LANGUAGE_IDS = {
  JA: 'ja',
  EN: 'en',
} as const;

// 言語ID配列（Zod enum用）
export const LANGUAGE_ID_VALUES = toNonEmptyArray(Object.values(LANGUAGE_IDS));
