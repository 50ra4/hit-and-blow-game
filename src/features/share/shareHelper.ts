import { format } from 'date-fns';
import { PLAY_TYPE_IDS } from '@/consts/playTypes';
import type { GameMode } from '@/features/game/game.schema';
import type { ShareTextData } from '@/features/share/share.schema';

const MODE_NAMES_JA = {
  beginner: 'ビギナー',
  normal: 'ノーマル',
  hard: 'ハード',
  expert: 'エキスパート',
  master: 'マスター',
} as const satisfies Record<GameMode, string>;

const MODE_NAMES_EN = {
  beginner: 'Beginner',
  normal: 'Normal',
  hard: 'Hard',
  expert: 'Expert',
  master: 'Master',
} as const satisfies Record<GameMode, string>;

const getGameUrl = (): string =>
  window.location.origin + import.meta.env.BASE_URL;

export const generateShareText = (data: ShareTextData): string => {
  const { mode, attempts, playType } = data;
  const modeName = MODE_NAMES_JA[mode];
  const url = getGameUrl();

  if (playType === PLAY_TYPE_IDS.DAILY) {
    const dateStr = format(new Date(), 'yyyy/MM/dd');
    return `タイルヒットアンドブロー 今日の問題（${modeName}） ${dateStr} を${attempts}回でクリア！\n#タイルヒットアンドブロー #ヒットアンドブロー #パズルゲーム\n${url}`;
  }

  return `タイルヒットアンドブロー【${modeName}】を${attempts}回でクリア！\n#タイルヒットアンドブロー #ヒットアンドブロー #パズルゲーム\n${url}`;
};

export const generateShareTextEn = (data: ShareTextData): string => {
  const { mode, attempts, playType } = data;
  const modeName = MODE_NAMES_EN[mode];
  const url = getGameUrl();

  if (playType === PLAY_TYPE_IDS.DAILY) {
    const dateStr = format(new Date(), 'yyyy/MM/dd');
    return `Tile Hit & Blow — Daily Challenge (${modeName}) ${dateStr} cleared in ${attempts} attempts!\n#TileHitAndBlow #HitAndBlow #PuzzleGame\n${url}`;
  }

  return `Tile Hit & Blow [${modeName}] cleared in ${attempts} attempts!\n#TileHitAndBlow #HitAndBlow #PuzzleGame\n${url}`;
};
