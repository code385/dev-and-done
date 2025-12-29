'use client';

import { motion } from 'framer-motion';

export default function TimelineDemo() {
  const steps = [
    { id: 1, label: 'Planning', progress: 100 },
    { id: 2, label: 'Design', progress: 75 },
    { id: 3, label: 'Development', progress: 50 },
    { id: 4, label: 'Testing', progress: 25 },
    { id: 5, label: 'Launch', progress: 0 },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-muted" />
        
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="relative flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Timeline Dot */}
            <motion.div
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10 relative"
              whileHover={{ scale: 1.2 }}
              animate={{
                backgroundColor: step.progress === 100 ? '#10b981' : '#00d9ff',
              }}
            >
              {step.id}
            </motion.div>
            
            {/* Step Content */}
            <div className="flex-1">
              <h4 className="font-semibold mb-2">{step.label}</h4>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${step.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{step.progress}% Complete</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

