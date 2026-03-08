import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import yo from './locales/yo.json';
import ha from './locales/ha.json';
import ig from './locales/ig.json';
import pcm from './locales/pcm.json';
import ar from './locales/ar.json';

export const supportedLanguages = ['en', 'fr', 'es', 'yo', 'ha', 'ig', 'pcm', 'ar'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  yo: 'Yorùbá',
  ha: 'Hausa',
  ig: 'Igbo',
  pcm: 'Pidgin',
  ar: 'العربية',
};

export const languageFlags: Record<SupportedLanguage, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
  yo: '🇳🇬',
  ha: '🇳🇬',
  ig: '🇳🇬',
  pcm: '🇳🇬',
  ar: '🇸🇦',
};

export const rtlLanguages: SupportedLanguage[] = ['ar'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      yo: { translation: yo },
      ha: { translation: ha },
      ig: { translation: ig },
      pcm: { translation: pcm },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    supportedLngs: supportedLanguages as unknown as string[],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'navigator', 'localStorage'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
  });

export default i18n;
