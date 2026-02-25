import type liff from '@line/liff';
import { APP_CONFIG } from '@/consts/config';

export type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

type LiffState = {
  isLiff: boolean;
  isReady: boolean;
  profile: LiffProfile | null;
};

// liffInstance はリアクティブな状態管理が不要なため、クロージャ内で保持する
let liffInstance: typeof liff | null = null;

let state: LiffState = {
  isLiff: false,
  isReady: false,
  profile: null,
};

const listeners = new Set<() => void>();

const notify = (): void => listeners.forEach((l) => l());

export const subscribe = (onStoreChange: () => void): (() => void) => {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
};

export const getSnapshot = (): LiffState => state;

// モジュールスコープの安定した関数のため useCallback 不要
export const shareToLine = async (message: string): Promise<void> => {
  if (!liffInstance) return;
  try {
    await liffInstance.shareTargetPicker([{ type: 'text', text: message }]);
  } catch (error) {
    console.error('LINE シェアエラー:', error);
    throw error;
  }
};

const initLiff = async (): Promise<void> => {
  if (!APP_CONFIG.LIFF_ID) {
    state = { ...state, isReady: true };
    notify();
    return;
  }

  try {
    // LINE アプリ内ブラウザでのみ使用するため、ダイナミックインポートでバンドルを分割する
    const { default: instance } = await import('@line/liff');
    liffInstance = instance;

    await instance.init({ liffId: APP_CONFIG.LIFF_ID });
    const inClient = instance.isInClient();

    let profile: LiffProfile | null = null;
    if (inClient) {
      const liffProfile = await instance.getProfile();
      profile = {
        userId: liffProfile.userId,
        displayName: liffProfile.displayName,
        pictureUrl: liffProfile.pictureUrl ?? undefined,
      };
    }

    state = { isLiff: inClient, isReady: true, profile };
  } catch (error) {
    console.error('LINE LIFF 初期化エラー:', error);
    state = { ...state, isReady: true };
  }

  notify();
};

// モジュール読み込み時に初期化開始
void initLiff();
