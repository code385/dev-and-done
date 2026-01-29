import { notFound } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import VoteButtons from '@/components/community/VoteButtons';
import ReportButton from '@/components/community/ReportButton';
import PostComments from '@/components/community/PostComments';
import { CommunityErrorBoundary } from '@/components/community/ErrorBoundary';
import * as QuestionModel from '@/lib/mongodb/models/CommunityQuestion';
import * as AnswerModel from '@/lib/mongodb/models/CommunityAnswer';
import { generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const question = await QuestionModel.getQuestionBySlug(slug);

  if (!question) {
    return {
      title: 'Question Not Found',
    };
  }

  return generatePageMetadata({
    title: `${question.title} | DevAndDone Community`,
    description: question.content.substring(0, 160).replace(/[#*`]/g, ''),
    path: `/community/questions/${slug}`,
  });
}

export default async function QuestionDetailPage({ params }) {
  const { slug } = await params;
  const question = await QuestionModel.getQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  // Increment view count
  await QuestionModel.incrementViewCount(question._id.toString());

  // Get answers
  const answersResult = await AnswerModel.getAnswers(question._id.toString(), {
    sort: { isAccepted: -1, upvoteCount: -1, createdAt: -1 },
  });
  const answers = answersResult.answers || [];

  return (
    <CommunityErrorBoundary>
      <Section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Question */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0 flex sm:flex-col items-center justify-center sm:justify-start gap-2 sm:gap-1">
              <VoteButtons
                targetType="question"
                targetId={question._id.toString()}
                upvoteCount={question.upvoteCount || 0}
                downvoteCount={question.downvoteCount || 0}
                size="md"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {question.status === 'answered' && (
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-sm font-medium">
                    ✓ Answered
                  </span>
                )}
                {question.status === 'open' && (
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-medium">
                    Open
                  </span>
                )}
                {question.isPinned && (
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-sm font-medium">
                    📌 Pinned
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 break-words">{question.title}</h1>
              <div className="prose prose-invert max-w-none mb-6" dangerouslySetInnerHTML={{ __html: question.content.replace(/\n/g, '<br />') }} />
              
              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author & Date */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <span>Asked by {question.authorName}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span>{question.viewCount} views</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{question.answerCount} answers</span>
                  </div>
                  <ReportButton
                    targetType="question"
                    targetId={question._id.toString()}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          {answers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No answers yet. Be the first to answer!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {answers.map((answer) => (
                <Card key={answer._id.toString()} className={answer.isAccepted ? 'border-green-500 border-2' : ''}>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0 flex sm:flex-col items-center justify-center sm:justify-start gap-2 sm:gap-1">
                      <VoteButtons
                        targetType="answer"
                        targetId={answer._id.toString()}
                        upvoteCount={answer.upvoteCount || 0}
                        downvoteCount={answer.downvoteCount || 0}
                        size="sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {answer.isAccepted && (
                        <div className="mb-2">
                          <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-sm font-medium">
                            ✓ Accepted Answer
                          </span>
                        </div>
                      )}
                      <div className="prose prose-invert max-w-none mb-4" dangerouslySetInnerHTML={{ __html: answer.content.replace(/\n/g, '<br />') }} />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Answered by {answer.authorName}</span>
                        <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Answer Form */}
        <Card>
          <h3 className="text-xl font-bold mb-4">Your Answer</h3>
          <form action="/api/community/questions/[id]/answers" method="POST" className="space-y-4">
            <input type="hidden" name="questionId" value={question._id.toString()} />
            <textarea
              name="content"
              rows={8}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write your answer here... (Markdown supported)"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                Post Answer
              </Button>
            </div>
          </form>
        </Card>

        {/* Comments */}
        <div className="mt-8">
          <PostComments
            postId={question._id.toString()}
            questionId={question._id.toString()}
          />
        </div>
      </div>
    </Section>
  );
}

