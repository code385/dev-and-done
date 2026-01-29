import { NextResponse } from 'next/server';
import * as QuestionModel from '@/lib/mongodb/models/CommunityQuestion';
import { verifyToken } from '@/lib/auth/verify';

// GET /api/community/questions/[id] - Get question by ID or slug
export async function GET(request, { params }) {
  try {
    const { id } = await params;
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

    // Increment view count
    await QuestionModel.incrementViewCount(question._id.toString());

    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

// PUT /api/community/questions/[id] - Update question
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token = await verifyToken();

    const question = await QuestionModel.getQuestionById(id);
    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check authorization
    const isAuthor = question.authorId && token && 
      question.authorId.toString() === (token.userId || token._id);
    const isAdmin = token && token.role === 'founder';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const result = await QuestionModel.updateQuestion(id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Question updated' });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

// DELETE /api/community/questions/[id] - Delete question
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const token = await verifyToken();

    const question = await QuestionModel.getQuestionById(id);
    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check authorization
    const isAuthor = question.authorId && token && 
      question.authorId.toString() === (token.userId || token._id);
    const isAdmin = token && token.role === 'founder';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const result = await QuestionModel.deleteQuestion(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}

