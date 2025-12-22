/**
 * Role-Based Access Control (RBAC) - Permission Matrix
 * 
 * Complete permission system for all roles and resources
 * Addresses gaps: Permission matrix, authorization edge cases
 */

// ============================================
// ROLES
// ============================================

export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
}

// ============================================
// RESOURCES & ACTIONS
// ============================================

export enum Resource {
  // Organization
  ORGANIZATION = 'organization',
  ORGANIZATION_SETTINGS = 'organization_settings',
  
  // Users
  USERS = 'users',
  USER_ROLES = 'user_roles',
  
  // Billing
  BILLING = 'billing',
  INVOICES = 'invoices',
  SUBSCRIPTION = 'subscription',
  
  // Calls
  CALLS = 'calls',
  CALL_NOTES = 'call_notes',
  CALL_TAGS = 'call_tags',
  CALL_RECORDINGS = 'call_recordings',
  
  // AI Configuration
  AI_CONFIG = 'ai_config',
  AI_TEST = 'ai_test',
  
  // Knowledge Base
  KNOWLEDGE = 'knowledge',
  
  // Phone Numbers
  PHONE_NUMBERS = 'phone_numbers',
  
  // Analytics
  ANALYTICS = 'analytics',
  REPORTS = 'reports',
  
  // Integrations
  INTEGRATIONS = 'integrations',
}

export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage', // Full control (create, read, update, delete)
}

// ============================================
// PERMISSION TYPE
// ============================================

export interface Permission {
  resource: Resource;
  action: Action;
  conditions?: PermissionCondition[];
}

export type PermissionCondition = 
  | { type: 'own'; field: string } // Can only access own resources
  | { type: 'organization'; field: string } // Can only access org resources
  | { type: 'custom'; check: (user: any, resource: any) => boolean };

// ============================================
// PERMISSION MATRIX
// ============================================

/**
 * Complete permission matrix for all roles
 * This is the single source of truth for authorization
 */
