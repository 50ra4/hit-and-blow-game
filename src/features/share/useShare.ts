import { useTranslation } from 'react-i18next';
import {
  generateShareText,
  generateShareTextEn,
} from '@/features/share/shareHelper';
import type { ShareTextData } from '@/features/share/share.schema';

export const useShare = (): {
  canShare: boolean;
  shareText: (data: ShareTextData) => Promise<void>;
} => {
  const { i18n } = useTranslation();
  const canShare = typeof navigator.share !== 'undefined';

  const shareText = async (data: ShareTextData): Promise<void> => {
    const text =
      i18n.language === 'ja'
        ? generateShareText(data)
        : generateShareTextEn(data);

    try {
      await navigator.share({ text });
    } catch (error) {
      // AbortError はユーザーによるキャンセルのため無視
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('シェアエラー:', error);
      throw error;
    }
  };

  return { canShare, shareText };
};
