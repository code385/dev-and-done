import Section from '@/components/ui/Section';
import ServiceDetail from '@/components/ui/ServiceDetail';
import Button from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { services } from '@/data/services';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.services' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <>
      <Section className="pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('pages.services.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('pages.services.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {services.map((service) => (
            <ServiceDetail key={service.id} service={service} />
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to start your project? Book a consultation, get an instant estimate, or chat with our AI consultant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-service">
              <Button variant="primary" size="lg">
                Book a Service
              </Button>
            </Link>
            <Link href="/estimator">
              <Button variant="outline" size="lg">
                Get Project Estimate
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

