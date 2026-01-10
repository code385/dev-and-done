import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const t = await getTranslations({ locale, namespace: 'nav' });

  return {
    title: 'Contact Us | DevAndDone',
    description: 'Get in touch with DevAndDone. Contact us via email, WhatsApp, or schedule a consultation. We\'re here to help bring your project to life.',
    keywords: ['contact', 'get in touch', 'consultation', 'web development contact', 'mobile app development contact'],
    openGraph: {
      title: 'Contact Us | DevAndDone',
      description: 'Get in touch with DevAndDone. Contact us via email, WhatsApp, or schedule a consultation.',
      url: `${baseUrl}/${locale}/contact`,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 512,
          height: 512,
          alt: 'DevAndDone Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact Us | DevAndDone',
      description: 'Get in touch with DevAndDone. We\'re here to help bring your project to life.',
      images: [`${baseUrl}/logo.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
    },
  };
}

export default function ContactLayout({ children }) {
  return children;
}

