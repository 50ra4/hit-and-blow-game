// アプリ設定
export const APP_CONFIG = {
  NAME: 'シンボルヒットアンドブロー',
  VERSION: '1.0.0',
  LIFF_ID: import.meta.env.VITE_LIFF_ID || '',
  ADSENSE_CLIENT_ID: import.meta.env.VITE_ADSENSE_CLIENT_ID || '',
  ADSENSE_SLOT_ID: import.meta.env.VITE_ADSENSE_SLOT_ID || ''
} as const;
