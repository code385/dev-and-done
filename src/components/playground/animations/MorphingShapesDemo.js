'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MorphingShapesDemo() {
  const [shape, setShape] = useState(0);
  const shapes = ['circle', 'square', 'triangle', 'diamond'];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Morphing Shape */}
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="w-32 h-32 bg-primary"
          animate={{
            borderRadius: shape === 0 ? '50%' : shape === 1 ? '0%' : shape === 2 ? '0%' : '0%',
            rotate: shape === 2 ? [0, 45, 0] : shape === 3 ? [0, 45, 0] : 0,
            clipPath: shape === 2 
              ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
              : shape === 3
              ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
              : 'none',
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          onClick={() => setShape((shape + 1) % shapes.length)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>

      {/* Blob Animation */}
      <div className="flex justify-center">
        <motion.div
          className="w-40 h-40 bg-gradient-to-r from-primary to-secondary rounded-full"
          animate={{
            borderRadius: [
              '60% 40% 30% 70% / 60% 30% 70% 40%',
              '30% 60% 70% 40% / 50% 60% 30% 60%',
              '60% 40% 30% 70% / 60% 30% 70% 40%',
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Shape Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-16 bg-primary"
            animate={{
              borderRadius: i % 2 === 0 ? '50%' : '0%',
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

