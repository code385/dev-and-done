// Demo Factory - Helper functions for demo management
// Note: We're using direct imports in LandingPagePreview.js for better performance
// This file contains utility functions for demo management

// Get appropriate landing template based on demo category
export const getTemplateForDemo = (demoId) => {
  // Map demos to templates based on their nature
  if (demoId.includes('background') || demoId.includes('parallax') || demoId.includes('gradient') || 
      demoId.includes('particle') || demoId.includes('starfield') || demoId.includes('aurora') ||
      demoId.includes('firefly') || demoId.includes('liquid') || demoId.includes('flow')) {
    return 'saas'; // Background effects work great for SaaS
  }
  if (demoId.includes('hover') || demoId.includes('interactive') || demoId.includes('magnetic') ||
      demoId.includes('scale') || demoId.includes('glow') || demoId.includes('pulse') ||
      demoId.includes('tilt') || demoId.includes('cursor')) {
    return 'ecommerce'; // Interactive demos work well for e-commerce
  }
  if (demoId.includes('typography') || demoId.includes('text') || demoId.includes('typewriter') ||
      demoId.includes('glitch') || demoId.includes('letter') || demoId.includes('word')) {
    return 'portfolio'; // Typography demos work well for portfolios
  }
  // Default to SaaS
  return 'saas';
};

