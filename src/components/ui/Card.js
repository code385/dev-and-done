'use client';

import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = false,
  ...props
}) {
  const baseStyles = 'bg-card border border-border rounded-xl p-6 transition-all duration-300';
  const hoverStyles = hover ? 'hover:border-primary hover:shadow-lg hover:shadow-primary/20' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

