'use client';

import { getReadingTime } from '@/lib/utils/readingTime';

export default function ReadingTime({ content, className = '' }) {
  if (!content) return null;

  const readingTime = getReadingTime(content);

  return (
    <span className={`text-sm text-muted-foreground ${className}`}>
      {readingTime}
    </span>
  );
}

