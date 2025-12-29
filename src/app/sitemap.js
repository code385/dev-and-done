export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const routes = [
    '',
    '/services',
    '/work',
    '/about',
    '/contact',
    '/chat',
    '/estimator',
    '/playground',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}

