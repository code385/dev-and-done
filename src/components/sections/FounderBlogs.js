'use client';

import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FounderBlogs() {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBlogs();
  }, []);

  const fetchFeaturedBlogs = async () => {
    try {
      // Fetch up to 6 blogs, prioritizing featured ones
      const response = await fetch('/api/blogs?limit=6');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success) {
        // Sort to show featured blogs first, then by createdAt
        const sortedBlogs = data.blogs.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setFeaturedBlogs(sortedBlogs);
      }
    } catch (error) {
      // Fail silently - component will show empty state
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="py-16 md:py-24 bg-muted/30">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Founder's Blog
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Insights, tutorials, and thoughts on web development, technology, and building great products.
        </motion.p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading blogs...</p>
        </div>
      ) : featuredBlogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col overflow-hidden p-0">
                  {blog.coverImage && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {blog.category}
                      </span>
                      {blog.readTime && <span>•</span>}
                      {blog.readTime && <span>{blog.readTime}</span>}
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4">
                      {blog.excerpt}
                    </p>
                    {blog.averageRating > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < Math.floor(blog.averageRating || 0) ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {blog.averageRating.toFixed(1)}
                          {blog.reviewCount > 0 && ` (${blog.reviewCount})`}
                        </span>
                      </div>
                    )}
                    <Link href={`/blogs/${blog.slug}`}>
                      <Button variant="primary" className="w-full">
                        Read Article
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/blogs">
              <Button variant="outline" size="lg">
                View All Blogs
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No blogs available yet.</p>
          <Link href="/blogs">
            <Button variant="outline">Visit Blog</Button>
          </Link>
        </div>
      )}
    </Section>
  );
}

