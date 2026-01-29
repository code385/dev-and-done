'use client';

import { Link } from '@/i18n/routing';
import { Calendar, MessageCircle, Eye, Pin } from 'lucide-react';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import VoteButtons from './VoteButtons';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({ post, showVotes = true, className = '' }) {
  const timeAgo = post.createdAt 
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : '';

  return (
    <Card className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${className}`} hover>
      {showVotes && (
        <div className="flex-shrink-0 flex sm:flex-col items-center justify-center sm:justify-start gap-2 sm:gap-1">
          <VoteButtons
            targetType="post"
            targetId={post._id?.toString() || post.slug}
            upvoteCount={post.upvoteCount || 0}
            downvoteCount={post.downvoteCount || 0}
            userVote={post.userVote || null}
            size="sm"
          />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-2">
          {post.isPinned && (
            <Pin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
          )}
          <Link 
            href={`/community/posts/${post.slug || post._id?.toString() || 'unknown'}`}
            className="flex-1 group"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
        </div>

        {post.excerpt && (
          <p className="text-muted-foreground mb-3 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {post.tags && post.tags.length > 0 && (
            <>
              {post.tags.slice(0, 3).map((tag, index) => (
                <Tag
                  key={index}
                  tag={{ name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') }}
                  className="text-xs"
                />
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{post.tags.length - 3} more
                </span>
              )}
            </>
          )}
        </div>

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
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentCount || 0}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.viewCount || 0}</span>
          </div>

          {post.category && (
            <span className="px-2 py-1 bg-muted rounded text-xs">
              {post.category}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

