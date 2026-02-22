// プレイタイプID定数
export const PLAY_TYPE_IDS = {
  FREE: 'free',
  DAILY: 'daily'
} as const;

// プレイタイプID配列（Zod enum用）
export const PLAY_TYPE_ID_VALUES = Object.values(PLAY_TYPE_IDS);
