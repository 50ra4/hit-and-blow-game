import { useTranslation } from 'react-i18next';
import { GAME_MODE_IDS, GAME_MODES } from '@/consts/modes';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import { useDailyPlayed } from '@/services/storage/useDailyPlayed';
import { useCountdown } from '@/hooks/useCountdown';

const DAILY_MODE_CONFIG = GAME_MODES[GAME_MODE_IDS.NORMAL];

export function DailyChallengeCard() {
  const { t } = useTranslation();
  const { hasPlayedToday } = useDailyPlayed();
  const countdown = useCountdown();

  return (
    <div className="mb-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-6">
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg font-semibold text-white">
          📅 {t('home.dailyChallenge')}
        </span>
        <span className="rounded-full bg-yellow-500/30 px-3 py-1 text-xs font-semibold text-yellow-300">
          {t('home.dailyAllCommon')}
        </span>
      </div>
      <p className="mb-3 text-sm text-white/70">
        {t('home.dailyRule', {
          modeName: t(DAILY_MODE_CONFIG.nameKey),
          length: DAILY_MODE_CONFIG.length,
          duplicates: t(
            DAILY_MODE_CONFIG.allowDuplicates
              ? 'home.dailyRuleDuplicatesOn'
              : 'home.dailyRuleDuplicatesOff',
          ),
          maxAttempts: DAILY_MODE_CONFIG.maxAttempts,
        })}
      </p>
      <p className="mb-4 text-sm text-white/70">
        {t('home.dailyCountdown', { time: countdown })}
      </p>
      <ButtonLink to="/games/daily" className="w-full py-4 text-lg">
        {hasPlayedToday()
          ? t('home.dailyChallengeCompleted')
          : `${t('home.dailyChallenge')}`}
      </ButtonLink>
    </div>
  );
}