export const PERMISSION_MATRIX: Record<Role, Permission[]> = {
  // ============================================
  // OWNER - Full access to everything
  // ============================================
  [Role.OWNER]: [
    // Organization
    { resource: Resource.ORGANIZATION, action: Action.MANAGE },
    { resource: Resource.ORGANIZATION_SETTINGS, action: Action.MANAGE },
    
    // Users
    { resource: Resource.USERS, action: Action.MANAGE },
    { resource: Resource.USER_ROLES, action: Action.MANAGE },
    
    // Billing (OWNER only)
    { resource: Resource.BILLING, action: Action.MANAGE },
    { resource: Resource.INVOICES, action: Action.READ },
    { resource: Resource.SUBSCRIPTION, action: Action.MANAGE },
    
    // Calls
    { resource: Resource.CALLS, action: Action.MANAGE },
    { resource: Resource.CALL_NOTES, action: Action.MANAGE },
    { resource: Resource.CALL_TAGS, action: Action.MANAGE },
    { resource: Resource.CALL_RECORDINGS, action: Action.READ },
    
    // AI Configuration
    { resource: Resource.AI_CONFIG, action: Action.MANAGE },
    { resource: Resource.AI_TEST, action: Action.CREATE },
    
    // Knowledge Base
    { resource: Resource.KNOWLEDGE, action: Action.MANAGE },
    
    // Phone Numbers
    { resource: Resource.PHONE_NUMBERS, action: Action.MANAGE },
    
    // Analytics
    { resource: Resource.ANALYTICS, action: Action.READ },
    { resource: Resource.REPORTS, action: Action.MANAGE },
    
    // Integrations
    { resource: Resource.INTEGRATIONS, action: Action.MANAGE },
  ],
  
  // ============================================
  // ADMIN - Full access except billing
  // ============================================
  [Role.ADMIN]: [
    // Organization (read/update, no delete)
    { resource: Resource.ORGANIZATION_SETTINGS, action: Action.READ },
    { resource: Resource.ORGANIZATION_SETTINGS, action: Action.UPDATE },
    
    // Users
    { resource: Resource.USERS, action: Action.MANAGE },
    { resource: Resource.USER_ROLES, action: Action.MANAGE },
    
    // Billing (read only)
    { resource: Resource.INVOICES, action: Action.READ },
    
    // Calls
    { resource: Resource.CALLS, action: Action.MANAGE },
    { resource: Resource.CALL_NOTES, action: Action.MANAGE },
    { resource: Resource.CALL_TAGS, action: Action.MANAGE },
    { resource: Resource.CALL_RECORDINGS, action: Action.READ },
    
    // AI Configuration
    { resource: Resource.AI_CONFIG, action: Action.MANAGE },
    { resource: Resource.AI_TEST, action: Action.CREATE },
    
    // Knowledge Base
    { resource: Resource.KNOWLEDGE, action: Action.MANAGE },
    
    // Phone Numbers
    { resource: Resource.PHONE_NUMBERS, action: Action.MANAGE },
    
    // Analytics
    { resource: Resource.ANALYTICS, action: Action.READ },
    { resource: Resource.REPORTS, action: Action.MANAGE },
    
    // Integrations
    { resource: Resource.INTEGRATIONS, action: Action.MANAGE },
  ],
  
  // ============================================
  // MANAGER - Team management + view all calls
  // ============================================
  [Role.MANAGER]: [
    // Organization (read only)
    { resource: Resource.ORGANIZATION_SETTINGS, action: Action.READ },
    
    // Users (can invite, no delete)
    { resource: Resource.USERS, action: Action.READ },
    { resource: Resource.USERS, action: Action.CREATE },
    { resource: Resource.USERS, action: Action.UPDATE },
    
    // Calls (view all, add notes/tags)
    { resource: Resource.CALLS, action: Action.READ },
    { resource: Resource.CALL_NOTES, action: Action.CREATE },
    { resource: Resource.CALL_NOTES, action: Action.READ },
    { resource: Resource.CALL_TAGS, action: Action.CREATE },
    { resource: Resource.CALL_TAGS, action: Action.READ },
    { resource: Resource.CALL_RECORDINGS, action: Action.READ },
    
    // AI Configuration (read only, can test)
    { resource: Resource.AI_CONFIG, action: Action.READ },
    { resource: Resource.AI_TEST, action: Action.CREATE },
    
    // Knowledge Base (view and create)
    { resource: Resource.KNOWLEDGE, action: Action.READ },
    { resource: Resource.KNOWLEDGE, action: Action.CREATE },
    { resource: Resource.KNOWLEDGE, action: Action.UPDATE },
    
    // Phone Numbers (update routing only)
    { resource: Resource.PHONE_NUMBERS, action: Action.READ },
    { resource: Resource.PHONE_NUMBERS, action: Action.UPDATE },
    
    // Analytics
    { resource: Resource.ANALYTICS, action: Action.READ },
    { resource: Resource.REPORTS, action: Action.READ },
    { resource: Resource.REPORTS, action: Action.CREATE },
    
    // Integrations (read only)
    { resource: Resource.INTEGRATIONS, action: Action.READ },
  ],
  
  // ============================================
  // OPERATOR - Handle calls, view own data
  // ============================================
  [Role.OPERATOR]: [
    // Calls (view own, add notes/tags to own calls)
    { 
      resource: Resource.CALLS, 
      action: Action.READ,
      conditions: [{ type: 'own', field: 'handledByUserId' }],
    },
    { 
      resource: Resource.CALL_NOTES, 
      action: Action.CREATE,
      conditions: [{ type: 'own', field: 'call.handledByUserId' }],
    },
    { 
      resource: Resource.CALL_NOTES, 
      action: Action.READ,
      conditions: [{ type: 'own', field: 'call.handledByUserId' }],
    },
    { 
      resource: Resource.CALL_TAGS, 
      action: Action.CREATE,
      conditions: [{ type: 'own', field: 'call.handledByUserId' }],
    },
    { 
      resource: Resource.CALL_RECORDINGS, 
      action: Action.READ,
      conditions: [{ type: 'own', field: 'handledByUserId' }],
    },
    
    // AI Configuration (read only)
    { resource: Resource.AI_CONFIG, action: Action.READ },
    
    // Knowledge Base (view only)
    { resource: Resource.KNOWLEDGE, action: Action.READ },
    
    // Phone Numbers (view only)
    { resource: Resource.PHONE_NUMBERS, action: Action.READ },
  ],
  
  // ============================================
  // VIEWER - Read-only access
  // ============================================
  [Role.VIEWER]: [
    // Organization (read only)
    { resource: Resource.ORGANIZATION_SETTINGS, action: Action.READ },
    
    // Calls (view all, no modifications)
    { resource: Resource.CALLS, action: Action.READ },
    { resource: Resource.CALL_NOTES, action: Action.READ },
    { resource: Resource.CALL_TAGS, action: Action.READ },
    { resource: Resource.CALL_RECORDINGS, action: Action.READ },
    
    // AI Configuration (read only)
    { resource: Resource.AI_CONFIG, action: Action.READ },
    
    // Knowledge Base (view only)
    { resource: Resource.KNOWLEDGE, action: Action.READ },
    
    // Phone Numbers (view only)
    { resource: Resource.PHONE_NUMBERS, action: Action.READ },
    
    // Analytics (view only)
    { resource: Resource.ANALYTICS, action: Action.READ },
  ],
};

// ============================================
// PERMISSION CHECKING
// ============================================

/**
 * Check if user has permission for a specific action on a resource
 */
export function hasPermission(
  userRole: Role,
  resource: Resource,
  action: Action,
  context?: {
    user?: any;
    resourceData?: any;
  }
): boolean {
  const permissions = PERMISSION_MATRIX[userRole];
  
  // Check for exact permission match
  const exactMatch = permissions.find(
    p => p.resource === resource && p.action === action
  );
  
  if (exactMatch) {
    // Check conditions if any
    if (exactMatch.conditions && context) {
      return checkConditions(exactMatch.conditions, context);
    }
    return true;
  }
  
  // Check for MANAGE permission (includes all actions)
  const managePermission = permissions.find(
    p => p.resource === resource && p.action === Action.MANAGE
  );
  
  if (managePermission) {
    // Check conditions if any
    if (managePermission.conditions && context) {
      return checkConditions(managePermission.conditions, context);
    }
    return true;
  }
  
  return false;
}

