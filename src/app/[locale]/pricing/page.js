'use client';

import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import PricingCard from '@/components/ui/PricingCard';
import PricingComparison from '@/components/ui/PricingComparison';
import PricingCalculator from '@/components/ui/PricingCalculator';
import { pricingPackages } from '@/data/pricing';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import Button from '@/components/ui/Button';

export default function PricingPage() {
  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our commitment to quality and excellence.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {pricingPackages.map((pkg, index) => (
            <PricingCard key={pkg.id} package={pkg} index={index} />
          ))}
        </div>

        {/* Pricing Calculator */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Need a Custom Quote?</h2>
              <p className="text-muted-foreground mb-6">
                Every project is unique. Use our calculator to get an estimated price based on your specific needs,
                or book a free consultation to discuss your project in detail.
              </p>
              <PricingCalculator />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">What's Included?</h2>
              <Card className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Free Consultation</h4>
                      <p className="text-sm text-muted-foreground">
                        Discuss your project with our team at no cost
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Transparent Pricing</h4>
                      <p className="text-sm text-muted-foreground">
                        No hidden fees or surprises
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Quality Guarantee</h4>
                      <p className="text-sm text-muted-foreground">
                        We stand behind our work
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Ongoing Support</h4>
                      <p className="text-sm text-muted-foreground">
                        We're here for you after launch
                      </p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Compare Plans</h2>
          <Card className="p-6">
            <PricingComparison />
          </Card>
        </div>

        {/* CTA */}
        <Card className="p-8 bg-primary/5 border-primary/20 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Book a free consultation to discuss your project and get a detailed quote tailored to your needs.
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

