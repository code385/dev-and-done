'use client';

import { AnalyticsEvents, createEvent } from './events';

// Track analytics events
export async function trackEvent(type, data = {}) {
  if (typeof window === 'undefined') return;

  try {
    const event = createEvent(type, data);
    
    // Send to analytics API
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch((error) => {
      console.error('Analytics tracking error:', error);
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

// Convenience functions
export const trackPageView = (path) => trackEvent(AnalyticsEvents.PAGE_VIEW, { path });
export const trackButtonClick = (buttonName, location) => 
  trackEvent(AnalyticsEvents.BUTTON_CLICK, { buttonName, location });
export const trackFormStart = (formName) => 
  trackEvent(AnalyticsEvents.FORM_START, { formName });
export const trackFormSubmit = (formName, success = true) => 
  trackEvent(AnalyticsEvents.FORM_SUBMIT, { formName, success });
export const trackLinkClick = (url, text) => 
  trackEvent(AnalyticsEvents.LINK_CLICK, { url, text });
export const trackScrollDepth = (depth) => 
  trackEvent(AnalyticsEvents.SCROLL_DEPTH, { depth });
export const trackTimeOnPage = (seconds) => 
  trackEvent(AnalyticsEvents.TIME_ON_PAGE, { seconds });
export const trackContentShare = (platform, contentType, contentId, url) =>
  trackEvent(AnalyticsEvents.CONTENT_SHARE, { platform, contentType, contentId, url });

