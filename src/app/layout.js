import { Comfortaa } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ToastProvider from "@/components/ui/ToastProvider";
import AnalyticsWrapper from "@/components/ui/AnalyticsWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ui/ScrollToTop";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "DevAndDone - Premium Development Agency | AI-Powered Solutions",
    template: "%s | DevAndDone",
  },
  description: "Next-generation development agency building premium web apps, mobile apps, and AI solutions. Founder-led, modern stack, clean architecture.",
  keywords: ["web development", "mobile app development", "AI solutions", "custom software", "Next.js", "React", "premium development"],
  authors: [{ name: "DevAndDone" }],
  creator: "DevAndDone",
  publisher: "DevAndDone",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "DevAndDone",
    title: "DevAndDone - Premium Development Agency",
    description: "Next-generation development agency building premium web apps, mobile apps, and AI solutions.",
    images: [
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
    images: ["/og-image.jpg"],
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
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DevAndDone",
    description: "Premium development agency building next-generation web and mobile applications",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo.png`,
    sameAs: [
      "https://twitter.com/devanddone",
      "https://linkedin.com/company/devanddone",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
        email: process.env.CONTACT_EMAIL || "info@devanddone.com",
    },
  };

  return (
    <html lang="en" className={`scroll-smooth ${comfortaa.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${comfortaa.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ToastProvider />
          <AnalyticsWrapper>
            <Navigation />
            <main className="min-h-screen pt-16 md:pt-20">
              {children}
            </main>
            <Footer />
          </AnalyticsWrapper>
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
