'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

function MagneticCards() {
  const cards = [1, 2, 3].map(() => useState({ x: 0, y: 0 }));
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map(([pos, setPos], i) => (
        <motion.div
          key={i}
          className="h-24 bg-primary rounded-lg cursor-pointer"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            setPos({ x, y });
          }}
          onMouseLeave={() => setPos({ x: 0, y: 0 })}
          animate={{
            x: pos.x * 0.2,
            y: pos.y * 0.2,
            rotateX: pos.y * 0.05,
            rotateY: pos.x * 0.05,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.05 }}
        />
      ))}
    </div>
  );
}

export default function MagneticButtonDemo() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Magnetic Button */}
      <div className="flex justify-center items-center h-64">
        <motion.button
          className="px-8 py-4 bg-primary text-background rounded-lg font-semibold text-lg relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
          animate={{
            x: mousePosition.x * 0.3,
            y: mousePosition.y * 0.3,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Magnetic Button
        </motion.button>
      </div>

      {/* Magnetic Cards */}
      <MagneticCards />
    </motion.div>
  );
}

