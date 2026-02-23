import { TILE_IDS } from '@/consts/tiles';
import type { Tile } from '@/features/game/game.schema';

// タイルIDの型（Zodスキーマは string で推論されるため、表示層での型安全性確保に使用）
export type TileId = (typeof TILE_IDS)[keyof typeof TILE_IDS];

// タイルごとの表示シンボル（T-022でSVGに差し替え予定のプレースホルダー）
export const TILE_SYMBOLS = {
  star: '★',
  circle: '●',
  triangle: '▲',
  square: '■',
  diamond: '◆',
  spade: '♠',
  heart: '♥',
  club: '♣',
} as const satisfies Record<Tile['id'], string>;

// タイルごとの背景グラデーション（06_mock_design.htmlに基づく）
export const TILE_GRADIENT_STYLES = {
  star: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#8B4513',
  },
  circle: {
    background: 'linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%)',
    color: '#ffffff',
  },
  triangle: {
    background: 'linear-gradient(135deg, #FF5252 0%, #D32F2F 100%)',
    color: '#ffffff',
  },
  square: {
    background: 'linear-gradient(135deg, #66BB6A 0%, #388E3C 100%)',
    color: '#ffffff',
  },
  diamond: {
    background: 'linear-gradient(135deg, #BA68C8 0%, #7B1FA2 100%)',
    color: '#ffffff',
  },
  spade: {
    background: 'linear-gradient(135deg, #78909C 0%, #455A64 100%)',
    color: '#ffffff',
  },
  heart: {
    background: 'linear-gradient(135deg, #F06292 0%, #C2185B 100%)',
    color: '#ffffff',
  },
  club: {
    background: 'linear-gradient(135deg, #26A69A 0%, #00796B 100%)',
    color: '#ffffff',
  },
} as const satisfies Record<Tile['id'], { background: string; color: string }>;
