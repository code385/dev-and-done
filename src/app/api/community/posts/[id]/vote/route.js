import { NextResponse } from 'next/server';
import * as PostModel from '@/lib/mongodb/models/CommunityPost';
import * as VoteModel from '@/lib/mongodb/models/CommunityVote';
import * as UserModel from '@/lib/mongodb/models/CommunityUser';
import { verifyToken } from '@/lib/auth/verify';

// POST /api/community/posts/[id]/vote - Vote on post
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { voteType, userEmail } = body; // voteType: 'upvote' or 'downvote'

    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vote type' },
        { status: 400 }
      );
    }

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

    // Get user info - verifyToken may fail for guest users, so catch errors
    let token = null;
    let userId = null;
    let email = userEmail || null;
    
    try {
      token = await verifyToken();
      userId = token?.userId || null;
      email = token?.email || userEmail || null;
    } catch (error) {
      // Guest user - no token available
      token = null;
      userId = null;
    }
    
    // For guest users without email, use IP address as identifier
    if (!email && !userId) {
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown';
      email = `guest_${ip.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }

    // Create or update vote
    const voteResult = await VoteModel.createVote({
      userId,
      userEmail: email,
      targetType: 'post',
      targetId: post._id.toString(),
      voteType,
    });

    // Update post vote counts
    const voteCounts = await VoteModel.getVoteCounts('post', post._id.toString());
    await PostModel.updatePost(post._id.toString(), {
      upvoteCount: voteCounts.upvoteCount,
      downvoteCount: voteCounts.downvoteCount,
      lastActivityAt: new Date(),
    });

    // Update author reputation if vote was added (not removed)
    if (voteResult.action === 'created' && post.authorId) {
      const reputationChange = voteType === 'upvote' ? 10 : -2;
      await UserModel.incrementReputation(post.authorId.toString(), reputationChange);
    } else if (voteResult.action === 'removed' && post.authorId) {
      // Reverse reputation change if vote was removed
      const reputationChange = voteType === 'upvote' ? -10 : 2;
      await UserModel.incrementReputation(post.authorId.toString(), reputationChange);
    }

    return NextResponse.json({
      success: true,
      action: voteResult.action,
      voteCounts,
      userVote: voteResult.vote ? voteResult.vote.voteType : null,
    });
  } catch (error) {
    console.error('Error voting on post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to vote on post' },
      { status: 500 }
    );
  }
}

