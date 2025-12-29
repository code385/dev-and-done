'use client';

import { motion } from 'framer-motion';

export default function AmbientGradientShift() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(0, 217, 255, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
}

