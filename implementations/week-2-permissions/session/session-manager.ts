/**
 * Session Management System with Redis
 * 
 * Complete session management implementation
 * Addresses gaps: Session timeouts, concurrent sessions, session security
 */

import { createClient, RedisClientType } from 'redis';
import * as crypto from 'crypto';

// ============================================
// TYPES
// ============================================

export interface Session {
  sessionId: string;
  userId: string;
  organizationId: string;
  createdAt: number;
  lastActivityAt: number;
  expiresAt: number;
  device: {
    userAgent: string;
    ip: string;
    browser?: string;
    os?: string;
  };
  metadata?: Record<string, any>;
}

export interface SessionConfig {
  idleTimeout: number; // 30 minutes in seconds
  absoluteTimeout: number; // 24 hours in seconds
  maxConcurrentSessions: number; // 5
  rememberMeDuration: number; // 30 days in seconds
}

// ============================================
// DEFAULT CONFIGURATION
// ============================================

export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  idleTimeout: 30 * 60, // 30 minutes
  absoluteTimeout: 24 * 60 * 60, // 24 hours
  maxConcurrentSessions: 5,
  rememberMeDuration: 30 * 24 * 60 * 60, // 30 days
};

// ============================================
// SESSION MANAGER CLASS
// ============================================

export class SessionManager {
  private redis: RedisClientType;
  private config: SessionConfig;
  
  constructor(redisClient: RedisClientType, config: Partial<SessionConfig> = {}) {
    this.redis = redisClient;
    this.config = { ...DEFAULT_SESSION_CONFIG, ...config };
  }
  
  // ============================================
  // SESSION CREATION
  // ============================================
  
  /**
   * Create new session for user
   */
  async createSession(
    userId: string,
    organizationId: string,
    device: { userAgent: string; ip: string },
    rememberMe: boolean = false
  ): Promise<Session> {
    const now = Date.now();
    const sessionId = this.generateSessionId();
    
    // Parse user agent for device info
    const deviceInfo = this.parseUserAgent(device.userAgent);
    
    // Calculate expiry
    const timeout = rememberMe 
      ? this.config.rememberMeDuration 
      : this.config.absoluteTimeout;
    
    const session: Session = {
      sessionId,
      userId,
      organizationId,
      createdAt: now,
      lastActivityAt: now,
      expiresAt: now + (timeout * 1000),
      device: {
        ...device,
        ...deviceInfo,
      },
    };
    
    // Check concurrent sessions limit
    await this.enforceSessionLimit(userId);
    
    // Store session in Redis
    await this.storeSession(session);
    
    // Add to user's session list
    await this.addToUserSessions(userId, sessionId);
    
    return session;
  }
  
  /**
   * Generate cryptographically secure session ID
   */
  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  /**
   * Parse user agent string for device information
   */
  private parseUserAgent(userAgent: string): { browser?: string; os?: string } {
    // Simple parsing - for production, use a library like ua-parser-js
    const browser = userAgent.includes('Chrome') ? 'Chrome' 
      : userAgent.includes('Firefox') ? 'Firefox'
      : userAgent.includes('Safari') ? 'Safari'
      : 'Unknown';
    
    const os = userAgent.includes('Windows') ? 'Windows'
      : userAgent.includes('Mac') ? 'macOS'
      : userAgent.includes('Linux') ? 'Linux'
      : userAgent.includes('Android') ? 'Android'
      : userAgent.includes('iOS') ? 'iOS'
      : 'Unknown';
    
    return { browser, os };
  }
  
  // ============================================
  // SESSION RETRIEVAL & VALIDATION
  // ============================================
  
  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    const key = this.getSessionKey(sessionId);
    const data = await this.redis.get(key);
    
    if (!data) {
      return null;
    }
    
