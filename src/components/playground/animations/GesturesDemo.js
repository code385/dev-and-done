'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function GesturesDemo() {
  const [swiped, setSwiped] = useState(false);
  const [panned, setPanned] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Swipeable Card */}
      <motion.div
        className="h-32 bg-primary rounded-lg flex items-center justify-center text-white font-bold cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        onDragEnd={(e, info) => {
          if (Math.abs(info.offset.x) > 50) {
            setSwiped(true);
            setTimeout(() => setSwiped(false), 1000);
          }
        }}
        animate={{
          x: swiped ? (swiped ? 200 : 0) : 0,
          opacity: swiped ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {swiped ? 'Swiped!' : 'Swipe me left or right'}
      </motion.div>

      {/* Pan Gesture */}
      <motion.div
        className="h-32 bg-secondary rounded-lg flex items-center justify-center text-white font-bold cursor-move relative overflow-hidden"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDrag={(e, info) => setPanned({ x: info.offset.x, y: info.offset.y })}
        onDragEnd={() => setPanned({ x: 0, y: 0 })}
        animate={{
          x: panned.x,
          y: panned.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        Pan me around
      </motion.div>

      {/* Pinch Zoom (Simulated) */}
      <div className="h-32 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
        <motion.div
          className="w-20 h-20 bg-primary rounded-lg"
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
            Pinch
          </div>
        </motion.div>
      </div>

      {/* Long Press */}
      <motion.button
        className="w-full h-16 bg-primary text-background rounded-lg font-semibold"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onTapStart={() => {
          const timer = setTimeout(() => {
            alert('Long press detected!');
          }, 1000);
          return () => clearTimeout(timer);
        }}
      >
        Long Press Me (1 second)
      </motion.button>
    </motion.div>
  );
}

