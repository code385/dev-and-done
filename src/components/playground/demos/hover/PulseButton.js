'use client';

import { motion } from 'framer-motion';

export default function PulseButton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.button
        className="px-12 py-6 bg-primary text-background rounded-lg font-semibold text-lg relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(0, 217, 255, 0.7)',
            '0 0 0 20px rgba(0, 217, 255, 0)',
            '0 0 0 0 rgba(0, 217, 255, 0)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        Pulse Button
      </motion.button>
    </div>
  );
}

