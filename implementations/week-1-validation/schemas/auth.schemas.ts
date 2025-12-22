/**
 * Authentication & Authorization Validation Schemas
 * 
 * Complete Zod schemas for all auth-related inputs
 * Addresses gaps: Email validation, password validation, name validation
 */

import { z } from 'zod';

// ============================================
// HELPER VALIDATORS
// ============================================

/**
 * Email validation with comprehensive checks
 * - Max length: 254 chars (RFC 5321)
 * - Format validation
 * - Normalization: lowercase, trim
 * - Disposable email blocking (separate utility)
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(254, 'Email must not exceed 254 characters')
  .email('Invalid email format')
  .transform((email) => email.toLowerCase().trim());

/**
 * Password validation with security requirements
 * - Min: 8 chars, Max: 72 chars (bcrypt limit)
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - Optional: special characters
 * - Common password check (separate utility)
 * - Pwned password check (separate utility)
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must not exceed 72 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Strong password with special character requirement
 */
export const strongPasswordSchema = passwordSchema
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

/**
 * Name validation (user names, organization names)
 * - Length: 2-100 chars
 * - Unicode support (Cyrillic, Latin, Arabic, etc.)
 * - Allows: letters, spaces, apostrophes, hyphens
 * - No leading/trailing whitespace
 * - No profanity (separate utility)
 */
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .regex(
    /^[\p{L}\p{M}\s'\-]+$/u,
    'Name can only contain letters, spaces, apostrophes, and hyphens'
  )
  .transform((name) => name.trim())
  .refine((name) => name.length >= 2, 'Name must be at least 2 characters after trimming');

/**
 * Organization name with additional checks
 * - Reserved names blocked
 * - Slug generation safe
 */
const RESERVED_ORG_NAMES = [
  'admin', 'api', 'www', 'support', 'billing', 'status', 
  'help', 'docs', 'blog', 'mail', 'ftp', 'localhost',
  'dashboard', 'app', 'auth', 'login', 'signup', 'register'
];

export const organizationNameSchema = nameSchema
  .refine(
    (name) => !RESERVED_ORG_NAMES.includes(name.toLowerCase()),
    'This organization name is reserved'
  );

/**
 * Slug validation (for organization slugs)
 * - Lowercase letters, numbers, hyphens only
 * - No leading/trailing hyphens
 * - No consecutive hyphens
 */
export const slugSchema = z
  .string()
  .min(2, 'Slug must be at least 2 characters')
  .max(100, 'Slug must not exceed 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .refine(
    (slug) => !RESERVED_ORG_NAMES.includes(slug),
    'This slug is reserved'
  );

// ============================================
// AUTH ENDPOINT SCHEMAS
// ============================================

/**
 * POST /auth/signup
 * User registration with organization creation
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  organizationName: organizationNameSchema,
  industry: z.enum([
    'ecommerce',
    'healthcare',
    'finance',
    'education',
    'real_estate',
    'hospitality',
    'retail',
    'technology',
    'other'
  ]).optional(),
  language: z.enum(['ru', 'uz', 'en']).default('ru'),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
});

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * POST /auth/login
 * User authentication
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * POST /auth/refresh
 * Token refresh
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

/**
 * POST /auth/forgot-password
 * Password reset request
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * POST /auth/reset-password
 * Password reset with token
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * POST /auth/change-password
 * Change password (authenticated)
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  }
);

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * POST /auth/verify-email
 * Email verification with token
 */
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

/**
 * POST /auth/resend-verification
 * Resend verification email
 */
export const resendVerificationSchema = z.object({
  email: emailSchema,
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

// ============================================
// USER MANAGEMENT SCHEMAS
// ============================================

/**
 * PATCH /users/me
 * Update current user profile
 */
export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  language: z.enum(['ru', 'uz', 'en']).optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  notificationPrefs: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    sms: z.boolean().optional(),
    callAlerts: z.boolean().optional(),
    weeklyReport: z.boolean().optional(),
  }).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * POST /users (Invite user)
 * Invite new user to organization
 */
export const inviteUserSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  role: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER']),
  sendEmail: z.boolean().optional().default(true),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;

/**
 * PATCH /users/:userId
 * Update user (role change, etc.)
 */
export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  role: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER']).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * DELETE /users/:userId
 * Remove user from organization (soft delete)
 */
export const deleteUserSchema = z.object({
  transferCallsTo: z.string().cuid().optional(),
  reason: z.string().max(500).optional(),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

// ============================================
// ORGANIZATION SCHEMAS
// ============================================

/**
 * PATCH /organization
 * Update organization settings
 */
export const updateOrganizationSchema = z.object({
  name: organizationNameSchema.optional(),
  industry: z.enum([
    'ecommerce',
    'healthcare',
    'finance',
    'education',
    'real_estate',
    'hospitality',
    'retail',
    'technology',
    'other'
  ]).optional(),
  timezone: z.string().optional(),
  language: z.enum(['ru', 'uz', 'en']).optional(),
  billingEmail: emailSchema.optional(),
  supportEmail: emailSchema.optional(),
  website: z.string().url('Invalid website URL').optional(),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

/**
 * DELETE /organization
 * Delete organization (requires confirmation)
 */
export const deleteOrganizationSchema = z.object({
  confirmName: z.string(),
  reason: z.string().max(1000).optional(),
  exportData: z.boolean().optional().default(true),
});

export type DeleteOrganizationInput = z.infer<typeof deleteOrganizationSchema>;

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate and parse with Zod schema
 * Returns { success: true, data } or { success: false, errors }
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      success: true as const,
      data: result.data,
    };
  }
  
  return {
    success: false as const,
    errors: result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
}

/**
 * Validate or throw error (for use in try-catch)
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

