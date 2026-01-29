'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial scroll position
    toggleVisibility();
    
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Ensure Crisp chat widget doesn't overlap scroll to top button
  useEffect(() => {
    const setCrispZIndex = () => {
      // Target Crisp chat elements
      const crispSelectors = [
        '#crisp-chatbox',
        '#crisp-client',
        '.crisp-client',
        '[class*="crisp-"]',
        '[id*="crisp-"]'
      ];

      crispSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.zIndex = '9999';
            }
          });
        } catch (e) {
          // Ignore errors for invalid selectors
        }
      });

      // Also target iframes
      const iframes = document.querySelectorAll('iframe[src*="crisp.chat"]');
      iframes.forEach(iframe => {
        if (iframe instanceof HTMLElement) {
          iframe.style.zIndex = '9999';
        }
      });
    };

    // Set immediately
    setCrispZIndex();

    // Set after a delay to catch dynamically loaded elements
    const timeout = setTimeout(setCrispZIndex, 1000);

    // Use MutationObserver to catch dynamically added Crisp elements
    const observer = new MutationObserver(setCrispZIndex);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="scroll-to-top-container fixed bottom-24 right-6 md:bottom-28 md:right-8 z-[99999] flex flex-col items-end space-y-4">
      <ThemeToggle />
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Scroll to top"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

