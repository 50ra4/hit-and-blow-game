import {
  format,
  subDays,
  eachDayOfInterval,
  isToday,
  getDay,
} from 'date-fns';
import { useTranslation } from 'react-i18next';
import { GAME_MODE_IDS, GAME_MODES } from '@/consts/modes';
import type { Stats } from '@/features/stats/stats.schema';
import type { GameMode } from '@/features/game/game.schema';
import type { DailyRecord } from '@/features/stats/stats.schema';

type StatsPanelProps = {
  stats: Stats;
};

// インラインスタイル禁止のため、Tailwind クラスをすべて列挙したマッピングを使用
const WIN_RATE_WIDTH_CLASSES = {
  0: 'w-0',
  10: 'w-[10%]',
  20: 'w-[20%]',
  30: 'w-[30%]',
  40: 'w-[40%]',
  50: 'w-1/2',
  60: 'w-[60%]',
  70: 'w-[70%]',
  80: 'w-4/5',
  90: 'w-[90%]',
  100: 'w-full',
} as const satisfies Record<number, string>;

const getWinRateStep = (winRate: number): keyof typeof WIN_RATE_WIDTH_CLASSES =>
  (Math.floor(winRate / 10) * 10) as keyof typeof WIN_RATE_WIDTH_CLASSES;

const MODE_ID_LIST: GameMode[] = [
  GAME_MODE_IDS.BEGINNER,
  GAME_MODE_IDS.NORMAL,
  GAME_MODE_IDS.HARD,
  GAME_MODE_IDS.EXPERT,
  GAME_MODE_IDS.MASTER,
];

const getDayCellClass = (
  day: Date,
  record: DailyRecord | undefined,
): string => {
  if (record) return record.isWon ? 'bg-green-500' : 'bg-red-500';
  if (isToday(day)) return 'bg-white/10 border border-white/40';
  return 'bg-white/10';
};

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

  const hasNoStats = stats.totalPlays === 0;

  // 日付をキーとしたマップに変換
  const historyMap = Object.fromEntries(
    stats.dailyHistory.map((record) => [record.date, record]),
  );

  // 直近28日分（今日含む）の日付配列を生成
  const today = new Date();
  const days = eachDayOfInterval({
    start: subDays(today, 27),
    end: today,
  });

  // 曜日ヘッダーラベルを生成
  const weekdayLabels = days.slice(0, 7).map((day) =>
    t(`stats.weekday.${getDay(day)}`),
  );

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
                <div className="space-y-2 text-sm text-white/70">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span>
                      {t('stats.totalPlays')}: {modeStat.plays}
                    </span>
                    <span>
                      {t('stats.totalWins')}: {modeStat.wins}
                    </span>
                    <span>
                      {t('stats.avgAttempts')}:{' '}
                      {modeStat.wins === 0
                        ? t('stats.noData')
                        : modeStat.averageAttempts.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>{t('stats.winRate')}</span>
                      <span>
                        {modeStat.plays === 0
                          ? t('stats.noData')
                          : `${modeStat.winRate.toFixed(1)}%`}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10">
                      <div
                        className={`h-2 rounded-full bg-indigo-400 transition-all ${WIN_RATE_WIDTH_CLASSES[getWinRateStep(modeStat.winRate)]}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* デイリー履歴 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white/80">
          {t('stats.dailyHistory')}
        </h2>
        {/* 曜日ヘッダー */}
        <div className="mb-1 grid grid-cols-7 gap-1">
          {weekdayLabels.map((label) => (
            <div key={label} className="text-center text-xs text-white/40">
              {label}
            </div>
          ))}
        </div>
        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const record = historyMap[dayKey];
            const titleText = record
              ? `${dayKey} ${record.isWon ? t('result.win') : t('result.lose')} ${t('stats.attempts', { count: record.attempts })}`
              : dayKey;
            return (
              <div
                key={dayKey}
                title={titleText}
                className={`h-6 w-full rounded-sm ${getDayCellClass(day, record)}`}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
