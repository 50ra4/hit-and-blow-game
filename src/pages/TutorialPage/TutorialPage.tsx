import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/i18n/useSettings';
import { useTutorial } from '@/features/tutorial/useTutorial';
import { useGame } from '@/features/game/useGame';
import { TutorialStep } from '@/features/tutorial/TutorialStep/TutorialStep';
import { GameBoard } from '@/features/game/GameBoard/GameBoard';
import { GameInputArea } from '@/features/game/GameInputArea/GameInputArea';
import { TILE_ID_VALUES } from '@/consts/tiles';
import { TileIcon } from '@/components/TileIcon/TileIcon';
import { TILE_GRADIENT_STYLES, type TileId } from '@/features/game/tileDisplay';
import { GAME_MODE_ID_VALUES, GAME_MODE_IDS, GAME_MODES } from '@/consts/modes';
import { PLAY_TYPE_IDS } from '@/consts/playTypes';
import { Button } from '@/components/Button/Button';

// Step1: ヒット・ブロー説明用の静的例
// 答え: star, circle, triangle, square / 推測: star, diamond, triangle, heart
// ヒット2 (star, triangleが位置一致), ブロー0
const EXAMPLE_ANSWER_IDS: TileId[] = ['star', 'circle', 'triangle', 'square'];
const EXAMPLE_GUESS_IDS: TileId[] = ['star', 'diamond', 'triangle', 'heart'];

const TILE_ID_LIST = TILE_ID_VALUES;

const FREE_MODE_ID_LIST = GAME_MODE_ID_VALUES;

