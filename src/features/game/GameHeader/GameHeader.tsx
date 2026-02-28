import { useTranslation } from 'react-i18next';
import { PLAY_TYPE_IDS } from '@/consts/playTypes';
import type { PlayType } from '@/features/game/game.schema';

type GameHeaderProps = {
  modeName: string;
  playType: PlayType;
  onBack: () => void;
};

export function GameHeader({ modeName, playType, onBack }: GameHeaderProps) {
  const { t } = useTranslation();

  const centerTitle =
    playType === PLAY_TYPE_IDS.DAILY
      ? t('game.dailyTitle', { mode: modeName })
      : t('game.freeTitle', { mode: modeName });

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-gray-900/85 px-4 py-3 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
        >
          {t('game.backToHome')}
        </button>

        <h2 className="flex-1 truncate px-2 text-center text-base font-semibold text-white">
          {centerTitle}
        </h2>
      </div>
    </header>
  );
}
