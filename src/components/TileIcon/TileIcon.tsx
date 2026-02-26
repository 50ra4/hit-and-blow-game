import type { TileId } from '@/features/game/tileDisplay';

type TileIconProps = {
  tileId: TileId;
  className?: string;
};

const TILE_SVG_CONTENTS: Record<TileId, React.ReactNode> = {
  star: (
    <path d="M32 6 L39.6 25.2 L59.6 25.2 L43.6 37.2 L51.2 56.4 L32 44.4 L12.8 56.4 L20.4 37.2 L4.4 25.2 L24.4 25.2 Z" />
  ),
  circle: <circle cx="32" cy="32" r="26" />,
  triangle: <polygon points="32,6 6,58 58,58" />,
  square: <rect x="6" y="6" width="52" height="52" />,
  diamond: <polygon points="32,4 60,32 32,60 4,32" />,
  spade: (
    <path d="M32 4 C 32 4, 58 22, 58 36 C 58 48, 46 54, 38 48 L 40 58 L 24 58 L 26 48 C 18 54, 6 48, 6 36 C 6 22, 32 4, 32 4 Z" />
  ),
  heart: (
    <path d="M32 54 C 32 54, 4 36, 4 20 C 4 10, 12 4, 20 4 C 26 4, 32 10, 32 10 C 32 10, 38 4, 44 4 C 52 4, 60 10, 60 20 C 60 36, 32 54, 32 54 Z" />
  ),
  club: (
    <>
      <circle cx="32" cy="20" r="12" />
      <circle cx="18" cy="36" r="12" />
      <circle cx="46" cy="36" r="12" />
      <rect x="28" y="44" width="8" height="14" />
      <rect x="20" y="55" width="24" height="5" />
    </>
  ),
};

export function TileIcon({ tileId, className }: TileIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {TILE_SVG_CONTENTS[tileId]}
    </svg>
  );
}
