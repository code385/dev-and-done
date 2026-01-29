import { NextResponse } from 'next/server';
import * as QuestionModel from '@/lib/mongodb/models/CommunityQuestion';
import * as AnswerModel from '@/lib/mongodb/models/CommunityAnswer';
import * as UserModel from '@/lib/mongodb/models/CommunityUser';
import { verifyToken } from '@/lib/auth/verify';
import { sanitizeText, checkRateLimit } from '@/lib/utils/sanitize';

// GET /api/community/questions/[id]/answers - Get answers for a question
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'accepted'; // accepted, votes, newest

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

    let sortOption = { isAccepted: -1, upvoteCount: -1, createdAt: -1 };
    if (sort === 'votes') {
      sortOption = { upvoteCount: -1, createdAt: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const result = await AnswerModel.getAnswers(question._id.toString(), { sort: sortOption });

    return NextResponse.json({
      success: true,
      answers: result.answers,
    });
  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch answers' },
      { status: 500 }
    );
  }
}

// POST /api/community/questions/[id]/answers - Add answer to question
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    let { content, authorName, authorEmail } = body;

    // Rate limiting
    const identifier = authorEmail || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`${identifier}-answer`, 15, 3600000)) { // 15 answers per hour
      return NextResponse.json(
        { success: false, error: 'Too many answers. Please try again later.' },
        { status: 429 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Answer content is required' },
        { status: 400 }
      );
    }

    // Sanitize input
    content = sanitizeText(content, 50000);

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

    const answerData = {
      questionId: question._id.toString(),
      content: content.trim(),
      authorId,
      authorName: finalAuthorName || 'Anonymous',
      authorEmail: finalAuthorEmail || '',
    };

    const result = await AnswerModel.createAnswer(answerData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create answer' },
        { status: 400 }
      );
    }

    // Update question status if it was open
    if (question.status === 'open') {
      await QuestionModel.updateQuestion(question._id.toString(), { status: 'answered' });
    }

    return NextResponse.json({
      success: true,
      answer: result.answer,
      message: 'Answer created successfully',
    });
  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create answer' },
      { status: 500 }
    );
  }
}

