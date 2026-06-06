'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error reporting service here (Sentry, etc.)
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">🔧</div>
          <h1 className="text-3xl font-semibold mb-3">Something went wrong</h1>
          <p className="text-zinc-600 mb-8">
            We hit an unexpected error. This has been logged and we&apos;re looking into it.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => reset()} size="lg">
              Try again
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.location.href = '/'}
            >
              Go to homepage
            </Button>
          </div>

          <p className="text-xs text-zinc-400 mt-8">
            Error ID: {error.digest || 'unknown'}
          </p>
        </div>
      </body>
    </html>
  );
}
