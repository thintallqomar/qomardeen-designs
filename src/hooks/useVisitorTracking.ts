import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const getSessionId = () => {
  let id = sessionStorage.getItem('visitor_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('visitor_session_id', id);
  }
  return id;
};

const trackEvent = async (eventType: string, pagePath: string, metadata?: Record<string, unknown>) => {
  try {
    await supabase.from('visitor_events').insert([{
      session_id: getSessionId(),
      event_type: eventType,
      page_path: pagePath,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      metadata: (metadata as any) || null,
    }]);
  } catch {
    // Silent fail for tracking
  }
};

export const useVisitorTracking = () => {
  const location = useLocation();
  const lastPath = useRef('');

  useEffect(() => {
    // Skip bare paths that will redirect to /:lang/ versions
    const langPrefixRe = /^\/(en|fr|es|de|pt|ru|yo|ha|ig|pcm|ar)(\/|$)/;
    const isLocalized = langPrefixRe.test(location.pathname);
    const isAdmin = location.pathname.startsWith('/admin');
    const isRoot = location.pathname === '/';

    // Only track localized paths, admin paths, or root
    if (!isLocalized && !isAdmin && !isRoot) return;

    if (location.pathname !== lastPath.current) {
      lastPath.current = location.pathname;
      trackEvent('page_view', location.pathname);
    }
  }, [location.pathname]);
};

export const trackClick = (label: string, pagePath: string) => {
  trackEvent('click', pagePath, { label });
};

export const trackShare = (
  destination: string,
  pagePath: string,
  metadata?: Record<string, unknown>
) => {
  trackEvent('share', pagePath, { destination, ...(metadata || {}) });
};
