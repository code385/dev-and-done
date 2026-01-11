'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';
import Button from './Button';
import Link from 'next/link';
import { Sparkles, Calculator, Code2, ArrowRight, Zap, TrendingUp } from 'lucide-react';

export default function SpotlightModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const scheduleShow = (callback) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 2000 });
      } else {
        setTimeout(callback, 2000);
      }
    };
    
    // Check if modal has been shown before in this session
    try {
      const hasShown = sessionStorage.getItem('spotlightModalShown');
      if (!hasShown) {
        // Wait for page to be interactive before showing modal
        scheduleShow(() => {
          setIsOpen(true);
          try {
            sessionStorage.setItem('spotlightModalShown', 'true');
          } catch (e) {
            // Ignore storage errors (e.g., private browsing)
            if (process.env.NODE_ENV === 'development') {
              console.warn('Could not save to sessionStorage:', e);
            }
          }
        });
      }
    } catch (e) {
      // Ignore storage errors (e.g., private browsing mode)
      if (process.env.NODE_ENV === 'development') {
        console.warn('Could not access sessionStorage:', e);
      }
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Memoize features to prevent re-creation on every render
  const features = useMemo(() => [
    {
      icon: Calculator,
      title: 'Project Estimator',
      description: 'Get instant AI-powered estimates for your project timeline and budget. Answer a few questions and receive a detailed breakdown.',
      href: '/estimator',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      iconBg: 'bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20',
      iconBorder: 'border-blue-500/30',
      badge: 'AI-Powered',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      stat: '2 min',
      statLabel: 'Quick Estimate',
    },
    {
      icon: Code2,
      title: 'Tech Playground',
      description: 'Explore 200+ interactive demos and see them in action on realistic landing pages. Perfect for inspiration and testing.',
      href: '/playground',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      iconBg: 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20',
      iconBorder: 'border-purple-500/30',
      badge: 'Interactive',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      stat: '200+',
      statLabel: 'Demos',
    },
  ], []);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      showCloseButton={true}
    >
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary rounded-full blur-3xl" />
          </div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="relative z-10">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10 px-4 sm:px-6">
            {/* Animated Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 20,
                duration: 0.6
              }}
              className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-2xl shadow-primary/30 border border-primary/20">
                <Sparkles className="text-white w-10 h-10 sm:w-12 sm:h-12" strokeWidth={2.5} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent leading-tight"
            >
              Welcome to DevAndDone
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
            >
              Discover powerful tools that help you bring your digital ideas to life
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.href}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: 0.4 + index * 0.15,
                    type: 'spring',
                    stiffness: 100
                  }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Link 
                    href={feature.href} 
                    onClick={handleClose}
                    className="block h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
                  >
                    <div className="relative h-full p-6 sm:p-7 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 overflow-hidden group-hover:shadow-xl group-hover:shadow-primary/10">
                      {/* Hover Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      {/* Animated Border Glow */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`} />
                      
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Top Section - Badge & Icon */}
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-3">
                            {/* Icon Container */}
                            <div className={`relative p-3 rounded-xl ${feature.iconBg} border ${feature.iconBorder} group-hover:scale-110 transition-transform duration-300`}>
                              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300`} />
                              <IconComponent className={`relative w-6 h-6 sm:w-7 sm:h-7 text-transparent bg-gradient-to-br ${feature.gradient} bg-clip-text`} />
                            </div>
                            <div>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${feature.badgeColor}`}>
                                {feature.badge}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                        </div>

                        {/* Content */}
                        <div className="grow">
                          <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                            {feature.description}
                          </p>
                        </div>

                        {/* Bottom Section - Stats & CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">{feature.stat}</span>
                            <span>{feature.statLabel}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                          >
                            Explore
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>These features are always available in the navigation</span>
            </div>
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-sm hover:text-foreground"
            >
              Continue Browsing
            </Button>
          </motion.div>
        </div>
      </div>
    </Modal>
  );
}
