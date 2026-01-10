// SEO utility functions

export function generatePageMetadata({ title, description, path = '' }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}${path}`;

  return {
    title: title ? `${title} | DevAndDone` : 'DevAndDone - Premium Development Agency',
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'DevAndDone',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 512,
          height: 512,
          alt: 'DevAndDone Logo',
          type: 'image/png',
        },
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title || 'DevAndDone',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/logo.png`, `${baseUrl}/og-image.jpg`],
    },
  };
}

export function generateStructuredData(type, data) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const schemas = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'DevAndDone',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: process.env.CONTACT_EMAIL || 'info@devanddone.com',
      },
    },
    service: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: data.serviceType,
      provider: {
        '@type': 'Organization',
        name: 'DevAndDone',
      },
      areaServed: 'Worldwide',
      ...data,
    },
  };

  return schemas[type] || null;
}

