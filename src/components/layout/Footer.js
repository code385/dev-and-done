'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isHovered, setIsHovered] = useState(false);

  const footerLinks = {
    company: [
      { href: '/about', label: 'About Us' },
      { href: '/services', label: 'Services' },
      { href: '/work', label: 'Work' },
      { href: '/contact', label: 'Contact' },
    ],
    resources: [
      { href: '/chat', label: 'AI Chat' },
      { href: '/estimator', label: 'Project Estimator' },
      { href: '/playground', label: 'Tech Playground' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/admin/login', label: 'Admin Login' },
    ],
  };

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link 
              href="/" 
              className="relative flex items-center justify-center h-12 w-32 md:h-14 md:w-40 mb-4 overflow-hidden"
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
            <p className="text-sm text-muted-foreground mb-4">
              Premium development agency building next-generation web and mobile applications.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Links - Placeholder */}
              <a
                href="https://twitter.com/devanddone"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/devanddone"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="max-w-md">
            <h3 className="text-sm font-semibold text-foreground mb-2">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} DevAndDone. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Built with Next.js, React, and AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

