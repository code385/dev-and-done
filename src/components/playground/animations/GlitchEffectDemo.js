'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function GlitchEffectDemo() {
  const [glitch, setGlitch] = useState(false);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glitch Text */}
      <div className="relative h-32 flex items-center justify-center">
        <motion.h1
          className="text-4xl font-bold"
          animate={glitch ? {
            x: [0, -2, 2, -2, 2, 0],
            textShadow: [
              '2px 0 #00d9ff, -2px 0 #ec4899',
              '-2px 0 #00d9ff, 2px 0 #ec4899',
              '2px 0 #00d9ff, -2px 0 #ec4899',
              '0 0 transparent',
            ],
          } : {}}
          transition={{ duration: 0.1 }}
          onMouseEnter={() => setGlitch(true)}
          onMouseLeave={() => setGlitch(false)}
        >
          GLITCH EFFECT
        </motion.h1>
      </div>

      {/* Glitch Box */}
      <motion.div
        className="h-48 bg-gradient-to-r from-primary to-secondary rounded-lg relative overflow-hidden"
        animate={glitch ? {
          clipPath: [
            'inset(0 0 0 0)',
            'inset(20% 0 60% 0)',
            'inset(60% 0 20% 0)',
            'inset(0 0 0 0)',
          ],
        } : {}}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setGlitch(true)}
        onMouseLeave={() => setGlitch(false)}
      >
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
          Hover for Glitch
        </div>
      </motion.div>

      {/* Scan Lines */}
      <div className="h-32 bg-muted rounded-lg relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00d9ff 2px, #00d9ff 4px)',
          }}
          animate={{
            y: [0, 20],
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </motion.div>
  );
}