/**
 * Check permission conditions
 */
function checkConditions(
  conditions: PermissionCondition[],
  context: { user?: any; resourceData?: any }
): boolean {
  for (const condition of conditions) {
    if (condition.type === 'own') {
      // Check if resource belongs to user
      const resourceValue = getNestedValue(context.resourceData, condition.field);
      if (resourceValue !== context.user?.id) {
        return false;
      }
    } else if (condition.type === 'organization') {
      // Check if resource belongs to user's organization
      const resourceValue = getNestedValue(context.resourceData, condition.field);
      if (resourceValue !== context.user?.organizationId) {
        return false;
      }
    } else if (condition.type === 'custom') {
      // Custom condition check
      if (!condition.check(context.user, context.resourceData)) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Get nested value from object using dot notation
 * Example: getNestedValue(obj, 'call.handledByUserId')
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Check if user can perform multiple actions
 */
export function hasAnyPermission(
  userRole: Role,
  checks: Array<{ resource: Resource; action: Action }>
): boolean {
  return checks.some(({ resource, action }) => 
    hasPermission(userRole, resource, action)
  );
}

/**
 * Check if user can perform all actions
 */
export function hasAllPermissions(
  userRole: Role,
  checks: Array<{ resource: Resource; action: Action }>
): boolean {
  return checks.every(({ resource, action }) => 
    hasPermission(userRole, resource, action)
  );
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return PERMISSION_MATRIX[role];
}

/**
 * Check if role can access a resource at all (any action)
 */
export function canAccessResource(userRole: Role, resource: Resource): boolean {
  const permissions = PERMISSION_MATRIX[userRole];
  return permissions.some(p => p.resource === resource);
}

// ============================================
// ROLE HIERARCHY
// ============================================

/**
 * Role hierarchy (higher number = more permissions)
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.OWNER]: 5,
  [Role.ADMIN]: 4,
  [Role.MANAGER]: 3,
  [Role.OPERATOR]: 2,
  [Role.VIEWER]: 1,
};

/**
 * Check if user role is higher or equal in hierarchy
 */
export function isRoleHigherOrEqual(userRole: Role, targetRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole];
}

/**
 * Check if user can change another user's role
 */
export function canChangeRole(
  userRole: Role,
  targetCurrentRole: Role,
  targetNewRole: Role
): boolean {
  // Must have permission to manage user roles
  if (!hasPermission(userRole, Resource.USER_ROLES, Action.UPDATE)) {
    return false;
  }
  
  // Can't change role to a higher role than your own
  if (ROLE_HIERARCHY[targetNewRole] >= ROLE_HIERARCHY[userRole]) {
    return false;
  }
  
  // Can't change role of someone with equal or higher role
  if (ROLE_HIERARCHY[targetCurrentRole] >= ROLE_HIERARCHY[userRole]) {
    return false;
  }
  
  return true;
}

// ============================================
// SPECIAL RULES
// ============================================

/**
 * Check if organization can be deleted
 * Rules:
 * - Only OWNER can delete
 * - Must not have active calls
 * - Must confirm by typing organization name
 */
export function canDeleteOrganization(
  userRole: Role,
  hasActiveCalls: boolean,
  confirmed: boolean
): { allowed: boolean; reason?: string } {
  if (userRole !== Role.OWNER) {
    return { allowed: false, reason: 'Only organization owners can delete the organization' };
  }
  
  if (hasActiveCalls) {
    return { allowed: false, reason: 'Cannot delete organization with active calls' };
  }
  
  if (!confirmed) {
    return { allowed: false, reason: 'Must confirm organization name to delete' };
  }
  
  return { allowed: true };
}

/**
 * Check if user can be removed from organization
 * Rules:
 * - Can't remove last OWNER
 * - Can't remove users with higher or equal role
 */
export function canRemoveUser(
  actorRole: Role,
  targetRole: Role,
  isLastOwner: boolean
): { allowed: boolean; reason?: string } {
  if (!hasPermission(actorRole, Resource.USERS, Action.DELETE)) {
    return { allowed: false, reason: 'Insufficient permissions to remove users' };
  }
  
  if (isLastOwner && targetRole === Role.OWNER) {
    return { allowed: false, reason: 'Cannot remove the last owner from organization' };
  }
  
  if (!isRoleHigherOrEqual(actorRole, targetRole)) {
    return { allowed: false, reason: 'Cannot remove users with equal or higher role' };
  }
  
  return { allowed: true };
}

/**
 * Check if OWNER can demote themselves
 * Rules:
 * - Yes, but requires confirmation
 * - Must not be the last OWNER
 */
export function canOwnerDemoteSelf(
  isLastOwner: boolean,
  confirmed: boolean
): { allowed: boolean; reason?: string } {
  if (isLastOwner) {
    return { allowed: false, reason: 'Cannot demote yourself as the last owner' };
  }
  
  if (!confirmed) {
    return { allowed: false, reason: 'Must confirm self-demotion' };
  }
  
  return { allowed: true };
}

