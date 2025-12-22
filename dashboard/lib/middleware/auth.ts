/**
 * Authentication Middleware
 * Optional - ready to integrate with Clerk, NextAuth, or custom auth
 */

import { NextRequest } from 'next/server';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  permissions: string[];
}

/**
 * Verify API key (simple authentication)
 */
export async function verifyApiKey(request: NextRequest): Promise<boolean> {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.API_KEY;
  
  // If API_KEY is not set, allow all (development mode)
  if (!validApiKey) {
    return true;
  }
  
  return apiKey === validApiKey;
}

/**
 * Get authenticated user (placeholder for future auth integration)
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  // TODO: Integrate with Clerk/NextAuth
  // For now, return a mock admin user
  
  if (process.env.NODE_ENV === 'development') {
    return {
      id: 'dev-user',
      email: 'dev@example.com',
      role: 'admin',
      permissions: ['backup:create', 'backup:restore', 'backup:delete', 'system:status'],
    };
  }
  
  return null;
}

/**
 * Check if user has permission
 */
export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.permissions.includes(permission);
}

/**
 * Require authentication
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

/**
 * Require specific permission
 */
export async function requirePermission(
  request: NextRequest, 
  permission: string
): Promise<AuthUser> {
  const user = await requireAuth(request);
  
  if (!hasPermission(user, permission)) {
    throw new Error('Forbidden');
  }
  
  return user;
}
