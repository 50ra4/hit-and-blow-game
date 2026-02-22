import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE_IDS } from '@/consts/languages';
import ja from './locales/ja.json';
import en from './locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    [LANGUAGE_IDS.JA]: { translation: ja },
    [LANGUAGE_IDS.EN]: { translation: en },
  },
  lng: LANGUAGE_IDS.JA,
  fallbackLng: LANGUAGE_IDS.JA,
  interpolation: { escapeValue: false },
});

export default i18n;
