import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useGame } from '@/features/game/useGame';
import { useStats } from '@/features/stats/useStats';
import { useDailyPlayed } from '@/services/storage/useDailyPlayed';
import { GameHeader } from '@/features/game/GameHeader/GameHeader';
import { GameInfoPanel } from '@/features/game/GameInfoPanel/GameInfoPanel';
import { GameBoard } from '@/features/game/GameBoard/GameBoard';
import { ResultDisplay } from '@/features/game/ResultDisplay/ResultDisplay';
import { GAME_MODES } from '@/consts/modes';
import { PLAY_TYPE_IDS } from '@/consts/playTypes';

// デイリーチャレンジは常にノーマルモード（設計書仕様）
const DAILY_MODE = 'normal' as const;

export default function DailyGamePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stats, recordGame } = useStats();
  const { hasPlayedToday, markPlayedToday } = useDailyPlayed();
  const isRecordedRef = useRef(false);

  const modeConfig = GAME_MODES[DAILY_MODE];
  const modeName = t(modeConfig.nameKey);

  const {
    answer,
    guesses,
    currentGuess,
    isGameOver,
    isWon,
    attempts,
    maxAttempts,
    submitGuess,
    addTile,
    removeTile,
    resetCurrentGuess,
    resetGame,
  } = useGame(DAILY_MODE, PLAY_TYPE_IDS.DAILY);

  if (isGameOver && !isRecordedRef.current) {
    isRecordedRef.current = true;
    recordGame({
      mode: DAILY_MODE,
      playType: PLAY_TYPE_IDS.DAILY,
      isWon,
      attempts,
      timestamp: Date.now(),
    });
    markPlayedToday();
  }

  const handleRestart = () => {
    isRecordedRef.current = false;
    resetGame();
  };

  const handleBack = () => {
    if (!isGameOver && !window.confirm(t('game.confirmLeave'))) return;
    navigate('/');
  };

  // 既プレイかつゲームが終わっていない場合は結果サマリーを表示
  if (hasPlayedToday() && !isGameOver) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayRecord = stats.dailyHistory.findLast((r) => r.date === today);

    return (
      <div className="bg-gradient-dark-1 flex min-h-screen flex-col">
        <GameHeader
          modeName={modeName}
          playType={PLAY_TYPE_IDS.DAILY}
          onBack={handleBack}
        />
        <div className="flex flex-1 items-center justify-center px-4 py-8 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 text-5xl">
              {todayRecord?.isWon ? '🎉' : '📅'}
            </div>
            <p className="text-lg font-semibold text-white">
              {t('home.dailyChallenge')}
            </p>
            {todayRecord ? (
              <div className="mt-4 space-y-2">
                <p
                  className={`text-base font-bold ${todayRecord.isWon ? 'text-yellow-400' : 'text-blue-400'}`}
                >
                  {todayRecord.isWon ? t('result.win') : t('result.lose')}
                </p>
                {todayRecord.isWon && (
                  <p className="text-sm text-white/70">
                    {t('result.attempts', { count: todayRecord.attempts })}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-white/60">
                {t('home.dailyDesc')}
              </p>
            )}
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-medium text-white transition-all hover:bg-white/20"
            >
              {t('result.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={`daily-${location.search}`}
      className="bg-gradient-dark-1 flex min-h-screen flex-col"
    >
      <GameHeader
        modeName={modeName}
        playType={PLAY_TYPE_IDS.DAILY}
        onBack={handleBack}
      />

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <GameInfoPanel
            modeName={modeName}
            answerLength={modeConfig.length}
            allowDuplicates={modeConfig.allowDuplicates}
            attempts={attempts}
            maxAttempts={maxAttempts}
          />
          {isGameOver ? (
            <ResultDisplay
              isWon={isWon}
              attempts={attempts}
              answer={answer}
              mode={DAILY_MODE}
              playType={PLAY_TYPE_IDS.DAILY}
              onRestart={handleRestart}
            />
          ) : (
            <GameBoard
              guesses={guesses}
              currentGuess={currentGuess}
              answerLength={modeConfig.length}
              maxAttempts={maxAttempts}
              onTileSelect={addTile}
              onTileRemove={removeTile}
              onSubmit={submitGuess}
              onResetGuess={resetCurrentGuess}
              isGameOver={isGameOver}
              allowDuplicates={modeConfig.allowDuplicates}
            />
          )}
        </div>
      </div>
    </div>
  );
}
