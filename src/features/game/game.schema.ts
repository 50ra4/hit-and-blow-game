import { z } from 'zod';
import { TILE_ID_VALUES } from '@/consts/tiles';
import { GAME_MODE_ID_VALUES } from '@/consts/modes';
import { PLAY_TYPE_ID_VALUES } from '@/consts/playTypes';

// Tile スキーマ
export const TileSchema = z.object({
  id: z.enum(TILE_ID_VALUES),
  color: z.string(),
});

// GameMode スキーマ
export const GameModeSchema = z.enum(GAME_MODE_ID_VALUES);

// PlayType スキーマ
export const PlayTypeSchema = z.enum(PLAY_TYPE_ID_VALUES);

// Guess スキーマ
export const GuessSchema = z.object({
  tiles: z.array(TileSchema),
  hits: z.number().int().min(0),
  blows: z.number().int().min(0),
  timestamp: z.number().int().positive(),
});

// GameState スキーマ
export const GameStateSchema = z.object({
  mode: GameModeSchema,
  playType: PlayTypeSchema,
  answer: z.array(TileSchema),
  guesses: z.array(GuessSchema),
  currentGuess: z.array(TileSchema),
  isGameOver: z.boolean(),
  isWon: z.boolean(),
  attempts: z.number().int().min(0),
  maxAttempts: z.number().int().min(1),
});

// GameResult スキーマ
export const GameResultSchema = z.object({
  mode: GameModeSchema,
  playType: PlayTypeSchema,
  isWon: z.boolean(),
  attempts: z.number().int().min(1),
  timestamp: z.number().int().positive(),
});

// ModeConfig スキーマ
export const ModeConfigSchema = z.object({
  id: GameModeSchema,
  nameKey: z.string(),
  length: z.number().int().min(1),
  allowDuplicates: z.boolean(),
  maxAttempts: z.number().int().min(1),
  unlockCondition: GameModeSchema.optional(),
});

// 型推論
export type Tile = z.output<typeof TileSchema>;
export type GameMode = z.output<typeof GameModeSchema>;
export type PlayType = z.output<typeof PlayTypeSchema>;
export type Guess = z.output<typeof GuessSchema>;
export type GameState = z.output<typeof GameStateSchema>;
export type GameResult = z.output<typeof GameResultSchema>;
export type ModeConfig = z.output<typeof ModeConfigSchema>;

// Input/Output型
export type GameResultInput = z.input<typeof GameResultSchema>;
export type GameResultOutput = z.output<typeof GameResultSchema>;
