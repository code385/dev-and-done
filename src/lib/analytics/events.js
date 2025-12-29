// Analytics event types
export const AnalyticsEvents = {
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  FORM_ERROR: 'form_error',
  LINK_CLICK: 'link_click',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  ERROR: 'error',
  CHAT_START: 'chat_start',
  CHAT_MESSAGE: 'chat_message',
  ESTIMATOR_START: 'estimator_start',
  ESTIMATOR_COMPLETE: 'estimator_complete',
  NEWSLETTER_SUBSCRIBE: 'newsletter_subscribe',
};

export function createEvent(type, data = {}) {
  return {
    type,
    data,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    path: typeof window !== 'undefined' ? window.location.pathname : '',
  };
}

