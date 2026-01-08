'use client';

import { useState, useEffect } from 'react';
import Tag from './Tag';
import { motion } from 'framer-motion';

export default function TagCloud({ limit = 20, minSize = 12, maxSize = 24 }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch(`/api/tags?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        setTags(data.tags || []);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading tags...</div>;
  }

  if (tags.length === 0) {
    return null;
  }

  // Calculate font sizes based on count
  const maxCount = Math.max(...tags.map(t => t.count || 0));
  const minCount = Math.min(...tags.map(t => t.count || 0));
  const range = maxCount - minCount || 1;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => {
        const size = minSize + ((tag.count || 0) - minCount) / range * (maxSize - minSize);
        return (
          <motion.div
            key={tag._id?.toString() || tag.name || index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
          >
            <Tag
              tag={tag}
              href={`/tags/${tag.slug}`}
              className="text-sm"
              style={{ fontSize: `${size}px` }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

