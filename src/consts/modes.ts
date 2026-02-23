import { toNonEmptyArray } from '@/utils/arrayUtils';

// ゲームモードID定数
export const GAME_MODE_IDS = {
  BEGINNER: 'beginner',
  NORMAL: 'normal',
  HARD: 'hard',
  EXPERT: 'expert',
  MASTER: 'master',
} as const;

// ゲームモードID配列（Zod enum用）
export const GAME_MODE_ID_VALUES = toNonEmptyArray(
  Object.values(GAME_MODE_IDS),
);

// ゲームモード設定（ModeConfig型はgame.schemaから取得）
export const GAME_MODES = {
  [GAME_MODE_IDS.BEGINNER]: {
    id: GAME_MODE_IDS.BEGINNER,
    nameKey: 'mode.beginner',
    length: 3,
    allowDuplicates: false,
    maxAttempts: 6,
  },
  [GAME_MODE_IDS.NORMAL]: {
    id: GAME_MODE_IDS.NORMAL,
    nameKey: 'mode.normal',
    length: 4,
    allowDuplicates: false,
    maxAttempts: 8,
  },
  [GAME_MODE_IDS.HARD]: {
    id: GAME_MODE_IDS.HARD,
    nameKey: 'mode.hard',
    length: 4,
    allowDuplicates: true,
    maxAttempts: 10,
  },
  [GAME_MODE_IDS.EXPERT]: {
    id: GAME_MODE_IDS.EXPERT,
    nameKey: 'mode.expert',
    length: 8,
    allowDuplicates: false,
    maxAttempts: 12,
    unlockCondition: GAME_MODE_IDS.NORMAL,
  },
  [GAME_MODE_IDS.MASTER]: {
    id: GAME_MODE_IDS.MASTER,
    nameKey: 'mode.master',
    length: 8,
    allowDuplicates: true,
    maxAttempts: 15,
    unlockCondition: GAME_MODE_IDS.EXPERT,
  },
} as const;
