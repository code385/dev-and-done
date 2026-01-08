'use client';

import { useState, useEffect } from 'react';
import FAQCard from './FAQCard';
import { motion } from 'framer-motion';

export default function FAQSection({ category, limit, title = 'Frequently Asked Questions' }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, [category, limit]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`/api/faqs?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setFaqs(data.faqs || []);
      } else {
        setError('Failed to load FAQs');
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <p className="text-center text-muted-foreground">Loading FAQs...</p>
      </div>
    );
  }

  if (error || faqs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold mb-6"
        >
          {title}
        </motion.h2>
      )}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <FAQCard
            key={faq._id.toString()}
            faq={faq}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
