import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  generateShareText,
  generateShareTextEn,
} from '@/features/share/shareHelper';
import { useShare } from '@/features/share/useShare';
import { useFallbackShare } from '@/features/share/useFallbackShare';
import type { GameMode, PlayType } from '@/features/game/game.schema';

type ShareButtonProps = {
  mode: GameMode;
  attempts: number;
  playType: PlayType;
};

export function ShareButton({ mode, attempts, playType }: ShareButtonProps) {
  const { t, i18n } = useTranslation();
  const { canShare, shareText } = useShare();
  const { copyToClipboard, openTwitterShare, openLineShare, openThreadsShare } =
    useFallbackShare();
  const [copied, setCopied] = useState(false);

  const shareData = { mode, attempts, playType };
  const text =
    i18n.language === 'ja'
      ? generateShareText(shareData)
      : generateShareTextEn(shareData);

  const handleWebShare = () => {
    void shareText(shareData);
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // エラーは useFallbackShare 内でログ済み
    }
  };

  if (canShare) {
    return (
      <button
        onClick={handleWebShare}
        className="w-full rounded-xl bg-linear-to-r from-sky-500 to-blue-600 py-3 text-base font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/40 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
      >
        {t('result.share')}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => openTwitterShare(text)}
        className="rounded-lg bg-black px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        rel="noopener noreferrer"
      >
        X
      </button>
      <button
        onClick={() => openLineShare(text)}
        className="rounded-lg bg-[#06C755] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#06C755] focus-visible:ring-offset-2"
      >
        LINE
      </button>
      <button
        onClick={() => openThreadsShare(text)}
        className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
      >
        Threads
      </button>
      <button
        onClick={() => void handleCopy()}
        className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
      >
        {copied ? '✓ コピー済み' : 'コピー'}
      </button>
    </div>
  );
}
