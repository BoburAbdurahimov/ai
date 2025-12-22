/**
 * Rate Limiting System with Redis
 * 
 * Complete rate limiting implementation for all endpoints
 * Addresses gaps: Login rate limiting, password reset, API limits, per-IP and per-user limits
 */

import { RedisClientType } from 'redis';

// ============================================
// TYPES
// ============================================

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests in window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  keyPrefix?: string; // Redis key prefix
  onLimitReached?: (key: string) => void; // Callback when limit reached
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
  retryAfter?: number; // Seconds to wait before retrying
}

// ============================================
// RATE LIMITER CLASS
// ============================================

export class RateLimiter {
  private redis: RedisClientType;
  
  constructor(redisClient: RedisClientType) {
    this.redis = redisClient;
  }
  
  /**
   * Check and consume rate limit
   * Uses sliding window algorithm for accuracy
   */
  async checkLimit(
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    const redisKey = `${config.keyPrefix || 'ratelimit'}:${key}`;
    
    // Use Redis transaction for atomic operations
    const multi = this.redis.multi();
    
    // Remove old entries outside the window
    multi.zRemRangeByScore(redisKey, 0, windowStart);
    
    // Count current requests in window
    multi.zCard(redisKey);
    
    // Add current request
    multi.zAdd(redisKey, { score: now, value: `${now}:${Math.random()}` });
    
    // Set expiry on key
    multi.expire(redisKey, Math.ceil(config.windowMs / 1000));
    
    const results = await multi.exec();
    
    // Extract count (second command result)
    const currentCount = (results?.[1] as number) || 0;
    
    const allowed = currentCount < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - currentCount - 1);
    const reset = now + config.windowMs;
    
    if (!allowed) {
      // Remove the request we just added since it's not allowed
      await this.redis.zRem(redisKey, `${now}:${Math.random()}`);
      
      // Calculate retry after
      const oldestTimestamp = await this.redis.zRange(redisKey, 0, 0, { REV: false });
      const retryAfter = oldestTimestamp[0] 
        ? Math.ceil((parseInt(oldestTimestamp[0].toString().split(':')[0]) + config.windowMs - now) / 1000)
        : Math.ceil(config.windowMs / 1000);
      
      if (config.onLimitReached) {
        config.onLimitReached(key);
      }
      
      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        reset,
        retryAfter,
      };
    }
    
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining,
      reset,
    };
  }
  
  /**
   * Check limit without consuming (peek)
   */
  async peekLimit(
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    const redisKey = `${config.keyPrefix || 'ratelimit'}:${key}`;
    
    // Remove old entries
    await this.redis.zRemRangeByScore(redisKey, 0, windowStart);
    
    // Count current requests
    const currentCount = await this.redis.zCard(redisKey);
    
    const allowed = currentCount < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - currentCount);
    const reset = now + config.windowMs;
    
    return {
      allowed,
      limit: config.maxRequests,
      remaining,
      reset,
    };
  }
  
  /**
   * Reset rate limit for a key
   */
  async resetLimit(key: string, keyPrefix: string = 'ratelimit'): Promise<void> {
    const redisKey = `${keyPrefix}:${key}`;
    await this.redis.del(redisKey);
  }
  
  /**
   * Get current usage for a key
   */
  async getUsage(
    key: string,
    config: RateLimitConfig
  ): Promise<{ count: number; limit: number; remaining: number }> {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    const redisKey = `${config.keyPrefix || 'ratelimit'}:${key}`;
    
    await this.redis.zRemRangeByScore(redisKey, 0, windowStart);
    const count = await this.redis.zCard(redisKey);
    
    return {
      count,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - count),
    };
  }
}

// ============================================
// PRE-CONFIGURED RATE LIMITERS
// ============================================

/**
 * Login rate limiting
 * 5 attempts per 15 minutes per account + per IP
 */
export const LOGIN_RATE_LIMIT: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  keyPrefix: 'login',
};

/**
 * Password reset rate limiting
 * 3 requests per hour per email
 */
export const PASSWORD_RESET_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  keyPrefix: 'password-reset',
};

/**
 * Email verification resend rate limiting
 * 5 resends per hour with 60 second cooldown
 */
export const EMAIL_VERIFICATION_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5,
  keyPrefix: 'email-verification',
};

/**
 * Email verification cooldown (between resends)
 * 1 request per 60 seconds
 */
export const EMAIL_VERIFICATION_COOLDOWN: RateLimitConfig = {
  windowMs: 60 * 1000, // 60 seconds
  maxRequests: 1,
  keyPrefix: 'email-verification-cooldown',
};

/**
 * Global API rate limiting - Authenticated users
 * 1000 requests per hour
 */
