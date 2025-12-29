'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="relative w-12 h-6 rounded-full bg-muted border border-border" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background border border-border shadow-md flex items-center justify-center"
        animate={{
          x: theme === 'light' ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === 'dark' ? (
          <svg
            className="w-3.5 h-3.5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </motion.div>
    </button>
  );
}

