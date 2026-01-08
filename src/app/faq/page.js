'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/ui/Section';
import FAQSection from '@/components/ui/FAQSection';
import FAQSearch from '@/components/ui/FAQSearch';
import { motion } from 'framer-motion';

const categories = [
  'general',
  'web-development',
  'mobile-development',
  'ai-solutions',
  'ui-ux-engineering',
  'maintenance-scaling',
  'pricing',
  'process',
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allFAQs, setAllFAQs] = useState([]);

  useEffect(() => {
    fetchAllFAQs();
  }, []);

  const fetchAllFAQs = async () => {
    try {
      const response = await fetch('/api/faqs?limit=100');
      const data = await response.json();
      if (data.success) {
        setAllFAQs(data.faqs || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const filteredFAQs = selectedCategory === 'all'
    ? allFAQs
    : allFAQs.filter(faq => faq.category === selectedCategory);

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = allFAQs.filter(faq => faq.category === cat).length;
    return acc;
  }, {});

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our services, process, and more.
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-8">
          <FAQSearch />
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            All ({allFAQs.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} ({categoryCounts[category] || 0})
            </button>
          ))}
        </div>

        {/* FAQs */}
        {filteredFAQs.length > 0 ? (
          <FAQSection
            category={selectedCategory === 'all' ? undefined : selectedCategory}
            title={null}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No FAQs found in this category.</p>
          </div>
        )}

        {/* Schema.org FAQPage markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: filteredFAQs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </Section>
  );
}
