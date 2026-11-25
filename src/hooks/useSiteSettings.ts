import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cachedSiteSettings, getSiteSettings, heroStyleOf, hiddenProjectsOf, nowLineOf, type HeroStyle, type SiteSettings } from '@/lib/siteSettings';

/**
 * Uploaded hero images / CV. Returns the settings plus `ready`: true once we know whether anything was uploaded
 * (instantly for returning visitors, otherwise after the first answer or at most ~0.8s), so the hero can avoid
 * flashing the built-in photo before the uploaded one.
 */
export const useSiteSettingsState = (): { settings: SiteSettings; ready: boolean } => {
  const cached = cachedSiteSettings();
  const query = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => getSiteSettings(),
    staleTime: 5 * 60 * 1000,
    retry: false,
    placeholderData: cached,
  });
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setTimedOut(true), 800);
    return () => clearTimeout(id);
  }, []);
  return { settings: query.data ?? cached ?? {}, ready: !!cached || query.isFetched || query.isError || timedOut };
};

export const useSiteSettings = (): SiteSettings => useSiteSettingsState().settings;

/** Which hero to show and the optional "Now" line, from Admin > Site. Defaults to the new hero. */
export const useHeroConfig = (): { heroStyle: HeroStyle; nowLine: string } => {
  const settings = useSiteSettings();
  return { heroStyle: heroStyleOf(settings), nowLine: nowLineOf(settings) };
};

/** Projects switched off in the admin (built-in ones and their imported copies). */
export const useHiddenProjects = (): Set<string> => hiddenProjectsOf(useSiteSettings());
