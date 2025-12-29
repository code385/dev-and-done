'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MagneticCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.button
          className="px-8 py-4 bg-primary text-background rounded-lg font-semibold text-lg relative z-10"
          animate={{
            x: hovered ? (mousePosition.x - window.innerWidth / 2) * 0.1 : 0,
            y: hovered ? (mousePosition.y - window.innerHeight / 2) * 0.1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1 }}
        >
          Hover Me
        </motion.button>
        {hovered && (
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-lg blur-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </div>
  );
}

