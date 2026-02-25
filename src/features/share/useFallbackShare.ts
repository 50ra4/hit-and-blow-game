export const useFallbackShare = (): {
  copyToClipboard: (text: string) => Promise<void>;
  openTwitterShare: (text: string) => void;
  openLineShare: (text: string) => void;
  openThreadsShare: (text: string) => void;
} => {
  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('クリップボードコピーエラー:', error);
      throw error;
    }
  };

  const openTwitterShare = (text: string): void => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openLineShare = (text: string): void => {
    const url = `https://line.me/R/share?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openThreadsShare = (text: string): void => {
    const url = `https://threads.net/intent/post?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return { copyToClipboard, openTwitterShare, openLineShare, openThreadsShare };
};
