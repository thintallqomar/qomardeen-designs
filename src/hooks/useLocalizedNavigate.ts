import { useNavigate, useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, type SupportedLanguage } from '@/i18n';

const LANG_PREFIX_RE = new RegExp(`^\\/(${supportedLanguages.join('|')})(?=\\/|$)`);

export const useLocalizedNavigate = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const currentLang = lang || i18n.language?.slice(0, 2) || 'en';

  const localizedNavigate = useCallback(
    (path: string) => {
      if (path.startsWith('/admin') || path.startsWith('http')) {
        navigate(path);
        return;
      }
      const cleanPath = path.replace(LANG_PREFIX_RE, '') || '/';
      navigate(`/${currentLang}${cleanPath === '/' ? '' : cleanPath}`);
    },
    [navigate, currentLang]
  );

  return localizedNavigate;
};

export const useLocalizedPath = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const currentLang = lang || i18n.language?.slice(0, 2) || 'en';

  return useCallback(
    (path: string) => {
      if (path.startsWith('/admin') || path.startsWith('http')) return path;
      const cleanPath = path.replace(LANG_PREFIX_RE, '') || '/';
      return `/${currentLang}${cleanPath === '/' ? '' : cleanPath}`;
    },
    [currentLang]
  );
};