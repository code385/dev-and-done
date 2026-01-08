'use client';

import { useEffect, useState } from 'react';
import { getReadingProgress, saveReadingProgress } from '@/lib/utils/bookmarks';

export default function ReadingProgress({ contentId, contentType, className = '' }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load initial progress
    const initialProgress = getReadingProgress(contentId, contentType);
    setProgress(initialProgress);

    // Track scroll progress
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const scrollableHeight = documentHeight - windowHeight;
      if (scrollableHeight > 0) {
        const percentage = Math.round((scrollTop / scrollableHeight) * 100);
        setProgress(percentage);
        saveReadingProgress(contentId, contentType, percentage);
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [contentId, contentType]);

  if (progress === 0) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 h-1 bg-muted z-50 ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

