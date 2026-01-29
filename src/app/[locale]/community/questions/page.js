'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import PostCard from '@/components/community/PostCard';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import { PostCardSkeleton } from '@/components/community/SkeletonLoader';
import { CommunityErrorBoundary } from '@/components/community/ErrorBoundary';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Search, Plus, TrendingUp, Clock, ArrowUp, HelpCircle } from 'lucide-react';

export default function CommunityQuestionsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [page, sort]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sort,
        category: 'help', // Filter for help/questions category
      });

      if (search) params.append('search', search);

      const response = await fetch(`/api/community/posts?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  return (
    <CommunityErrorBoundary>
      <Section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Questions & Answers</h1>
              <p className="text-muted-foreground">
                Ask questions and get help from the community
              </p>
            </div>
            <Button
              onClick={() => router.push('/community/questions/new')}
              variant="primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSort('newest')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                  sort === 'newest'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Newest</span>
                <span className="sm:hidden">New</span>
              </button>
              <button
                onClick={() => setSort('popular')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                  sort === 'popular'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <ArrowUp className="w-4 h-4 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Popular</span>
                <span className="sm:hidden">Top</span>
              </button>
              <button
                onClick={() => setSort('trending')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                  sort === 'trending'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Trending</span>
                <span className="sm:hidden">Hot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-xl font-bold mb-2">No questions yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to ask a question!
            </p>
            <Button
              onClick={() => router.push('/community/questions/new')}
              variant="primary"
            >
              Ask First Question
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {posts.map((post) => (
                <PostCard key={post._id?.toString() || post.slug} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Section>
    </CommunityErrorBoundary>
  );
}

