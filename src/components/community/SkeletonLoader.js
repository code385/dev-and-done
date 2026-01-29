'use client';

export function PostCardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-20 bg-muted rounded"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="flex gap-2 mt-4">
            <div className="h-6 bg-muted rounded w-16"></div>
            <div className="h-6 bg-muted rounded w-16"></div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="border border-border rounded-lg p-4 animate-pulse mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-muted rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-32"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-muted rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-muted rounded w-32"></div>
          <div className="h-4 bg-muted rounded w-24"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

