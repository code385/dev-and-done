'use client';

import { motion } from 'framer-motion';

export default function WaveAnimationDemo() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* SVG Wave */}
      <div className="h-48 bg-gradient-to-b from-primary/20 to-transparent rounded-lg overflow-hidden relative">
        <svg className="absolute bottom-0 w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <motion.path
            d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-primary"
            animate={{
              d: [
                'M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z',
                'M0,60 Q300,100 600,60 T1200,60 L1200,120 L0,120 Z',
                'M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </div>

      {/* Multiple Waves */}
      <div className="h-32 bg-muted rounded-lg overflow-hidden relative">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-full"
            style={{ height: `${30 + i * 10}%` }}
            animate={{
              x: ['-100%', '0%'],
            }}
            transition={{
              duration: 2 + i,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.3,
            }}
          >
            <div className="h-full bg-primary opacity-20 rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* Ripple Effect */}
      <div className="flex justify-center items-center h-32">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 border-2 border-primary rounded-full"
            animate={{
              scale: [0, 3],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

