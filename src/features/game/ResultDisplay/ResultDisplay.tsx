import { useTranslation } from 'react-i18next';
import { PLAY_TYPE_IDS } from '@/consts/playTypes';
import type { GameMode, PlayType, Tile } from '@/features/game/game.schema';
import {
  TILE_GRADIENT_STYLES,
  TILE_SYMBOLS,
  type TileId,
} from '@/features/game/tileDisplay';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';

type ResultDisplayProps = {
  isWon: boolean;
  attempts: number;
  answer: Tile[];
  mode: GameMode;
  playType: PlayType;
  onRestart: () => void;
};

export function ResultDisplay({
  isWon,
  attempts,
  answer,
  playType,
  onRestart,
}: ResultDisplayProps) {
  const { t } = useTranslation();
  const isFreePlay = playType === PLAY_TYPE_IDS.FREE;

  return (
    <div className="mx-auto max-w-lg px-4 py-6 text-center">
      {/* 結果ヒーローエリア */}
      <div
        className={`mb-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md ${
          isWon
            ? 'border-yellow-400/50 bg-linear-to-br from-yellow-400/10 to-orange-400/10'
            : 'border-blue-400/50 bg-linear-to-br from-blue-400/10 to-blue-600/10'
        } `}
      >
        <div className="mb-4 text-6xl">{isWon ? '🎉' : '😔'}</div>

        <h2 className="mb-3 text-3xl font-bold text-white">
          {isWon ? t('result.win') : t('result.lose')}
        </h2>

        {isWon ? (
          <p className="text-lg text-white/70">
            {t('result.attempts', { count: attempts })}
          </p>
        ) : (
          <div>
            <p className="mb-3 text-sm text-white/60">{t('result.answer')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {answer.map((tile, index) => (
                <div
                  key={index}
                  style={TILE_GRADIENT_STYLES[tile.id as TileId]}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold shadow-md"
                >
                  {TILE_SYMBOLS[tile.id as TileId]}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* シェアボタン用スロット（T-019で実装） */}
      {/* 広告表示用スロット（T-020で実装） */}

      {/* アクションボタン */}
      <div className="flex flex-col gap-3">
        {isFreePlay && (
          <button
            onClick={onRestart}
            className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 py-4 text-lg font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
          >
            {t('result.restart')}
          </button>
        )}
        <ButtonLink
          to="/"
          variant="secondary"
          className="w-full py-4 font-bold"
        >
          {t('result.backToHome')}
        </ButtonLink>
      </div>
    </div>
  );
}
