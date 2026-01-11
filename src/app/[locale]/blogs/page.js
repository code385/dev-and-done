'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import Spinner from '@/components/ui/Spinner';
import { useTranslations } from 'next-intl';

export default function BlogsPage() {
  const t = useTranslations();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Fetch featured posts
      const featuredResponse = await fetch('/api/blogs?featured=true&limit=2');
      if (!featuredResponse.ok || !featuredResponse.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Invalid response from server');
      }
      const featuredData = await featuredResponse.json();

      // Fetch all posts
      const allResponse = await fetch('/api/blogs?limit=100');
      if (!allResponse.ok || !allResponse.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Invalid response from server');
      }
      const allData = await allResponse.json();

      if (featuredData.success) {
        setFeaturedPosts(featuredData.blogs);
      }
      if (allData.success) {
        setAllPosts(allData.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="text-center py-12">
          <Spinner />
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
          {t('pages.blogs.title')}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('pages.blogs.description')}
        </p>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-8 sm:mb-12 px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post._id?.toString() || post.id || `featured-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-0 h-full hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                  {post.coverImage && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      <span>{post.category}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{post.readTime}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-xs sm:text-sm">{new Date(post.createdAt || post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 line-clamp-2">{post.title}</h3>
                    {post.averageRating > 0 && (
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`${i < Math.floor(post.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'} text-xs sm:text-sm`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {post.averageRating.toFixed(1)}
                          {post.reviewCount > 0 && <span className="hidden sm:inline"> ({post.reviewCount})</span>}
                        </span>
                      </div>
                    )}
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                    <Link href={`/blogs/${post.slug}`} className="self-start">
                      <Button variant="primary" size="sm" className="text-xs sm:text-sm">
                        {t('common.readMore')}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      <div className="px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">All Articles</h2>
        {allPosts.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">No blog posts yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Check back soon for new articles!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {allPosts.map((post, index) => (
              <motion.div
                key={post._id || post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-0 h-full hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
                  {post.coverImage && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      <span>{post.category}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 line-clamp-2">{post.title}</h3>
                    {post.averageRating > 0 && (
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`${i < Math.floor(post.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'} text-xs sm:text-sm`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {post.averageRating.toFixed(1)}
                          {post.reviewCount > 0 && <span className="hidden sm:inline"> ({post.reviewCount})</span>}
                        </span>
                      </div>
                    )}
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                    <Link href={`/blogs/${post.slug}`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
                        {t('common.readMore')}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

