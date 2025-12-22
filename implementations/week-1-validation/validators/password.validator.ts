/**
 * Password Validation Utilities
 * 
 * Advanced password validation beyond basic requirements
 * - Common password detection
 * - Pwned password check (HaveIBeenPwned API)
 * - Password strength scoring
 * - Password history checking
 */

import * as crypto from 'crypto';

// ============================================
// COMMON PASSWORDS
// ============================================

/**
 * Top 100 most common passwords
 * Source: Various password breach databases
 * This list should be expanded or use a library like:
 * - https://github.com/danielmiessler/SecLists
 */
const COMMON_PASSWORDS = new Set([
  'password',
  'Password',
  'Password1',
  'Password123',
  'Password123!',
  '123456',
  '12345678',
  '123456789',
  'password1',
  'qwerty',
  'abc123',
  'monkey',
  '1234567',
  'letmein',
  'trustno1',
  'dragon',
  'baseball',
  'iloveyou',
  'master',
  'sunshine',
  'ashley',
  'bailey',
  'passw0rd',
  'shadow',
  '123123',
  '654321',
  'superman',
  'qazwsx',
  'michael',
  'football',
  'welcome',
  'jesus',
  'ninja',
  'mustang',
  'password1',
  '123456a',
  'password!',
  'password@',
  'admin',
  'admin123',
  'root',
  'toor',
  'pass',
  'test',
  'guest',
  'info',
  'adm',
  'mysql',
  'user',
  'administrator',
  'oracle',
  'ftp',
  'pi',
  'puppet',
  'ansible',
  'ec2-user',
  'vagrant',
  'azureuser',
  'qwerty123',
  '1q2w3e4r',
  '1q2w3e4r5t',
  'zaq12wsx',
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
]);

/**
 * Check if password is in common passwords list
 */
export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password);
}

// ============================================
// PWNED PASSWORDS CHECK (HaveIBeenPwned API)
// ============================================

/**
 * Check if password has been pwned using HaveIBeenPwned API
 * Uses k-anonymity model - only sends first 5 chars of SHA-1 hash
 * 
 * API: https://haveibeenpwned.com/API/v3#PwnedPasswords
 */
export async function isPwnedPassword(password: string): Promise<{
  isPwned: boolean;
  count?: number;
  error?: string;
}> {
  try {
    // Hash password with SHA-1
    const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    
    // Take first 5 chars for k-anonymity
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);
    
    // Query HaveIBeenPwned API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'User-Agent': 'AI-Call-Center-SaaS',
      },
    });
    
    if (!response.ok) {
      return {
        isPwned: false,
        error: 'Failed to check password against breach database',
      };
    }
    
    const text = await response.text();
    const hashes = text.split('\n');
    
    // Check if our password hash suffix is in the results
    for (const line of hashes) {
      const [hashSuffix, countStr] = line.split(':');
      if (hashSuffix === suffix) {
        return {
          isPwned: true,
          count: parseInt(countStr, 10),
        };
      }
    }
    
    return { isPwned: false };
  } catch (error) {
    console.error('Error checking pwned password:', error);
    return {
      isPwned: false,
      error: 'Failed to check password against breach database',
    };
  }
}

// ============================================
// PASSWORD STRENGTH SCORING
// ============================================

export interface PasswordStrength {
  score: number; // 0-4 (0=weak, 4=very strong)
  feedback: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Calculate password strength score
 * Based on zxcvbn-style scoring
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  
  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (varietyCount >= 3) score += 1;
  if (varietyCount === 4) score += 1;
  
  // Check for patterns
  const hasSequence = /(?:abc|bcd|cde|123|234|345|456)/i.test(password);
  const hasRepeating = /(.)\1{2,}/.test(password);
  const hasKeyboardPattern = /(?:qwer|asdf|zxcv|1qaz|2wsx)/i.test(password);
  
  if (hasSequence) {
    score -= 1;
    warnings.push('Contains sequential characters');
    suggestions.push('Avoid sequences like abc or 123');
  }
  
  if (hasRepeating) {
    score -= 1;
    warnings.push('Contains repeating characters');
    suggestions.push('Avoid repeated characters like aaa');
  }
  
