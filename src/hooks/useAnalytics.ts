import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export const useAnalytics = () => {
  const scrollDepthTracked = useRef<Set<number>>(new Set());

  const trackEvent = useCallback(async (eventType: string, eventData?: Record<string, unknown>) => {
    try {
      await supabase.from('analytics_events').insert({
        event_type: eventType,
        event_data: eventData as Json | undefined,
        page_path: window.location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });
    } catch (error) {
      // Silently fail - analytics should not break the app
      console.debug('Analytics error:', error);
    }
  }, []);

  const trackPageView = useCallback(() => {
    trackEvent('page_view', {
      title: document.title,
      url: window.location.href,
    });
  }, [trackEvent]);

  const trackCTAClick = useCallback((ctaName: string, destination?: string) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      destination,
    });
  }, [trackEvent]);

  const trackScrollDepth = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    const thresholds = [25, 50, 75, 100];
    
    thresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && !scrollDepthTracked.current.has(threshold)) {
        scrollDepthTracked.current.add(threshold);
        trackEvent('scroll_depth', {
          depth: threshold,
          page_path: window.location.pathname,
        });
      }
    });
  }, [trackEvent]);

  const trackSectionView = useCallback((sectionId: string) => {
    trackEvent('section_view', {
      section_id: sectionId,
    });
  }, [trackEvent]);

  useEffect(() => {
    // Track page view on mount
    trackPageView();

    // Set up scroll depth tracking
    const handleScroll = () => trackScrollDepth();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackPageView, trackScrollDepth]);

  return {
    trackEvent,
    trackPageView,
    trackCTAClick,
    trackScrollDepth,
    trackSectionView,
  };
};
