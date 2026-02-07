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
    if (location.pathname !== lastPath.current) {
      lastPath.current = location.pathname;
      trackEvent('page_view', location.pathname);
    }
  }, [location.pathname]);
};

export const trackClick = (label: string, pagePath: string) => {
  trackEvent('click', pagePath, { label });
};
