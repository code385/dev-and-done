'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { addBookmark, removeBookmark, isBookmarked } from '@/lib/utils/bookmarks';
import toast from 'react-hot-toast';

export default function BookmarkButton({ contentId, contentType, title, url, image = '' }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(contentId, contentType));
  }, [contentId, contentType]);

  const handleToggle = () => {
    if (bookmarked) {
      if (removeBookmark(contentId, contentType)) {
        setBookmarked(false);
        toast.success('Removed from bookmarks');
      }
    } else {
      if (addBookmark(contentId, contentType, title, url, image)) {
        setBookmarked(true);
        toast.success('Added to bookmarks');
      } else {
        toast.error('Already bookmarked');
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? (
        <>
          <BookmarkCheck className="w-5 h-5 text-primary" fill="currentColor" />
          <span className="text-sm">Bookmarked</span>
        </>
      ) : (
        <>
          <Bookmark className="w-5 h-5" />
          <span className="text-sm">Bookmark</span>
        </>
      )}
    </button>
  );
}

