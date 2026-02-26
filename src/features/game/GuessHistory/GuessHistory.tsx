import { useTranslation } from 'react-i18next';
import { TileIcon } from '@/components/TileIcon/TileIcon';
import type { Guess } from '@/features/game/game.schema';
import { TILE_GRADIENT_STYLES } from '@/features/game/tileDisplay';

type GuessHistoryProps = {
  guesses: Guess[];
  answerLength: number;
  maxAttempts: number;
};

export function GuessHistory({
  guesses,
  answerLength,
  maxAttempts,
}: GuessHistoryProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      {Array.from({ length: maxAttempts }, (_, rowIndex) => {
        const guess = guesses.at(rowIndex);

        if (!guess) {
          return (
            <div
              key={rowIndex}
              className="flex items-center gap-3 rounded-xl bg-black/20 p-3 opacity-40"
            >
              <div className="flex flex-1 gap-2">
                {Array.from({ length: answerLength }, (_, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="h-10 w-10 rounded-xl border-2 border-dashed border-white/40 bg-white/5"
                  />
                ))}
              </div>
              <div className="flex min-w-24 justify-end gap-4 text-sm font-bold">
                <span className="text-green-400">{t('game.hit')}: -</span>
                <span className="text-yellow-400">{t('game.blow')}: -</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={rowIndex}
            className="flex items-center gap-3 rounded-xl bg-black/20 p-3"
          >
            <div className="flex flex-1 gap-2">
              {guess.tiles.map((tile, slotIndex) => (
                <div
                  key={slotIndex}
                  style={TILE_GRADIENT_STYLES[tile.id]}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-md"
                >
                  <TileIcon tileId={tile.id} className="h-6 w-6" />
                </div>
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
        );
      })}
    </div>
  );
}
