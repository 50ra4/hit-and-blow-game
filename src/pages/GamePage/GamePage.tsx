import { useRef } from 'react';
import {
  useNavigate,
  useSearchParams,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useGame } from '@/features/game/useGame';
import { useStats } from '@/features/stats/useStats';
import { useDailyPlayed } from '@/services/storage/useDailyPlayed';
import { GameHeader } from '@/features/game/GameHeader/GameHeader';
import { GameBoard } from '@/features/game/GameBoard/GameBoard';
import { ResultDisplay } from '@/features/game/ResultDisplay/ResultDisplay';
import { GAME_MODES, GAME_MODE_ID_VALUES } from '@/consts/modes';
import { PLAY_TYPE_IDS } from '@/consts/playTypes';
import type { GameMode, PlayType } from '@/features/game/game.schema';

type GamePageProps = {
  playType: PlayType;
};

// 存在しないモードはノーマルにフォールバック（設計書仕様）
const resolveMode = (playType: PlayType, rawMode: string): GameMode => {
  if (playType === PLAY_TYPE_IDS.DAILY) return 'normal';
  return GAME_MODE_ID_VALUES.find((id) => id === rawMode) ?? 'normal';
};

export default function GamePage({ playType }: GamePageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { stats, recordGame, isModeUnlocked } = useStats();
  const { hasPlayedToday, markPlayedToday } = useDailyPlayed();
  const isRecordedRef = useRef(false);

  const rawMode = searchParams.get('mode') ?? '';
  const mode = resolveMode(playType, rawMode);
  const modeConfig = GAME_MODES[mode];
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
  } = useGame(mode, playType);

  // フリープレイ: 未解放モードはホームにリダイレクト
  if (playType === PLAY_TYPE_IDS.FREE && !isModeUnlocked(mode)) {
    return <Navigate to="/" replace />;
  }

  // ゲーム終了時の記録（初回のみ）
  if (isGameOver && !isRecordedRef.current) {
    isRecordedRef.current = true;
    recordGame({
      mode,
      playType,
      isWon,
      attempts,
      timestamp: Date.now(),
    });
    if (playType === PLAY_TYPE_IDS.DAILY) {
      markPlayedToday();
    }
  }

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRestart = () => {
    isRecordedRef.current = false;
    resetGame();
  };

  // デイリーチャレンジ: 既にプレイ済みかつゲームが終わっていない場合
  if (playType === PLAY_TYPE_IDS.DAILY && hasPlayedToday() && !isGameOver) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayRecord = stats.dailyHistory.findLast((r) => r.date === today);

    return (
      <div className="bg-gradient-dark-1 flex min-h-screen flex-col">
        <GameHeader
          modeName={modeName}
          attempts={attempts}
          maxAttempts={maxAttempts}
          playType={playType}
          onBack={handleGoHome}
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
            <button
              onClick={handleGoHome}
              className="mt-6 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-medium text-white transition-all hover:bg-white/20"
            >
              {t('result.backToHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    // キー: 同じルートでもmodeが変わったら再マウント
    <div
      key={`${playType}-${mode}-${location.search}`}
      className="bg-gradient-dark-1 flex min-h-screen flex-col"
    >
      <GameHeader
        modeName={modeName}
        attempts={attempts}
        maxAttempts={maxAttempts}
        playType={playType}
        onBack={handleGoHome}
      />

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl">
          {isGameOver ? (
            <ResultDisplay
              isWon={isWon}
              attempts={attempts}
              answer={answer}
              mode={mode}
              playType={playType}
              onRestart={handleRestart}
              onGoHome={handleGoHome}
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
