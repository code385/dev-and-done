'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CardFlipDemo() {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center">
        <div className="w-64 h-64 perspective-1000">
          <motion.div
            className="relative w-full h-full"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }}
            onClick={() => setFlipped(!flipped)}
          >
            {/* Front */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backfaceVisibility: 'hidden' }}
            >
              Front
            </motion.div>
            
            {/* Back */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              Back
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex justify-center gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-20 h-32 bg-primary rounded-lg cursor-pointer"
            whileHover={{ 
              rotateY: 180,
              z: 50,
            }}
            transition={{ duration: 0.5 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="w-full h-full bg-secondary rounded-lg" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

