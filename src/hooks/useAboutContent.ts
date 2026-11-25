import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { aboutDefaults, fetchAbout, mergeAbout, type AboutContent } from '@/lib/aboutContent';

const CACHE = 'about-content-cache-v1';
const cached = () => {
  try { const raw = localStorage.getItem(CACHE); return raw ? JSON.parse(raw) : undefined; } catch { return undefined; }
};
const load = async () => {
  const data = await fetchAbout();
  try { localStorage.setItem(CACHE, JSON.stringify(data)); } catch { /* private mode */ }
  return data;
};

/** The About page text in the visitor's language: built-in text plus your edits from the admin. */
export const useAboutContent = (): AboutContent => {
  const { t, i18n } = useTranslation();
  const { data } = useQuery({ queryKey: ['about-content'], queryFn: load, staleTime: 5 * 60 * 1000, retry: false, placeholderData: cached });
  const lang = (i18n.language || 'en').split('-')[0];
  return useMemo(() => mergeAbout(aboutDefaults(t), data?.langs?.[lang]), [t, data, lang]);
};
