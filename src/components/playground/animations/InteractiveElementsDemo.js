'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveElementsDemo() {
  const [count, setCount] = useState(0);
  const [dragged, setDragged] = useState(false);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Counter with Animation */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <motion.button
            className="px-6 py-3 bg-primary text-background rounded-lg font-semibold"
            onClick={() => setCount(count - 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            -
          </motion.button>
          <motion.div
            key={count}
            className="text-4xl font-bold min-w-[100px] text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {count}
          </motion.div>
          <motion.button
            className="px-6 py-3 bg-primary text-background rounded-lg font-semibold"
            onClick={() => setCount(count + 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Draggable Card */}
      <motion.div
        className="h-32 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={() => setDragged(true)}
        onDragEnd={() => setDragged(false)}
        animate={{
          scale: dragged ? 1.05 : 1,
          rotate: dragged ? 5 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <motion.p
          className="text-white font-semibold"
          animate={{
            opacity: dragged ? 0.8 : 1,
          }}
        >
          {dragged ? 'Dragging...' : 'Drag me!'}
        </motion.p>
      </motion.div>

      {/* Toggle Switch */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <span className="text-sm font-medium">Toggle Animation</span>
        <motion.div
          className="w-14 h-7 bg-muted-foreground/30 rounded-full p-1 cursor-pointer"
          onClick={() => setDragged(!dragged)}
        >
          <motion.div
            className="w-5 h-5 bg-primary rounded-full"
            animate={{
              x: dragged ? 28 : 0,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.div>
      </div>

      {/* Progress Circle */}
      <div className="flex justify-center">
        <motion.div
          className="w-32 h-32 relative"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-primary"
              strokeDasharray={352}
              strokeDashoffset={352}
              animate={{
                strokeDashoffset: [352, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

