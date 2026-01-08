'use client';

import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Timeline from '@/components/ui/Timeline';
import { processSteps } from '@/data/process';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const metadata = {
  title: 'Our Process',
  description: 'Learn how we work with clients to deliver exceptional results.',
};

export default function ProcessPage() {
  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How We Work</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our proven process ensures your project is delivered on time, on budget, and exceeds expectations.
          </p>
        </motion.div>

        {/* Timeline */}
        <Timeline steps={processSteps} />

        {/* What to Expect */}
        <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
          <h2 className="text-2xl font-bold mb-6">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Regular Communication</h3>
              <p className="text-sm text-muted-foreground">
                We keep you updated with weekly progress reports and are always available for questions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Transparent Process</h3>
              <p className="text-sm text-muted-foreground">
                You'll see exactly what we're building at every stage, with opportunities for feedback.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quality First</h3>
              <p className="text-sm text-muted-foreground">
                We don't cut corners. Every line of code is written with quality and maintainability in mind.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Long-term Partnership</h3>
              <p className="text-sm text-muted-foreground">
                We're not just here for the launch. We support you as your business grows.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Card className="mt-8 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-muted-foreground mb-6">
            Let's discuss how we can bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-service">
              <Button variant="primary" size="lg">
                Book a Free Consultation
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </Section>
  );
}

