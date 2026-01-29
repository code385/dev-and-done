import { NextResponse } from 'next/server';
import * as PostModel from '@/lib/mongodb/models/CommunityPost';
import * as CommentModel from '@/lib/mongodb/models/CommunityComment';
import * as VoteModel from '@/lib/mongodb/models/CommunityVote';
import * as UserModel from '@/lib/mongodb/models/CommunityUser';
import { verifyToken } from '@/lib/auth/verify';
import { sanitizeText, checkRateLimit } from '@/lib/utils/sanitize';

// GET /api/community/posts/[id]/comments - Get comments for post
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sort = searchParams.get('sort') || 'oldest'; // oldest, newest, popular

    // Get post to verify it exists
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

    // Sort options
    let sortOption = { createdAt: 1 }; // oldest first
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'popular') {
      sortOption = { upvoteCount: -1, createdAt: 1 };
    }

    const result = await CommentModel.getCommentsByPost(post._id.toString());

    // Get vote counts and user votes for all comments
    const token = await verifyToken();
    const commentsWithVotes = await Promise.all(
      result.comments.map(async (comment) => {
        const voteCounts = await VoteModel.getVoteCounts('comment', comment._id.toString());
        let userVote = null;
        if (token) {
          userVote = await VoteModel.getUserVote(
            token.userId,
            token.email,
            'comment',
            comment._id.toString()
          );
        }
        return {
          ...comment,
          upvoteCount: voteCounts.upvoteCount,
          downvoteCount: voteCounts.downvoteCount,
          userVote: userVote ? userVote.voteType : null,
        };
      })
    );

    // Build comment tree (nested structure)
    const buildCommentTree = (comments, parentId = null) => {
      return comments
        .filter(comment => {
          if (parentId === null) {
            return !comment.parentCommentId;
          }
          return comment.parentCommentId && 
                 comment.parentCommentId.toString() === parentId.toString();
        })
        .map(comment => ({
          ...comment,
          replies: buildCommentTree(comments, comment._id),
        }));
    };

    const commentTree = buildCommentTree(commentsWithVotes);

    return NextResponse.json({
      success: true,
      comments: commentTree,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/community/posts/[id]/comments - Add comment to post
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    let { content, parentCommentId, authorName, authorEmail } = body;

    // Rate limiting
    const identifier = authorEmail || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`${identifier}-comment`, 20, 3600000)) { // 20 comments per hour
      return NextResponse.json(
        { success: false, error: 'Too many comments. Please try again later.' },
        { status: 429 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // Sanitize input
    content = sanitizeText(content, 5000);

    // Get post
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

    // Get or create user
    const token = await verifyToken();
    let user = null;
    let authorId = null;
    let finalAuthorName = authorName;
    let finalAuthorEmail = authorEmail;

    if (token && token.email) {
      user = await UserModel.getCommunityUserByEmail(token.email);
      if (user) {
        authorId = user._id.toString();
        finalAuthorName = user.displayName || user.username;
        finalAuthorEmail = user.email;
      }
    }

    if (!user && finalAuthorEmail) {
      user = await UserModel.getCommunityUserByEmail(finalAuthorEmail);
      if (!user) {
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

    // Create comment
    const commentData = {
      postId: post._id.toString(),
      parentCommentId: parentCommentId || null,
      content: content.trim(),
      authorId,
      authorName: finalAuthorName || 'Anonymous',
      authorEmail: finalAuthorEmail || '',
    };

    const result = await CommentModel.createComment(commentData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create comment' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      comment: result.comment,
      message: 'Comment added successfully',
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

