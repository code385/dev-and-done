import { NextResponse } from 'next/server';
import * as PostModel from '@/lib/mongodb/models/CommunityPost';
import * as UserModel from '@/lib/mongodb/models/CommunityUser';
import { verifyToken } from '@/lib/auth/verify';
import { sanitizeTitle, sanitizeText, sanitizeTags, checkRateLimit } from '@/lib/utils/sanitize';

// GET /api/community/posts - Get all posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const sort = searchParams.get('sort') || 'newest'; // newest, popular, trending
    const search = searchParams.get('search');

    const filter = {};

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Tag filter
    if (tag) {
      filter.tags = tag;
    }

    // Search filter (text search)
    if (search) {
      filter.$text = { $search: search };
    }

    // Sort options
    let sortOption = { isPinned: -1, createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { isPinned: -1, upvoteCount: -1, createdAt: -1 };
    } else if (sort === 'trending') {
      // Trending = recent + high upvotes
      sortOption = { isPinned: -1, lastActivityAt: -1, upvoteCount: -1 };
    }

    const result = await PostModel.getPosts(filter, {
      page,
      limit,
      sort: sortOption,
    });

    return NextResponse.json({
      success: true,
      posts: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/community/posts - Create new post
export async function POST(request) {
  try {
    const body = await request.json();
    let { title, content, excerpt, category, tags, status, authorName, authorEmail } = body;

    // Rate limiting
    const identifier = authorEmail || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(identifier, 10, 3600000)) { // 10 posts per hour
      return NextResponse.json(
        { success: false, error: 'Too many posts. Please try again later.' },
        { status: 429 }
      );
    }

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    title = sanitizeTitle(title, 200);
    content = sanitizeText(content, 50000);
    excerpt = excerpt ? sanitizeText(excerpt, 500) : '';
    tags = sanitizeTags(tags || [], 10);

    // Get or create user
    let user = null;
    let authorId = null;
    let finalAuthorName = authorName;
    let finalAuthorEmail = authorEmail;

    // Try to get authenticated user
    const token = await verifyToken();
    if (token && token.email) {
      user = await UserModel.getCommunityUserByEmail(token.email);
      if (user) {
        authorId = user._id.toString();
        finalAuthorName = user.displayName || user.username;
        finalAuthorEmail = user.email;
      }
    }

    // If no authenticated user, use provided email or create guest user
    if (!user && finalAuthorEmail) {
      user = await UserModel.getCommunityUserByEmail(finalAuthorEmail);
      if (!user) {
        // Create guest user
        const newUser = await UserModel.createCommunityUser({
          email: finalAuthorEmail,
          name: finalAuthorName || 'Guest',
          displayName: finalAuthorName || 'Guest',
        });
        if (newUser.success) {
          user = newUser.user;
          authorId = user._id.toString();
          finalAuthorName = user.displayName || user.username;
        }
      } else {
        authorId = user._id.toString();
        finalAuthorName = user.displayName || user.username;
        finalAuthorEmail = user.email;
      }
    }

    // Create post
    const postData = {
      title,
      content,
      excerpt,
      category: category || 'general',
      tags: tags || [],
      status: status || 'published',
      authorId,
      authorName: finalAuthorName || 'Anonymous',
      authorEmail: finalAuthorEmail || '',
    };

    const result = await PostModel.createPost(postData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create post' },
        { status: 400 }
      );
    }

    // Increment user post count
    if (user && authorId) {
      await UserModel.incrementPostCount(authorId);
      // Add reputation for creating post
      await UserModel.incrementReputation(authorId, 5);
    }

    return NextResponse.json({
      success: true,
      post: result.post,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

