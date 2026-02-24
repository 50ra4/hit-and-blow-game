import { useTranslation } from 'react-i18next';
import { Navigate, Link } from 'react-router-dom';
import { useSettings } from '@/i18n/useSettings';
import { useStats } from '@/features/stats/useStats';
import { useDailyPlayed } from '@/services/storage/useDailyPlayed';
import { GAME_MODE_IDS, GAME_MODES } from '@/consts/modes';
import type { GameMode } from '@/features/game/game.schema';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';

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
  const { isModeUnlocked } = useStats();
  const { hasPlayedToday } = useDailyPlayed();

  if (!settings.tutorialCompleted) {
    return <Navigate to="/tutorial" replace />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* タイトル */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-white">
          {t('common.title')}
        </h1>
      </div>

      {/* デイリーチャレンジ */}
      <div className="mb-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-6 text-center">
        <p className="mb-3 text-sm text-white/70">{t('home.dailyDesc')}</p>
        <ButtonLink to="/games/daily" className="w-full py-4 text-lg">
          {hasPlayedToday()
            ? t('home.dailyChallengeCompleted')
            : `📅 ${t('home.dailyChallenge')}`}
        </ButtonLink>
      </div>

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
            const unlocked = isModeUnlocked(modeId);
            const unlockCondition =
              'unlockCondition' in modeConfig
                ? modeConfig.unlockCondition
                : undefined;

            const cardContent = (
              <>
                <div className="font-semibold text-white">
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
              </>
            );

            return unlocked ? (
              <Link
                key={modeId}
                to={`/games/free?mode=${modeId}`}
                className="rounded-xl border border-white/20 bg-white/10 p-4 text-left transition-all duration-200 hover:border-indigo-400/50 hover:bg-white/15"
              >
                {cardContent}
              </Link>
            ) : (
              <button
                key={modeId}
                disabled
                className="cursor-not-allowed rounded-xl border border-white/10 bg-white/5 p-4 text-left opacity-60 transition-all duration-200"
              >
                {cardContent}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
