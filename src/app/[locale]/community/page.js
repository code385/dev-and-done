'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PostCard from '@/components/community/PostCard';
import Spinner from '@/components/ui/Spinner';
import { PostCardSkeleton } from '@/components/community/SkeletonLoader';
import { CommunityErrorBoundary } from '@/components/community/ErrorBoundary';
import { useRouter } from '@/i18n/routing';
import { MessageSquare, HelpCircle, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const router = useRouter();
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/community/posts?limit=6&sort=newest');
      const data = await response.json();

      if (data.success) {
        setRecentPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommunityErrorBoundary>
      <Section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Community Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join discussions, share knowledge, ask questions, and connect with fellow developers
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/community/posts/new')}>
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Start Discussion</h3>
            <p className="text-muted-foreground mb-4">
              Share your thoughts, ideas, or experiences with the community
            </p>
            <Button variant="outline" size="sm">
              Create Post <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/community/questions/new')}>
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Ask Question</h3>
            <p className="text-muted-foreground mb-4">
              Get help from the community on technical challenges
            </p>
            <Button variant="outline" size="sm">
              Ask Question <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/community/posts?sort=trending')}>
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Trending</h3>
            <p className="text-muted-foreground mb-4">
              See what's hot and what the community is talking about
            </p>
            <Button variant="outline" size="sm">
              View Trending <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Link href="/community/posts">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">All Posts</h3>
                  <p className="text-muted-foreground">
                    Browse all community discussions and posts
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </Link>

          <Link href="/community/questions">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Questions & Answers</h3>
                  <p className="text-muted-foreground">
                    Ask questions and help others by answering
                  </p>
                </div>
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Posts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Posts</h2>
            <Link href="/community/posts">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a discussion!
              </p>
              <Button
                onClick={() => router.push('/community/posts/new')}
                variant="primary"
              >
                Create First Post
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <PostCard key={post._id?.toString() || post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
    </CommunityErrorBoundary>
  );
}