    return JSON.parse(data);
  }
  
  /**
   * Validate and refresh session
   * Checks: expiry, idle timeout, updates last activity
   */
  async validateSession(sessionId: string): Promise<{
    valid: boolean;
    session?: Session;
    reason?: string;
  }> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      return { valid: false, reason: 'Session not found' };
    }
    
    const now = Date.now();
    
    // Check absolute expiry
    if (now > session.expiresAt) {
      await this.destroySession(sessionId);
      return { valid: false, reason: 'Session expired (absolute timeout)' };
    }
    
    // Check idle timeout
    const idleTime = now - session.lastActivityAt;
    if (idleTime > this.config.idleTimeout * 1000) {
      await this.destroySession(sessionId);
      return { valid: false, reason: 'Session expired (idle timeout)' };
    }
    
    // Update last activity
    session.lastActivityAt = now;
    await this.storeSession(session);
    
    return { valid: true, session };
  }
  
  /**
   * Touch session (update last activity without full validation)
   */
  async touchSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;
    
    session.lastActivityAt = Date.now();
    await this.storeSession(session);
  }
  
  // ============================================
  // SESSION DESTRUCTION
  // ============================================
  
  /**
   * Destroy single session
   */
  async destroySession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;
    
    // Remove from Redis
    await this.redis.del(this.getSessionKey(sessionId));
    
    // Remove from user's session list
    await this.removeFromUserSessions(session.userId, sessionId);
  }
  
  /**
   * Destroy all sessions for a user
   * Use case: Logout from all devices, password change, role change
   */
  async destroyAllUserSessions(userId: string): Promise<number> {
    const sessionIds = await this.getUserSessions(userId);
    
    // Delete all sessions
    const pipeline = this.redis.multi();
    for (const sessionId of sessionIds) {
      pipeline.del(this.getSessionKey(sessionId));
    }
    await pipeline.exec();
    
    // Clear user's session list
    await this.redis.del(this.getUserSessionsKey(userId));
    
    return sessionIds.length;
  }
  
  /**
   * Destroy all sessions except current one
   * Use case: "Logout other devices" feature
   */
  async destroyOtherSessions(userId: string, keepSessionId: string): Promise<number> {
    const sessionIds = await this.getUserSessions(userId);
    const toDestroy = sessionIds.filter(id => id !== keepSessionId);
    
    if (toDestroy.length === 0) return 0;
    
    // Delete sessions
    const pipeline = this.redis.multi();
    for (const sessionId of toDestroy) {
      pipeline.del(this.getSessionKey(sessionId));
    }
    await pipeline.exec();
    
    // Update user's session list
    await this.redis.del(this.getUserSessionsKey(userId));
    await this.redis.sAdd(this.getUserSessionsKey(userId), keepSessionId);
    
    return toDestroy.length;
  }
  
  // ============================================
  // CONCURRENT SESSION MANAGEMENT
  // ============================================
  
  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<string[]> {
    const key = this.getUserSessionsKey(userId);
    return await this.redis.sMembers(key);
  }
  
  /**
   * Get detailed information about user's active sessions
   */
  async getUserSessionDetails(userId: string): Promise<Session[]> {
    const sessionIds = await this.getUserSessions(userId);
    
    const sessions: Session[] = [];
    for (const sessionId of sessionIds) {
      const session = await this.getSession(sessionId);
      if (session) {
        sessions.push(session);
      }
    }
    
    // Sort by last activity (most recent first)
    return sessions.sort((a, b) => b.lastActivityAt - a.lastActivityAt);
  }
  
  /**
   * Enforce maximum concurrent sessions
   * If limit exceeded, destroy oldest session
   */
  private async enforceSessionLimit(userId: string): Promise<void> {
    const sessions = await this.getUserSessionDetails(userId);
    
    if (sessions.length >= this.config.maxConcurrentSessions) {
      // Sort by last activity (oldest first)
      const sorted = sessions.sort((a, b) => a.lastActivityAt - b.lastActivityAt);
      
      // Destroy oldest session(s) to make room
      const toDestroy = sorted.slice(0, sessions.length - this.config.maxConcurrentSessions + 1);
      
      for (const session of toDestroy) {
        await this.destroySession(session.sessionId);
      }
    }
  }
  
  // ============================================
  // SESSION SECURITY
  // ============================================
  
  /**
   * Check for session hijacking
   * Compares IP address and user agent
   */
  async checkSessionSecurity(
    sessionId: string,
    currentIp: string,
    currentUserAgent: string
  ): Promise<{
    secure: boolean;
    warnings: string[];
  }> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return { secure: false, warnings: ['Session not found'] };
    }
    
    const warnings: string[] = [];
    
    // Check IP change
    if (session.device.ip !== currentIp) {
      warnings.push('IP address changed');
    }
    
    // Check user agent change
    if (session.device.userAgent !== currentUserAgent) {
      warnings.push('User agent changed');
    }
    
    // If both changed, likely hijacking
    const secure = warnings.length < 2;
    
    return { secure, warnings };
  }
  
  /**
   * Invalidate sessions on password change
   * Keep only current session (optional)
   */
  async invalidateOnPasswordChange(
    userId: string,
    keepCurrentSession?: string
  ): Promise<void> {
    if (keepCurrentSession) {
      await this.destroyOtherSessions(userId, keepCurrentSession);
    } else {
      await this.destroyAllUserSessions(userId);
    }
  }
  
  /**
   * Invalidate sessions on role change (downgrade only)
   */
  async invalidateOnRoleDowngrade(userId: string): Promise<void> {
    // Destroy all sessions to force re-authentication with new permissions
    await this.destroyAllUserSessions(userId);
  }
  
  // ============================================
  // HELPER METHODS
  // ============================================
  
  private getSessionKey(sessionId: string): string {
    return `session:${sessionId}`;
  }
  
  private getUserSessionsKey(userId: string): string {
    return `user:${userId}:sessions`;
  }
  
  private async storeSession(session: Session): Promise<void> {
    const key = this.getSessionKey(session.sessionId);
    const ttl = Math.floor((session.expiresAt - Date.now()) / 1000);
    
    await this.redis.setEx(key, ttl, JSON.stringify(session));
  }
  
  private async addToUserSessions(userId: string, sessionId: string): Promise<void> {
    await this.redis.sAdd(this.getUserSessionsKey(userId), sessionId);
  }
  
  private async removeFromUserSessions(userId: string, sessionId: string): Promise<void> {
    await this.redis.sRem(this.getUserSessionsKey(userId), sessionId);
  }
  
  // ============================================
  // CLEANUP & MAINTENANCE
  // ============================================
  
  /**
   * Clean up expired sessions
   * Should be run periodically (e.g., hourly cron job)
   */
  async cleanupExpiredSessions(): Promise<number> {
    // Redis automatically expires keys, but we need to clean up user session lists
    let cleaned = 0;
    
    // This would need to iterate through all users
    // In production, maintain a separate index of active users
    
    return cleaned;
  }
}

