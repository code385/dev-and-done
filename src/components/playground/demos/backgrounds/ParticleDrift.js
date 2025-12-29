'use client';

import { motion } from 'framer-motion';

export default function ParticleDrift() {
  const particles = Array.from({ length: 50 });

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            y: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

