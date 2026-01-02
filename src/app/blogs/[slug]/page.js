import { notFound } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import BlogReviewSection from '@/components/ui/BlogReviewSection';
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

    return {
      title: `${post.title} | DevAndDone Blog`,
      description: post.excerpt,
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
            <span>{post.readTime}</span>
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">{post.author?.charAt(0) || 'D'}</span>
            </div>
            <div>
              <p className="font-medium">{post.author || 'DevAndDone Team'}</p>
              <p className="text-sm text-muted-foreground">Published on {new Date(post.createdAt || post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
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

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost._id?.toString() || relatedPost.slug || `related-${relatedPost.title}`} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{relatedPost.category}</span>
                    <span>•</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{relatedPost.title}</h3>
                  <p className="text-muted-foreground mb-4">{relatedPost.excerpt}</p>
                  <Link href={`/blogs/${relatedPost.slug}`}>
                    <Button variant="outline" size="sm">
                      Read Article
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

