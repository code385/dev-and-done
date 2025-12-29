'use client';

import { motion } from 'framer-motion';

export default function ScrollRevealDemo() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scroll Triggered Elements */}
      <div className="space-y-4 h-96 overflow-y-auto p-4 border border-border rounded-lg">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="h-32 bg-primary rounded-lg flex items-center justify-center text-white font-bold"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-100px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            Scroll Item {i}
          </motion.div>
        ))}
      </div>

      {/* Fade In on Scroll */}
      <motion.div
        className="h-32 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Fade In on Scroll
      </motion.div>

      {/* Slide In */}
      <motion.div
        className="h-32 bg-muted rounded-lg flex items-center justify-center"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        Slide In from Left
      </motion.div>
    </motion.div>
  );
}

