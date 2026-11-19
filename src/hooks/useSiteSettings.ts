import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cachedSiteSettings, getSiteSettings, type SiteSettings } from '@/lib/siteSettings';

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
  return { settings: query.data ?? {}, ready: !!cached || query.isFetched || query.isError || timedOut };
};

export const useSiteSettings = (): SiteSettings => useSiteSettingsState().settings;
