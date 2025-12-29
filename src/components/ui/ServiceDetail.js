'use client';

import Card from './Card';
import TechStackBadge from './TechStackBadge';
import { motion } from 'framer-motion';

export default function ServiceDetail({ service }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="h-full">
        <div className="text-5xl mb-4">{service.icon}</div>
        <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
        <p className="text-muted-foreground mb-6">{service.longDescription}</p>

        <div className="mb-6">
          <h4 className="font-semibold mb-3">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {service.techStack.map((tech) => (
              <TechStackBadge key={tech} tech={tech} />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-3">Our Process</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            {service.process.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Expected Outcomes</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {service.outcomes.map((outcome, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </motion.div>
  );
}

