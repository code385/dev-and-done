'use client';

import Section from '../ui/Section';
import AnimatedCounter from '../ui/AnimatedCounter';
import { motion } from 'framer-motion';

const stats = [
  {
    label: 'Projects Built',
    value: 50,
    suffix: '+',
    description: 'Successful deployments',
  },
  {
    label: 'Tech Stack',
    value: 25,
    suffix: '+',
    description: 'Modern technologies',
  },
  {
    label: 'Uptime',
    value: 99,
    suffix: '%',
    description: 'System reliability',
  },
  {
    label: 'Client Satisfaction',
    value: 100,
    suffix: '%',
    description: 'Happy clients',
  },
];

export default function TrustSignals() {
  return (
    <Section className="bg-muted/50">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Trusted by Forward-Thinking Companies
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          Real numbers that speak to our commitment to excellence
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="mb-2">
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                className="text-4xl md:text-5xl font-bold text-primary"
              />
            </div>
            <h3 className="text-lg font-semibold mb-1">{stat.label}</h3>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