// ============================================
// SESSION MIDDLEWARE INTEGRATION
// ============================================

/**
 * Express middleware to load session
 */
export function sessionMiddleware(sessionManager: SessionManager) {
  return async (req: any, res: any, next: any) => {
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
    
    if (!sessionId) {
      return next();
    }
    
    const validation = await sessionManager.validateSession(sessionId);
    
    if (validation.valid && validation.session) {
      req.session = validation.session;
      req.sessionId = sessionId;
    }
    
    next();
  };
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Example 1: Login - Create session
 * 
 * ```typescript
 * const session = await sessionManager.createSession(
 *   user.id,
 *   user.organizationId,
 *   { userAgent: req.headers['user-agent'], ip: req.ip },
 *   req.body.rememberMe
 * );
 * 
 * res.cookie('sessionId', session.sessionId, {
 *   httpOnly: true,
 *   secure: true,
 *   sameSite: 'strict',
 *   maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
 * });
 * ```
 */

/**
 * Example 2: Validate session on each request
 * 
 * ```typescript
 * const validation = await sessionManager.validateSession(sessionId);
 * 
 * if (!validation.valid) {
 *   return res.status(401).json({ error: validation.reason });
 * }
 * ```
 */

/**
 * Example 3: Logout
 * 
 * ```typescript
 * await sessionManager.destroySession(sessionId);
 * res.clearCookie('sessionId');
 * ```
 */

/**
 * Example 4: Logout from all devices
 * 
 * ```typescript
 * const count = await sessionManager.destroyAllUserSessions(userId);
 * res.json({ message: `Logged out from ${count} devices` });
 * ```
 */

/**
 * Example 5: View active sessions
 * 
 * ```typescript
 * const sessions = await sessionManager.getUserSessionDetails(userId);
 * res.json({ sessions });
 * ```
 */

