import { NextResponse } from 'next/server';
import * as PostModel from '@/lib/mongodb/models/CommunityPost';
import * as VoteModel from '@/lib/mongodb/models/CommunityVote';
import * as UserModel from '@/lib/mongodb/models/CommunityUser';
import { verifyToken } from '@/lib/auth/verify';

// GET /api/community/posts/[id] - Get single post
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeVotes = searchParams.get('includeVotes') === 'true';

    // Try to get by slug first, then by ID
    let post = await PostModel.getPostBySlug(id);
    if (!post) {
      post = await PostModel.getPostById(id);
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get vote counts and user vote if requested
    let voteData = null;
    if (includeVotes) {
      const voteCounts = await VoteModel.getVoteCounts('post', post._id.toString());
      
      // Get user's vote if authenticated
      const token = await verifyToken();
      let userVote = null;
      if (token) {
        userVote = await VoteModel.getUserVote(
          token.userId,
          token.email,
          'post',
          post._id.toString()
        );
      }

      voteData = {
        ...voteCounts,
        userVote: userVote ? userVote.voteType : null,
      };
    }

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        votes: voteData,
      },
    });
  } catch (error) {
    console.error('Error fetching community post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/community/posts/[id] - Update post
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token = await verifyToken();

    // Get post to check ownership
    const post = await PostModel.getPostById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user can edit (owner or admin)
    const canEdit = 
      (token && token.email && post.authorEmail === token.email) ||
      (token && token.role === 'founder' || token.role === 'admin');

    if (!canEdit) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    const result = await PostModel.updatePost(id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update post' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
    });
  } catch (error) {
    console.error('Error updating community post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/community/posts/[id] - Delete post
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const token = await verifyToken();

    // Get post to check ownership
    const post = await PostModel.getPostById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user can delete (owner or admin)
    const canDelete = 
      (token && token.email && post.authorEmail === token.email) ||
      (token && token.role === 'founder' || token.role === 'admin');

    if (!canDelete) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const result = await PostModel.deletePost(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to delete post' },
        { status: 400 }
      );
    }

    // Decrement user post count
    if (post.authorId) {
      const { ObjectId } = await import('mongodb');
      const user = await UserModel.getCommunityUser({ _id: new ObjectId(post.authorId) });
      if (user) {
        await UserModel.updateCommunityUser(post.authorId, {
          postCount: Math.max(0, (user.postCount || 0) - 1),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting community post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

