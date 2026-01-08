'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function TagPage() {
  const params = useParams();
  const tagSlug = params.tag;
  const [tag, setTag] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tagSlug) {
      fetchTagContent();
    }
  }, [tagSlug]);

  const fetchTagContent = async () => {
    setLoading(true);
    try {
      // Fetch tag info
      const tagResponse = await fetch(`/api/tags`);
      const tagData = await tagResponse.json();
      const foundTag = tagData.tags?.find(t => t.slug === tagSlug);
      setTag(foundTag);

      // Fetch blogs and books with this tag
      const searchResponse = await fetch(`/api/search?q=${encodeURIComponent(foundTag?.name || tagSlug)}`);
      const searchData = await searchResponse.json();

      if (searchData.success) {
        setBlogs(searchData.results.filter(r => r.type === 'blog'));
        setBooks(searchData.results.filter(r => r.type === 'book'));
      }
    } catch (error) {
      console.error('Error fetching tag content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Section className="pt-24 pb-16">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Section>
    );
  }

  if (!tag) {
    return (
      <Section className="pt-24 pb-16">
        <Card className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Tag Not Found</h1>
          <Link href="/blogs">
            <Button variant="outline">Back to Blogs</Button>
          </Link>
        </Card>
      </Section>
    );
  }

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tag: {tag.name}</h1>
          {tag.description && (
            <p className="text-lg text-muted-foreground">{tag.description}</p>
          )}
        </motion.div>

        {blogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Blog Posts ({blogs.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Card key={blog._id} hover>
                  {blog.coverImage && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{blog.excerpt}</p>
                  <Link href={`/blogs/${blog.slug}`}>
                    <Button variant="outline" size="sm">Read Article</Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}

        {books.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Books ({books.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <Card key={book._id} hover>
                  {book.coverImage && (
                    <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{book.description}</p>
                  <Link href={`/books/${book._id}`}>
                    <Button variant="outline" size="sm">View Book</Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}

        {blogs.length === 0 && books.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-muted-foreground">No content found with this tag.</p>
          </Card>
        )}
      </div>
    </Section>
  );
}

