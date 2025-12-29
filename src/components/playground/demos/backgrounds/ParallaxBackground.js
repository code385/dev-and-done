'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxBackground() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -600]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Multiple parallax layers */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute inset-0"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full opacity-30"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

