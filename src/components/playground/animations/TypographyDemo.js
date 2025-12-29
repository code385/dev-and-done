'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TypographyDemo() {
  const [hovered, setHovered] = useState(false);
  
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Text */}
      <div className="space-y-4">
        <motion.h1
          className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ['0%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundSize: '200% auto',
          }}
        >
          Animated Typography
        </motion.h1>
        
        <motion.p
          className="text-2xl"
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          animate={{
            scale: hovered ? 1.1 : 1,
            letterSpacing: hovered ? '0.2em' : '0em',
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Hover me for effect
        </motion.p>
      </div>

      {/* Text Reveal */}
      <div className="h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        <motion.div
          className="text-2xl font-bold"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          Scrolling Text Animation
        </motion.div>
      </div>

      {/* Letter Animation */}
      <div className="flex justify-center gap-2">
        {'DEVELOPMENT'.split('').map((letter, i) => (
          <motion.span
            key={i}
            className="text-3xl font-bold"
            initial={{ y: 0, opacity: 0.5 }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </div>

      {/* Typewriter Effect */}
      <div className="h-16 bg-muted rounded-lg flex items-center px-4">
        <motion.span
          className="text-lg font-mono"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        >
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            |
          </motion.span>
        </motion.span>
      </div>
    </motion.div>
  );
}

