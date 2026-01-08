'use client';

import { motion } from 'framer-motion';
import Card from './Card';

export default function ProcessStep({ step, index, isLast }) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <Card hover className="relative">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-3xl">
                {step.icon}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-primary">Step {step.step}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{step.duration}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              {step.deliverables && step.deliverables.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Deliverables:</p>
                  <ul className="space-y-1">
                    {step.deliverables.map((deliverable, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
      {!isLast && (
        <div className="hidden md:block absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-primary to-secondary" />
      )}
    </div>
  );
}

