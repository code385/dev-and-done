'use client';

import { motion } from 'framer-motion';

export default function GradientPulse() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary"
        animate={{
          backgroundPosition: ['0%', '100%', '0%'],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/20 to-transparent"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

