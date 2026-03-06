import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/Modal/Modal';
import type { Guess } from '@/features/game/game.schema';
import { TileChip } from '@/components/TileChip/TileChip';

type GuessHistoryProps = {
  guesses: Guess[];
  allowDuplicates: boolean;
};

export function GuessHistory({ guesses, allowDuplicates }: GuessHistoryProps) {
  const { t } = useTranslation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs text-white/50">{t('game.guessHistoryLabel')}</p>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="text-green-400/70">{t('game.hit')}</span>
            <span className="text-yellow-400/70">{t('game.blow')}</span>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex h-4 w-4 items-center justify-center rounded-full border border-white/30 text-[10px] font-bold text-white/50 transition-all duration-200 hover:border-white/60 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label={t('game.rulesHelpLabel')}
            >
              ?
            </button>
          </div>
        </div>
        {guesses.map((guess, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-3 rounded-xl bg-black/20 p-3"
          >
            <div className="flex flex-1 gap-2">
              {guess.tiles.map((tile, slotIndex) => (
                <TileChip
                  key={slotIndex}
                  tileId={tile.id}
                  className="h-10 w-10 rounded-xl shadow-md"
                />
              ))}
            </div>
            <div className="flex min-w-24 justify-end gap-4 text-sm font-bold">
              <span className="text-green-400">
                {t('game.hit')}: {guess.hits}
              </span>
              <span className="text-yellow-400">
                {t('game.blow')}: {guess.blows}
              </span>
            </div>
          </div>
        ))}
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
