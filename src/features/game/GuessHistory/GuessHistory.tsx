import { useTranslation } from 'react-i18next';
import type { Guess } from '@/features/game/game.schema';
import { TileChip } from '@/components/TileChip/TileChip';

type GuessHistoryProps = {
  guesses: Guess[];
};

export function GuessHistory({ guesses }: GuessHistoryProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      {guesses.map((guess, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-3 rounded-xl bg-black/20 p-3"
        >
          <div className="flex flex-1 gap-2">
            {guess.tiles.map((tile, slotIndex) => (
              <TileChip key={slotIndex} tileId={tile.id} className="h-10 w-10 rounded-xl shadow-md" />
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
  );
}
