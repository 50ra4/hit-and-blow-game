import { useTranslation } from 'react-i18next';
import { TileIcon } from '@/components/TileIcon/TileIcon';
import type { Guess, Tile } from '@/features/game/game.schema';
import { TILE_GRADIENT_STYLES } from '@/features/game/tileDisplay';
import { TilePicker } from '@/features/game/TilePicker/TilePicker';
import { GuessHistory } from '@/features/game/GuessHistory/GuessHistory';

type GameBoardProps = {
  guesses: Guess[];
  currentGuess: Tile[];
  answerLength: number;
  maxAttempts: number;
  onTileSelect: (tile: Tile) => void;
  onTileRemove: (index: number) => void;
  onSubmit: () => void;
  onResetGuess: () => void;
  isGameOver: boolean;
  allowDuplicates: boolean;
};

export function GameBoard({
  guesses,
  currentGuess,
  answerLength,
  maxAttempts,
  onTileSelect,
  onTileRemove,
  onSubmit,
  onResetGuess,
  isGameOver,
  allowDuplicates,
}: GameBoardProps) {
  const { t } = useTranslation();
  const canSubmit = currentGuess.length === answerLength && !isGameOver;

  return (
    <div className="space-y-6">
      {/* 現在の入力エリア */}
      {!isGameOver && (
        <div className="rounded-xl border-2 border-dashed border-white/30 bg-white/5 p-4">
          <p className="mb-3 text-center text-sm text-white/60">
            {t('game.currentGuessLabel')}
          </p>

          {/* 入力スロット */}
          <div className="mb-5 flex flex-wrap justify-center gap-2">
            {Array.from({ length: answerLength }, (_, index) => {
              const tile = currentGuess.at(index);

              if (tile) {
                return (
                  <button
                    key={index}
                    onClick={() => onTileRemove(index)}
                    style={TILE_GRADIENT_STYLES[tile.id]}
                    className="inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:opacity-75 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 active:scale-95"
                    aria-label={t('game.removeTile', {
                      tile: t(`tile.${tile.id}`),
                    })}
                  >
                    <TileIcon tileId={tile.id} className="h-8 w-8" />
                  </button>
                );
              }

              return (
                <div
                  key={index}
                  className="h-14 w-14 rounded-2xl border-2 border-dashed border-white/40 bg-white/5"
                />
              );
            })}
          </div>

          {/* タイルパレット */}
          <TilePicker
            selected={currentGuess}
            onSelect={onTileSelect}
            maxLength={answerLength}
            disabled={isGameOver}
            allowDuplicates={allowDuplicates}
          />

          {/* アクションボタン */}
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={onResetGuess}
              disabled={currentGuess.length === 0}
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-white transition-all duration-300 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('game.reset')}
            </button>
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              className="max-w-xs flex-1 rounded-xl bg-linear-to-r from-green-500 to-green-700 py-3 text-lg font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/40 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {t('game.submit')}
            </button>
          </div>
        </div>
      )}

      {/* 推測履歴 */}
      <GuessHistory
        guesses={guesses}
        answerLength={answerLength}
        maxAttempts={maxAttempts}
      />
    </div>
  );
}