  if (hasKeyboardPattern) {
    score -= 1;
    warnings.push('Contains keyboard patterns');
    suggestions.push('Avoid keyboard patterns like qwerty');
  }
  
  // Common password check
  if (isCommonPassword(password)) {
    score = 0;
    warnings.push('This is a commonly used password');
    suggestions.push('Choose a unique password');
  }
  
  // Ensure score is in valid range
  score = Math.max(0, Math.min(4, score));
  
  // Generate feedback
  if (score === 0) {
    feedback.push('Very weak password');
  } else if (score === 1) {
    feedback.push('Weak password');
  } else if (score === 2) {
    feedback.push('Fair password');
  } else if (score === 3) {
    feedback.push('Strong password');
  } else {
    feedback.push('Very strong password');
  }
  
  // Suggestions for improvement
  if (!hasUpper) suggestions.push('Add uppercase letters');
  if (!hasLower) suggestions.push('Add lowercase letters');
  if (!hasNumber) suggestions.push('Add numbers');
  if (!hasSpecial) suggestions.push('Add special characters');
  if (password.length < 12) suggestions.push('Use at least 12 characters');
  
  return { score, feedback, warnings, suggestions };
}

// ============================================
// PASSWORD HISTORY
// ============================================

/**
 * Hash password for storage in password history
 * Uses bcrypt or similar
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcrypt');
  return bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(password, hash);
}

/**
 * Check if password was used recently (password history)
 * Prevents reusing last N passwords
 */
export async function isPasswordInHistory(
  password: string,
  passwordHistory: string[], // Array of hashed passwords
  limit: number = 5
): Promise<boolean> {
  const recentPasswords = passwordHistory.slice(0, limit);
  
  for (const hash of recentPasswords) {
    const matches = await comparePassword(password, hash);
    if (matches) {
      return true;
    }
  }
  
  return false;
}

// ============================================
// COMPREHENSIVE PASSWORD VALIDATION
// ============================================

export interface PasswordValidationResult {
  valid: boolean;
  strength: PasswordStrength;
  errors: string[];
  warnings: string[];
  isPwned?: boolean;
  pwnedCount?: number;
}

/**
 * Comprehensive password validation
 * Combines all checks into one function
 */
export async function validatePasswordComprehensive(
  password: string,
  options: {
    checkPwned?: boolean;
    checkHistory?: boolean;
    passwordHistory?: string[];
    minStrengthScore?: number; // 0-4
  } = {}
): Promise<PasswordValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Length check (already done by Zod, but double-check)
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (password.length > 72) {
    errors.push('Password must not exceed 72 characters (bcrypt limit)');
  }
  
  // Basic requirements (already done by Zod, but double-check)
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Common password check
  if (isCommonPassword(password)) {
    errors.push('This password is too common. Please choose a more unique password');
  }
  
  // Strength check
  const strength = calculatePasswordStrength(password);
  warnings.push(...strength.warnings);
  
  if (options.minStrengthScore && strength.score < options.minStrengthScore) {
    errors.push(`Password strength is too weak (score: ${strength.score}/${options.minStrengthScore})`);
  }
  
  // Pwned password check
  let isPwned = false;
  let pwnedCount: number | undefined;
  
  if (options.checkPwned) {
    const pwnedResult = await isPwnedPassword(password);
    isPwned = pwnedResult.isPwned;
    pwnedCount = pwnedResult.count;
    
    if (isPwned) {
      errors.push(
        `This password has been exposed in ${pwnedCount?.toLocaleString()} data breaches. ` +
        'Please choose a different password'
      );
    }
    
    if (pwnedResult.error) {
      warnings.push(pwnedResult.error);
    }
  }
  
  // Password history check
  if (options.checkHistory && options.passwordHistory) {
    const inHistory = await isPasswordInHistory(password, options.passwordHistory);
    if (inHistory) {
      errors.push('You have used this password recently. Please choose a different password');
    }
  }
  
  return {
    valid: errors.length === 0,
    strength,
    errors,
    warnings,
    isPwned,
    pwnedCount,
  };
}

// ============================================
// PASSWORD GENERATION
// ============================================

/**
 * Generate a strong random password
 */
export function generateStrongPassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + special;
  
  let password = '';
  
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

