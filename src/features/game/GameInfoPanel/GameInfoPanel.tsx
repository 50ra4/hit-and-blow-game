import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@/features/game/CircularProgress/CircularProgress';

type GameInfoPanelProps = {
  modeName: string;
  allowDuplicates: boolean;
  attempts: number;
  maxAttempts: number;
};

export function GameInfoPanel({
  modeName,
  allowDuplicates,
  attempts,
  maxAttempts,
}: GameInfoPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div className="text-center">
          <p className="mb-2 text-xs text-white/60">
            {t('game.infoModeLabel')}
          </p>
          <p className="text-lg font-bold text-white">{modeName}</p>
        </div>
        <div className="text-center">
          <p className="mb-2 text-xs text-white/60">
            {t('game.infoDuplicatesLabel')}
          </p>
          <p className="text-lg font-bold text-white">
            {allowDuplicates
              ? t('game.infoDuplicatesOn')
              : t('game.infoDuplicatesOff')}
          </p>
        </div>
        <CircularProgress current={attempts} max={maxAttempts} />
      </div>
    </div>
  );
}
