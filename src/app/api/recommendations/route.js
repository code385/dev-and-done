import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/connect';
import * as BlogModel from '@/lib/mongodb/models/Blog';
import * as BookModel from '@/lib/mongodb/models/Book';

const DB_NAME = 'devanddone';

// GET /api/recommendations - Get content recommendations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('type'); // blog or book
    const contentId = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '6');

    const recommendations = [];

    if (contentType === 'blog' && contentId) {
      // Get the blog to find related ones
      try {
        const blog = await BlogModel.getBlogById(contentId);
        if (blog) {
          // Find blogs with same category
          const related = await BlogModel.getBlogs(
            {
              isPublished: true,
              _id: { $ne: blog._id },
              category: blog.category,
            },
            { limit: limit, sort: { views: -1, createdAt: -1 } }
          );
          recommendations.push(...related.blogs.slice(0, limit));
        }
      } catch (error) {
        console.error('Error fetching blog recommendations:', error);
      }
    } else if (contentType === 'book' && contentId) {
      // Get the book to find related ones
      try {
        const book = await BookModel.getBookById(contentId);
        if (book) {
          // Find books with similar characteristics
          const related = await BookModel.getBooks(
            {
              isPublished: true,
              _id: { $ne: book._id },
            },
            { limit: limit, sort: { views: -1, createdAt: -1 } }
          );
          recommendations.push(...related.books.slice(0, limit));
        }
      } catch (error) {
        console.error('Error fetching book recommendations:', error);
      }
    } else {
      // Get trending content
      try {
        const trendingBlogs = await BlogModel.getBlogs(
          { isPublished: true },
          { limit: Math.floor(limit / 2), sort: { views: -1 } }
        );
        const trendingBooks = await BookModel.getBooks(
          { isPublished: true },
          { limit: Math.floor(limit / 2), sort: { views: -1 } }
        );
        recommendations.push(...trendingBlogs.blogs, ...trendingBooks.books);
      } catch (error) {
        console.error('Error fetching trending content:', error);
      }
    }

    return NextResponse.json({
      success: true,
      recommendations: recommendations.slice(0, limit),
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

