'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackTimeOnPage } from '@/lib/analytics/track';

export default function AnalyticsWrapper({ children }) {
  const pathname = usePathname();
  const startTime = Date.now();

  useEffect(() => {
    // Track page view
    if (pathname) {
      trackPageView(pathname);
    }

    // Track time on page when user leaves
    return () => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
      if (timeOnPage > 0) {
        trackTimeOnPage(timeOnPage);
      }
    };
  }, [pathname, startTime]);

  return children;
}

