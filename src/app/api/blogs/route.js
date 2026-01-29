import { NextResponse } from 'next/server';
import * as BlogModel from '@/lib/mongodb/models/Blog';
import * as CategoryModel from '@/lib/mongodb/models/Category';
import * as TagModel from '@/lib/mongodb/models/Tag';

// GET /api/blogs - Get published blogs (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const categorySlug = searchParams.get('category');
    const tagSlug = searchParams.get('tag');
    const tags = searchParams.get('tags'); // Comma-separated tag slugs
    const featured = searchParams.get('featured') === 'true';

    const filter = { isPublished: true };
    
    // Handle category filter (by slug or ObjectId)
    if (categorySlug) {
      const { ObjectId } = await import('mongodb');
      if (ObjectId.isValid(categorySlug) && categorySlug.toString().length === 24) {
        filter.category = new ObjectId(categorySlug);
      } else {
        const category = await CategoryModel.getCategoryBySlug(categorySlug);
        if (category) {
          filter.category = category._id;
        } else {
          // Return empty results if category not found
          return NextResponse.json({
            success: true,
            blogs: [],
            pagination: {
              page,
              limit,
              total: 0,
              pages: 0,
            },
          });
        }
      }
    }
    
    // Handle tag filter (by slug or ObjectId)
    if (tagSlug) {
      const { ObjectId } = await import('mongodb');
      let tagId;
      if (ObjectId.isValid(tagSlug) && tagSlug.toString().length === 24) {
        tagId = new ObjectId(tagSlug);
      } else {
        const tag = await TagModel.getTagBySlug(tagSlug);
        if (tag) {
          tagId = tag._id;
        } else {
          // Return empty results if tag not found
          return NextResponse.json({
            success: true,
            blogs: [],
            pagination: {
              page,
              limit,
              total: 0,
              pages: 0,
            },
          });
        }
      }
      filter.tags = tagId;
    }
    
    // Handle multiple tags filter
    if (tags) {
      const tagSlugs = tags.split(',').map(s => s.trim());
      const { ObjectId } = await import('mongodb');
      const tagIds = [];
      
      for (const slug of tagSlugs) {
        let tagId;
        if (ObjectId.isValid(slug) && slug.toString().length === 24) {
          tagId = new ObjectId(slug);
        } else {
          const tag = await TagModel.getTagBySlug(slug);
          if (tag) {
            tagId = tag._id;
          }
        }
        if (tagId) {
          tagIds.push(tagId);
        }
      }
      
      if (tagIds.length > 0) {
        filter.tags = { $in: tagIds };
      } else {
        // Return empty results if no valid tags found
        return NextResponse.json({
          success: true,
          blogs: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
          },
        });
      }
    }
    
    if (featured) filter.featured = true;

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: true, // Populate category and tags
    };

    const result = await BlogModel.getBlogs(filter, options);

    return NextResponse.json({
      success: true,
      blogs: result.blogs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

