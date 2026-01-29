'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import VoteButtons from './VoteButtons';
import Spinner from '@/components/ui/Spinner';
import { CommentSkeleton } from './SkeletonLoader';
import { MessageCircle, Send, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function PostComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments?sort=newest`);
      const data = await response.json();

      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewComment('');
        toast.success('Comment added!');
        fetchComments();
      } else {
        toast.error(data.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
          parentCommentId: parentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReplyContent('');
        setReplyingTo(null);
        toast.success('Reply added!');
        fetchComments();
      } else {
        toast.error(data.error || 'Failed to add reply');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to add reply');
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment, depth = 0) => {
    const timeAgo = comment.createdAt 
      ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
      : '';

    return (
      <div key={comment._id?.toString()} className={depth > 0 ? 'ml-4 sm:ml-8 mt-4 border-l-2 border-border pl-2 sm:pl-4' : ''}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <div className="flex-shrink-0 flex sm:flex-col items-center justify-center sm:justify-start gap-2 sm:gap-1">
            <VoteButtons
              targetType="comment"
              targetId={comment._id?.toString()}
              upvoteCount={comment.upvoteCount || 0}
              downvoteCount={comment.downvoteCount || 0}
              userVote={comment.userVote || null}
              size="sm"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{comment.authorName}</span>
              <span className="text-sm text-muted-foreground">{timeAgo}</span>
            </div>

            <div className="text-foreground mb-3 whitespace-pre-wrap">
              {comment.content}
            </div>

            {depth < 3 && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment._id?.toString() ? null : comment._id?.toString())}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Reply className="w-4 h-4" />
                Reply
              </button>
            )}

            {replyingTo === comment._id?.toString() && (
              <div className="mt-3">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={3}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment._id?.toString())}
                    disabled={submitting || !replyContent.trim()}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => renderComment(reply, depth + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5" />
        <h2 className="text-2xl font-bold">Comments</h2>
        <span className="text-muted-foreground">({comments.length})</span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={4}
          className="mb-3"
        />
        <Button
          type="submit"
          disabled={submitting || !newComment.trim()}
          variant="primary"
        >
          <Send className="w-4 h-4 mr-2" />
          {submitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </Card>
  );
}

