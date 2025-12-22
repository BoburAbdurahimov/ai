/**
 * Email Validation Utilities
 * 
 * Advanced email validation beyond basic format checking
 * - Disposable email detection
 * - Corporate email verification
 * - Email normalization
 */

// ============================================
// DISPOSABLE EMAIL DOMAINS
// ============================================

/**
 * List of known disposable email domains
 * This should be updated periodically or use a service like:
 * - https://github.com/disposable-email-domains/disposable-email-domains
 * - https://www.mailinator.com/
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Temporary email services
  'mailinator.com',
  'guerrillamail.com',
  'temp-mail.org',
  '10minutemail.com',
  'throwaway.email',
  'getnada.com',
  'tempmail.com',
  'maildrop.cc',
  'mailnesia.com',
  'yopmail.com',
  'fakeinbox.com',
  'trashmail.com',
  'tempinbox.com',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'trbvm.com',
  'anonymbox.com',
  // Add more as needed
]);

/**
 * Check if email domain is disposable
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

/**
 * Load disposable domains from external source
 * Call this on app startup or periodically
 */
export async function loadDisposableDomainsFromAPI(): Promise<void> {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf'
    );
    const text = await response.text();
    const domains = text.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    domains.forEach(domain => DISPOSABLE_EMAIL_DOMAINS.add(domain.toLowerCase()));
    
    console.log(`Loaded ${domains.length} disposable email domains`);
  } catch (error) {
    console.error('Failed to load disposable email domains:', error);
  }
}

// ============================================
// CORPORATE EMAIL VERIFICATION
// ============================================

/**
 * Common free email providers
 * Corporate emails should NOT be from these domains
 */
const FREE_EMAIL_PROVIDERS = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.ru',
  'yandex.ru',
  'yandex.com',
  'protonmail.com',
  'zoho.com',
  // Add regional providers
  'mail.uz',
  'inbox.uz',
]);

/**
 * Check if email is from a corporate domain (not free provider)
 */
export function isCorporateEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return !FREE_EMAIL_PROVIDERS.has(domain);
}

/**
 * Require corporate email for Enterprise plans
 */
export function validateCorporateEmail(email: string, plan: string): { valid: boolean; error?: string } {
  if (plan !== 'ENTERPRISE') {
    return { valid: true };
  }
  
  if (!isCorporateEmail(email)) {
    return {
      valid: false,
      error: 'Enterprise plans require a corporate email address',
    };
  }
  
  return { valid: true };
}

// ============================================
// EMAIL NORMALIZATION
// ============================================

/**
 * Normalize email address
 * - Convert to lowercase
 * - Trim whitespace
 * - Handle Gmail plus addressing (optional)
 * - Handle Gmail dot addressing (optional)
 */
export interface NormalizeOptions {
  removePlus?: boolean; // Remove +tag from address
  removeDots?: boolean; // Remove dots from Gmail addresses (gmail ignores dots)
}

export function normalizeEmail(email: string, options: NormalizeOptions = {}): string {
  let normalized = email.toLowerCase().trim();
  
  const [localPart, domain] = normalized.split('@');
  if (!localPart || !domain) return normalized;
  
  let processedLocalPart = localPart;
  
  // Handle Gmail plus addressing
  if (options.removePlus && processedLocalPart.includes('+')) {
    processedLocalPart = processedLocalPart.split('+')[0];
  }
  
  // Handle Gmail dot addressing
  if (options.removeDots && domain === 'gmail.com') {
    processedLocalPart = processedLocalPart.replace(/\./g, '');
  }
  
  return `${processedLocalPart}@${domain}`;
}

// ============================================
// PLUS ADDRESSING HANDLING
// ============================================

/**
 * Check if email uses plus addressing
 */
export function hasPlus Addressing(email: string): boolean {
  const localPart = email.split('@')[0];
  return localPart?.includes('+') || false;
}

/**
 * Extract base email from plus addressing
 * user+tag@example.com → user@example.com
 */
export function getBaseEmail(email: string): string {
  return normalizeEmail(email, { removePlus: true });
}

/**
 * Extract tag from plus addressing
 * user+tag@example.com → tag
 */
export function getPlusTag(email: string): string | null {
  const localPart = email.split('@')[0];
  if (!localPart?.includes('+')) return null;
  
  const parts = localPart.split('+');
  return parts[1] || null;
}

// ============================================
// EMAIL UNIQUENESS CHECK
// ============================================

/**
 * Check if email is unique (considering normalization)
 * This should query your database
 */
export async function isEmailUnique(
  email: string,
  db: any, // Replace with your Prisma client type
  excludeUserId?: string
): Promise<boolean> {
  const normalized = normalizeEmail(email, { removePlus: true, removeDots: true });
  
  const existingUser = await db.user.findFirst({
    where: {
      email: normalized,
      id: excludeUserId ? { not: excludeUserId } : undefined,
      isDeleted: false,
    },
  });
  
  return !existingUser;
}

// ============================================
// COMPREHENSIVE EMAIL VALIDATION
// ============================================

export interface EmailValidationResult {
  valid: boolean;
  normalized: string;
  errors: string[];
  warnings: string[];
  metadata: {
    isDisposable: boolean;
    isCorporate: boolean;
    hasPlus: boolean;
    plusTag?: string;
  };
}

/**
 * Comprehensive email validation
 * Combines all checks into one function
 */
export async function validateEmailComprehensive(
  email: string,
  options: {
    blockDisposable?: boolean;
    requireCorporate?: boolean;
    plan?: string;
    checkUniqueness?: boolean;
    db?: any;
    excludeUserId?: string;
  } = {}
): Promise<EmailValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic format check (already done by Zod, but double-check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }
  
  // Normalize
  const normalized = normalizeEmail(email, { removePlus: true, removeDots: true });
  
  // Length check
  if (email.length > 254) {
    errors.push('Email must not exceed 254 characters');
  }
  
  // Disposable email check
  const isDisposable = isDisposableEmail(normalized);
  if (isDisposable && options.blockDisposable) {
    errors.push('Disposable email addresses are not allowed');
  } else if (isDisposable) {
    warnings.push('This is a disposable email address');
  }
  
  // Corporate email check
  const corporate = isCorporateEmail(normalized);
  if (options.requireCorporate && !corporate) {
    errors.push('A corporate email address is required');
  }
  
  // Plan-specific check
  if (options.plan === 'ENTERPRISE' && !corporate) {
    errors.push('Enterprise plans require a corporate email address');
  }
  
  // Uniqueness check
  if (options.checkUniqueness && options.db) {
    const unique = await isEmailUnique(normalized, options.db, options.excludeUserId);
    if (!unique) {
      errors.push('This email address is already registered');
    }
  }
  
  // Plus addressing metadata
  const hasPlus = hasPlusAddressing(email);
  const plusTag = hasPlus ? getPlusTag(email) : undefined;
  
  return {
    valid: errors.length === 0,
    normalized,
    errors,
    warnings,
    metadata: {
      isDisposable,
      isCorporate: corporate,
      hasPlus,
      plusTag,
    },
  };
}

// ============================================
// HELPER: EMAIL SUGGESTION
// ============================================

/**
 * Common email typos and suggestions
 */
const EMAIL_SUGGESTIONS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'hotmai.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
};

/**
 * Suggest correction for common email typos
 */
export function suggestEmailCorrection(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return null;
  
  const suggestion = EMAIL_SUGGESTIONS[domain];
  if (!suggestion) return null;
  
  const localPart = email.split('@')[0];
  return `${localPart}@${suggestion}`;
}

