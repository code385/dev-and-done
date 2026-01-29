'use client';

import { motion } from 'framer-motion';

export default function JourneyMap({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No journey data available
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Most common user navigation paths
      </div>
      
      {data.slice(0, 10).map((journey, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-muted p-4 rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {journey.path.map((path, pathIndex) => (
                <div key={pathIndex} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {path}
                  </span>
                  {pathIndex < journey.path.length - 1 && (
                    <span className="text-muted-foreground">→</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-right">
              <div className="font-bold">{journey.frequency}</div>
              <div className="text-xs text-muted-foreground">{journey.percentage}%</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}


