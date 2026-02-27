import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PLAY_TYPE_IDS } from '@/consts/playTypes';
import type {
  GameMode,
  PlayType,
  Tile,
  Guess,
} from '@/features/game/game.schema';
import { TileIcon } from '@/components/TileIcon/TileIcon';
import { TILE_GRADIENT_STYLES } from '@/features/game/tileDisplay';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import { ShareButton } from '@/features/share/ShareButton/ShareButton';
import { AdBanner } from '@/features/ad/AdBanner/AdBanner';
import { GuessHistory } from '@/features/game/GuessHistory/GuessHistory';

type ResultDisplayProps = {
  isWon: boolean;
  attempts: number;
  answer: Tile[];
  guesses: Guess[];
  mode: GameMode;
  playType: PlayType;
  onRestart: () => void;
};

export function ResultDisplay({
  isWon,
  attempts,
  answer,
  guesses,
  mode,
  playType,
  onRestart,
}: ResultDisplayProps) {
  const { t } = useTranslation();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
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
                  style={TILE_GRADIENT_STYLES[tile.id]}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
                >
                  <TileIcon tileId={tile.id} className="h-8 w-8" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 広告バナー */}
      <AdBanner />

      {/* 試行履歴トグル */}
      <div className="mb-4">
        <button
          onClick={() => setIsHistoryOpen((prev) => !prev)}
          className="w-full rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10"
        >
          {isHistoryOpen ? t('result.historyClose') : t('result.historyOpen')}
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isHistoryOpen ? 'mt-3 max-h-screen' : 'max-h-0'
          }`}
        >
          <GuessHistory guesses={guesses} />
        </div>
      </div>

      {/* シェアボタン */}
      <div className="mb-4">
        <ShareButton mode={mode} attempts={attempts} playType={playType} />
      </div>

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
