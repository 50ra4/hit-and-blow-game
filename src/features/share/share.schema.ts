import { z } from 'zod';
import { GameModeSchema, PlayTypeSchema } from '@/features/game/game.schema';

export const ShareTextDataSchema = z.object({
  mode: GameModeSchema,
  attempts: z.number().int().min(1),
  playType: PlayTypeSchema,
});

export type ShareTextData = z.output<typeof ShareTextDataSchema>;
