import { useCallback } from 'react';
import i18n from '@/i18n/index';
import { useLocalStorage } from '@/services/storage/useLocalStorage';
import { STORAGE_KEYS } from '@/consts/storageKeys';
import { SettingsSchema, type Settings } from './i18n.schema';

const DEFAULT_SETTINGS: Settings = SettingsSchema.parse({});

type UseSettingsReturn = {
  settings: Settings;
  updateLanguage: (language: Settings['language']) => void;
  updateTheme: (theme: Settings['theme']) => void;
  toggleSound: () => void;
  completeTutorial: () => void;
};

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS,
    SettingsSchema,
  );

  const updateLanguage = useCallback((language: Settings['language']): void => {
     
    setSettings((prev) => {
      if (prev.language === language) return prev;
      void i18n.changeLanguage(language);
      return { ...prev, language };
    });
  }, []);

  const updateTheme = useCallback((theme: Settings['theme']): void => {
     
    setSettings((prev) => {
      if (prev.theme === theme) return prev;
      return { ...prev, theme };
    });
  }, []);

  const toggleSound = useCallback((): void => {
     
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const completeTutorial = useCallback((): void => {
     
    setSettings((prev) => ({ ...prev, tutorialCompleted: true }));
  }, []);

  return {
    settings,
    updateLanguage,
    updateTheme,
    toggleSound,
    completeTutorial,
  };
};
