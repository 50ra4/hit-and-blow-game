import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type StatsCardProps = {
  totalPlays: number;
  totalWins: number;
  winRate: number;
};

export function StatsCard({ totalPlays, totalWins, winRate }: StatsCardProps) {
  const { t } = useTranslation();

  const isEmpty = totalPlays === 0;

  return (
    <Link
      to="/stats"
      className="mb-6 block rounded-2xl border border-white/10 bg-white/10 p-6 transition-colors hover:bg-white/15"
    >
      <div className="text-lg font-semibold text-white">
        {t('home.statsCard')}
      </div>

      {isEmpty ? (
        <div className="mt-4 text-center text-sm text-white/60">
          {t('home.statsCardEmpty')}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-center text-2xl font-bold text-white">
              {totalPlays}
            </div>
            <div className="mt-1 text-center text-xs text-white/60">
              {t('home.statsCardTotalPlays')}
            </div>
          </div>

          <div>
            <div className="text-center text-2xl font-bold text-white">
              {totalWins}
            </div>
            <div className="mt-1 text-center text-xs text-white/60">
              {t('home.statsCardWins')}
            </div>
          </div>

          <div>
            <div className="text-center text-2xl font-bold text-white">
              {winRate.toFixed(1)}%
            </div>
            <div className="mt-1 text-center text-xs text-white/60">
              {t('home.statsCardWinRate')}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
