'use client';

import { motion } from 'framer-motion';

export default function FireflySwarm() {
  const fireflies = Array.from({ length: 30 });

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {fireflies.map((_, i) => {
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              boxShadow: '0 0 10px rgba(0, 217, 255, 0.8)',
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
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}

