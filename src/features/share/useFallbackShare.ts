import { useCallback } from 'react';

export const useFallbackShare = () => {
  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('クリップボードコピーエラー:', error);
      throw error;
    }
  }, []);

  const openTwitterShare = useCallback((text: string): void => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const openLineShare = useCallback((text: string): void => {
    const url = `https://line.me/R/share?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const openThreadsShare = useCallback((text: string): void => {
    const url = `https://threads.net/intent/post?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return { copyToClipboard, openTwitterShare, openLineShare, openThreadsShare };
};
