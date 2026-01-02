import Hero from '@/components/sections/Hero';
import TrustSignals from '@/components/sections/TrustSignals';
import WhatWeBuild from '@/components/sections/WhatWeBuild';
import WhyDevAndDone from '@/components/sections/WhyDevAndDone';
import FounderBooks from '@/components/sections/FounderBooks';
import FounderBlogs from '@/components/sections/FounderBlogs';
import SpotlightModal from '@/components/ui/SpotlightModal';

export const metadata = {
  title: 'Home',
  description: 'DevAndDone - Premium development agency building next-generation web apps, mobile apps, and AI solutions.',
};

export default function Home() {
  return (
    <>
      <SpotlightModal />
      <Hero />
      <TrustSignals />
      <WhatWeBuild />
      <WhyDevAndDone />
      <FounderBooks />
      <FounderBlogs />
    </>
  );
}
