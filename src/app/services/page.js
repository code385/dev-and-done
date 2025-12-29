import Section from '@/components/ui/Section';
import ServiceDetail from '@/components/ui/ServiceDetail';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { services } from '@/data/services';

export const metadata = {
  title: 'Services',
  description: 'Our comprehensive development services: Web Development, Mobile Apps, AI Solutions, UI/UX Engineering, and Maintenance & Scaling.',
};

export default function ServicesPage() {
  return (
    <>
      <Section className="pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive development services tailored to your business needs.
            From concept to deployment, we handle every aspect of your project.
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

