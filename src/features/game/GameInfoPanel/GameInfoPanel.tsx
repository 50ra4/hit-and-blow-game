import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@/features/game/CircularProgress/CircularProgress';

type GameInfoPanelProps = {
  modeName: string;
  answerLength: number;
  allowDuplicates: boolean;
  attempts: number;
  maxAttempts: number;
};

export function GameInfoPanel({
  modeName,
  answerLength,
  allowDuplicates,
  attempts,
  maxAttempts,
}: GameInfoPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="mb-2 text-xs text-white/60">
            {t('game.infoModeLabel')}
          </p>
          <p className="text-2xl font-bold text-white">{modeName}</p>
        </div>
        <div className="text-center">
          <p className="mb-2 text-xs text-white/60">
            {t('game.infoDigitsLabel')}
          </p>
          <p className="text-2xl font-bold text-white">
            {t('game.infoDigits', { count: answerLength })}
          </p>
        </div>
        <div className="text-center">
          <p className="mb-2 text-xs text-white/60">
            {t('game.infoDuplicatesLabel')}
          </p>
          <p className="text-2xl font-bold text-white">
            {allowDuplicates
              ? t('game.infoDuplicatesOn')
              : t('game.infoDuplicatesOff')}
          </p>
        </div>
        <div className="col-span-3 flex justify-center pt-2">
          <CircularProgress current={attempts} max={maxAttempts} />
        </div>
      </div>
    </div>
  );
}
