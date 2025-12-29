'use client';

import Card from '../ui/Card';
import { motion } from 'framer-motion';

export default function Vision() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            To be the go-to development partner for forward-thinking companies who refuse 
            to settle for mediocre technology. We envision a world where every business has 
            access to premium, AI-powered solutions that drive real growth.
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To deliver exceptional digital products that exceed expectations. We combine 
            cutting-edge technology with business acumen to build solutions that not only 
            work flawlessly but also drive measurable business outcomes.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

