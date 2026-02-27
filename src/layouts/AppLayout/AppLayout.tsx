import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useSettings } from '@/i18n/useSettings';
import { Modal } from '@/components/Modal/Modal';
import { Button } from '@/components/Button/Button';
import { THEME_IDS } from '@/consts/themes';
import type { Settings } from '@/i18n/i18n.schema';

const THEME_OPTIONS: { value: Settings['theme']; labelKey: string }[] = [
  { value: THEME_IDS.LIGHT, labelKey: 'theme.light' },
  { value: THEME_IDS.DARK, labelKey: 'theme.dark' },
  { value: THEME_IDS.SYSTEM, labelKey: 'theme.system' },
];

export function AppLayout() {
  const { t } = useTranslation();
  const { settings, updateLanguage, updateTheme, toggleSound } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useDarkMode(settings.theme);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleToggleLanguage = () => {
    updateLanguage(settings.language === 'ja' ? 'en' : 'ja');
  };

  return (
    <div className="bg-gradient-dark-1 flex min-h-screen flex-col text-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-gray-900/85 px-4 py-3 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link
            to="/"
            className="text-lg font-bold text-white transition-opacity hover:opacity-80"
          >
            {t('common.title')}
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLanguage}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
            >
              {settings.language === 'ja' ? 'EN' : 'JA'}
            </button>
            <button
              onClick={handleOpenSettings}
              className="rounded-lg p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white"
              aria-label={t('settings.title')}
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* フッター: ホームページのみ表示 */}
      {isHome && (
        <footer className="border-t border-white/10 bg-gray-900/50 px-4 py-6">
          <nav className="mx-auto flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              to="/stats"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {t('nav.stats')}
            </Link>
            <Link
              to="/tutorial"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {t('nav.tutorial')}
            </Link>
            <Link
              to="/terms"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {t('nav.terms')}
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {t('nav.privacy')}
            </Link>
          </nav>
          <p className="mt-2 text-center text-xs text-white/40">©50ra4</p>
        </footer>
      )}

      {/* 設定モーダル */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        title={t('settings.title')}
      >
        <div className="space-y-6">
          {/* テーマ設定 */}
          <div>
            <p className="mb-3 text-sm font-medium text-white/80">
              {t('settings.theme')}
            </p>
            <div className="flex gap-2">
              {THEME_OPTIONS.map(({ value, labelKey }) => (
                <Button
                  key={value}
                  variant={settings.theme === value ? 'primary' : 'secondary'}
                  onClick={() => {
                    updateTheme(value);
                  }}
                  className="flex-1 text-sm"
                >
                  {t(labelKey)}
                </Button>
              ))}
            </div>
          </div>

          {/* 言語設定 */}
          <div>
            <p className="mb-3 text-sm font-medium text-white/80">
              {t('settings.language')}
            </p>
            <div className="flex gap-2">
              <Button
                variant={settings.language === 'ja' ? 'primary' : 'secondary'}
                onClick={() => {
                  updateLanguage('ja');
                }}
                className="flex-1 text-sm"
              >
                日本語
              </Button>
              <Button
                variant={settings.language === 'en' ? 'primary' : 'secondary'}
                onClick={() => {
                  updateLanguage('en');
                }}
                className="flex-1 text-sm"
              >
                English
              </Button>
            </div>
          </div>

          {/* サウンド設定 */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white/80">
              {t('settings.sound')}
            </p>
            <button
              onClick={toggleSound}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${
                settings.soundEnabled ? 'bg-indigo-500' : 'bg-white/20'
              }`}
              role="switch"
              aria-checked={settings.soundEnabled}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
