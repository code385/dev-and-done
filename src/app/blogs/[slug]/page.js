import { notFound } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import BlogReviewSection from '@/components/ui/BlogReviewSection';
import SocialShare from '@/components/ui/SocialShare';
import ReadingProgress from '@/components/ui/ReadingProgress';
import BookmarkButton from '@/components/ui/BookmarkButton';
import ReadingTime from '@/components/ui/ReadingTime';
import RelatedContent from '@/components/ui/RelatedContent';
import * as BlogModel from '@/lib/mongodb/models/Blog';
import * as BlogReviewModel from '@/lib/mongodb/models/BlogReview';

// Force dynamic rendering for blog posts (since they're added dynamically by admins)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const post = await BlogModel.getBlogBySlug(slug);
    
    if (!post || !post.isPublished) {
      return {
        title: 'Blog Post Not Found',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/blogs/${slug}`;
    const image = post.coverImage 
      ? (post.coverImage.startsWith('http') ? post.coverImage : `${baseUrl}${post.coverImage}`)
      : `${baseUrl}/og-image.jpg`;

    return {
      title: `${post.title} | DevAndDone Blog`,
      description: post.excerpt || post.title,
      keywords: post.category ? [post.category, 'DevAndDone', 'blog'] : ['DevAndDone', 'blog'],
      authors: [{ name: post.author || 'DevAndDone Team' }],
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        url: url,
        siteName: 'DevAndDone',
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        locale: 'en_US',
        type: 'article',
        publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
        modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
        authors: [post.author || 'DevAndDone Team'],
        section: post.category,
        tags: post.category ? [post.category] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.title,
        images: [image],
        creator: '@devanddone',
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found',
    };
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  
  let post = null;
  let relatedPosts = [];
  let reviews = [];
  
  try {
    // Get the blog post directly from database
    post = await BlogModel.getBlogBySlug(slug);
    
    if (!post || !post.isPublished) {
      notFound();
    }
    
    // Get reviews
    try {
      const reviewResult = await BlogReviewModel.getBlogReviews(
        { blogId: post._id.toString(), isApproved: true },
        { page: 1, limit: 20, sort: { createdAt: -1 } }
      );
      // Serialize MongoDB objects to plain objects for client component
      reviews = (reviewResult.reviews || []).map(review => ({
        _id: review._id.toString(),
        blogId: review.blogId.toString(),
        userId: review.userId,
        userName: review.userName,
        userEmail: review.userEmail,
        rating: review.rating,
        review: review.review,
        helpful: review.helpful,
        isApproved: review.isApproved,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      }));
    } catch (reviewError) {
      console.error('Error fetching reviews:', reviewError);
      reviews = [];
    }
    
    // Increment views
    await BlogModel.incrementBlogViews(slug);
    
    // Fetch related posts (published only)
    try {
      const { ObjectId } = await import('mongodb');
      let postId;
      if (post._id instanceof ObjectId) {
        postId = post._id;
      } else if (typeof post._id === 'string') {
        postId = ObjectId.isValid(post._id) ? new ObjectId(post._id) : post._id;
      } else {
        postId = post._id;
      }
      
      const relatedResult = await BlogModel.getBlogs(
        { 
          isPublished: true,
          _id: { $ne: postId } // Exclude current post
        },
        { 
          limit: 3,
          sort: { createdAt: -1 }
        }
      );
      
      relatedPosts = relatedResult.blogs.slice(0, 2);
    } catch (relatedError) {
      console.error('Error fetching related posts:', relatedError);
      // Continue without related posts if there's an error
      relatedPosts = [];
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <>
      <ReadingProgress contentId={post._id?.toString()} contentType="blog" />
      <Section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
              {post.category}
            </span>
            <ReadingTime content={post.content} />
            <span>•</span>
            <span>{new Date(post.createdAt || post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-4 mb-4">
            {post.averageRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < Math.floor(post.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {post.averageRating.toFixed(1)}
                  {post.reviewCount > 0 && ` (${post.reviewCount} reviews)`}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">{post.author?.charAt(0) || 'D'}</span>
              </div>
              <div>
                <p className="font-medium">{post.author || 'DevAndDone Team'}</p>
                <p className="text-sm text-muted-foreground">Published on {new Date(post.createdAt || post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookmarkButton
                contentId={post._id?.toString()}
                contentType="blog"
                title={post.title}
                url={`/blogs/${slug}`}
                image={post.coverImage}
              />
              <span className="text-sm text-muted-foreground">Share:</span>
              <SocialShare
                url={`/blogs/${slug}`}
                title={post.title}
                description={post.excerpt}
                contentType="blog"
                contentId={post._id?.toString()}
                image={post.coverImage}
                variant="horizontal"
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Card className="p-8 md:p-12 mb-8">
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-ul:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Card>

        {/* Reviews Section */}
        <BlogReviewSection blogSlug={slug} initialReviews={reviews} />

        {/* Call to Action */}
        <Card className="p-8 bg-primary/5 border-primary/20 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Enjoyed this article?</h2>
            <p className="text-muted-foreground mb-6">
              If you found this helpful, you might be interested in working with us on your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Get in Touch
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg">
                  View Our Services
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Related Content */}
        <RelatedContent contentType="blog" contentId={post._id?.toString()} />
      </div>
    </Section>
    </>
  );
}

