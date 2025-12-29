'use client';

import { motion } from 'framer-motion';

export default function LiquidFlowBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <defs>
          <linearGradient id="liquid1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 217, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.3)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z"
          fill="url(#liquid1)"
          animate={{
            d: [
              'M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z',
              'M0,400 Q300,600 600,400 T1200,400 L1200,800 L0,800 Z',
              'M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
}

