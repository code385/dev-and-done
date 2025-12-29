'use client';

import { motion } from 'framer-motion';

export default function LoadingStatesDemo() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Spinner */}
      <div className="flex justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Dots Loading */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-primary rounded-full"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Skeleton Loader */}
      <div className="space-y-3">
        <motion.div
          className="h-4 bg-muted rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="h-4 bg-muted rounded w-3/4"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.2,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="h-4 bg-muted rounded w-1/2"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.4,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>

      {/* Pulse Effect */}
      <div className="flex justify-center">
        <motion.div
          className="w-20 h-20 bg-primary rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.div>
  );
}

