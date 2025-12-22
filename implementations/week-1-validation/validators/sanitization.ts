/**
 * Input Sanitization Utilities
 * 
 * Prevent XSS, SQL injection, and other injection attacks
 * - HTML sanitization
 * - SQL injection prevention
 * - Path traversal prevention
 * - NoSQL injection prevention
 */

// ============================================
// XSS PREVENTION
// ============================================

/**
 * HTML entities that need escaping
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'\/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Strip all HTML tags from string
 */
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize HTML - allow only safe tags
 * For rich text inputs, use a library like DOMPurify
 */
export function sanitizeHtml(html: string): string {
  // This is a basic implementation
  // For production, use DOMPurify: https://github.com/cure53/DOMPurify
  
  // Allowed tags (whitelist approach)
  const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li'];
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  // For more robust sanitization, use DOMPurify
  return sanitized;
}

// ============================================
// SQL INJECTION PREVENTION
// ============================================

/**
 * Escape single quotes for SQL
 * NOTE: Always use parameterized queries instead!
 * This is only for rare cases where dynamic SQL is necessary
 */
export function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

/**
 * Validate that input doesn't contain SQL injection patterns
 * This is a defense-in-depth measure, not a replacement for parameterized queries
 */
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bunion\b.*\bselect\b)/i,
    /(\bselect\b.*\bfrom\b)/i,
    /(\binsert\b.*\binto\b)/i,
    /(\bupdate\b.*\bset\b)/i,
    /(\bdelete\b.*\bfrom\b)/i,
    /(\bdrop\b.*\btable\b)/i,
    /(\bexec\b.*\(/i,
    /(\bexecute\b.*\(/i,
    /(;.*--)/, // Comment injection
    /('.*or.*'.*=.*')/, // Classic OR injection
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

// ============================================
// NOSQL INJECTION PREVENTION
// ============================================

/**
 * Sanitize MongoDB query operators
 * Prevents NoSQL injection by removing $ and . from keys
 */
export function sanitizeMongoQuery(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeMongoQuery);
  }
  
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Remove $ and . from keys (MongoDB operators)
    const sanitizedKey = key.replace(/[$\.]/g, '');
    sanitized[sanitizedKey] = sanitizeMongoQuery(value);
  }
  
  return sanitized;
}

/**
 * Validate that JSON input doesn't contain MongoDB operators
 */
export function containsMongoInjection(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  if (Array.isArray(obj)) {
    return obj.some(containsMongoInjection);
  }
  
  for (const [key, value] of Object.entries(obj)) {
    // Check for MongoDB operators
    if (key.startsWith('$') || key.includes('.')) {
      return true;
    }
    
    if (containsMongoInjection(value)) {
      return true;
    }
  }
  
  return false;
}

// ============================================
// PATH TRAVERSAL PREVENTION
// ============================================

/**
 * Sanitize file path to prevent directory traversal
 */
export function sanitizeFilePath(path: string): string {
  // Remove ../ and ..\\ patterns
  let sanitized = path.replace(/\.\.[\/\\]/g, '');
  
  // Remove leading slashes
  sanitized = sanitized.replace(/^[\/\\]+/, '');
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  return sanitized;
}

/**
 * Check if path contains traversal attempts
 */
export function containsPathTraversal(path: string): boolean {
  const patterns = [
    /\.\.[\/\\]/, // ../ or ..\
    /\/\.\./, // /..
    /\\\.\./, // \..
    /\0/, // Null byte
  ];
  
  return patterns.some(pattern => pattern.test(path));
}

// ============================================
// COMMAND INJECTION PREVENTION
// ============================================

/**
 * Escape shell command arguments
 * NOTE: Avoid executing shell commands with user input if possible!
 */
export function escapeShellArg(arg: string): string {
  // Wrap in single quotes and escape any single quotes
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

/**
 * Check if input contains shell command injection patterns
 */
export function containsCommandInjection(input: string): boolean {
  const patterns = [
    /[;&|`$()]/,  // Shell metacharacters
    /\n|\r/,      // Newlines
  ];
  
  return patterns.some(pattern => pattern.test(input));
}

// ============================================
// URL VALIDATION & SANITIZATION
// ============================================

/**
 * Validate URL protocol (whitelist approach)
 */
export function isAllowedProtocol(url: string): boolean {
  const allowedProtocols = ['http:', 'https:', 'ftp:'];
  
  try {
    const parsed = new URL(url);
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize URL - ensure it's safe to use
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // Only allow http, https, ftp protocols
    if (!['http:', 'https:', 'ftp:'].includes(parsed.protocol)) {
      return null;
    }
    
    // Prevent javascript: and data: protocols
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}

// ============================================
// PROFANITY FILTERING
// ============================================

/**
 * Basic profanity list
 * For production, use a library like bad-words or a service
 */
const PROFANITY_PATTERNS = [
  // Add patterns for profanity in Russian, Uzbek, English
  // This is intentionally minimal - use a proper library in production
  /\b(badword1|badword2)\b/i,
];

/**
 * Check if text contains profanity
 */
export function containsProfanity(text: string): boolean {
  return PROFANITY_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Filter profanity by replacing with asterisks
 */
export function filterProfanity(text: string): string {
  let filtered = text;
  
  for (const pattern of PROFANITY_PATTERNS) {
    filtered = filtered.replace(pattern, (match) => '*'.repeat(match.length));
  }
  
  return filtered;
}

// ============================================
// WHITESPACE NORMALIZATION
// ============================================

/**
 * Normalize whitespace in text
 * - Trim leading/trailing whitespace
 * - Replace multiple spaces with single space
 * - Remove zero-width characters
 */
export function normalizeWhitespace(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width chars
}

// ============================================
// UNICODE NORMALIZATION
// ============================================

/**
 * Normalize Unicode to prevent homograph attacks
 * Example: Cyrillic 'а' (U+0430) vs Latin 'a' (U+0061)
 */
export function normalizeUnicode(text: string): string {
  // NFC = Canonical Decomposition, followed by Canonical Composition
  return text.normalize('NFC');
}

/**
 * Detect potential homograph attack
 * Mixed scripts in domain names or identifiers
 */
export function hasMixedScripts(text: string): boolean {
  const scripts = new Set<string>();
  
  for (const char of text) {
    const code = char.charCodeAt(0);
    
    // Latin: 0x0000-0x007F, 0x0080-0x00FF
    if ((code >= 0x0000 && code <= 0x007F) || (code >= 0x0080 && code <= 0x00FF)) {
      scripts.add('latin');
    }
    // Cyrillic: 0x0400-0x04FF
    else if (code >= 0x0400 && code <= 0x04FF) {
      scripts.add('cyrillic');
    }
    // Arabic: 0x0600-0x06FF
    else if (code >= 0x0600 && code <= 0x06FF) {
      scripts.add('arabic');
    }
  }
  
  // If more than one script detected, it's mixed
  return scripts.size > 1;
}

// ============================================
// COMPREHENSIVE SANITIZATION
// ============================================

export interface SanitizationOptions {
  escapeHtml?: boolean;
  stripHtml?: boolean;
  normalizeWhitespace?: boolean;
  normalizeUnicode?: boolean;
  checkProfanity?: boolean;
  checkSqlInjection?: boolean;
  checkPathTraversal?: boolean;
  maxLength?: number;
}

export interface SanitizationResult {
  sanitized: string;
  warnings: string[];
  blocked: boolean;
  reason?: string;
}

/**
 * Comprehensive input sanitization
 */
export function sanitizeInput(
  input: string,
  options: SanitizationOptions = {}
): SanitizationResult {
  const warnings: string[] = [];
  let sanitized = input;
  
  // Length check
  if (options.maxLength && sanitized.length > options.maxLength) {
    return {
      sanitized: '',
      warnings: [],
      blocked: true,
      reason: `Input exceeds maximum length of ${options.maxLength} characters`,
    };
  }
  
  // Unicode normalization (should be done first)
  if (options.normalizeUnicode) {
    sanitized = normalizeUnicode(sanitized);
  }
  
  // Check for mixed scripts (potential homograph attack)
  if (hasMixedScripts(sanitized)) {
    warnings.push('Input contains mixed scripts (potential homograph attack)');
  }
  
  // SQL injection check
  if (options.checkSqlInjection && containsSqlInjection(sanitized)) {
    return {
      sanitized: '',
      warnings: [],
      blocked: true,
      reason: 'Input contains potential SQL injection patterns',
    };
  }
  
  // Path traversal check
  if (options.checkPathTraversal && containsPathTraversal(sanitized)) {
    return {
      sanitized: '',
      warnings: [],
      blocked: true,
      reason: 'Input contains path traversal patterns',
    };
  }
  
  // Profanity check
  if (options.checkProfanity && containsProfanity(sanitized)) {
    warnings.push('Input contains profanity');
    // Optionally filter it
    // sanitized = filterProfanity(sanitized);
  }
  
  // HTML sanitization
  if (options.stripHtml) {
    sanitized = stripHtml(sanitized);
  } else if (options.escapeHtml) {
    sanitized = escapeHtml(sanitized);
  }
  
  // Whitespace normalization
  if (options.normalizeWhitespace) {
    sanitized = normalizeWhitespace(sanitized);
  }
  
  return {
    sanitized,
    warnings,
    blocked: false,
  };
}

// ============================================
// HELPER: SAFE JSON PARSE
// ============================================

/**
 * Safely parse JSON with size limit
 */
export function safeJsonParse<T = any>(
  json: string,
  maxSize: number = 1024 * 1024 // 1MB default
): { success: true; data: T } | { success: false; error: string } {
  try {
    // Check size
    if (json.length > maxSize) {
      return {
        success: false,
        error: `JSON exceeds maximum size of ${maxSize} bytes`,
      };
    }
    
    const data = JSON.parse(json);
    
    // Check for MongoDB injection in parsed object
    if (containsMongoInjection(data)) {
      return {
        success: false,
        error: 'JSON contains potential NoSQL injection patterns',
      };
    }
    
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
}

