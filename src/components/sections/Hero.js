'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '../ui/Button';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Lazy load 3D component for better performance
const HeroBackground = dynamic(() => import('../three/HeroBackground'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background" />,
});

const headlineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const headline = "We Build Next-Generation Digital Products";
  const words = headline.split(' ');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={headlineVariants}
          className="text-center"
        >
          <motion.h1
            variants={headlineVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className="inline-block mr-3"
              >
                {index === 1 && (
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {word}{' '}
                  </span>
                )}
                {index !== 1 && `${word} `}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            Premium development agency specializing in AI-powered web apps, 
            mobile applications, and custom software solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Start Your Project
              </Button>
            </Link>
            <Link href="/book-service">
              <Button variant="primary" size="lg" className="!bg-gradient-to-r !from-purple-500 !to-pink-500 hover:!from-purple-600 hover:!to-pink-600 border-0">
                Book a Free Consultation
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg">
                Our Services
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block"
            >
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

