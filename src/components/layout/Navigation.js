'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Button from '../ui/Button';
import { services } from '@/data/services';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [writingDropdownOpen, setWritingDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [experimentLabDropdownOpen, setExperimentLabDropdownOpen] = useState(false);
  const writingRef = useRef(null);
  const servicesRef = useRef(null);
  const experimentLabRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (writingRef.current && !writingRef.current.contains(event.target)) {
        setWritingDropdownOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
      if (experimentLabRef.current && !experimentLabRef.current.contains(event.target)) {
        setExperimentLabDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/work', label: 'What We’ve Built' },
    { href: '/about', label: 'Who we are' },
    // { href: '/contact', label: 'Build With Us' },
  ];

  const writingOptions = [
    { href: '/books', label: 'Books' },
    { href: '/blogs', label: 'Blogs' },
  ];

  const experimentLabOptions = [
    { href: '/playground', label: 'Tech Playground' },
    { href: '/estimator', label: 'Project Estimator' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center justify-center h-12 w-32 md:h-14 md:w-40 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full h-full">
              {/* Default Logo (1st image) - moves to left and merges with 2nd image's D */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  x: isHovered ? -40 : 0,
                  opacity: isHovered ? 0 : 1,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Image
                  src="/D.png"
                  alt="DevAndDone Logo"
                  width={160}
                  height={56}
                  className="h-full w-auto object-contain"
                  priority
                />
              </motion.div>

              {/* Hover Logo (2nd image) - fades in as 1st image moves */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                  delay: isHovered ? 0.1 : 0,
                }}
              >
                <Image
                  src="/Hovered_logo.png"
                  alt="DevAndDone"
                  width={160}
                  height={56}
                  className="h-full w-auto object-contain"
                />
              </motion.div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded flex items-center gap-1"
              >
                What we offer
                <svg
                  className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                  >
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setServicesDropdownOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{service.icon}</span>
                          <span>{service.title}</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Writing Dropdown */}
            <div className="relative" ref={writingRef}>
              <button
                onClick={() => setWritingDropdownOpen(!writingDropdownOpen)}
                onMouseEnter={() => setWritingDropdownOpen(true)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded flex items-center gap-1"
              >
                Knowledge
                <svg
                  className={`w-4 h-4 transition-transform ${writingDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {writingDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setWritingDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                  >
                    {writingOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setWritingDropdownOpen(false)}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Experiment Lab Dropdown */}
            <div className="relative" ref={experimentLabRef}>
              <button
                onClick={() => setExperimentLabDropdownOpen(!experimentLabDropdownOpen)}
                onMouseEnter={() => setExperimentLabDropdownOpen(true)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded flex items-center gap-1"
              >
                Experiment Lab
                <svg
                  className={`w-4 h-4 transition-transform ${experimentLabDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {experimentLabDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setExperimentLabDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                  >
                    {experimentLabOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setExperimentLabDropdownOpen(false)}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Contact Link after Experiment Lab */}
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Build With Us
            </Link>
            <Link href="/chat">
              <Button variant="primary" size="sm">
                AI Chat
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-base font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Services Dropdown Mobile */}
              <div>
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="w-full flex items-center justify-between text-base font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Services
                  <svg
                    className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {servicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      {services.map((service) => (
                        <Link
                          key={service.id}
                          href={`/services/${service.id}`}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => {
                            setServicesDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span>{service.icon}</span>
                            <span>{service.title}</span>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Writing Dropdown Mobile */}
              <div>
                <button
                  onClick={() => setWritingDropdownOpen(!writingDropdownOpen)}
                  className="w-full flex items-center justify-between text-base font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Writing
                  <svg
                    className={`w-4 h-4 transition-transform ${writingDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {writingDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      {writingOptions.map((option) => (
                        <Link
                          key={option.href}
                          href={option.href}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => {
                            setWritingDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {option.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Experiment Lab Dropdown Mobile */}
              <div>
                <button
                  onClick={() => setExperimentLabDropdownOpen(!experimentLabDropdownOpen)}
                  className="w-full flex items-center justify-between text-base font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Experiment Lab
                  <svg
                    className={`w-4 h-4 transition-transform ${experimentLabDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {experimentLabDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      {experimentLabOptions.map((option) => (
                        <Link
                          key={option.href}
                          href={option.href}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => {
                            setExperimentLabDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {option.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                Build With Us
              </Link>
              <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  AI Chat
                </Button>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

