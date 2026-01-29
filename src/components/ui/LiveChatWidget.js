'use client';

import { useEffect } from 'react';

export default function LiveChatWidget() {
  useEffect(() => {
    // Only load on client side
    if (typeof window === 'undefined') return;

    const crispId = process.env.NEXT_PUBLIC_CRISP_ID;
    
    if (!crispId) {
      console.warn('Crisp chat ID not configured. Set NEXT_PUBLIC_CRISP_ID in your environment variables.');
      return;
    }

    // Load Crisp script
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = crispId;

    (function() {
      const d = document;
      const s = d.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = 1;
      d.getElementsByTagName('head')[0].appendChild(s);
    })();

    // Cleanup function
    return () => {
      // Crisp doesn't provide a cleanup method, but we can remove the script
      const crispScript = document.querySelector('script[src*="crisp.chat"]');
      if (crispScript) {
        crispScript.remove();
      }
    };
  }, []);

  // This component doesn't render anything visible
  // Crisp handles the UI
  return null;
}