export const API_RATE_LIMIT_AUTHENTICATED: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1000,
  keyPrefix: 'api-auth',
};

/**
 * Global API rate limiting - Unauthenticated/IP
 * 100 requests per hour
 */
export const API_RATE_LIMIT_UNAUTHENTICATED: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 100,
  keyPrefix: 'api-unauth',
};

/**
 * Signup rate limiting - Per IP
 * 5 signups per hour per IP
 */
export const SIGNUP_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5,
  keyPrefix: 'signup',
};

// ============================================
// MIDDLEWARE
// ============================================

/**
 * Create Express middleware for rate limiting
 */
export function rateLimitMiddleware(
  rateLimiter: RateLimiter,
  config: RateLimitConfig,
  getKey: (req: any) => string
) {
  return async (req: any, res: any, next: any) => {
    try {
      const key = getKey(req);
      const result = await rateLimiter.checkLimit(key, config);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.reset);
      
      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfter || 60);
        
        return res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later',
            retryAfter: result.retryAfter,
            limit: result.limit,
            remaining: result.remaining,
            reset: result.reset,
          },
        });
      }
      
      next();
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      // On error, allow request (fail open)
      next();
    }
  };
}

/**
 * Combined rate limiter - checks multiple limits
 * Example: Login checks both per-account and per-IP limits
 */
export function combinedRateLimitMiddleware(
  rateLimiter: RateLimiter,
  limits: Array<{ config: RateLimitConfig; getKey: (req: any) => string; name: string }>
) {
  return async (req: any, res: any, next: any) => {
    try {
      for (const { config, getKey, name } of limits) {
        const key = getKey(req);
        const result = await rateLimiter.checkLimit(key, config);
        
        if (!result.allowed) {
          res.setHeader('X-RateLimit-Limit', result.limit);
          res.setHeader('X-RateLimit-Remaining', result.remaining);
          res.setHeader('X-RateLimit-Reset', result.reset);
          res.setHeader('Retry-After', result.retryAfter || 60);
          
          return res.status(429).json({
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: `Rate limit exceeded: ${name}`,
              retryAfter: result.retryAfter,
              limit: result.limit,
              remaining: result.remaining,
              reset: result.reset,
            },
          });
        }
      }
      
      // Set headers from the most restrictive limit
      const mostRestrictive = limits[0]; // Simplified - could calculate actual most restrictive
      const key = mostRestrictive.getKey(req);
      const result = await rateLimiter.peekLimit(key, mostRestrictive.config);
      
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.reset);
      
      next();
    } catch (error) {
      console.error('Combined rate limit middleware error:', error);
      next();
    }
  };
}

// ============================================
// SPECIAL RATE LIMITERS
// ============================================

/**
 * Progressive delay rate limiter
 * Adds exponential delays: 1s, 2s, 4s, 8s after failed attempts
 */
export class ProgressiveDelayLimiter {
  private redis: RedisClientType;
  
  constructor(redisClient: RedisClientType) {
    this.redis = redisClient;
  }
  
  /**
   * Record failed attempt and calculate delay
   */
  async recordFailure(key: string): Promise<{ delay: number; attempts: number }> {
    const redisKey = `progressive:${key}`;
    
    // Increment failure count
    const attempts = await this.redis.incr(redisKey);
    
    // Set expiry (reset after 15 minutes of no attempts)
    await this.redis.expire(redisKey, 15 * 60);
    
    // Calculate exponential delay
    const delay = Math.min(Math.pow(2, attempts - 1), 16); // Max 16 seconds
    
    return { delay, attempts };
  }
  
  /**
   * Reset failures on successful attempt
   */
  async recordSuccess(key: string): Promise<void> {
    const redisKey = `progressive:${key}`;
    await this.redis.del(redisKey);
  }
  
  /**
   * Get current delay for a key
   */
  async getDelay(key: string): Promise<number> {
    const redisKey = `progressive:${key}`;
    const attempts = await this.redis.get(redisKey);
    
    if (!attempts) return 0;
    
    return Math.min(Math.pow(2, parseInt(attempts) - 1), 16);
  }
}

/**
 * CAPTCHA trigger
 * Triggers CAPTCHA after N failed attempts
 */
export class CaptchaTrigger {
  private redis: RedisClientType;
  private threshold: number;
  
  constructor(redisClient: RedisClientType, threshold: number = 3) {
    this.redis = redisClient;
    this.threshold = threshold;
  }
  
  /**
   * Check if CAPTCHA should be required
   */
  async shouldRequireCaptcha(key: string): Promise<boolean> {
    const redisKey = `captcha-trigger:${key}`;
    const attempts = await this.redis.get(redisKey);
    
    return attempts ? parseInt(attempts) >= this.threshold : false;
  }
  
