import { NextResponse } from 'next/server';
import * as BlogModel from '@/lib/mongodb/models/Blog';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/admin/blogs/[id] - Get a single blog by ID (admin only)
export async function GET(request, { params }) {
  try {
    const payload = await requireAuth();
    const { id } = await params;

    const blog = await BlogModel.getBlogById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Admins can view any blog (no ownership check needed)

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blogs/[id] - Update a blog (admin only)
export async function PUT(request, { params }) {
  try {
    const payload = await requireAuth();
    const { id } = await params;
    const data = await request.json();

    // Get existing blog
    const existingBlog = await BlogModel.getBlogById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Admins can edit any blog (no ownership check needed)

    // If slug is being updated, check if new slug already exists
    if (data.slug && data.slug !== existingBlog.slug) {
      const slugExists = await BlogModel.getBlogBySlug(data.slug);
      if (slugExists && slugExists._id.toString() !== id) {
        return NextResponse.json(
          { success: false, error: 'Blog with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await BlogModel.updateBlog(id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update blog' },
        { status: 500 }
      );
    }

    const updatedBlog = await BlogModel.getBlogById(id);

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blogs/[id] - Delete a blog (admin only)
export async function DELETE(request, { params }) {
  try {
    const payload = await requireAuth();
    const { id } = await params;

    // Get existing blog
    const existingBlog = await BlogModel.getBlogById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Admins can delete any blog (no ownership check needed)

    const result = await BlogModel.deleteBlog(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete blog' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}

