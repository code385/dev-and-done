'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Tilt3D() {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg']);

  const handleMouseMove = (e) => {
    if (!hovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-64 h-64 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-2xl"
      >
        <span style={{ transform: 'translateZ(50px)' }}>3D Tilt</span>
      </motion.div>
    </div>
  );
}

