'use client';

import { motion } from 'framer-motion';

export default function ScaleOnHover() {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-8">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-2xl"
          whileHover={{ 
            scale: 1.2,
            rotate: 5,
            boxShadow: '0 20px 40px rgba(0, 217, 255, 0.4)',
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {i}
        </motion.div>
      ))}
    </div>
  );
}

