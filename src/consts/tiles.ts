import { toNonEmptyArray } from '@/utils/arrayUtils';

// タイルID定数
export const TILE_IDS = {
  STAR: 'star',
  CIRCLE: 'circle',
  TRIANGLE: 'triangle',
  SQUARE: 'square',
  DIAMOND: 'diamond',
  SPADE: 'spade',
  HEART: 'heart',
  CLUB: 'club',
} as const;

// タイルID配列（Zod enum用）
export const TILE_ID_VALUES = toNonEmptyArray(Object.values(TILE_IDS));

// タイル定義（Tile型はgame.schemaから取得）
export const TILES = {
  [TILE_IDS.STAR]: { id: TILE_IDS.STAR, color: '#FBBF24' },
  [TILE_IDS.CIRCLE]: { id: TILE_IDS.CIRCLE, color: '#EF4444' },
  [TILE_IDS.TRIANGLE]: { id: TILE_IDS.TRIANGLE, color: '#3B82F6' },
  [TILE_IDS.SQUARE]: { id: TILE_IDS.SQUARE, color: '#10B981' },
  [TILE_IDS.DIAMOND]: { id: TILE_IDS.DIAMOND, color: '#8B5CF6' },
  [TILE_IDS.SPADE]: { id: TILE_IDS.SPADE, color: '#1F2937' },
  [TILE_IDS.HEART]: { id: TILE_IDS.HEART, color: '#EC4899' },
  [TILE_IDS.CLUB]: { id: TILE_IDS.CLUB, color: '#F97316' },
} as const;

// タイル配列
export const AVAILABLE_TILES = Object.values(TILES);
