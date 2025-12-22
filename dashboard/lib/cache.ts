/**
 * Caching Utility
 * Simple in-memory cache with TTL support
 */

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 60000) { // 1 minute default
    this.store = new Map();
    this.defaultTTL = defaultTTL;
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, value: T, options?: CacheOptions): void {
    const ttl = options?.ttl || this.defaultTTL;
    const expiresAt = Date.now() + ttl;

    this.store.set(key, {
      value,
      expiresAt,
    });
  }

  /**
   * Get cache entry
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const value = this.get(key);
    return value !== null;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get or set (cache aside pattern)
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    this.set(key, value, options);
    return value;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.store.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.store.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Get cache stats
   */
  stats() {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }
}

// Export singleton instance
export const cache = new Cache();

// Pre-configured caches for different use cases
export const caches = {
  // 1 minute for frequently changing data
  short: new Cache(60 * 1000),
  
  // 5 minutes for relatively stable data
  medium: new Cache(5 * 60 * 1000),
  
  // 1 hour for rarely changing data
  long: new Cache(60 * 60 * 1000),
};

// Cache key builders
export const cacheKeys = {
  backupList: () => 'backups:list',
  backupDetails: (id: string) => `backup:${id}`,
  systemStatus: () => 'system:status',
  stats: () => 'system:stats',
};
