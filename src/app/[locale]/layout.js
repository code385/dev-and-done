import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ToastProvider from "@/components/ui/ToastProvider";
import AnalyticsWrapper from "@/components/ui/AnalyticsWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    title: {
      default: "DevAndDone - Premium Development Agency | AI-Powered Solutions",
      template: "%s | DevAndDone",
    },
    description: "Next-generation development agency building premium web apps, mobile apps, and AI solutions. Founder-led, modern stack, clean architecture.",
    keywords: ["web development", "mobile app development", "AI solutions", "custom software", "Next.js", "React", "premium development"],
    authors: [{ name: "DevAndDone" }],
    creator: "DevAndDone",
    publisher: "DevAndDone",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${baseUrl}/${loc}`])
      ),
    },
    openGraph: {
      type: "website",
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'fr' ? 'fr_FR' : 'ar_SA',
      url: `${baseUrl}/${locale}`,
      siteName: "DevAndDone",
      title: "DevAndDone - Premium Development Agency",
      description: "Next-generation development agency building premium web apps, mobile apps, and AI solutions.",
      images: [
        {
          url: "/logo.png",
          width: 512,
          height: 512,
          alt: "DevAndDone Logo",
          type: "image/png",
        },
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "DevAndDone - Premium Development Agency",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "DevAndDone - Premium Development Agency",
      description: "Next-generation development agency building premium web apps, mobile apps, and AI solutions.",
      images: ["/logo.png", "/og-image.jpg"],
      creator: "@devanddone",
      site: "@devanddone",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: '/icon.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [
        { url: '/icon.png', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: '/icon.png',
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Determine if RTL
  const isRTL = locale === 'ar';

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <ToastProvider />
        <AnalyticsWrapper>
          <Navigation />
          <main className={`min-h-screen pt-16 md:pt-20 ${isRTL ? 'rtl' : 'ltr'}`}>
            {children}
          </main>
          <Footer />
        </AnalyticsWrapper>
        <ScrollToTop />
        <WhatsAppButton />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

