'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TypewriterEffect() {
  const text = "Build Amazing Experiences";
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        // Blink cursor
        setInterval(() => setShowCursor(prev => !prev), 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <h1 className="text-5xl md:text-7xl font-bold text-center">
        {displayedText}
        {showCursor && <span className="text-primary">|</span>}
      </h1>
    </div>
  );
}

