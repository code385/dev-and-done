'use client';

import { useState, useEffect, useRef } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Button from '../ui/Button';
import SearchBar from '../ui/SearchBar';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { services } from '@/data/services';

export default function Navigation() {
  const t = useTranslations('nav');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [writingDropdownOpen, setWritingDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [experimentLabDropdownOpen, setExperimentLabDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const writingRef = useRef(null);
  const servicesRef = useRef(null);
  const experimentLabRef = useRef(null);
  const searchRef = useRef(null);

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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: t('overview') },
    { href: '/work', label: t('whatWeBuilt') },
    { href: '/about', label: t('whoWeAre') },
  ];

  const writingOptions = [
    { href: '/books', label: t('books') },
    { href: '/blogs', label: t('blogs') },
  ];

  const experimentLabOptions = [
    { href: '/playground', label: t('techPlayground') },
    { href: '/estimator', label: t('projectEstimator') },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
              className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                  ? 'bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm' 
                  : 'bg-background/80 backdrop-blur-sm'
              }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center justify-center h-14 w-40 flex-shrink-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full h-full flex items-center justify-center">
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
                  unoptimized
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
                  unoptimized
                />
              </motion.div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                {t('services')}
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
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.id}`}
                            onClick={() => setServicesDropdownOpen(false)}
                            className="group relative p-4 rounded-xl hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20"
                          >
                            <div className="flex flex-col">
                              <div className="text-3xl mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                {service.icon}
                              </div>
                              <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                                {service.title}
                              </h3>
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Writing Dropdown */}
            <div className="relative" ref={writingRef}>
              <button
                onClick={() => setWritingDropdownOpen(!writingDropdownOpen)}
                onMouseEnter={() => setWritingDropdownOpen(true)}
                className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                {t('knowledge')}
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
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setWritingDropdownOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[400px] bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {writingOptions.map((option) => (
                          <Link
                            key={option.href}
                            href={option.href}
                            onClick={() => setWritingDropdownOpen(false)}
                            className="group relative p-4 rounded-xl hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20"
                          >
                            <div className="flex flex-col">
                              <div className="text-3xl mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                {option.href === '/books' ? '📚' : '📝'}
                              </div>
                              <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                                {option.label}
                              </h3>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {option.href === '/books' 
                                  ? 'Explore our collection of books and resources'
                                  : 'Read our latest blog posts and articles'}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Experiment Lab Dropdown */}
            <div className="relative" ref={experimentLabRef}>
              <button
                onClick={() => setExperimentLabDropdownOpen(!experimentLabDropdownOpen)}
                onMouseEnter={() => setExperimentLabDropdownOpen(true)}
                className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                {t('experimentLab')}
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
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setExperimentLabDropdownOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[400px] bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {experimentLabOptions.map((option) => (
                          <Link
                            key={option.href}
                            href={option.href}
                            onClick={() => setExperimentLabDropdownOpen(false)}
                            className="group relative p-4 rounded-xl hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20"
                          >
                            <div className="flex flex-col">
                              <div className="text-3xl mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                {option.href === '/playground' ? '🧪' : '📊'}
                              </div>
                              <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                                {option.label}
                              </h3>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {option.href === '/playground'
                                  ? 'Interactive tech demos and experiments'
                                  : 'Estimate your project timeline and cost'}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Contact Link after Experiment Lab */}
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors whitespace-nowrap"
            >
              {t('buildWithUs')}
            </Link>
            
            {/* Right side: Search, Language, CTA */}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border/50">
              {/* Search Icon - Expandable */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchExpanded(!searchExpanded)}
                  className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {searchExpanded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-80 z-50"
                    >
                      <SearchBar variant="default" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <LanguageSwitcher />
              
              <Link href="/chat">
                <Button variant="primary" size="sm" className="whitespace-nowrap">
                  {t('aiChat')}
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button & Actions */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setSearchExpanded(!searchExpanded)}
              className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              className="p-2 text-foreground"
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
        
        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {searchExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden px-4 py-4 border-t border-border bg-background/95 backdrop-blur-md"
            >
              <SearchBar variant="default" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

              {/* Services Dropdown Mobile */}
              <div>
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="w-full flex items-center justify-between text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2"
                >
                  {t('services')}
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
                  className="w-full flex items-center justify-between text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2"
                >
                  {t('writing')}
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
                  className="w-full flex items-center justify-between text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2"
                >
                  {t('experimentLab')}
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
                className="block text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2"
              >
                {t('buildWithUs')}
              </Link>
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
              <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  {t('aiChat')}
                </Button>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

