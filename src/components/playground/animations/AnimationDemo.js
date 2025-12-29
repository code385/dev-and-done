'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimationDemo() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <motion.div 
      className="space-y-6"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.2 },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      {/* Gradient Box with Animation */}
      <motion.div
        className="w-full h-64 bg-gradient-to-br from-primary via-secondary to-primary rounded-lg flex items-center justify-center relative overflow-hidden"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: hovered ? ['-100%', '200%'] : '-100%',
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
        <motion.div
          className="text-4xl font-bold text-white relative z-10"
          animate={{
            scale: clicked ? [1, 1.2, 1] : 1,
            rotate: clicked ? [0, 5, -5, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          Framer Motion
        </motion.div>
      </motion.div>

      {/* Animated Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-24 bg-muted rounded-lg flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: '0 10px 25px rgba(0, 217, 255, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-8 h-8 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Progress Bar Animation */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Loading Animation</p>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
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
    </motion.div>
  );
}

