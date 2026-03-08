import { useNavigate, useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useLocalizedNavigate = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const currentLang = lang || i18n.language || 'en';

  const localizedNavigate = useCallback(
    (path: string) => {
      // Don't prefix admin routes or absolute URLs
      if (path.startsWith('/admin') || path.startsWith('http')) {
        navigate(path);
        return;
      }
      // Strip any existing language prefix
      const cleanPath = path.replace(/^\/(en|fr|es)/, '') || '/';
      navigate(`/${currentLang}${cleanPath === '/' ? '' : cleanPath}`);
    },
    [navigate, currentLang]
  );

  return localizedNavigate;
};

export const useLocalizedPath = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const currentLang = lang || i18n.language || 'en';

  return useCallback(
    (path: string) => {
      if (path.startsWith('/admin') || path.startsWith('http')) return path;
      const cleanPath = path.replace(/^\/(en|fr|es)/, '') || '/';
      return `/${currentLang}${cleanPath === '/' ? '' : cleanPath}`;
    },
    [currentLang]
  );
};
