/**
 * Validation Middleware for Express/Next.js
 * 
 * Middleware to validate request bodies, params, and queries using Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sanitizeInput, SanitizationOptions } from '../validators/sanitization';

// ============================================
// TYPES
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: ValidationError[];
  };
}

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

/**
 * Create middleware to validate request body with Zod schema
 */
export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errors: ValidationError[] = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        const response: ValidationErrorResponse = {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: errors,
          },
        };
        
        return res.status(400).json(response);
      }
      
      // Replace req.body with validated data
      req.body = result.data;
      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error during validation',
        },
      });
    }
  };
}

/**
 * Create middleware to validate request params with Zod schema
 */
export function validateParams<T extends z.ZodTypeAny>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);
      
      if (!result.success) {
        const errors: ValidationError[] = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        const response: ValidationErrorResponse = {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request parameters',
            details: errors,
          },
        };
        
        return res.status(400).json(response);
      }
      
      req.params = result.data;
      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error during validation',
        },
      });
    }
  };
}

/**
 * Create middleware to validate request query with Zod schema
 */
export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        const errors: ValidationError[] = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        const response: ValidationErrorResponse = {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: errors,
          },
        };
        
        return res.status(400).json(response);
      }
      
      req.query = result.data as any;
      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error during validation',
        },
      });
    }
  };
}

// ============================================
// SANITIZATION MIDDLEWARE
// ============================================

/**
 * Middleware to sanitize all string inputs in request body
 */
export function sanitizeBody(options: SanitizationOptions = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body, options);
    }
    next();
  };
}

/**
 * Recursively sanitize all strings in an object
 */
function sanitizeObject(obj: any, options: SanitizationOptions): any {
  if (typeof obj === 'string') {
    const result = sanitizeInput(obj, options);
    
    if (result.blocked) {
      throw new Error(result.reason || 'Input blocked by sanitization');
    }
    
    return result.sanitized;
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, options));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value, options);
    }
    return sanitized;
  }
  
  return obj;
}

// ============================================
// REQUEST SIZE LIMIT MIDDLEWARE
// ============================================

/**
 * Middleware to enforce request body size limits
 */
export function requestSizeLimit(maxSize: number = 10 * 1024 * 1024) { // 10MB default
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: `Request body exceeds maximum size of ${maxSize} bytes`,
        },
      });
    }
    
    next();
  };
}

// ============================================
// NEXT.JS API ROUTE HELPERS
// ============================================

/**
 * Validate request in Next.js API route
 */
export async function validateNextRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: ValidationErrorResponse }> {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors: ValidationError[] = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    return {
      success: false,
      error: {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request',
          details: errors,
        },
      },
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
}

/**
 * Higher-order function to wrap Next.js API route with validation
 */
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (req: any, res: any, data: T) => Promise<void>
) {
  return async (req: any, res: any) => {
    const validation = await validateNextRequest(schema, req.body);
    
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }
    
    return handler(req, res, validation.data);
  };
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Example: Express route with validation
 * 
 * ```typescript
 * import { validateBody } from './middleware/validation.middleware';
 * import { signupSchema } from './schemas/auth.schemas';
 * 
 * router.post('/auth/signup',
 *   validateBody(signupSchema),
 *   async (req, res) => {
 *     // req.body is now typed and validated
 *     const { email, password, name } = req.body;
 *     // ... handle signup
 *   }
 * );
 * ```
 */

/**
 * Example: Next.js API route with validation
 * 
 * ```typescript
 * import { withValidation } from './middleware/validation.middleware';
 * import { signupSchema, SignupInput } from './schemas/auth.schemas';
 * 
 * export default withValidation(signupSchema, async (req, res, data: SignupInput) => {
 *   // data is typed and validated
 *   const { email, password, name } = data;
 *   // ... handle signup
 *   res.status(200).json({ success: true });
 * });
 * ```
 */

/**
 * Example: Multiple validations
 * 
 * ```typescript
 * router.post('/calls/:id/notes',
 *   validateParams(z.object({ id: z.string().cuid() })),
 *   validateBody(addCallNoteSchema),
 *   sanitizeBody({ escapeHtml: true, normalizeWhitespace: true }),
 *   async (req, res) => {
 *     const { id } = req.params;
 *     const { content } = req.body;
 *     // ... handle adding note
 *   }
 * );
 * ```
 */

