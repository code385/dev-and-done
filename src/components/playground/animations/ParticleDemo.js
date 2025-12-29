'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ParticleDemo() {
  const [particles, setParticles] = useState([]);

  const createParticle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
    };
    
    setParticles((prev) => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="w-full h-96 bg-gradient-to-br from-background via-muted to-background rounded-lg relative overflow-hidden cursor-crosshair border-2 border-border"
        onClick={createParticle}
        onMouseMove={(e) => {
          if (Math.random() > 0.95) {
            createParticle(e);
          }
        }}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [1, 0.5, 0],
              y: particle.y - 100,
              x: particle.x + (Math.random() - 0.5) * 50,
            }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-muted-foreground text-sm">
            Click or move mouse to create particles
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
            whileHover={{
              scale: 1.1,
              rotate: 5,
            }}
          >
            <motion.div
              className="text-2xl"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              ⭐
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

