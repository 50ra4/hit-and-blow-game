import { memo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_TILES } from '@/consts/tiles';
import type { Tile } from '@/features/game/game.schema';
import {
  TILE_GRADIENT_STYLES,
  TILE_SYMBOLS,
  type TileId,
} from '@/features/game/tileDisplay';

type TilePickerProps = {
  selected: Tile[];
  onSelect: (tile: Tile) => void;
  maxLength: number;
  disabled?: boolean;
  allowDuplicates: boolean;
};

export const TilePicker = memo(function TilePicker({
  selected,
  onSelect,
  maxLength,
  disabled = false,
  allowDuplicates,
}: TilePickerProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const isTileDisabled = useCallback(
    (tile: Tile): boolean => {
      if (disabled) return true;
      if (selected.length >= maxLength) return true;
      if (!allowDuplicates && selected.some((s) => s.id === tile.id))
        return true;
      return false;
    },
    [disabled, maxLength, allowDuplicates, selected],
  );

  const isTileSelected = useCallback(
    (tile: Tile): boolean => selected.some((s) => s.id === tile.id),
    [selected],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const buttons = containerRef.current?.querySelectorAll('button');
      if (!buttons) return;

      const total = buttons.length;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        (buttons.item((index + 1) % total) as HTMLElement).focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        (buttons.item((index - 1 + total) % total) as HTMLElement).focus();
      }
    },
    [],
  );

  return (
    <div ref={containerRef} className="grid grid-cols-4 gap-3 sm:gap-4">
      {AVAILABLE_TILES.map((tile, index) => {
        const tileDisabled = isTileDisabled(tile);
        const tileSelected = isTileSelected(tile);
        const gradientStyle = TILE_GRADIENT_STYLES[tile.id as TileId];
        const symbol = TILE_SYMBOLS[tile.id as TileId];

        return (
          <button
            key={tile.id}
            role="button"
            aria-label={t(`tile.${tile.id}`)}
            aria-pressed={tileSelected}
            disabled={tileDisabled}
            onClick={() => onSelect(tile)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={tileDisabled ? undefined : gradientStyle}
            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold shadow-md transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 sm:h-16 sm:w-16 ${
              tileDisabled
                ? 'cursor-not-allowed bg-gray-600 text-gray-400 opacity-30'
                : 'cursor-pointer hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:scale-95'
            } ${tileSelected ? 'ring-4 ring-white/60' : ''} `}
          >
            {symbol}
          </button>
        );
      })}
    </div>
  );
});
