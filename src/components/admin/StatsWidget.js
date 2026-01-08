'use client';

import { motion } from 'framer-motion';
import Card from '../ui/Card';

export default function StatsWidget({ title, value, icon, trend, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card hover className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold mb-2">{value}</p>
            {trend && (
              <p className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          {icon && (
            <div className="text-4xl opacity-20">{icon}</div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

