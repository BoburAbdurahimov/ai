/**
 * Supabase Auth Integration
 * User authentication and authorization helpers
 */

import { supabaseAdmin } from './client';
import { NextRequest } from 'next/server';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  metadata: Record<string, any>;
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    // Check user role from metadata
    const role = user.user_metadata?.role || 'user';

    return {
      id: user.id,
      email: user.email || '',
      role: role as 'admin' | 'user',
      metadata: user.user_metadata || {},
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Require authentication
 */
export async function requireAuth(request: Request): Promise<AuthUser> {
  const user = await getAuthUser(request);

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

/**
 * Require admin role
 */
export async function requireAdmin(request: Request): Promise<AuthUser> {
  const user = await requireAuth(request);

  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return user;
}

/**
 * Check if user has permission
 */
export function hasPermission(user: AuthUser, permission: string): boolean {
  // Admins have all permissions
  if (user.role === 'admin') {
    return true;
  }

  // Check user's permissions from metadata
  const permissions = user.metadata?.permissions || [];
  return permissions.includes(permission);
}

/**
 * Create new user with role
 */
export async function createUser(
  email: string,
  password: string,
  role: 'admin' | 'user' = 'user',
  metadata?: Record<string, any>
) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      ...metadata,
    },
  });

  if (error) throw error;
  return data.user;
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: 'admin' | 'user') {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      user_metadata: { role },
    }
  );

  if (error) throw error;
  return data.user;
}

/**
 * Delete user
 */
export async function deleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw error;
}

/**
 * List all users (admin only)
 */
export async function listUsers(page: number = 1, perPage: number = 50) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page,
    perPage,
  });

  if (error) throw error;
  return data.users;
}

/**
 * Generate password reset link
 */
export async function generatePasswordResetLink(email: string) {
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
  });

  if (error) throw error;
  return data;
}

/**
 * Generate magic link for passwordless login
 */
export async function generateMagicLink(email: string) {
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (error) throw error;
  return data;
}

/**
 * Verify user email
 */
export async function verifyUserEmail(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      email_confirm: true,
    }
  );

  if (error) throw error;
  return data.user;
}

/**
 * Ban user
 */
export async function banUser(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      ban_duration: 'none', // Permanent ban
    }
  );

  if (error) throw error;
  return data.user;
}

/**
 * Unban user
 */
export async function unbanUser(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      ban_duration: '0s',
    }
  );

  if (error) throw error;
  return data.user;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error) throw error;
  return data.user;
}

/**
 * Session management - Sign out user
 */
export async function signOutUser(userId: string) {
  // Revoke all sessions for user
  const { error } = await supabaseAdmin.auth.admin.signOut(userId, 'global');

  if (error) throw error;
}

/**
 * Get user sessions
 */
export async function getUserSessions(userId: string) {
  // Note: This is a placeholder - Supabase doesn't expose session listing
  // In production, you'd track sessions in your own table
  return [];
}
