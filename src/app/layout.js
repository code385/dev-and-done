import { Comfortaa } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Root layout - required wrapper with HTML/body tags for Next.js
// With next-intl [locale] routing, this provides the base HTML structure
// The [locale]/layout.js will handle locale-specific content and providers

export const metadata = {
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icon.png',
    shortcut: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DevAndDone",
    alternateName: "DEV & Done",
    description: "Premium development agency building next-generation web and mobile applications",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${baseUrl}/logo.png`,
    sameAs: [
      "https://twitter.com/devanddone",
      "https://linkedin.com/company/devanddone",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: process.env.CONTACT_EMAIL || "info@devanddone.com",
      availableLanguage: ["English", "Spanish", "French", "Arabic"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "Worldwide",
    },
  };

  // Website Schema with Sitelinks
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DevAndDone",
    url: baseUrl,
    publisher: {
      "@type": "Organization",
      name: "DevAndDone",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Work",
          url: `${baseUrl}/work`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "AI Consultant",
          url: `${baseUrl}/chat`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Playground",
          url: `${baseUrl}/playground`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Contact",
          url: `${baseUrl}/contact`,
        },
      ],
    },
  };

  const structuredData = [organizationSchema, websiteSchema];

  return (
    <html lang="en" dir="ltr" className={`scroll-smooth ${comfortaa.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.add(theme);
                } catch (e) {}
                // Update lang/dir based on URL path if [locale] routing is used
                try {
                  const path = window.location.pathname;
                  const localeMatch = path.match(/^\\/(en|es|fr|ar)(\\/|$)/);
                  if (localeMatch) {
                    const locale = localeMatch[1];
                    document.documentElement.lang = locale;
                    const isRTL = locale === 'ar';
                    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
                    if (isRTL) {
                      document.documentElement.classList.add('rtl');
                    } else {
                      document.documentElement.classList.remove('rtl');
                    }
                  }
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
        {children}
      </body>
    </html>
  );
}
