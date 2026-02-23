import { z } from 'zod';
import { LANGUAGE_ID_VALUES } from '@/consts/languages';
import { THEME_ID_VALUES } from '@/consts/themes';

// Settings スキーマ
export const SettingsSchema = z.object({
  language: z.enum(LANGUAGE_ID_VALUES).default('ja'),
  theme: z.enum(THEME_ID_VALUES).default('system'),
  soundEnabled: z.boolean().default(true),
  tutorialCompleted: z.boolean().default(false),
});

// 型推論
export type Settings = z.output<typeof SettingsSchema>;

// Input/Output型
export type SettingsInput = z.input<typeof SettingsSchema>;
export type SettingsOutput = z.output<typeof SettingsSchema>;
