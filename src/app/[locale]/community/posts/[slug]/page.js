import { notFound } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import VoteButtons from '@/components/community/VoteButtons';
import ReportButton from '@/components/community/ReportButton';
import Tag from '@/components/ui/Tag';
import SocialShare from '@/components/ui/SocialShare';
import PostComments from '@/components/community/PostComments';
import * as PostModel from '@/lib/mongodb/models/CommunityPost';
import * as VoteModel from '@/lib/mongodb/models/CommunityVote';
import { verifyToken } from '@/lib/auth/verify';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Eye, MessageCircle, Edit, Trash2, Pin, Lock } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { CommunityErrorBoundary } from '@/components/community/ErrorBoundary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  // Handle params as Promise (Next.js 15+) - MUST await first
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  if (!slug) {
    return {
      title: 'Post Not Found',
    };
  }
  
  try {
    const post = await PostModel.getPostBySlug(slug, { skipViewIncrement: true });
    
    if (!post || post.status !== 'published') {
      return {
        title: 'Post Not Found',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/community/posts/${slug}`;

    return {
      title: `${post.title} | DevAndDone Community`,
      description: post.excerpt || post.title,
      keywords: post.tags || ['DevAndDone', 'community'],
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        url: url,
        siteName: 'DevAndDone',
        type: 'article',
        publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
        authors: [post.authorName || 'Community Member'],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.title,
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function CommunityPostPage({ params }) {
  // Handle params as Promise (Next.js 15+) - MUST await first
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  if (!slug) {
    console.error('No slug provided to CommunityPostPage');
    notFound();
  }
  
  let post = null;
  let voteData = null;
  let canEdit = false;
  
  try {
    // Get token first to check permissions (may fail for guest users)
    let token = null;
    try {
      token = await verifyToken();
    } catch (error) {
      // Guest user - no token available
      token = null;
    }
    
    // Try to get post by slug first (without status filter to allow checking permissions)
    post = await PostModel.getPostBySlug(slug, { skipViewIncrement: true });
    
    // If not found by slug, try by ID (in case URL has ID instead of slug)
    if (!post) {
      const { ObjectId } = await import('mongodb');
      if (ObjectId.isValid(slug)) {
        post = await PostModel.getPostById(slug);
      }
    }
    
    if (!post) {
      console.error('Post not found for slug/ID:', slug);
      notFound();
    }

    // Check if user can view this post
    const isAuthor = post.authorId && token && 
      post.authorId.toString() === (token.userId || token._id);
    const isAdmin = token && token.role === 'founder';
    
    // Only published posts are visible to everyone, but authors and admins can see drafts
    if (post.status !== 'published' && !isAuthor && !isAdmin) {
      notFound();
    }

    // Increment view count for published posts
    if (post.status === 'published') {
      await PostModel.incrementViewCount(post._id.toString());
    }

    // Get vote counts and user vote
    const voteCounts = await VoteModel.getVoteCounts('post', post._id.toString());
    
    let userVote = null;
    if (token && (token.userId || token.email)) {
      try {
        userVote = await VoteModel.getUserVote(
          token.userId || null,
          token.email || null,
          'post',
          post._id.toString()
        );
      } catch (error) {
        // If getting user vote fails, continue without it
        console.error('Error getting user vote:', error);
      }
    }

    voteData = {
      upvoteCount: voteCounts?.upvoteCount || 0,
      downvoteCount: voteCounts?.downvoteCount || 0,
      userVote: userVote ? userVote.voteType : null,
    };

    // Check if user can edit
    canEdit = isAuthor || isAdmin;

  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }

  const timeAgo = post.createdAt 
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : '';

  // Simple markdown-like rendering (basic)
  const renderContent = (content) => {
    if (!content) return '';
    
    // Basic markdown parsing
    let html = content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/gim, '<br />');
    
    return html;
  };

  return (
    <CommunityErrorBoundary>
      <Section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Link href="/community/posts">
          <Button variant="ghost" size="sm" className="mb-6">
            ← Back to Posts
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Vote Buttons */}
          <div className="flex-shrink-0 flex sm:flex-col items-center justify-center sm:justify-start gap-2 sm:gap-1">
            <VoteButtons
              targetType="post"
              targetId={post._id?.toString() || post.slug || slug}
              upvoteCount={voteData?.upvoteCount || 0}
              downvoteCount={voteData?.downvoteCount || 0}
              userVote={voteData?.userVote || null}
              size="md"
            />
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            <Card className="mb-6">
              {/* Header */}
              <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {post.isPinned && (
                            <Pin className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                          {post.isLocked && (
                            <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">{post.title}</h1>
                        </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {post.tags && post.tags.map((tag, index) => (
                        <Tag
                          key={index}
                          tag={{ name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') }}
                          href={`/community/posts?tag=${tag}`}
                        />
                      ))}
                      {post.category && (
                        <span className="px-3 py-1 bg-muted rounded-full text-sm">
                          {post.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {canEdit && (
                      <Link href={`/community/posts/${post.slug}/edit`}>
                        <Button variant="ghost" size="sm" className="p-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <ReportButton
                      targetType="post"
                      targetId={post._id?.toString() || post.slug}
                    />
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">{post.authorName}</span>
                  </div>
                  {timeAgo && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{timeAgo}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.viewCount || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentCount || 0} comments</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
              />

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-border">
                <SocialShare
                  url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/community/posts/${post.slug}`}
                  title={post.title}
                />
              </div>
            </Card>

            {/* Comments Section */}
            <PostComments postId={post._id?.toString() || slug} />
          </div>
        </div>
      </div>
    </Section>
    </CommunityErrorBoundary>
  );
}

