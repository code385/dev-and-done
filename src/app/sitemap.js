import { routing } from '@/i18n/routing';

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const routes = [
    { path: '', priority: 1.0, changeFreq: 'weekly' },
    { path: '/work', priority: 0.9, changeFreq: 'weekly' },
    { path: '/chat', priority: 0.9, changeFreq: 'monthly' },
    { path: '/playground', priority: 0.8, changeFreq: 'monthly' },
    { path: '/contact', priority: 0.9, changeFreq: 'monthly' },
    { path: '/services', priority: 0.8, changeFreq: 'monthly' },
    { path: '/about', priority: 0.7, changeFreq: 'monthly' },
    { path: '/estimator', priority: 0.7, changeFreq: 'monthly' },
  ];

  // Generate sitemap entries for each locale
  const sitemapEntries = [];
  
  routing.locales.forEach((locale) => {
    routes.forEach((routeConfig) => {
      const route = routeConfig.path || routeConfig;
      const priority = routeConfig.priority || (route === '' ? 1.0 : 0.8);
      const changeFreq = routeConfig.changeFreq || 'monthly';
      
      const url = locale === routing.defaultLocale 
        ? `${baseUrl}${route === '' ? '' : `/${locale}${route}`}`
        : `${baseUrl}/${locale}${route === '' ? '' : route}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: changeFreq,
        priority: priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((loc) => [
              loc,
              loc === routing.defaultLocale
                ? `${baseUrl}${route === '' ? '' : `/${loc}${route}`}`
                : `${baseUrl}/${loc}${route === '' ? '' : route}`
            ])
          ),
        },
      });
    });
  });

  return sitemapEntries;
}

