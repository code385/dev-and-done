'use client';

import { motion } from 'framer-motion';

export default function GlowOutline() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.button
        className="px-12 py-6 border-2 border-primary rounded-lg font-semibold text-lg relative overflow-hidden"
        whileHover={{
          boxShadow: '0 0 30px rgba(0, 217, 255, 0.6)',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          className="absolute inset-0 bg-primary opacity-0"
          whileHover={{
            opacity: 0.1,
          }}
        />
        <span className="relative z-10">Hover for Glow</span>
        <motion.div
          className="absolute inset-0 border-2 border-primary rounded-lg"
          whileHover={{
            scale: 1.1,
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </motion.button>
    </div>
  );
}

