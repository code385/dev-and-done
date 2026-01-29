import { NextResponse } from 'next/server';
import * as CommentModel from '@/lib/mongodb/models/CommunityComment';
import * as VoteModel from '@/lib/mongodb/models/CommunityVote';
import * as UserModel from '@/lib/mongodb/models/CommunityUser';
import { verifyToken } from '@/lib/auth/verify';

// POST /api/community/comments/[id]/vote - Vote on comment
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { voteType, userEmail } = body;

    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vote type' },
        { status: 400 }
      );
    }

    // Get comment
    const comment = await CommentModel.getCommentById(id);
    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Get user info
    const token = await verifyToken();
    const userId = token?.userId || null;
    const email = token?.email || userEmail;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'User email required' },
        { status: 400 }
      );
    }

    // Create or update vote
    const voteResult = await VoteModel.createVote({
      userId,
      userEmail: email,
      targetType: 'comment',
      targetId: id,
      voteType,
    });

    // Update comment vote counts
    const voteCounts = await VoteModel.getVoteCounts('comment', id);
    await CommentModel.updateComment(id, {
      upvoteCount: voteCounts.upvoteCount,
      downvoteCount: voteCounts.downvoteCount,
    });

    // Update author reputation if vote was added
    if (voteResult.action === 'created' && comment.authorId) {
      const reputationChange = voteType === 'upvote' ? 2 : -1;
      await UserModel.incrementReputation(comment.authorId.toString(), reputationChange);
    } else if (voteResult.action === 'removed' && comment.authorId) {
      const reputationChange = voteType === 'upvote' ? -2 : 1;
      await UserModel.incrementReputation(comment.authorId.toString(), reputationChange);
    }

    return NextResponse.json({
      success: true,
      action: voteResult.action,
      voteCounts,
      userVote: voteResult.vote ? voteResult.vote.voteType : null,
    });
  } catch (error) {
    console.error('Error voting on comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to vote on comment' },
      { status: 500 }
    );
  }
}

