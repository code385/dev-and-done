'use client';

import Section from '@/components/ui/Section';
import ServiceBookingForm from '@/components/booking/ServiceBookingForm';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/routing';

export default function BookServicePage() {
  const router = useRouter();

  const handleSuccess = (booking) => {
    // Optionally redirect to bookings page
    setTimeout(() => {
      router.push('/bookings');
    }, 2000);
  };

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book a Service
          </h1>
          <p className="text-xl text-muted-foreground">
            Schedule a consultation with our team. We'll confirm your booking shortly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ServiceBookingForm onSuccess={handleSuccess} />
        </motion.div>
      </div>
    </Section>
  );
}

