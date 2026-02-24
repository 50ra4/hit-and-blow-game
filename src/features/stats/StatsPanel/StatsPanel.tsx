import { useTranslation } from 'react-i18next';
import { GAME_MODE_IDS, GAME_MODES } from '@/consts/modes';
import type { Stats } from '@/features/stats/stats.schema';
import type { GameMode } from '@/features/game/game.schema';

type StatsPanelProps = {
  stats: Stats;
};

const MODE_ID_LIST: GameMode[] = [
  GAME_MODE_IDS.BEGINNER,
  GAME_MODE_IDS.NORMAL,
  GAME_MODE_IDS.HARD,
  GAME_MODE_IDS.EXPERT,
  GAME_MODE_IDS.MASTER,
];

export function StatsPanel({ stats }: StatsPanelProps) {
  const { t } = useTranslation();

  const winRateText =
    stats.totalPlays === 0 ? t('stats.noData') : `${stats.winRate.toFixed(1)}%`;

  const avgAttemptsText =
    stats.totalWins === 0
      ? t('stats.noData')
      : stats.averageAttempts.toFixed(1);

  const bestAttemptsText =
    stats.bestAttempts === null
      ? t('stats.noData')
      : String(stats.bestAttempts);

  const sortedDailyHistory = stats.dailyHistory.toReversed();
  const hasNoStats = stats.totalPlays === 0;

  return (
    <div className="space-y-8">
      {hasNoStats && (
        <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-white/60">
          {t('stats.empty')}
        </p>
      )}
      {/* 全体統計 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white/80">
          {t('stats.title')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {stats.totalPlays}
            </div>
            <div className="mt-1 text-xs text-white/60">
              {t('stats.totalPlays')}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {stats.totalWins}
            </div>
            <div className="mt-1 text-xs text-white/60">
              {t('stats.totalWins')}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="text-2xl font-bold text-white">{winRateText}</div>
            <div className="mt-1 text-xs text-white/60">
              {t('stats.winRate')}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {avgAttemptsText}
            </div>
            <div className="mt-1 text-xs text-white/60">
              {t('stats.avgAttempts')}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {bestAttemptsText}
            </div>
            <div className="mt-1 text-xs text-white/60">
              {t('stats.bestAttempts')}
            </div>
          </div>
        </div>
      </section>

      {/* モード別統計 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white/80">
          {t('stats.modeStats')}
        </h2>
        <div className="space-y-3">
          {MODE_ID_LIST.every((modeId) => !stats.modeStats[modeId]) && (
            <p className="text-sm text-white/50">{t('stats.modeStatsEmpty')}</p>
          )}
          {MODE_ID_LIST.map((modeId) => {
            const modeStat = stats.modeStats[modeId];
            if (!modeStat) return null;
            const modeConfig = GAME_MODES[modeId];

            return (
              <div
                key={modeId}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="mb-2 font-medium text-white">
                  {t(modeConfig.nameKey)}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/70">
                  <span>
                    {t('stats.totalPlays')}: {modeStat.plays}
                  </span>
                  <span>
                    {t('stats.winRate')}: {modeStat.winRate.toFixed(1)}%
                  </span>
                  <span>
                    {t('stats.bestAttempts')}:{' '}
                    {modeStat.bestAttempts ?? t('stats.noData')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* デイリー履歴 */}
      {sortedDailyHistory.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white/80">
            {t('stats.dailyHistory')}
          </h2>
          <div className="space-y-2">
            {sortedDailyHistory.map((record, index) => (
              <div
                key={`${record.date}-${index}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="text-sm text-white/70">{record.date}</span>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60">
                    {t('stats.attempts', { count: record.attempts })}
                  </span>
                  <span
                    className={record.isWon ? 'text-green-400' : 'text-red-400'}
                  >
                    {record.isWon ? t('result.win') : t('result.lose')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
