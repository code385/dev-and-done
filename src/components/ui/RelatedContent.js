'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function RelatedContent({ contentType, contentId, title = 'You Might Also Like' }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [contentType, contentId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (contentType) params.append('type', contentType);
      if (contentId) params.append('id', contentId);

      const response = await fetch(`/api/recommendations?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item, index) => (
          <motion.div
            key={item._id?.toString() || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              {item.coverImage && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {item.excerpt || item.description}
              </p>
              {item.type === 'blog' ? (
                <Link href={`/blogs/${item.slug}`}>
                  <Button variant="outline" size="sm">Read Article</Button>
                </Link>
              ) : (
                <Link href={`/books/${item._id}`}>
                  <Button variant="outline" size="sm">View Book</Button>
                </Link>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

