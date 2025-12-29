'use client';

import Card from '../ui/Card';
import TechStackBadge from '../ui/TechStackBadge';
import Button from '../ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EstimatorResults({ estimate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <Card>
        <h2 className="text-2xl font-bold mb-6">Your Project Estimate</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Budget Range</h3>
            <p className="text-3xl font-bold text-primary">
              ${estimate.priceRange.min.toLocaleString()} - ${estimate.priceRange.max.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Estimated cost based on your requirements
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Timeline</h3>
            <p className="text-2xl font-bold">
              {estimate.timeline.min} - {estimate.timeline.max} weeks
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Estimated development time
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Suggested Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {estimate.suggestedTechStack.map((tech) => (
                <TechStackBadge key={tech} tech={tech} />
              ))}
            </div>
          </div>

          {estimate.confidence === 'medium' && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <p className="text-sm text-warning">
                <strong>Note:</strong> This is a preliminary estimate. For a detailed quote, 
                please contact us for a consultation.
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/contact">
          <Button variant="primary" size="lg">
            Get Detailed Quote
          </Button>
        </Link>
        <Link href="/chat">
          <Button variant="outline" size="lg">
            Chat with AI Consultant
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