export default function TutorialPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { completeTutorial } = useSettings();
  const { step, totalSteps, isFirst, isLast, next, prev } = useTutorial();

  const {
    guesses,
    currentGuess,
    isGameOver,
    attempts,
    maxAttempts,
    submitGuess,
    addTile,
    removeTile,
    resetCurrentGuess,
  } = useGame(GAME_MODE_IDS.BEGINNER, PLAY_TYPE_IDS.FREE);

  const modeConfig = GAME_MODES[GAME_MODE_IDS.BEGINNER];

  const handleComplete = () => {
    completeTutorial();
    navigate('/');
  };

  const handleSkip = () => {
    completeTutorial();
    navigate('/');
  };

  const stepContents = [
    // Step 0: ゲームの目的
    <div key="step0">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {t('tutorial.step0Title')}
      </h2>
      <p className="mb-6 text-lg text-white/80">{t('tutorial.step0Desc')}</p>
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-white/70">
        <p className="mb-2 text-sm">例: 4つのタイルの組み合わせを当てよう！</p>
        <p className="text-sm">
          制限回数以内に正解できればクリア。数字は使わず、タイルのシンボルで考えるのがコツ。
        </p>
      </div>
    </div>,

    // Step 1: ヒット・ブロー説明
    <div key="step1">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {t('tutorial.step1Title')}
      </h2>
      <div className="mb-5 space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-green-400/30 bg-green-400/10 p-3">
          <span className="text-2xl font-bold text-green-400">2</span>
          <span className="text-sm font-semibold text-green-300">
            {t('tutorial.step1HitDesc')}
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-3">
          <span className="text-2xl font-bold text-yellow-400">0</span>
          <span className="text-sm font-semibold text-yellow-300">
            {t('tutorial.step1BlowDesc')}
          </span>
        </div>
      </div>

      {/* 答えの例 */}
      <p className="mb-2 text-xs text-white/50">答え（隠されている）:</p>
      <div className="mb-4 flex gap-2">
        {EXAMPLE_ANSWER_IDS.map((id, i) => (
          <div
            key={i}
            style={TILE_GRADIENT_STYLES[id]}
            className="flex h-12 w-12 items-center justify-center rounded-xl"
          >
            <TileIcon tileId={id} className="h-7 w-7" />
          </div>
        ))}
      </div>

      {/* 推測の例 */}
      <p className="mb-2 text-xs text-white/50">推測:</p>
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {EXAMPLE_GUESS_IDS.map((id, i) => (
            <div
              key={i}
              style={TILE_GRADIENT_STYLES[id]}
              className="flex h-12 w-12 items-center justify-center rounded-xl"
            >
              <TileIcon tileId={id} className="h-7 w-7" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
          <span className="font-bold text-green-400">2</span>
          <span className="mx-1 text-white/40">Hit</span>
          <span className="font-bold text-yellow-400">0</span>
          <span className="ml-1 text-white/40">Blow</span>
        </div>
      </div>
    </div>,

    // Step 2: タイルの種類
    <div key="step2">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {t('tutorial.step2Title')}
      </h2>
      <p className="mb-5 text-white/70">{t('tutorial.step2Desc')}</p>
      <div className="grid grid-cols-4 gap-3">
        {TILE_ID_LIST.map((id) => (
          <div key={id} className="flex flex-col items-center gap-1">
            <div
              style={TILE_GRADIENT_STYLES[id]}
              className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
            >
              <TileIcon tileId={id} className="h-8 w-8" />
            </div>
            <span className="text-xs text-white/60">{t(`tile.${id}`)}</span>
          </div>
        ))}
      </div>
    </div>,

    // Step 3: モードとプレイタイプ
    <div key="step3">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {t('tutorial.step3Title')}
      </h2>
      <div className="mb-4 space-y-2">
        <div className="rounded-xl border border-indigo-400/30 bg-indigo-400/10 p-3">
          <p className="text-sm font-semibold text-indigo-300">
            {t('tutorial.step3FreeDesc')}
          </p>
        </div>
        <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-3">
          <p className="text-sm font-semibold text-yellow-300">
            {t('tutorial.step3DailyDesc')}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {FREE_MODE_ID_LIST.map((modeId) => {
          const config = GAME_MODES[modeId];
          return (
            <div
              key={modeId}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2"
            >
              <span className="font-medium text-white">
                {t(config.nameKey)}
              </span>
              <span className="text-sm text-white/60">
                {config.length}桁 / {config.maxAttempts}回
              </span>
            </div>
          );
        })}
      </div>
    </div>,

    // Step 4: 実際に試してみよう
    <div key="step4">
      <h2 className="mb-2 text-xl font-bold text-white">
        {t('tutorial.step4Title')}
      </h2>
      <p className="mb-4 text-sm text-white/70">{t('tutorial.step4Desc')}</p>

      {isGameOver ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="mb-2 font-semibold text-white">
            {attempts <= maxAttempts &&
            guesses.at(-1)?.hits === modeConfig.length
              ? '🎉 ' + t('result.win')
              : t('result.lose')}
          </p>
          <div className="mt-2 space-y-1 text-sm text-white/60">
            <p>{t('tutorial.step4HintHit')}</p>
            <p>{t('tutorial.step4HintBlow')}</p>
          </div>
        </div>
      ) : (
        <>
          {guesses.length > 0 && (
            <div className="mb-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/50">
              <span className="text-green-400">Hit</span>
              {' = '}
              {t('tutorial.step4HintHitDesc')}
              {'  '}
              <span className="text-yellow-400">Blow</span>
              {' = '}
              {t('tutorial.step4HintBlowDesc')}
            </div>
          )}
          <GameBoard guesses={guesses} />
          {!isGameOver && (
            <GameInputArea
              currentGuess={currentGuess}
              answerLength={modeConfig.length}
              onTileSelect={addTile}
              onTileRemove={removeTile}
              onSubmit={submitGuess}
              onResetGuess={resetCurrentGuess}
              allowDuplicates={modeConfig.allowDuplicates}
            />
          )}
        </>
      )}
    </div>,
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 hab-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">{t('tutorial.title')}</h1>
        <button
          onClick={handleSkip}
          className="text-sm text-white/50 transition-colors hover:text-white/80"
        >
          {t('tutorial.skip')}
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <TutorialStep step={step} totalSteps={totalSteps}>
          {stepContents.at(step)}
        </TutorialStep>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={prev}
          disabled={isFirst}
          className="w-24"
        >
          {t('tutorial.prev')}
        </Button>

        <span className="text-sm text-white/50">
          {t('tutorial.step', { current: step + 1, total: totalSteps })}
        </span>

        {isLast ? (
          <Button onClick={handleComplete} className="w-32">
            {t('tutorial.complete')}
          </Button>
        ) : (
          <Button onClick={next} className="w-24">
            {t('tutorial.next')}
          </Button>
        )}
      </div>
    </div>
  );
}
