import { useTranslation } from 'react-i18next';
import { GAME_MODE_IDS, GAME_MODES } from '@/consts/modes';
import type { GameMode } from '@/features/game/game.schema';

const MODE_CHIP_STYLES: Record<GameMode, string> = {
  [GAME_MODE_IDS.BEGINNER]: 'bg-green-500/30 text-green-400',
  [GAME_MODE_IDS.NORMAL]: 'bg-blue-500/30 text-blue-400',
  [GAME_MODE_IDS.HARD]: 'bg-orange-500/30 text-orange-400',
  [GAME_MODE_IDS.EXPERT]: 'bg-purple-500/30 text-purple-400',
  [GAME_MODE_IDS.MASTER]: 'bg-red-500/30 text-red-400',
};

type ModeChipProps = {
  mode: GameMode;
  className?: string;
};

export function ModeChip({ mode, className }: ModeChipProps) {
  const { t } = useTranslation();
  const modeName = t(GAME_MODES[mode].nameKey);

  return (
    <span
      className={`rounded-full font-semibold ${MODE_CHIP_STYLES[mode]} ${className ?? ''}`}
    >
      {modeName}
    </span>
  );
}
