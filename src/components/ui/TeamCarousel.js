'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Image from 'next/image';

export default function TeamCarousel({ members }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Auto-rotate carousel (pauses on hover)
  useEffect(() => {
    if (isHovered || !isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % members.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [members.length, isHovered, isAutoRotating]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoRotating(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);
    setIsAutoRotating(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % members.length);
    setIsAutoRotating(false);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="w-full"
              >
                <Card className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar */}
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 ring-2 ring-primary/20 shadow-lg">
                        {members[currentIndex].avatar ? (
                          <Image
                            src={members[currentIndex].avatar}
                            alt={members[currentIndex].name}
                            width={160}
                            height={160}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl md:text-6xl font-bold text-primary">
                              {members[currentIndex].name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">
                          {members[currentIndex].name}
                        </h3>
                        <p className="text-primary font-semibold mb-4 text-lg">
                          {members[currentIndex].role}
                        </p>
                        {members[currentIndex].shortBio && (
                          <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto md:mx-0">
                            {members[currentIndex].shortBio}
                          </p>
                        )}

                        {/* Links */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                          {members[currentIndex].portfolio && (
                            <a
                              href={members[currentIndex].portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                              <span>Portfolio</span>
                            </a>
                          )}
                          {members[currentIndex].linkedin && (
                            <a
                              href={members[currentIndex].linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`${members[currentIndex].name}'s LinkedIn`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                          )}
                          {members[currentIndex].github && (
                            <a
                              href={members[currentIndex].github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`${members[currentIndex].name}'s GitHub`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-md border-2 border-primary/30 rounded-full p-3 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg hover:shadow-xl"
        aria-label="Previous team member"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-md border-2 border-primary/30 rounded-full p-3 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg hover:shadow-xl"
        aria-label="Next team member"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {members.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-primary'
                : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to team member ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
