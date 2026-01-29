'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function VoteButtons({ 
  targetType, // 'post', 'question', 'answer', 'comment'
  targetId,
  upvoteCount = 0,
  downvoteCount = 0,
  userVote = null, // 'upvote', 'downvote', or null
  onVoteChange,
  className = '',
  size = 'md',
}) {
  const [votes, setVotes] = useState({ upvoteCount, downvoteCount });
  const [currentVote, setCurrentVote] = useState(userVote);
  const [loading, setLoading] = useState(false);

  const totalVotes = votes.upvoteCount - votes.downvoteCount;

  const handleVote = async (voteType) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/community/${targetType}s/${targetId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVotes({
          upvoteCount: data.voteCounts.upvoteCount,
          downvoteCount: data.voteCounts.downvoteCount,
        });
        setCurrentVote(data.userVote);
        
        if (onVoteChange) {
          onVoteChange(data);
        }
      } else {
        toast.error(data.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const buttonSize = size === 'sm' ? 'p-1' : 'p-2';
  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <button
        onClick={() => handleVote('upvote')}
        disabled={loading}
        className={`
          ${buttonSize} rounded transition-all duration-200
          ${currentVote === 'upvote' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label="Upvote"
      >
        <ChevronUp size={iconSize} />
      </button>
      
      <span className={`font-semibold ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
        {totalVotes}
      </span>
      
      <button
        onClick={() => handleVote('downvote')}
        disabled={loading}
        className={`
          ${buttonSize} rounded transition-all duration-200
          ${currentVote === 'downvote' 
            ? 'bg-destructive text-destructive-foreground' 
            : 'bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label="Downvote"
      >
        <ChevronDown size={iconSize} />
      </button>
    </div>
  );
}

