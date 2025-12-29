export const caseStudies = [
  {
    id: 'ecommerce-platform',
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    category: 'Web Development',
    client: 'RetailTech Startup',
    problem: 'A growing retail startup needed a scalable e-commerce platform to handle increasing traffic and complex product catalogs. Their existing solution was slow, difficult to maintain, and couldn\'t scale with their growth.',
    solution: 'We built a modern e-commerce platform using Next.js with server-side rendering for optimal SEO and performance. Implemented a headless architecture with a flexible CMS, integrated payment processing, and built a custom admin dashboard for inventory management.',
    result: 'The new platform reduced page load times by 70%, increased conversion rates by 35%, and can now handle 10x more traffic. The client saw a 50% reduction in operational costs.',
    metrics: [
      { label: 'Performance Improvement', value: '70%' },
      { label: 'Conversion Rate Increase', value: '35%' },
      { label: 'Traffic Capacity', value: '10x' },
      { label: 'Cost Reduction', value: '50%' },
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Stripe', 'PostgreSQL', 'Vercel'],
    image: '/case-studies/ecommerce.jpg',
    featured: true,
  },
  {
    id: 'ai-chatbot-platform',
    slug: 'ai-chatbot-platform',
    title: 'AI-Powered Customer Support Platform',
    category: 'AI Solutions',
    client: 'SaaS Company',
    problem: 'A SaaS company was struggling with high customer support costs and response times. They needed a solution to handle common inquiries 24/7 while maintaining high-quality support.',
    solution: 'We developed an AI-powered chatbot platform using OpenAI\'s GPT-4, integrated with their existing knowledge base. The system can handle complex queries, escalate to human agents when needed, and learns from interactions to improve over time.',
    result: 'The AI chatbot handles 80% of customer inquiries automatically, reducing support costs by 60% and improving average response time from 2 hours to under 30 seconds. Customer satisfaction scores increased by 25%.',
    metrics: [
      { label: 'Automated Inquiries', value: '80%' },
      { label: 'Cost Reduction', value: '60%' },
      { label: 'Response Time', value: '<30s' },
      { label: 'Satisfaction Increase', value: '25%' },
    ],
    techStack: ['Next.js', 'OpenAI API', 'Python', 'PostgreSQL', 'WebSockets'],
    image: '/case-studies/ai-chatbot.jpg',
    featured: true,
  },
  {
    id: 'fitness-mobile-app',
    slug: 'fitness-mobile-app',
    title: 'Fitness Tracking Mobile App',
    category: 'Mobile Development',
    client: 'Fitness Startup',
    problem: 'A fitness startup wanted to create a mobile app that tracks workouts, nutrition, and progress. They needed both iOS and Android versions with real-time sync and offline capabilities.',
    solution: 'We built a cross-platform mobile app using React Native, ensuring native performance on both platforms. Implemented real-time data sync with cloud storage, offline mode for workouts, and integrated with fitness wearables. Added social features for community engagement.',
    result: 'The app launched on both App Store and Google Play, achieving 50,000+ downloads in the first 3 months. User retention rate is 75% after 30 days, and the app maintains a 4.8-star rating.',
    metrics: [
      { label: 'Downloads (3 months)', value: '50K+' },
      { label: '30-Day Retention', value: '75%' },
      { label: 'App Store Rating', value: '4.8/5' },
      { label: 'Platforms', value: 'iOS & Android' },
    ],
    techStack: ['React Native', 'TypeScript', 'Firebase', 'Redux', 'Expo'],
    image: '/case-studies/fitness-app.jpg',
    featured: false,
  },
  {
    id: 'enterprise-dashboard',
    slug: 'enterprise-dashboard',
    title: 'Enterprise Analytics Dashboard',
    category: 'Custom Software',
    client: 'Enterprise Client',
    problem: 'A large enterprise needed a unified analytics dashboard to consolidate data from multiple systems. Their existing solution was fragmented, slow, and required manual data exports.',
    solution: 'We developed a custom analytics platform that integrates with 10+ data sources, provides real-time dashboards, automated reporting, and advanced data visualization. Built with a microservices architecture for scalability and reliability.',
    result: 'The platform processes millions of data points daily, provides real-time insights, and reduced reporting time from days to minutes. Decision-makers can now access critical metrics instantly.',
    metrics: [
      { label: 'Data Sources Integrated', value: '10+' },
      { label: 'Reporting Time Reduction', value: 'Days → Minutes' },
      { label: 'Data Points Processed', value: 'Millions/day' },
      { label: 'Uptime', value: '99.9%' },
    ],
    techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'GraphQL'],
    image: '/case-studies/dashboard.jpg',
    featured: false,
  },
];

export function getCaseStudyBySlug(slug) {
  return caseStudies.find((study) => study.slug === slug);
}

export function getFeaturedCaseStudies() {
  return caseStudies.filter((study) => study.featured);
}

export function getCaseStudiesByCategory(category) {
  return caseStudies.filter((study) => study.category === category);
}

