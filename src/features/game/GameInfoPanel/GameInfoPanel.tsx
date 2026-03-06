import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/Modal/Modal';
import { CircularProgress } from '@/features/game/CircularProgress/CircularProgress';

type GameInfoPanelProps = {
  length: number;
  allowDuplicates: boolean;
  attempts: number;
  maxAttempts: number;
};

export function GameInfoPanel({
  length,
  allowDuplicates,
  attempts,
  maxAttempts,
}: GameInfoPanelProps) {
  const { t } = useTranslation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <p className="mb-2 text-xs text-white/60">
              {t('game.infoDigitsLabel')}
            </p>
            <p className="text-lg font-bold text-white">
              {t('game.infoDigits', { count: length })}
            </p>
          </div>
          <CircularProgress current={attempts} max={maxAttempts} />
          <div className="flex-1 text-center">
            <p className="mb-2 text-xs text-white/60">
              {t('game.infoDuplicatesLabel')}
            </p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-lg font-bold text-white">
                {allowDuplicates
                  ? t('game.infoDuplicatesOn')
                  : t('game.infoDuplicatesOff')}
              </p>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-xs font-bold text-white/60 transition-all duration-200 hover:border-white/60 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label={t('game.rulesHelpLabel')}
              >
                ?
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title={t('game.rulesHelpTitle')}
      >
        <div className="space-y-4 text-white">
          <div className="flex items-center gap-3">
            <span className="w-12 shrink-0 font-bold text-green-400">
              {t('game.rulesHelpHitTitle')}
            </span>
            <span className="text-sm text-white/80">
              {t('game.rulesHelpHitDesc')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-12 shrink-0 font-bold text-yellow-400">
              {t('game.rulesHelpBlowTitle')}
            </span>
            <span className="text-sm text-white/80">
              {t('game.rulesHelpBlowDesc')}
            </span>
          </div>
          {allowDuplicates && (
            <>
              <hr className="border-white/10" />
              <div>
                <p className="mb-2 text-sm font-semibold text-white/90">
                  {t('game.rulesHelpDuplicateNote')}
                </p>
                <p className="text-sm text-white/70">
                  {t('game.rulesHelpDuplicateDesc')}
                </p>
                <p className="mt-2 rounded-lg bg-white/5 p-3 text-xs text-white/60">
                  {t('game.rulesHelpDuplicateExample')}
                </p>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
