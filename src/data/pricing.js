export const pricingPackages = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small projects and MVPs',
    price: 'Starting at $2,500',
    features: [
      'Up to 5 pages',
      'Responsive design',
      'Basic SEO optimization',
      'Contact form',
      '1 month support',
      'Basic analytics',
    ],
    popular: false,
    cta: 'Get Started',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing businesses',
    price: 'Starting at $7,500',
    features: [
      'Up to 15 pages',
      'Custom design',
      'Advanced SEO',
      'Content management',
      '3 months support',
      'Advanced analytics',
      'Performance optimization',
      'Security features',
    ],
    popular: true,
    cta: 'Get Started',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large-scale applications',
    price: 'Custom Pricing',
    features: [
      'Unlimited pages',
      'Fully custom solution',
      'Enterprise SEO',
      'Custom integrations',
      '6+ months support',
      'Dedicated account manager',
      'Priority support',
      'Custom SLA',
      'Training & documentation',
    ],
    popular: false,
    cta: 'Contact Sales',
  },
];

export const servicePricing = {
  'web-development': {
    starter: { min: 2500, max: 5000 },
    professional: { min: 7500, max: 15000 },
    enterprise: { min: 20000, max: null },
  },
  'mobile-development': {
    starter: { min: 5000, max: 10000 },
    professional: { min: 15000, max: 30000 },
    enterprise: { min: 40000, max: null },
  },
  'ai-solutions': {
    starter: { min: 3000, max: 8000 },
    professional: { min: 10000, max: 25000 },
    enterprise: { min: 30000, max: null },
  },
  'ui-ux-engineering': {
    starter: { min: 2000, max: 5000 },
    professional: { min: 6000, max: 12000 },
    enterprise: { min: 15000, max: null },
  },
  'maintenance-scaling': {
    starter: { min: 500, max: 1500 },
    professional: { min: 2000, max: 5000 },
    enterprise: { min: 8000, max: null },
  },
};

