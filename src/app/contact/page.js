'use client';

import Section from '@/components/ui/Section';
import ContactForm from '@/components/ui/ContactForm';
import TrustBadges from '@/components/ui/TrustBadges';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function ContactPage() {
  // Use NEXT_PUBLIC_ prefix for client component access, or fallback to default
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@devanddone.com';

  return (
    <Section className="pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Ready to start your project? Have questions? We're here to help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {contactEmail}
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Response Time</h3>
                  <p className="text-muted-foreground">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Schedule a Call</h3>
                  <p className="text-muted-foreground">
                    Prefer to talk? Use our AI chat or contact form to schedule a consultation.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
              <ContactForm />
            </Card>
          </motion.div>
        </div>

        <TrustBadges />
      </div>
    </Section>
  );
}

