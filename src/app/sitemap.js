import { routing } from '@/i18n/routing';

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

  // Generate sitemap entries for each locale
  const sitemapEntries = [];
  
  routing.locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = locale === routing.defaultLocale 
        ? `${baseUrl}${route === '' ? '' : `/${locale}${route}`}`
        : `${baseUrl}/${locale}${route === '' ? '' : route}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1.0 : 0.8,
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

