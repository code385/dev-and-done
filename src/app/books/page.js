'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/ui/Section';
import BookCard from '@/components/books/BookCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';
import Spinner from '@/components/ui/Spinner';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const categories = ['General', 'Technology', 'Business', 'Leadership', 'Development', 'Design'];

  useEffect(() => {
    fetchBooks();
  }, [page, category, search]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`/api/books?${params}`);
      const data = await response.json();

      if (data.success) {
        setBooks(data.books);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  return (
    <Section className="pt-24 pb-16">
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Founder's Library
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          Explore books written by our founder. Read, learn, and share your thoughts.
        </motion.p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={category === '' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setCategory('');
              setPage(1);
            }}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No books found. Check back soon for new releases!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {books.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-muted-foreground">
                Page {page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

