'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import Button from './Button';
import Link from 'next/link';
import { Sparkles, Calculator, Code2 } from 'lucide-react';

export default function SpotlightModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if modal has been shown before in this session
    const hasShown = sessionStorage.getItem('spotlightModalShown');
    if (!hasShown) {
      // Small delay to let page load
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('spotlightModalShown', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const features = [
    {
      icon: Calculator,
      title: 'Project Estimator',
      description: 'Get instant estimates for your project timeline and budget. Answer a few questions and receive a detailed breakdown.',
      href: '/estimator',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Code2,
      title: 'Tech Playground',
      description: 'Explore 200+ interactive demos and see them in action on realistic landing pages. Perfect for inspiration and testing.',
      href: '/playground',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="lg"
      showCloseButton={true}
    >
      <div className="text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto w-20 h-20 mb-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
        >
          <Sparkles className="text-white" size={40} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Discover Our Spotlight Features
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-8 text-lg"
        >
          Experience the power of our cutting-edge tools designed to help you bring your ideas to life
        </motion.p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="relative group"
              >
                <div className="p-6 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="text-white" size={28} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {feature.description}
                  </p>

                  {/* CTA */}
                  <Link href={feature.href} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Try Now →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Close Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            Maybe Later
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}

