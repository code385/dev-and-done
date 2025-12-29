'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ColorPickerDemo() {
  const [selectedColor, setSelectedColor] = useState('#00d9ff');
  const colors = ['#00d9ff', '#9333ea', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Color Display */}
      <motion.div
        className="h-48 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: selectedColor }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 0.3,
        }}
      >
        <motion.span
          className="text-2xl font-bold text-white drop-shadow-lg"
          key={selectedColor}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {selectedColor}
        </motion.span>
      </motion.div>

      {/* Color Swatches */}
      <div className="flex gap-4 justify-center flex-wrap">
        {colors.map((color) => (
          <motion.button
            key={color}
            className="w-16 h-16 rounded-full border-4 border-background shadow-lg"
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              borderColor: selectedColor === color ? color : 'transparent',
              scale: selectedColor === color ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
        ))}
      </div>

      {/* Gradient Preview */}
      <div className="h-24 rounded-lg overflow-hidden">
        <motion.div
          className="w-full h-full"
          style={{
            background: `linear-gradient(90deg, ${selectedColor}, ${colors[(colors.indexOf(selectedColor) + 1) % colors.length]})`,
          }}
          animate={{
            backgroundPosition: ['0%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>
    </motion.div>
  );
}

