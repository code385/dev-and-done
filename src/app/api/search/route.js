import { NextResponse } from 'next/server';
import * as BookModel from '@/lib/mongodb/models/Book';
import * as BlogModel from '@/lib/mongodb/models/Blog';
import { services } from '@/data/services';
import clientPromise from '@/lib/mongodb/connect';

const DB_NAME = 'devanddone';

// GET /api/search - Global search across all content types
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // blog, book, service, work
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const searchQuery = query.trim();
    const results = {
      blogs: [],
      books: [],
      services: [],
      work: [],
    };

    // Search Blogs
    if (!type || type === 'blog') {
      try {
        const { ObjectId } = await import('mongodb');
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection('blogs');

        const blogFilter = {
          isPublished: true,
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { excerpt: { $regex: searchQuery, $options: 'i' } },
            { content: { $regex: searchQuery, $options: 'i' } },
            { category: { $regex: searchQuery, $options: 'i' } },
          ],
        };

        if (category) {
          blogFilter.category = category;
        }

        const blogs = await collection
          .find(blogFilter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray();

        results.blogs = blogs.map(blog => ({
          _id: blog._id.toString(),
          type: 'blog',
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          coverImage: blog.coverImage,
          category: blog.category,
          author: blog.author,
          createdAt: blog.createdAt,
        }));
      } catch (error) {
        console.error('Error searching blogs:', error);
      }
    }

    // Search Books
    if (!type || type === 'book') {
      try {
        const { ObjectId } = await import('mongodb');
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection('books');

        const bookFilter = {
          isPublished: true,
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { author: { $regex: searchQuery, $options: 'i' } },
          ],
        };

        const books = await collection
          .find(bookFilter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray();

        results.books = books.map(book => ({
          _id: book._id.toString(),
          type: 'book',
          title: book.title,
          description: book.description,
          coverImage: book.coverImage,
          author: book.author,
          createdAt: book.createdAt,
        }));
      } catch (error) {
        console.error('Error searching books:', error);
      }
    }

    // Search Services
    if (!type || type === 'service') {
      results.services = services
        .filter(service => {
          const searchLower = searchQuery.toLowerCase();
          return (
            service.title.toLowerCase().includes(searchLower) ||
            service.description.toLowerCase().includes(searchLower) ||
            service.longDescription.toLowerCase().includes(searchLower) ||
            service.techStack.some(tech => tech.toLowerCase().includes(searchLower))
          );
        })
        .map(service => ({
          id: service.id,
          type: 'service',
          title: service.title,
          description: service.description,
          icon: service.icon,
          slug: service.id,
        }));
    }

    // Search Work/Case Studies (if you have a work collection)
    if (!type || type === 'work') {
      try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection('work');

        const workFilter = {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { content: { $regex: searchQuery, $options: 'i' } },
          ],
        };

        const workItems = await collection
          .find(workFilter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray();

        results.work = workItems.map(item => ({
          _id: item._id.toString(),
          type: 'work',
          title: item.title,
          slug: item.slug,
          description: item.description,
          coverImage: item.coverImage,
          createdAt: item.createdAt,
        }));
      } catch (error) {
        // Work collection might not exist, that's okay
        console.log('Work collection not found or error:', error);
      }
    }

    // Combine and sort results
    const allResults = [
      ...results.blogs,
      ...results.books,
      ...results.services,
      ...results.work,
    ];

    // Sort by relevance (simple: title matches first)
    allResults.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
      const bTitleMatch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });

    return NextResponse.json({
      success: true,
      query: searchQuery,
      results: allResults,
      counts: {
        blogs: results.blogs.length,
        books: results.books.length,
        services: results.services.length,
        work: results.work.length,
        total: allResults.length,
      },
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}

