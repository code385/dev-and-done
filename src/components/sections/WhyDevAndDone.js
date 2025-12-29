'use client';

import Section from '../ui/Section';
import Card from '../ui/Card';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Founder-Led Development',
    description: 'Direct access to the founder ensures your vision is understood and executed with precision.',
    icon: '👨‍💻',
  },
  {
    title: 'Modern Stack',
    description: 'We use the latest technologies and best practices to build future-proof applications.',
    icon: '⚡',
  },
  {
    title: 'Clean Architecture',
    description: 'Maintainable, scalable code that grows with your business and stands the test of time.',
    icon: '🏗️',
  },
  {
    title: 'Long-Term Partnership',
    description: 'We\'re not just contractors—we\'re your technology partners committed to your success.',
    icon: '🤝',
  },
];

export default function WhyDevAndDone() {
  return (
    <Section id="why-devanddone" className="bg-muted/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why DevAndDone</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're not a normal dev agency. Our approach combines technical excellence with business understanding.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

