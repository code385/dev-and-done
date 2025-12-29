'use client';

import { motion } from 'framer-motion';

export default function AuroraBorealis() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <defs>
          <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 217, 255, 0.4)" />
            <stop offset="50%" stopColor="rgba(147, 51, 234, 0.4)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.4)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,200 Q300,150 600,200 T1200,200 L1200,800 L0,800 Z"
          fill="url(#aurora1)"
          animate={{
            d: [
              'M0,200 Q300,150 600,200 T1200,200 L1200,800 L0,800 Z',
              'M0,200 Q300,250 600,200 T1200,200 L1200,800 L0,800 Z',
              'M0,200 Q300,100 600,200 T1200,200 L1200,800 L0,800 Z',
              'M0,200 Q300,150 600,200 T1200,200 L1200,800 L0,800 Z',
            ],
            opacity: [0.4, 0.7, 0.5, 0.4],
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

