import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PLAY_TYPE_IDS } from '@/consts/playTypes';
import type { PlayType } from '@/features/game/game.schema';

type GameHeaderProps = {
  modeName: string;
  attempts: number;
  maxAttempts: number;
  playType: PlayType;
};

export function GameHeader({
  modeName,
  attempts,
  maxAttempts,
  playType,
}: GameHeaderProps) {
  const { t } = useTranslation();

  const centerTitle =
    playType === PLAY_TYPE_IDS.DAILY
      ? t('game.dailyTitle', { mode: modeName })
      : modeName;

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-gray-900/85 px-4 py-3 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
        >
          {t('game.backToHome')}
        </Link>

        <h2 className="flex-1 truncate px-2 text-center text-base font-semibold text-white">
          {centerTitle}
        </h2>

        <div className="min-w-24 text-right text-sm font-medium text-white/80">
          {t('game.attempts', { current: attempts, max: maxAttempts })}
        </div>
      </div>
    </header>
  );
}
