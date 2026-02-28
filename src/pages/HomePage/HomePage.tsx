import { useTranslation } from 'react-i18next';
import { Navigate, Link } from 'react-router-dom';
import { useSettings } from '@/i18n/useSettings';
import { useStats } from '@/features/stats/useStats';
import { GAME_MODE_IDS, GAME_MODES } from '@/consts/modes';
import type { GameMode } from '@/features/game/game.schema';
import { DailyChallengeCard } from './DailyChallengeCard';
import { StatsCard } from './StatsCard';

const MODE_CARD_STYLES = {
  [GAME_MODE_IDS.BEGINNER]: {
    badge: 'EASY',
    borderClass: 'border-green-500/50',
    badgeClass: 'bg-green-500/30 text-green-400',
  },
  [GAME_MODE_IDS.NORMAL]: {
    badge: 'NORMAL',
    borderClass: 'border-blue-500/50',
    badgeClass: 'bg-blue-500/30 text-blue-400',
  },
  [GAME_MODE_IDS.HARD]: {
    badge: 'HARD',
    borderClass: 'border-orange-500/50',
    badgeClass: 'bg-orange-500/30 text-orange-400',
  },
  [GAME_MODE_IDS.EXPERT]: {
    badge: 'EXPERT',
    borderClass: 'border-purple-500/50',
    badgeClass: 'bg-purple-500/30 text-purple-400',
  },
  [GAME_MODE_IDS.MASTER]: {
    badge: 'MASTER',
    borderClass: 'border-red-500/50',
    badgeClass: 'bg-red-500/30 text-red-400',
  },
} as const;

const FREE_MODE_IDS: GameMode[] = [
  GAME_MODE_IDS.BEGINNER,
  GAME_MODE_IDS.NORMAL,
  GAME_MODE_IDS.HARD,
  GAME_MODE_IDS.EXPERT,
  GAME_MODE_IDS.MASTER,
];

export default function HomePage() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { stats, isModeUnlocked } = useStats();

  if (!settings.tutorialCompleted) {
    return <Navigate to="/tutorial" replace />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 hab-fade-in-up">
      {/* タイトル */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 bg-gradient-to-br from-indigo-400 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">
          {t('common.title')}
        </h1>
      </div>

      {/* デイリーチャレンジ */}
      <DailyChallengeCard />

      {/* チュートリアルリンク（常時表示） */}
      <div className="mb-6 text-center">
        <Link
          to="/tutorial"
          className="text-sm text-white/50 underline-offset-2 transition-colors hover:text-white/80 hover:underline"
        >
          ❓ {t('home.tutorial')}
        </Link>
      </div>

      {/* モード選択 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white/80">
          {t('home.selectMode')}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FREE_MODE_IDS.map((modeId) => {
            const modeConfig = GAME_MODES[modeId];
            const cardStyle = MODE_CARD_STYLES[modeId];
            const unlocked = isModeUnlocked(modeId);
            const unlockCondition =
              'unlockCondition' in modeConfig
                ? modeConfig.unlockCondition
                : undefined;

            const cardContent = (
              <>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cardStyle.badgeClass}`}
                  >
                    {cardStyle.badge}
                  </span>
                </div>
                <div className="font-semibold text-white">
                  {!unlocked && <span className="mr-1">🔒</span>}
                  {t(modeConfig.nameKey)}
                </div>
                <div className="mt-1 text-sm text-white/60">
                  {unlocked ? (
                    <>
                      {modeConfig.length}桁 / {modeConfig.maxAttempts}回
                    </>
                  ) : (
                    unlockCondition &&
                    t('mode.locked', {
                      condition: t(GAME_MODES[unlockCondition].nameKey),
                    })
                  )}
                </div>
                <p className="mt-1 text-xs text-white/50">
                  {t(modeConfig.descriptionKey)}
                </p>
              </>
            );

            return unlocked ? (
              <Link
                key={modeId}
                to={`/games/free?mode=${modeId}`}
                className={`rounded-xl border bg-white/10 p-4 text-left transition-all duration-200 hover:bg-white/15 ${cardStyle.borderClass}`}
              >
                {cardContent}
              </Link>
            ) : (
              <button
                key={modeId}
                disabled
                className={`cursor-not-allowed rounded-xl border bg-white/5 p-4 text-left opacity-60 transition-all duration-200 ${cardStyle.borderClass}`}
              >
                {cardContent}
              </button>
            );
          })}
        </div>
      </div>

      {/* 遊んだ記録 */}
      <StatsCard
        totalPlays={stats.totalPlays}
        totalWins={stats.totalWins}
        winRate={stats.winRate}
      />
    </div>
  );
}
