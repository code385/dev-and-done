'use client';

import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FounderBooks() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  const fetchFeaturedBooks = async () => {
    try {
      // Fetch up to 6 books, prioritizing featured ones
      const response = await fetch('/api/books?limit=6');
      const data = await response.json();

      if (data.success) {
        // Sort to show featured books first, then by publishedAt
        const sortedBooks = data.books.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        });
        setFeaturedBooks(sortedBooks);
      }
    } catch (error) {
      console.error('Error fetching featured books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="py-16 md:py-24">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Founder's Library
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Explore books written by our founder. Read, learn, and share your thoughts through reviews.
        </motion.p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading books...</p>
        </div>
      ) : featuredBooks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredBooks.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  {book.coverImage && (
                    <div className="mb-4 aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">By {book.author}</p>
                  <p className="text-sm text-foreground line-clamp-3 flex-1 mb-4">
                    {book.description}
                  </p>
                  <Link href={`/books/${book._id}`}>
                    <Button variant="primary" className="w-full">
                      Read Book
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/books">
              <Button variant="outline" size="lg">
                View All Books
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No books available yet.</p>
          <Link href="/books">
            <Button variant="outline">Visit Books Library</Button>
          </Link>
        </div>
      )}
    </Section>
  );
}

