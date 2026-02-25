import { useSyncExternalStore } from 'react';
import {
  subscribe,
  getSnapshot,
  shareToLine,
  type LiffProfile,
} from '@/services/liff/liffStore';

export const useLiff = (): {
  isLiff: boolean;
  isReady: boolean;
  profile: LiffProfile | null;
  shareToLine: (message: string) => Promise<void>;
} => {
  const { isLiff, isReady, profile } = useSyncExternalStore(
    subscribe,
    getSnapshot,
  );
  return { isLiff, isReady, profile, shareToLine };
};
