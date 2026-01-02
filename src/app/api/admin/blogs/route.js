import { NextResponse } from 'next/server';
import * as BlogModel from '@/lib/mongodb/models/Blog';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/admin/blogs - Get all blogs (admin only)
export async function GET() {
  try {
    const payload = await requireAuth();

    // Show all blogs to admins (not filtered by creator)
    // This allows admins to see and manage all blogs
    const filter = {};

    const options = {
      page: 1,
      limit: 100,
      sort: { createdAt: -1 },
    };

    const result = await BlogModel.getBlogs(filter, options);

    return NextResponse.json({
      success: true,
      blogs: result.blogs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/admin/blogs - Create a new blog (admin only)
export async function POST(request) {
  try {
    const payload = await requireAuth();
    const data = await request.json();

    const { title, slug, excerpt, content, author, category, readTime, featured, isPublished } = data;

    // Validate required fields
    if (!title || !slug || !excerpt || !content || !author || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBlog = await BlogModel.getBlogBySlug(slug);
    if (existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog with this slug already exists' },
        { status: 400 }
      );
    }

    const blogData = {
      title,
      slug,
      excerpt,
      content,
      author,
      category,
      readTime: readTime || '5 min read',
      featured: featured || false,
      isPublished: isPublished !== undefined ? isPublished : true,
      date: new Date().toISOString().split('T')[0],
      createdBy: payload.id,
      coverImage: data.coverImage || null,
    };

    const result = await BlogModel.createBlog(blogData);

    return NextResponse.json({
      success: true,
      blog: result.blog,
      id: result.id,
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