  /**
   * Record attempt
   */
  async recordAttempt(key: string, success: boolean): Promise<void> {
    const redisKey = `captcha-trigger:${key}`;
    
    if (success) {
      // Reset on success
      await this.redis.del(redisKey);
    } else {
      // Increment on failure
      await this.redis.incr(redisKey);
      await this.redis.expire(redisKey, 15 * 60); // 15 minutes
    }
  }
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Example 1: Login rate limiting (per account + per IP)
 * 
 * ```typescript
 * router.post('/auth/login',
 *   combinedRateLimitMiddleware(rateLimiter, [
 *     {
 *       config: LOGIN_RATE_LIMIT,
 *       getKey: (req) => `email:${req.body.email}`,
 *       name: 'per account'
 *     },
 *     {
 *       config: LOGIN_RATE_LIMIT,
 *       getKey: (req) => `ip:${req.ip}`,
 *       name: 'per IP'
 *     }
 *   ]),
 *   async (req, res) => {
 *     // Handle login
 *   }
 * );
 * ```
 */

/**
 * Example 2: Email verification with cooldown
 * 
 * ```typescript
 * router.post('/auth/resend-verification',
 *   combinedRateLimitMiddleware(rateLimiter, [
 *     {
 *       config: EMAIL_VERIFICATION_COOLDOWN,
 *       getKey: (req) => `email:${req.body.email}`,
 *       name: 'cooldown (60s between resends)'
 *     },
 *     {
 *       config: EMAIL_VERIFICATION_RATE_LIMIT,
 *       getKey: (req) => `email:${req.body.email}`,
 *       name: 'per hour (max 5)'
 *     }
 *   ]),
 *   async (req, res) => {
 *     // Resend verification email
 *   }
 * );
 * ```
 */

/**
 * Example 3: Global API rate limiting
 * 
 * ```typescript
 * app.use((req, res, next) => {
 *   const config = req.user 
 *     ? API_RATE_LIMIT_AUTHENTICATED 
 *     : API_RATE_LIMIT_UNAUTHENTICATED;
 *   
 *   const getKey = (req: any) => req.user 
 *     ? `user:${req.user.id}` 
 *     : `ip:${req.ip}`;
 *   
 *   return rateLimitMiddleware(rateLimiter, config, getKey)(req, res, next);
 * });
 * ```
 */

/**
 * Example 4: Progressive delay on failed logins
 * 
 * ```typescript
 * const delayLimiter = new ProgressiveDelayLimiter(redis);
 * 
 * router.post('/auth/login', async (req, res) => {
 *   const key = `login:${req.body.email}`;
 *   
 *   // Check delay before attempting login
 *   const delay = await delayLimiter.getDelay(key);
 *   if (delay > 0) {
 *     return res.status(429).json({
 *       error: `Please wait ${delay} seconds before trying again`
 *     });
 *   }
 *   
 *   // Attempt login
 *   const success = await attemptLogin(req.body.email, req.body.password);
 *   
 *   if (success) {
 *     await delayLimiter.recordSuccess(key);
 *     // Return success
 *   } else {
 *     const { delay, attempts } = await delayLimiter.recordFailure(key);
 *     return res.status(401).json({
 *       error: 'Invalid credentials',
 *       retryAfter: delay,
 *       attemptsRemaining: 5 - attempts
 *     });
 *   }
 * });
 * ```
 */

/**
 * Example 5: CAPTCHA trigger
 * 
 * ```typescript
 * const captchaTrigger = new CaptchaTrigger(redis, 3);
 * 
 * router.post('/auth/login', async (req, res) => {
 *   const key = `login:${req.body.email}`;
 *   
 *   // Check if CAPTCHA required
 *   const requiresCaptcha = await captchaTrigger.shouldRequireCaptcha(key);
 *   
 *   if (requiresCaptcha && !req.body.captchaToken) {
 *     return res.status(403).json({
 *       error: 'CAPTCHA required',
 *       code: 'CAPTCHA_REQUIRED'
 *     });
 *   }
 *   
 *   if (requiresCaptcha) {
 *     // Verify CAPTCHA token
 *     const captchaValid = await verifyCaptcha(req.body.captchaToken);
 *     if (!captchaValid) {
 *       return res.status(403).json({ error: 'Invalid CAPTCHA' });
 *     }
 *   }
 *   
 *   // Attempt login
 *   const success = await attemptLogin(req.body.email, req.body.password);
 *   
 *   // Record attempt
 *   await captchaTrigger.recordAttempt(key, success);
 *   
 *   // Return result
 * });
 * ```
 */

