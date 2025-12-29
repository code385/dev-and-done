'use client';

import Card from '../ui/Card';
import { motion } from 'framer-motion';

export default function FounderStory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card>
        <h2 className="text-3xl font-bold mb-6">Founder Story</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            DevAndDone was born from a simple observation: too many development agencies 
            treat projects as transactions, not partnerships. As a founder with years of 
            experience building products for startups and enterprises, I saw the gap between 
            what clients needed and what agencies delivered.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            The name "DevAndDone" reflects our philosophy: we don't just develop—we deliver 
            complete, production-ready solutions. Every project is an opportunity to build 
            something exceptional, something that scales, and something that makes a real 
            impact on your business.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Today, DevAndDone combines technical excellence with business understanding. 
            We're not just developers; we're your technology partners, committed to your 
            long-term success.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

