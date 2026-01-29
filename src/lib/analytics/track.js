'use client';

import { AnalyticsEvents, createEvent } from './events';

// Get or create session ID
function getSessionId() {
  if (typeof window === 'undefined') return null;
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Track analytics events
export async function trackEvent(type, data = {}) {
  if (typeof window === 'undefined') return;

  try {
    const event = createEvent(type, data);
    const sessionId = getSessionId();
    
    // Add session ID to event
    const eventWithSession = {
      ...event,
      sessionId,
    };
    
    // Send to analytics API - fail silently to avoid console errors
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventWithSession),
    }).catch(() => {
      // Silently fail - analytics should not break the app
    });
  } catch (error) {
    // Silently fail - analytics should not break the app
  }
}

// Track user journey (page sequence)
export function trackUserJourney(path, previousPath = null) {
  if (typeof window === 'undefined') return;
  
  trackEvent(AnalyticsEvents.PAGE_VIEW, {
    path,
    previousPath,
    timestamp: new Date().toISOString(),
  });
}

// Track conversion events
export function trackConversion(eventName, value = null, metadata = {}) {
  trackEvent('conversion', {
    eventName,
    value,
    ...metadata,
  });
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

