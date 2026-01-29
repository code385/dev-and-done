import { NextResponse } from 'next/server';
import * as UserModel from '@/lib/mongodb/models/CommunityUser';
import * as PostModel from '@/lib/mongodb/models/CommunityPost';
import * as QuestionModel from '@/lib/mongodb/models/CommunityQuestion';
import * as AnswerModel from '@/lib/mongodb/models/CommunityAnswer';

// GET /api/community/users/[username] - Get user profile
export async function GET(request, { params }) {
  try {
    const { username } = await params;
    const user = await UserModel.getCommunityUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's posts, questions, and answers
    const [postsResult, questionsResult] = await Promise.all([
      PostModel.getPosts({ authorId: user._id.toString() }, { limit: 10, sort: { createdAt: -1 } }),
      QuestionModel.getQuestions({ authorId: user._id.toString() }, { limit: 10, sort: { createdAt: -1 } }),
    ]);

    // Get user's answers
    const answersResult = await AnswerModel.getAnswers(null, {});
    const userAnswers = answersResult.answers?.filter(
      answer => answer.authorId && answer.authorId.toString() === user._id.toString()
    ).slice(0, 10) || [];

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        _id: user._id.toString(),
      },
      stats: {
        posts: postsResult.posts || [],
        questions: questionsResult.questions || [],
        answers: userAnswers,
        totalPosts: user.postCount || 0,
        totalQuestions: user.questionCount || 0,
        totalAnswers: user.answerCount || 0,
        acceptedAnswers: user.acceptedAnswerCount || 0,
        reputation: user.reputation || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

