'use client';

import { motion } from 'framer-motion';

export default function StarfieldDrift() {
  const stars = Array.from({ length: 100 });

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((_, i) => {
        const size = Math.random() * 2 + 0.5;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        return (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: ['0vh', '100vh'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}

