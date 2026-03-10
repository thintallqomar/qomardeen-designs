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
import de from './locales/de.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';

export const supportedLanguages = ['en', 'fr', 'es', 'de', 'pt', 'ru', 'yo', 'ha', 'ig', 'pcm', 'ar'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  pt: 'Português',
  ru: 'Русский',
  yo: 'Yorùbá',
  ha: 'Hausa',
  ig: 'Igbo',
  pcm: 'Pidgin',
  ar: 'العربية',
};

export const languageFlags: Record<SupportedLanguage, string> = {
  en: 'gb',
  fr: 'fr',
  es: 'es',
  de: 'de',
  pt: 'pt',
  ru: 'ru',
  yo: 'ng',
  ha: 'ng',
  ig: 'ng',
  pcm: 'ng',
  ar: 'sa',
};

export const getFlagUrl = (lang: SupportedLanguage) =>
  `https://flagcdn.com/${languageFlags[lang]}.svg`;

export const rtlLanguages: SupportedLanguage[] = ['ar'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      de: { translation: de },
      pt: { translation: pt },
      ru: { translation: ru },
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
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
  });

export default i18n;