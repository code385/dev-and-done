'use client';

import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingCard({ package: pkg, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={pkg.popular ? 'md:-mt-4 md:mb-4' : ''}
    >
      <Card
        hover
        className={`h-full relative ${pkg.popular ? 'border-primary border-2 shadow-lg shadow-primary/20' : ''}`}
      >
        {pkg.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-full">
            Most Popular
          </div>
        )}
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
            <p className="text-muted-foreground mb-4">{pkg.description}</p>
            <div className="mb-4">
              <span className="text-4xl font-bold">{pkg.price}</span>
            </div>
          </div>
          <ul className="flex-1 space-y-3 mb-6">
            {pkg.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <Link href="/book-service" className="w-full">
            <Button
              variant={pkg.popular ? 'primary' : 'outline'}
              size="lg"
              className="w-full"
            >
              {pkg.cta}
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

