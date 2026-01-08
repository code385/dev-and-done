import Hero from '@/components/sections/Hero';
import TrustSignals from '@/components/sections/TrustSignals';
import WhatWeBuild from '@/components/sections/WhatWeBuild';
import WhyDevAndDone from '@/components/sections/WhyDevAndDone';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FounderBooks from '@/components/sections/FounderBooks';
import FounderBlogs from '@/components/sections/FounderBlogs';
import SpotlightModal from '@/components/ui/SpotlightModal';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Home() {
  return (
    <>
      <SpotlightModal />
      <Hero />
      <TrustSignals />
      <WhatWeBuild />
      <WhyDevAndDone />
      <TestimonialsSection featured limit={6} />
      <FounderBooks />
      <FounderBlogs />
    </>
  );
}

