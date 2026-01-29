'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Spinner from './Spinner';

export default function TrendingContent({ contentType, limit = 6, days = 7, title = 'Trending Now' }) {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, [contentType, days]);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('strategy', 'trending');
      params.append('limit', limit.toString());
      if (contentType) params.append('type', contentType);

      const response = await fetch(`/api/recommendations?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTrending(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching trending content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      </div>
    );
  }

  if (trending.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <span className="text-sm text-muted-foreground">Last {days} days</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trending.map((item, index) => (
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
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold flex-1">{item.title}</h3>
                {item.views > 0 && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {item.views} views
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {item.excerpt || item.description}
              </p>
              {item.type === 'blog' || item.slug ? (
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


