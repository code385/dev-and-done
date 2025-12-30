'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import Button from './Button';
import Link from 'next/link';
import { Sparkles, Calculator, Code2, ArrowRight, X } from 'lucide-react';

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
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGradient: 'from-blue-500/10 via-cyan-500/10 to-teal-500/10',
      badge: 'AI-Powered',
    },
    {
      icon: Code2,
      title: 'Tech Playground',
      description: 'Explore 200+ interactive demos and see them in action on realistic landing pages. Perfect for inspiration and testing.',
      href: '/playground',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      bgGradient: 'from-purple-500/10 via-pink-500/10 to-rose-500/10',
      badge: 'Interactive',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="xl"
      showCloseButton={true}
    >
      <div className="relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10 px-2 sm:px-4">
            {/* Icon with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                type: 'spring', 
                stiffness: 200,
                damping: 15
              }}
              className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <Sparkles className="text-white w-8 h-8 sm:w-10 sm:h-10" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight px-2"
            >
              Discover Our Spotlight Features
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2"
            >
              Experience the power of our cutting-edge tools designed to help you bring your ideas to life
            </motion.p>
          </div>

          {/* Features Grid - Fully Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.href}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.5 + index * 0.15,
                    type: 'spring',
                    stiffness: 100
                  }}
                  whileHover={{ y: -4 }}
                  className="relative group"
                >
                  <Link 
                    href={feature.href} 
                    onClick={() => setIsOpen(false)}
                    className="block h-full"
                  >
                    <div className={`
                      relative p-5 sm:p-6 md:p-7 
                      rounded-2xl 
                      border border-border/50 
                      bg-gradient-to-br ${feature.bgGradient}
                      backdrop-blur-sm
                      hover:border-primary/50 
                      transition-all duration-300 
                      h-full 
                      flex flex-col
                      overflow-hidden
                      shadow-lg hover:shadow-xl hover:shadow-primary/10
                      group-hover:scale-[1.02]
                    `}>
                      {/* Animated Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {feature.badge}
                          </span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                        {/* Icon */}
                        <div className={`
                          w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                          rounded-xl sm:rounded-2xl
                          bg-gradient-to-br ${feature.gradient}
                          flex items-center justify-center 
                          mb-4 sm:mb-5
                          group-hover:scale-110 group-hover:rotate-3
                          transition-all duration-300
                          shadow-lg shadow-primary/20
                        `}>
                          <IconComponent className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 flex-grow leading-relaxed">
                          {feature.description}
                        </p>

                        {/* CTA Button */}
                        <div className="mt-auto">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full sm:w-auto group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                          >
                            <span className="flex items-center justify-center gap-2">
                              Explore Now
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </Button>
                        </div>
                      </div>

                      {/* Shine Effect on Hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/50"
          >
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-sm sm:text-base text-muted-foreground hover:text-foreground w-full sm:w-auto"
            >
              Maybe Later
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground/70 text-center sm:text-left">
              You can access these features anytime from the navigation menu
            </p>
          </motion.div>
        </div>
      </div>
    </Modal>
  );
}

