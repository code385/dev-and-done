'use client';

import Card from './Card';
import { motion } from 'framer-motion';

export default function ServiceCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Card hover className="h-full text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </Card>
    </motion.div>
  );
}

