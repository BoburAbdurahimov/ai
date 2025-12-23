// Thin wrapper to use the compiled TypeScript rate limiter with Redis when available.
const { createClient } = require('redis');

let rateLimiterInstance = null;
let redisClient = null;

function getRateLimiter() {
  if (rateLimiterInstance) return rateLimiterInstance;

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const { RateLimiter } = require('../../backend/dist/implementations/week-3-api/rate-limiting/rate-limiter');

  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
  if (!redisUrl) {
    console.warn('[RATE LIMITER] REDIS_URL not set; skipping rate limiting.');
    return null;
  }

  redisClient = createClient({ url: redisUrl });
  redisClient.on('error', (err) => console.error('[REDIS ERROR]', err));

  redisClient.connect().catch((err) => console.error('[REDIS CONNECT ERROR]', err));
  rateLimiterInstance = new RateLimiter(redisClient);
  return rateLimiterInstance;
}

async function checkRateLimit(key, config) {
  const limiter = getRateLimiter();
  if (!limiter) {
    return { allowed: true, remaining: Number.MAX_SAFE_INTEGER, limit: Number.MAX_SAFE_INTEGER };
  }
  return limiter.checkLimit(key, config);
}

module.exports = {
  checkRateLimit
};

