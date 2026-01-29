import { notFound } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PostCard from '@/components/community/PostCard';
import Link from 'next/link';
import * as UserModel from '@/lib/mongodb/models/CommunityUser';
import { generatePageMetadata } from '@/lib/seo';
import { CommunityErrorBoundary } from '@/components/community/ErrorBoundary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { username } = await params;
  const user = await UserModel.getCommunityUserByUsername(username);

  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  return generatePageMetadata({
    title: `${user.displayName || user.username} | DevAndDone Community`,
    description: user.bio || `Profile of ${user.displayName || user.username} on DevAndDone Community`,
    path: `/community/users/${username}`,
  });
}

export default async function UserProfilePage({ params }) {
  const { username } = await params;
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/community/users/${username}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      notFound();
    }

    const data = await response.json();
    if (!data.success) {
      notFound();
    }

    const { user, stats } = data;

    // Calculate reputation badge
    const getReputationBadge = (reputation) => {
      if (reputation >= 1000) return { emoji: '🥇', label: 'Gold', color: 'text-yellow-500' };
      if (reputation >= 500) return { emoji: '🥈', label: 'Silver', color: 'text-gray-400' };
      if (reputation >= 100) return { emoji: '🥉', label: 'Bronze', color: 'text-orange-500' };
      return { emoji: '⭐', label: 'Member', color: 'text-blue-500' };
    };

    const badge = getReputationBadge(user.reputation || 0);

    return (
      <CommunityErrorBoundary>
        <Section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Profile Header */}
          <Card className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl sm:text-4xl font-bold flex-shrink-0">
                {user.displayName?.[0]?.toUpperCase() || user.username[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold break-words">{user.displayName || user.username}</h1>
                  <span className={`text-xl sm:text-2xl ${badge.color} flex-shrink-0`} title={badge.label}>
                    {badge.emoji}
                  </span>
                  {user.isBanned && (
                    <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs sm:text-sm flex-shrink-0">
                      Banned
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-2">@{user.username}</p>
                {user.bio && (
                  <p className="text-sm sm:text-base text-foreground mb-4 break-words">{user.bio}</p>
                )}
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Last active {new Date(user.lastActiveAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
            <Card className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.reputation}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Reputation</div>
            </Card>
            <Card className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalPosts}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Posts</div>
            </Card>
            <Card className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalQuestions}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Questions</div>
            </Card>
            <Card className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalAnswers}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Answers</div>
            </Card>
            <Card className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-green-500">{stats.acceptedAnswers}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Accepted</div>
            </Card>
          </div>

          {/* User's Posts */}
          {stats.posts && stats.posts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
              <div className="space-y-4">
                {stats.posts.map((post) => (
                  <PostCard key={post._id?.toString() || post.slug} post={post} />
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href={`/community/posts?author=${user.username}`}>
                  <Button variant="outline">View All Posts</Button>
                </Link>
              </div>
            </div>
          )}

          {/* User's Questions */}
          {stats.questions && stats.questions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Recent Questions</h2>
              <div className="space-y-4">
                {stats.questions.map((question) => (
                  <Card key={question._id?.toString()} className="p-4 hover:shadow-lg transition-shadow">
                    <Link href={`/community/questions/${question.slug}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-primary">{question.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{question.answerCount} answers</span>
                        <span>•</span>
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                        {question.status === 'answered' && (
                          <>
                            <span>•</span>
                            <span className="text-green-500">✓ Answered</span>
                          </>
                        )}
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* User's Answers */}
          {stats.answers && stats.answers.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Answers</h2>
              <div className="space-y-4">
                {stats.answers.map((answer) => (
                  <Card key={answer._id?.toString()} className="p-4">
                    <div className="prose prose-invert max-w-none mb-2 line-clamp-3">
                      {answer.content.substring(0, 200)}...
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{answer.upvoteCount} upvotes</span>
                      <span>•</span>
                      <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                      {answer.isAccepted && (
                        <>
                          <span>•</span>
                          <span className="text-green-500">✓ Accepted</span>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!stats.posts || stats.posts.length === 0) &&
           (!stats.questions || stats.questions.length === 0) &&
           (!stats.answers || stats.answers.length === 0) && (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-xl font-bold mb-2">No activity yet</h3>
              <p className="text-muted-foreground">
                This user hasn't posted anything yet.
              </p>
            </Card>
          )}
        </div>
      </Section>
    );
  } catch (error) {
    console.error('Error loading user profile:', error);
    notFound();
  }
}

