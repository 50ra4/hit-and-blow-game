import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { APP_CONFIG } from '@/consts/config';

type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

export const useLiff = (): {
  isLiff: boolean;
  isReady: boolean;
  profile: LiffProfile | null;
  shareToLine: (message: string) => Promise<void>;
} => {
  const [isLiff, setIsLiff] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);

  useEffect(() => {
    if (!APP_CONFIG.LIFF_ID) {
      setIsReady(true);
      return;
    }

    void (async () => {
      try {
        await liff.init({ liffId: APP_CONFIG.LIFF_ID });
        const inClient = liff.isInClient();
        setIsLiff(inClient);

        if (inClient) {
          const liffProfile = await liff.getProfile();
          setProfile({
            userId: liffProfile.userId,
            displayName: liffProfile.displayName,
            pictureUrl: liffProfile.pictureUrl ?? undefined,
          });
        }
      } catch (error) {
        console.error('LINE LIFF 初期化エラー:', error);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const shareToLine = async (message: string): Promise<void> => {
    try {
      await liff.shareTargetPicker([{ type: 'text', text: message }]);
    } catch (error) {
      console.error('LINE シェアエラー:', error);
      throw error;
    }
  };

  return { isLiff, isReady, profile, shareToLine };
};
