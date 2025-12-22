/**
 * Authentication & Authorization Middleware
 * 
 * Middleware for Express/Next.js to:
 * - Verify authentication (JWT tokens)
 * - Load user from database
 * - Check permissions (RBAC)
 */

import { Request, Response, NextFunction } from 'express';
import { Role, Resource, Action, hasPermission, canAccessResource } from '../rbac/permissions';
import * as jwt from 'jsonwebtoken';

// ============================================
// TYPES
// ============================================

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  role: Role;
  isActive: boolean;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      requestId?: string;
    }
  }
}

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

/**
 * Verify JWT token and load user
 * Requires: Authorization: Bearer <token> header
 */
export function requireAuth(
  getUserById: (id: string) => Promise<AuthenticatedUser | null>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_MISSING',
            message: 'Authentication token is required',
          },
        });
      }
      
      const token = authHeader.substring(7); // Remove 'Bearer '
      
      // Verify token
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      
      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          return res.status(401).json({
            success: false,
            error: {
              code: 'TOKEN_EXPIRED',
              message: 'Authentication token has expired',
            },
          });
        }
        
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_INVALID',
            message: 'Invalid authentication token',
          },
        });
      }
      
      // Load user from database
      const user = await getUserById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }
      
      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'USER_INACTIVE',
            message: 'User account is inactive',
          },
        });
      }
      
      // Attach user to request
      req.user = user;
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error during authentication',
        },
      });
    }
  };
}

/**
 * Optional authentication - doesn't fail if no token
 * Useful for endpoints that work differently for authenticated vs anonymous users
 */
export function optionalAuth(
  getUserById: (id: string) => Promise<AuthenticatedUser | null>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // No token, continue without user
        return next();
      }
      
      const token = authHeader.substring(7);
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await getUserById(decoded.userId);
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Invalid token, continue without user
      }
      
      next();
    } catch (error) {
      console.error('Optional auth error:', error);
      next();
    }
  };
}

// ============================================
// AUTHORIZATION MIDDLEWARE (RBAC)
// ============================================

/**
 * Require specific role (or higher)
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
          requiredRoles: allowedRoles,
          currentRole: req.user.role,
        },
      });
    }
    
    next();
  };
}

/**
 * Require specific permission
 */
export function requirePermission(resource: Resource, action: Action) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }
    
    const hasAccess = hasPermission(req.user.role, resource, action);
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `You do not have permission to ${action} ${resource}`,
          requiredPermission: { resource, action },
          currentRole: req.user.role,
        },
      });
    }
    
    next();
  };
}

/**
 * Require resource access (any action)
 */
export function requireResourceAccess(resource: Resource) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }
    
    const hasAccess = canAccessResource(req.user.role, resource);
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `You do not have access to ${resource}`,
          resource,
          currentRole: req.user.role,
        },
      });
    }
    
    next();
  };
}

/**
 * Check ownership of resource
 * Use after loading resource to ensure user owns it
 */
export function requireOwnership(getOwnerId: (req: Request) => string | undefined) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }
    
    const ownerId = getOwnerId(req);
    
    if (!ownerId || ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You can only access your own resources',
        },
      });
    }
    
    next();
  };
}

/**
 * Check organization membership
 * Ensure resource belongs to user's organization
 */
export function requireOrganizationAccess(
  getOrganizationId: (req: Request) => string | undefined
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }
    
    const organizationId = getOrganizationId(req);
    
    if (!organizationId || organizationId !== req.user.organizationId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You can only access resources in your organization',
        },
      });
    }
    
    next();
  };
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Example 1: Basic authentication
 * 
 * ```typescript
 * router.get('/profile',
 *   requireAuth(getUserById),
 *   (req, res) => {
 *     // req.user is guaranteed to exist
 *     res.json({ user: req.user });
 *   }
 * );
 * ```
 */

/**
 * Example 2: Role-based access
 * 
 * ```typescript
 * router.delete('/organization',
 *   requireAuth(getUserById),
 *   requireRole(Role.OWNER),
 *   async (req, res) => {
 *     // Only OWNER can access this
 *   }
 * );
 * ```
 */

/**
 * Example 3: Permission-based access
 * 
 * ```typescript
 * router.post('/users',
 *   requireAuth(getUserById),
 *   requirePermission(Resource.USERS, Action.CREATE),
 *   async (req, res) => {
 *     // Only roles with user creation permission can access
 *   }
 * );
 * ```
 */

/**
 * Example 4: Ownership check
 * 
 * ```typescript
 * router.get('/calls/:id',
 *   requireAuth(getUserById),
 *   requirePermission(Resource.CALLS, Action.READ),
 *   async (req, res, next) => {
 *     const call = await getCall(req.params.id);
 *     
 *     // If user is OPERATOR, check ownership
 *     if (req.user!.role === Role.OPERATOR) {
 *       requireOwnership(() => call.handledByUserId)(req, res, next);
 *     } else {
 *       next();
 *     }
 *   },
 *   (req, res) => {
 *     // Return call data
 *   }
 * );
 * ```
 */

/**
 * Example 5: Combined middleware
 * 
 * ```typescript
 * router.patch('/users/:userId',
 *   requireAuth(getUserById),
 *   requirePermission(Resource.USERS, Action.UPDATE),
 *   requireOrganizationAccess((req) => req.body.organizationId),
 *   async (req, res) => {
 *     // Update user
 *   }
 * );
 * ```
 */

