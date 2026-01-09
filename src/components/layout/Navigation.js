'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronDown, Globe } from 'lucide-react';
import Image from 'next/image';
import Button from '../ui/Button';
import SearchBar from '../ui/SearchBar';
import { services } from '@/data/services';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  
  // Refs for click outside detection
  const moreRef = useRef(null);
  const servicesRef = useRef(null);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const languageRef = useRef(null);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      
      const isClickInside = (ref) => {
        if (!ref.current) return false;
        return ref.current.contains(target);
      };
      
      const isDropdownButton = target.closest?.('button[data-dropdown-button]');
      if (isDropdownButton) {
        return;
      }
      
      if (openDropdown === 'more' && !isClickInside(moreRef)) {
        setOpenDropdown(null);
      } else if (openDropdown === 'services' && !isClickInside(servicesRef)) {
        setOpenDropdown(null);
      }
      
      if (searchExpanded && !isClickInside(searchRef)) {
        setSearchExpanded(false);
      }
      
      if (languageDropdownOpen && !isClickInside(languageRef)) {
        setLanguageDropdownOpen(false);
      }
      
      if (isMobileMenuOpen && !isClickInside(mobileMenuRef) && !target.closest?.('button[aria-label="Toggle menu"]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, [openDropdown, searchExpanded, languageDropdownOpen, isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setSearchExpanded(false);
        setIsMobileMenuOpen(false);
        setLanguageDropdownOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleDropdown = useCallback((dropdown) => {
    setOpenDropdown(prev => prev === dropdown ? null : dropdown);
  }, []);

  const handleLanguageChange = (newLocale) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
      setLanguageDropdownOpen(false);
    }
  };

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  // Top-level navigation links
  const topNavLinks = [
    { href: '/', label: t('overview') },
    { href: '/work', label: t('whatWeBuilt') },
  ];

  // Services dropdown options
  const servicesOptions = services.map(s => ({ 
    href: `/services/${s.id}`, 
    label: s.title, 
    icon: s.icon, 
    description: s.description 
  }));

  // "More" dropdown options
  const moreOptions = [
    { href: '/about', label: t('whoWeAre'), icon: '👥', description: 'Learn about our team and mission' },
    { href: '/pricing', label: t('pricing'), icon: '💰', description: 'Transparent pricing plans' },
    { href: '/process', label: t('process'), icon: '⚙️', description: 'How we work and deliver' },
    { href: '/faq', label: t('faq'), icon: '❓', description: 'Frequently asked questions' },
    { href: '/books', label: t('books'), icon: '📚', description: 'Explore our books and resources' },
    { href: '/blogs', label: t('blogs'), icon: '📝', description: 'Read our latest blog posts' },
    { href: '/playground', label: t('techPlayground'), icon: '🧪', description: 'Interactive tech demos' },
    { href: '/estimator', label: t('projectEstimator'), icon: '📊', description: 'Estimate project cost' },
  ];

  // Dropdown component
  const DropdownMenu = ({ 
    id, 
    label, 
    options, 
    dropdownRef, 
    isWide = false 
  }) => {
    const isOpen = openDropdown === id;
    
    return (
      <div className="relative" ref={dropdownRef} data-dropdown-container={id}>
        <button
          data-dropdown-button={id}
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(id);
          }}
          onMouseEnter={() => {
            if (window.innerWidth >= 1280) {
              setOpenDropdown(id);
            }
          }}
          className="text-sm xl:text-base font-medium text-foreground/90 hover:text-primary transition-colors flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-lg hover:bg-muted/50"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {label}
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              onMouseLeave={() => {
                if (window.innerWidth >= 1280) {
                  setOpenDropdown(null);
                }
              }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] bg-background border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden"
              role="menu"
            >
              <div className="p-4 xl:p-6">
                <div className={`grid ${isWide ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                  {options.map((option) => (
                    <Link
                      key={option.href}
                      href={option.href}
                      onClick={() => setOpenDropdown(null)}
                      className="group relative p-4 rounded-xl hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      role="menuitem"
                    >
                      <div className="flex items-start gap-4">
                        {option.icon && (
                          <div className="text-2xl xl:text-3xl opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            {option.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {option.label}
                          </h3>
                          {option.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-6">
          {/* Logo - Preserved Animation */}
          <Link
            href="/"
            className="relative flex items-center justify-center h-10 w-28 sm:h-12 sm:w-36 xl:h-14 xl:w-40 2xl:h-16 2xl:w-44 flex-shrink-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="DevAndDone Home"
          >
            <div className="relative w-full h-full flex items-center justify-center overflow-visible">
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

          {/* Desktop Navigation - Top Level Only */}
          <nav 
            className="hidden xl:flex items-center gap-1 2xl:gap-2 flex-1 justify-center min-w-0" 
            aria-label="Desktop navigation"
          >
            {topNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm xl:text-base font-medium text-foreground/90 hover:text-primary transition-colors whitespace-nowrap px-4 py-2 rounded-lg hover:bg-muted/50"
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <DropdownMenu
              id="services"
              label={t('services')}
              options={servicesOptions}
              dropdownRef={servicesRef}
              isWide={true}
            />

            {/* More Dropdown */}
            <DropdownMenu
              id="more"
              label="More"
              options={moreOptions}
              dropdownRef={moreRef}
              isWide={true}
            />
          </nav>

          {/* Right Side Actions - Desktop */}
          <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchExpanded(!searchExpanded)}
                className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Search"
                aria-expanded={searchExpanded}
              >
                <Search className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {searchExpanded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 z-50"
                  >
                    <SearchBar variant="default" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Language Switcher - Icon Only */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                onMouseEnter={() => {
                  if (window.innerWidth >= 1280) {
                    setLanguageDropdownOpen(true);
                  }
                }}
                className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Change language"
                aria-expanded={languageDropdownOpen}
              >
                <Globe className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {languageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 1280) {
                        setLanguageDropdownOpen(false);
                      }
                    }}
                    className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden"
                  >
                    <div className="py-1">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageChange(language.code)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            locale === language.code
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground hover:bg-muted/50'
                          }`}
                        >
                          <span className="text-xl">{language.flag}</span>
                          <span className="flex-1 text-left">{language.name}</span>
                          {locale === language.code && (
                            <span className="text-primary">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* AI Chat - Secondary CTA (Outline Style) */}
            <Link href="/chat">
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap text-sm xl:text-base px-4 xl:px-5 py-2 border-foreground/20 hover:border-primary/50 hover:bg-primary/5"
              >
                {t('aiChat')}
              </Button>
            </Link>
            
            {/* Build With Us - Primary CTA */}
            <Link href="/contact">
              <Button 
                variant="primary" 
                size="sm" 
                className="whitespace-nowrap text-sm xl:text-base px-5 xl:px-7 py-2.5 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {t('buildWithUs')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setSearchExpanded(!searchExpanded)}
              className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {searchExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden px-4 py-4 border-t border-border bg-background/95 backdrop-blur-md"
            >
              <SearchBar variant="default" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden bg-background/95 backdrop-blur-md border-t border-border overflow-hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-6 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Top Level Links */}
              {topNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-base font-medium text-foreground/90 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Services Dropdown Mobile */}
              <div>
                <button
                  onClick={() => toggleDropdown('services')}
                  className="w-full flex items-center justify-between text-base font-medium text-foreground/90 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted/50"
                  aria-expanded={openDropdown === 'services'}
                >
                  {t('services')}
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'services' ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openDropdown === 'services' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 mt-1 space-y-1 overflow-hidden"
                    >
                      {servicesOptions.map((option) => (
                        <Link
                          key={option.href}
                          href={option.href}
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-muted/50"
                          onClick={() => {
                            setOpenDropdown(null);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {option.icon && <span className="text-xl">{option.icon}</span>}
                          <span>{option.label}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* More Dropdown Mobile */}
              <div>
                <button
                  onClick={() => toggleDropdown('more')}
                  className="w-full flex items-center justify-between text-base font-medium text-foreground/90 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted/50"
                  aria-expanded={openDropdown === 'more'}
                >
                  More
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'more' ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openDropdown === 'more' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 mt-1 space-y-1 overflow-hidden"
                    >
                      {moreOptions.map((option) => (
                        <Link
                          key={option.href}
                          href={option.href}
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-muted/50"
                          onClick={() => {
                            setOpenDropdown(null);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {option.icon && <span className="text-xl">{option.icon}</span>}
                          <span>{option.label}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Language Switcher Mobile */}
              <div className="pt-2 px-4">
                <div className="flex items-center gap-3 px-4 py-2">
                  <Globe className="w-5 h-5 text-foreground/70" />
                  <span className="text-sm font-medium text-foreground/90">Language</span>
                </div>
                <div className="pl-4 mt-2 space-y-1">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        handleLanguageChange(language.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                        locale === language.code
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-xl">{language.flag}</span>
                      <span className="flex-1 text-left">{language.name}</span>
                      {locale === language.code && (
                        <span className="text-primary">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Chat - Secondary Mobile */}
              <div className="pt-2 px-4">
                <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <Button variant="outline" size="md" className="w-full">
                    {t('aiChat')}
                  </Button>
                </Link>
              </div>

              {/* Build With Us - Primary CTA Mobile */}
              <div className="pt-2 px-4">
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <Button variant="primary" size="md" className="w-full font-semibold">
                    {t('buildWithUs')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
