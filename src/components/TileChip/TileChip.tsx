import { TILE_GRADIENT_STYLES, type TileId } from '@/features/game/tileDisplay';
import { TileIcon } from '@/components/TileIcon/TileIcon';

type TileChipProps = {
  tileId: TileId;
  className?: string;
};

export function TileChip({ tileId, className }: TileChipProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden ${className ?? ''}`}
      style={TILE_GRADIENT_STYLES[tileId]}
    >
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
        }}
      />
      <TileIcon tileId={tileId} className="relative w-[57%] h-[57%]" />
    </div>
  );
}
