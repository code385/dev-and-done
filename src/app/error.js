'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to analytics
    if (error) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error',
          error: error.message,
          stack: error.stack,
        }),
      }).catch(() => {});
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-error">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  );
}

