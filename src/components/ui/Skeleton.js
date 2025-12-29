export default function Skeleton({ className = '', lines = 1 }) {
  if (lines === 1) {
    return (
      <div
        className={`animate-pulse bg-muted rounded ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-muted rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'} ${className}`}
          style={{ height: '1rem' }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

