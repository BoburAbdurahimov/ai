/**
 * Billing Error State - Next.js 14 App Router
 * Handles errors gracefully with retry option
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function BillingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Billing page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 glass text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't load your billing information. This might be a temporary issue.
        </p>
        
        {error.message && (
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50 mb-6 text-left">
            <p className="text-xs font-mono text-muted-foreground">
              {error.message}
            </p>
          </div>
        )}
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Page
          </Button>
          <Button onClick={reset}>
            Try Again
          </Button>
        </div>
      </Card>
    </div>
  );
}
