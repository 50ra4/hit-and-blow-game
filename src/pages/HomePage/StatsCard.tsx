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
      className="mb-8 block rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xl font-bold text-white">
          {t('home.statsCard')}
        </span>
        <span className="text-white/60">→</span>
      </div>

      {isEmpty ? (
        <div className="text-center text-sm text-white/60">
          {t('home.statsCardEmpty')}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-black/20 p-3 text-center">
            <div className="text-2xl font-bold text-indigo-400">
              {totalPlays}
            </div>
            <div className="mt-1 text-sm text-white/60">
              {t('home.statsCardTotalPlays')}
            </div>
          </div>

          <div className="rounded-xl bg-black/20 p-3 text-center">
            <div className="text-2xl font-bold text-indigo-400">
              {totalWins}
            </div>
            <div className="mt-1 text-sm text-white/60">
              {t('home.statsCardWins')}
            </div>
          </div>

          <div className="rounded-xl bg-black/20 p-3 text-center">
            <div className="text-2xl font-bold text-indigo-400">
              {winRate.toFixed(1)}%
            </div>
            <div className="mt-1 text-sm text-white/60">
              {t('home.statsCardWinRate')}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
