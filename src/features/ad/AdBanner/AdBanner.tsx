import { useEffect } from 'react';
import { APP_CONFIG } from '@/consts/config';

export function AdBanner() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense 読み込み失敗時は無視
      }
    }
  }, []);

  if (!APP_CONFIG.ADSENSE_CLIENT_ID) return null;

  return (
    <div className="mx-auto my-4 w-full max-w-lg">
      <ins
        className="adsbygoogle block"
        data-ad-client={APP_CONFIG.ADSENSE_CLIENT_ID}
        data-ad-slot={APP_CONFIG.ADSENSE_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
