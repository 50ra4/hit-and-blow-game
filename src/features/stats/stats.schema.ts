import { z } from 'zod';
import { GameModeSchema } from '@/features/game/game.schema';

// ModeStats スキーマ
export const ModeStatsSchema = z.object({
  plays: z.number().int().min(0).default(0),
  wins: z.number().int().min(0).default(0),
  winRate: z.number().min(0).max(100).default(0),
  averageAttempts: z.number().min(0).default(0),
  bestAttempts: z.number().int().min(0).nullable().default(null),
});

// DailyRecord スキーマ
export const DailyRecordSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mode: GameModeSchema,
  isWon: z.boolean(),
  attempts: z.number().int().min(1),
});

// Stats スキーマ
export const StatsSchema = z.object({
  version: z.string().default('1.0'),
  totalPlays: z.number().int().min(0).default(0),
  totalWins: z.number().int().min(0).default(0),
  winRate: z.number().min(0).max(100).default(0),
  averageAttempts: z.number().min(0).default(0),
  bestAttempts: z.number().int().min(0).nullable().default(null),
  modeStats: z.record(GameModeSchema, ModeStatsSchema).default({}),
  unlockedModes: z
    .array(GameModeSchema)
    .default(['beginner', 'normal', 'hard']),
  dailyHistory: z.array(DailyRecordSchema).max(30).default([]),
  lastPlayed: z.string().default(''),
});

// 型推論
export type ModeStats = z.output<typeof ModeStatsSchema>;
export type DailyRecord = z.output<typeof DailyRecordSchema>;
export type Stats = z.output<typeof StatsSchema>;

// Input/Output型
export type StatsInput = z.input<typeof StatsSchema>;
export type StatsOutput = z.output<typeof StatsSchema>;
