import { useTranslation } from 'react-i18next';

type CircularProgressProps = {
  current: number;
  max: number;
  size?: number;
};

const getStrokeColor = (remaining: number, max: number): string => {
  if (remaining <= 1) return '#f44336';
  if (remaining / max <= 0.3) return '#ffc107';
  return '#4caf50';
};

export function CircularProgress({
  current,
  max,
  size = 100,
}: CircularProgressProps) {
  const { t } = useTranslation();
  const remaining = max - current;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - remaining / max);
  const strokeColor = getStrokeColor(remaining, max);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
          }}
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
