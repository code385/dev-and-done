'use client';

import { motion } from 'framer-motion';
import ProcessStep from './ProcessStep';

export default function Timeline({ steps }) {
  return (
    <div className="relative">
      <div className="space-y-8">
        {steps.map((step, index) => (
          <ProcessStep
            key={step.step}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

