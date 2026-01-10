import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const t = await getTranslations({ locale, namespace: 'nav' });

  return {
    title: 'Tech Playground | DevAndDone',
    description: 'Experience Lab - Select interactive demos and apply them to a realistic landing page preview. Explore our technology playground and interactive demos.',
    keywords: ['tech playground', 'interactive demos', 'experience lab', 'web development tools', 'UI/UX demos'],
    openGraph: {
      title: 'Tech Playground | DevAndDone',
      description: 'Experience Lab - Select interactive demos and apply them to a realistic landing page preview.',
      url: `${baseUrl}/${locale}/playground`,
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
      title: 'Tech Playground | DevAndDone',
      description: 'Experience Lab - Interactive demos and landing page previews.',
      images: [`${baseUrl}/logo.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/playground`,
    },
  };
}

export default function PlaygroundLayout({ children }) {
  return children;
}

