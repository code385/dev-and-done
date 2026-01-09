'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import Image from 'next/image';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    blogs: 0,
    books: 0,
    services: 0,
    work: 0,
    total: 0,
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setCounts(data.counts || {});
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const highlightText = (text, query) => {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-900">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'blog':
        return '📝';
      case 'book':
        return '📚';
      case 'service':
        return '⚙️';
      case 'work':
        return '💼';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-500/10 text-blue-500';
      case 'book':
        return 'bg-purple-500/10 text-purple-500';
      case 'service':
        return 'bg-green-500/10 text-green-500';
      case 'work':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Search</h1>
          <div className="mb-6">
            <SearchBar variant="full" onSearch={handleSearch} />
          </div>
        </motion.div>

        {query && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="mb-6 flex flex-wrap gap-2">
                  <span className="text-muted-foreground">
                    Found {counts.total} result{counts.total !== 1 ? 's' : ''} for "{query}"
                  </span>
                  {counts.blogs > 0 && (
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-sm">
                      {counts.blogs} blog{counts.blogs !== 1 ? 's' : ''}
                    </span>
                  )}
                  {counts.books > 0 && (
                    <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-500 text-sm">
                      {counts.books} book{counts.books !== 1 ? 's' : ''}
                    </span>
                  )}
                  {counts.services > 0 && (
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-sm">
                      {counts.services} service{counts.services !== 1 ? 's' : ''}
                    </span>
                  )}
                  {counts.work > 0 && (
                    <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-500 text-sm">
                      {counts.work} case stud{counts.work !== 1 ? 'ies' : 'y'}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {results.map((item, index) => (
                    <motion.div
                      key={`${item.type}-${item._id || item.id || index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card hover>
                        <div className="flex gap-4">
                          {item.coverImage && (
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.coverImage}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                                    {item.type}
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">
                                  {item.type === 'blog' ? (
                                    <Link
                                      href={`/blogs/${item.slug}`}
                                      className="hover:text-primary transition-colors"
                                    >
                                      {highlightText(item.title, query)}
                                    </Link>
                                  ) : item.type === 'book' ? (
                                    <Link
                                      href={`/books/${item._id}`}
                                      className="hover:text-primary transition-colors"
                                    >
                                      {highlightText(item.title, query)}
                                    </Link>
                                  ) : item.type === 'service' ? (
                                    <Link
                                      href={`/services/${item.slug}`}
                                      className="hover:text-primary transition-colors"
                                    >
                                      {highlightText(item.title, query)}
                                    </Link>
                                  ) : item.type === 'work' ? (
                                    <Link
                                      href={`/work/${item.slug}`}
                                      className="hover:text-primary transition-colors"
                                    >
                                      {highlightText(item.title, query)}
                                    </Link>
                                  ) : (
                                    highlightText(item.title, query)
                                  )}
                                </h3>
                                <p className="text-muted-foreground mb-3">
                                  {highlightText(item.excerpt || item.description, query)}
                                </p>
                                {item.author && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    By {item.author}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.type === 'blog' && (
                                <Link href={`/blogs/${item.slug}`}>
                                  <Button variant="outline" size="sm">
                                    Read Article
                                  </Button>
                                </Link>
                              )}
                              {item.type === 'book' && (
                                <Link href={`/books/${item._id}`}>
                                  <Button variant="outline" size="sm">
                                    View Book
                                  </Button>
                                </Link>
                              )}
                              {item.type === 'service' && (
                                <Link href={`/services/${item.slug}`}>
                                  <Button variant="outline" size="sm">
                                    Learn More
                                  </Button>
                                </Link>
                              )}
                              {item.type === 'work' && (
                                <Link href={`/work/${item.slug}`}>
                                  <Button variant="outline" size="sm">
                                    View Case Study
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-4">No results found</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any results for "{query}". Try different keywords or check the spelling.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/blogs">
                    <Button variant="outline">Browse Blogs</Button>
                  </Link>
                  <Link href="/books">
                    <Button variant="outline">Browse Books</Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline">View Services</Button>
                  </Link>
                </div>
              </Card>
            )}
          </>
        )}

        {!query && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-4">Start Searching</h2>
            <p className="text-muted-foreground mb-6">
              Search across our blogs, books, services, and case studies.
            </p>
          </Card>
        )}
      </div>
    </Section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Section className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading search...</p>
          </div>
        </div>
      </Section>
    }>
      <SearchContent />
    </Suspense>
  );
}

