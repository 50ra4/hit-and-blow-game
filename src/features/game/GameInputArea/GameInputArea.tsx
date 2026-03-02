import { useTranslation } from 'react-i18next';
import type { Tile } from '@/features/game/game.schema';
import { TilePicker } from '@/features/game/TilePicker/TilePicker';
import { TileChip } from '@/components/TileChip/TileChip';

type GameInputAreaProps = {
  currentGuess: (Tile | null)[];
  answerLength: number;
  activeSlotIndex: number | null;
  onTileSelect: (tile: Tile) => void;
  onSlotTap: (index: number) => void;
  onSubmit: () => void;
  onResetGuess: () => void;
  allowDuplicates: boolean;
};

export function GameInputArea({
  currentGuess,
  answerLength,
  activeSlotIndex,
  onTileSelect,
  onSlotTap,
  onSubmit,
  onResetGuess,
  allowDuplicates,
}: GameInputAreaProps) {
  const { t } = useTranslation();
  const canSubmit = currentGuess.every((t) => t !== null);
  const selectedTiles = currentGuess.filter((t): t is Tile => t !== null);

  return (
    <div className="mt-6 shrink-0 rounded-xl border-2 border-dashed border-white/30 bg-white/5 p-4">
      <p className="mb-3 text-center text-sm text-white/60">
        {t('game.currentGuessLabel')}
      </p>

      {/* 入力スロット */}
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {Array.from({ length: answerLength }, (_, index) => {
          const tile = currentGuess.at(index) ?? null;
          const isActive = activeSlotIndex === index;

          return (
            <button
              key={index}
              onClick={() => onSlotTap(index)}
              className={`inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl overflow-hidden shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 active:scale-95 ${
                isActive
                  ? 'hab-slot-pulse ring-2 ring-indigo-400'
                  : ''
              } ${
                tile
                  ? 'hover:-translate-y-0.5 hover:opacity-75'
                  : 'border-2 border-dashed border-white/40 bg-white/5'
              }`}
              aria-label={t('game.selectSlot', { index: index + 1 })}
            >
              {tile && (
                <TileChip tileId={tile.id} className="h-full w-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* タイルパレット */}
      <TilePicker
        selected={selectedTiles}
        onSelect={onTileSelect}
        maxLength={answerLength}
        disabled={false}
        allowDuplicates={allowDuplicates}
        activeSlotIndex={activeSlotIndex}
        activeSlotTile={activeSlotIndex !== null ? (currentGuess.at(activeSlotIndex) ?? null) : null}
      />

      {/* アクションボタン */}
      <div className="mt-5 flex justify-center gap-3">
        <button
          onClick={onResetGuess}
          disabled={currentGuess.every((t) => t === null)}
          className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-white transition-all duration-300 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('game.reset')}
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="max-w-xs flex-1 rounded-xl bg-linear-to-r from-green-500 to-green-700 py-3 text-lg font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/40 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {t('game.submit')}
        </button>
      </div>
    </div>
  );
}
