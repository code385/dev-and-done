'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * Static Landing Page Scaffold
 * This structure NEVER changes - demos are applied via data attributes
 */
export default function StaticScaffold() {
  const [email, setEmail] = useState('');

  return (
    <div className="w-full bg-background">
      {/* Navbar */}
      <nav className="relative z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TechFlow
          </div>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition">
              About
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition">
              Contact
            </a>
            <button className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Background demos apply here */}
      <section 
        data-preview-hero
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20"
      >
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Typography demos apply to this heading */}
          <h1 
            data-preview-text
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6"
          >
            Build Better Products
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Faster Than Ever
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            The all-in-one platform for modern teams. Ship features faster, collaborate better, and scale effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto bg-background/90 backdrop-blur-sm rounded-lg p-2 border border-border">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 sm:px-4 py-2 bg-transparent border-none outline-none text-sm flex-1 sm:flex-none"
              />
              {/* Hover demos apply to this button */}
              <button 
                data-preview-button
                className="px-4 sm:px-6 py-2 bg-primary text-background rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Content Section 1 */}
      <section 
        data-preview-section="1"
        id="features" 
        className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Everything you need to succeed</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Powerful features that scale with your business</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Built for speed and performance' },
              { icon: '🔒', title: 'Secure by Default', desc: 'Enterprise-grade security' },
              { icon: '📈', title: 'Scale Infinitely', desc: 'Grows with your business' },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section 2 */}
      <section 
        data-preview-section="2"
        className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">How it works</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Simple steps to get started</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your account in seconds' },
              { step: '02', title: 'Configure', desc: 'Set up your workspace' },
              { step: '03', title: 'Launch', desc: 'Start building amazing products' },
            ].map((item, i) => (
              <div key={i} className="bg-muted/50 rounded-xl p-6">
                <div className="text-3xl font-bold text-primary mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-primary/10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to get started?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
            Join thousands of teams already using TechFlow
          </p>
          <button 
            data-preview-button
            className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-background rounded-lg font-semibold text-base sm:text-lg shadow-lg"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}

