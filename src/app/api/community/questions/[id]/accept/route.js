import { NextResponse } from 'next/server';
import * as QuestionModel from '@/lib/mongodb/models/CommunityQuestion';
import * as AnswerModel from '@/lib/mongodb/models/CommunityAnswer';
import { verifyToken } from '@/lib/auth/verify';

// POST /api/community/questions/[id]/accept - Accept an answer
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { answerId } = body;

    if (!answerId) {
      return NextResponse.json(
        { success: false, error: 'Answer ID is required' },
        { status: 400 }
      );
    }

    const token = await verifyToken();
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let question = await QuestionModel.getQuestionBySlug(id);
    if (!question) {
      question = await QuestionModel.getQuestionById(id);
    }

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if user is the question author or admin
    const isAuthor = question.authorId && 
      question.authorId.toString() === (token.userId || token._id);
    const isAdmin = token.role === 'founder';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Only the question author can accept answers' },
        { status: 403 }
      );
    }

    const result = await AnswerModel.acceptAnswer(answerId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Answer accepted successfully',
    });
  } catch (error) {
    console.error('Error accepting answer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to accept answer' },
      { status: 500 }
    );
  }
}

