import { useTranslation } from 'react-i18next';

type CircularProgressProps = {
  current: number;
  max: number;
};

const SIZE = 90;
const RADIUS = (SIZE - 8) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getColorClass = (remaining: number, max: number): string => {
  if (remaining <= 1) return 'text-[#f44336]';
  if (remaining / max <= 0.3) return 'text-[#ffc107]';
  return 'text-[#4caf50]';
};

export function CircularProgress({ current, max }: CircularProgressProps) {
  const { t } = useTranslation();
  const remaining = max - current;
  const offset = CIRCUMFERENCE * (1 - remaining / max);
  const colorClass = getColorClass(remaining, max);

  return (
    <div className="relative size-22.5">
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={8}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className={`hab-progress-bar ${colorClass}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl leading-none font-bold text-white">
          {remaining}/{max}
        </span>
        <span className="mt-1 text-xs text-white/60">
          {t('game.attemptsUnit')}
        </span>
      </div>
    </div>
  );
}
