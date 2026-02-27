import { useRef } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGame } from '@/features/game/useGame';
import { useStats } from '@/features/stats/useStats';
import { GameHeader } from '@/features/game/GameHeader/GameHeader';
import { GameInfoPanel } from '@/features/game/GameInfoPanel/GameInfoPanel';
import { GameBoard } from '@/features/game/GameBoard/GameBoard';
import { ResultDisplay } from '@/features/game/ResultDisplay/ResultDisplay';
import { GAME_MODES, GAME_MODE_ID_VALUES } from '@/consts/modes';
import { PLAY_TYPE_IDS } from '@/consts/playTypes';
import type { GameMode } from '@/features/game/game.schema';

// 存在しないモードはノーマルにフォールバック（設計書仕様）
const resolveMode = (rawMode: string): GameMode =>
  GAME_MODE_ID_VALUES.find((id) => id === rawMode) ?? 'normal';

export default function FreeGamePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { recordGame, isModeUnlocked } = useStats();
  const isRecordedRef = useRef(false);

  const mode = resolveMode(searchParams.get('mode') ?? '');
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
  } = useGame(mode, PLAY_TYPE_IDS.FREE);

  // 未解放モードはホームにリダイレクト
  if (!isModeUnlocked(mode)) {
    return <Navigate to="/" replace />;
  }

  if (isGameOver && !isRecordedRef.current) {
    isRecordedRef.current = true;
    recordGame({
      mode,
      playType: PLAY_TYPE_IDS.FREE,
      isWon,
      attempts,
      timestamp: Date.now(),
    });
  }

  const handleRestart = () => {
    isRecordedRef.current = false;
    resetGame();
  };

  const handleBack = () => {
    if (!isGameOver && !window.confirm(t('game.confirmLeave'))) return;
    navigate('/');
  };

  return (
    <div className="bg-gradient-dark-1 flex min-h-screen flex-col">
      <GameHeader
        modeName={modeName}
        playType={PLAY_TYPE_IDS.FREE}
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
              mode={mode}
              playType={PLAY_TYPE_IDS.FREE}
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
