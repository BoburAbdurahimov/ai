/**
 * Rate Limiting Middleware
 * Prevents API abuse and ensures fair usage
 */

import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  interval: number;  // Time window in ms
  uniqueTokenPerInterval?: number;  // Max unique tokens
};

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
          resolve();
        } else if (tokenCount[0] < limit) {
          tokenCache.set(token, [tokenCount[0] + 1]);
          resolve();
        } else {
          reject(new Error('Rate limit exceeded'));
        }
      }),
  };
}

// Pre-configured rate limiters
export const limiters = {
  // 10 requests per minute
  default: rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
  }),

  // 3 requests per minute (expensive operations)
  strict: rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 100,
  }),

  // 60 requests per minute (read operations)
  lenient: rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 1000,
  }),
};

/**
 * Get client identifier for rate limiting
 */
export function getClientId(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to user agent + timestamp bucket (less accurate)
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `${userAgent}-${Math.floor(Date.now() / 60000)}`;
}
