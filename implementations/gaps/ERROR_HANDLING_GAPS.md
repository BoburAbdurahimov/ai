# Error Handling Gaps - Complete List

**Purpose:** All error handling, error response, and error state gaps  
**Status:** Basic error responses ⏳ OPEN, user-facing error states ⏳ OPEN

---

## ERROR HANDLING OVERVIEW

**Total Error Handling Gaps:** 48  
**Closed:** 1 (2%) - Rate limit error format partially done  
**Open:** 47 (98%) - Standardized formats, frontend states, tracking

---

## ⏳ OPEN: API ERROR RESPONSE STANDARDS (8 gaps)

### CATEGORY 1: STANDARDIZED ERROR RESPONSE FORMATS

## GAP-151 ⏳ OPEN
**Priority:** P0  
**Category:** Error Response  
**Requirement:** 400 Validation Error with field-specific details  
**Decision:** Consistent format with error code, message, and field-level details  
**Implementation:**
```typescript
// Type definitions
interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
  constraint?: string;
}

interface ValidationErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: ValidationErrorDetail[];
    timestamp: string;
    requestId: string;
  };
}

// Error class
class ValidationError extends Error {
  public statusCode = 400;
  public code = 'VALIDATION_ERROR';
  public details: ValidationErrorDetail[];
  
  constructor(message: string, details: ValidationErrorDetail[]) {
    super(message);
    this.details = details;
    this.name = 'ValidationError';
  }
}

// Example usage
throw new ValidationError('Invalid input', [
  { field: 'email', message: 'Email already exists', constraint: 'unique' },
  { field: 'password', message: 'Password must contain uppercase letter', constraint: 'pattern' }
]);

// Response format
const errorResponse: ValidationErrorResponse = {
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input',
    details: [
      { field: 'email', message: 'Email already exists' },
      { field: 'password', message: 'Password must contain uppercase letter' }
    ],
    timestamp: new Date().toISOString(),
    requestId: req.id
  }
};
```
**Action:** Implement standardized 400 validation error format

---

## GAP-152 ⏳ OPEN
**Priority:** P0  
**Category:** Error Response  
**Requirement:** 401 Unauthorized - differentiate expired vs invalid vs missing  
**Decision:** Specific error codes for each authentication failure type  
**Implementation:**
```typescript
// Type definitions
type UnauthorizedErrorCode = 
  | 'TOKEN_MISSING'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'TOKEN_REVOKED'
  | 'USER_INACTIVE'
  | 'USER_NOT_FOUND';

interface UnauthorizedErrorResponse {
  success: false;
  error: {
    code: UnauthorizedErrorCode;
    message: string;
    timestamp: string;
    requestId: string;
  };
}

// Error class
class UnauthorizedError extends Error {
  public statusCode = 401;
  public code: UnauthorizedErrorCode;
  
  constructor(code: UnauthorizedErrorCode, message?: string) {
    super(message || getDefaultMessage(code));
    this.code = code;
    this.name = 'UnauthorizedError';
  }
}

function getDefaultMessage(code: UnauthorizedErrorCode): string {
  const messages = {
    TOKEN_MISSING: 'Authentication token is required',
    TOKEN_EXPIRED: 'Authentication token has expired',
    TOKEN_INVALID: 'Invalid authentication token',
    TOKEN_REVOKED: 'Authentication token has been revoked',
    USER_INACTIVE: 'User account is inactive',
    USER_NOT_FOUND: 'User not found'
  };
  return messages[code];
}

// Usage in auth middleware
if (!token) {
  throw new UnauthorizedError('TOKEN_MISSING');
}

try {
  decoded = jwt.verify(token, JWT_SECRET);
} catch (error) {
  if (error instanceof jwt.TokenExpiredError) {
    throw new UnauthorizedError('TOKEN_EXPIRED');
  }
  throw new UnauthorizedError('TOKEN_INVALID');
}

// Response format
const errorResponse: UnauthorizedErrorResponse = {
  success: false,
  error: {
    code: 'TOKEN_EXPIRED',
    message: 'Authentication token has expired',
    timestamp: new Date().toISOString(),
    requestId: req.id
  }
};
```
**Action:** Implement differentiated 401 error codes

---

## GAP-153 ⏳ OPEN
**Priority:** P0  
**Category:** Error Response  
**Requirement:** 403 Forbidden with permission details  
**Decision:** Include required permission, current role, and specific action  
**Implementation:**
```typescript
// Type definitions
interface ForbiddenErrorResponse {
  success: false;
  error: {
    code: 'INSUFFICIENT_PERMISSIONS';
    message: string;
    requiredPermission?: {
      resource: string;
      action: string;
    };
    requiredRole?: string | string[];
    currentRole: string;
    timestamp: string;
    requestId: string;
  };
}

// Error class
class ForbiddenError extends Error {
  public statusCode = 403;
  public code = 'INSUFFICIENT_PERMISSIONS';
  public requiredPermission?: { resource: string; action: string };
  public requiredRole?: string | string[];
  public currentRole: string;
  
  constructor(options: {
    message: string;
    currentRole: string;
    requiredPermission?: { resource: string; action: string };
    requiredRole?: string | string[];
  }) {
    super(options.message);
    this.currentRole = options.currentRole;
    this.requiredPermission = options.requiredPermission;
    this.requiredRole = options.requiredRole;
    this.name = 'ForbiddenError';
  }
}

// Usage in permission middleware
if (!hasPermission(req.user.role, resource, action)) {
  throw new ForbiddenError({
    message: `You do not have permission to ${action} ${resource}`,
    currentRole: req.user.role,
    requiredPermission: { resource, action }
  });
}

// Response format
const errorResponse: ForbiddenErrorResponse = {
  success: false,
  error: {
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'You need ADMIN role to perform this action',
    requiredRole: ['ADMIN', 'OWNER'],
    currentRole: 'OPERATOR',
    timestamp: new Date().toISOString(),
    requestId: req.id
  }
};
```
**Action:** Implement 403 error with permission context

---

## GAP-154 ⏳ OPEN
**Priority:** P0  
**Category:** Error Response  
**Requirement:** 404 Not Found with resource type  
**Decision:** Include resource type, resource ID, and helpful suggestions  
**Implementation:**
```typescript
// Type definitions
interface NotFoundErrorResponse {
  success: false;
  error: {
    code: 'RESOURCE_NOT_FOUND';
    message: string;
    resourceType: string;
    resourceId: string;
    suggestions?: string[];
    timestamp: string;
    requestId: string;
  };
}

// Error class
class NotFoundError extends Error {
  public statusCode = 404;
  public code = 'RESOURCE_NOT_FOUND';
  public resourceType: string;
  public resourceId: string;
  public suggestions?: string[];
  
  constructor(resourceType: string, resourceId: string, suggestions?: string[]) {
    super(`${resourceType} not found: ${resourceId}`);
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    this.suggestions = suggestions;
    this.name = 'NotFoundError';
  }
}

// Usage
const call = await db.call.findUnique({ where: { id: req.params.id } });
if (!call) {
  throw new NotFoundError('call', req.params.id, [
    'Check that the call ID is correct',
    'You may not have access to this call',
    'The call may have been deleted'
  ]);
}

// Response format
const errorResponse: NotFoundErrorResponse = {
  success: false,
  error: {
    code: 'RESOURCE_NOT_FOUND',
    message: 'Call not found',
    resourceType: 'call',
    resourceId: 'call_abc123xyz',
    suggestions: [
      'Check that the call ID is correct',
      'You may not have access to this call'
    ],
    timestamp: new Date().toISOString(),
    requestId: req.id
  }
};
```
**Action:** Implement 404 error with resource context

---

## GAP-155 ⏳ OPEN
**Priority:** P0  
**Category:** Error Response  
**Requirement:** 409 Conflict with conflict field  
**Decision:** Identify specific field causing conflict and provide resolution  
**Implementation:**
```typescript
// Type definitions
interface ConflictErrorResponse {
  success: false;
  error: {
    code: 'RESOURCE_CONFLICT';
    message: string;
    conflictField: string;
    conflictValue?: any;
    existingResourceId?: string;
    resolution?: string;
    timestamp: string;
    requestId: string;
  };
}

// Error class
class ConflictError extends Error {
  public statusCode = 409;
  public code = 'RESOURCE_CONFLICT';
  public conflictField: string;
  public conflictValue?: any;
  public existingResourceId?: string;
  public resolution?: string;
  
  constructor(options: {
    message: string;
    conflictField: string;
    conflictValue?: any;
    existingResourceId?: string;
    resolution?: string;
  }) {
    super(options.message);
    this.conflictField = options.conflictField;
    this.conflictValue = options.conflictValue;
    this.existingResourceId = options.existingResourceId;
    this.resolution = options.resolution;
    this.name = 'ConflictError';
  }
}

// Usage
const existing = await db.user.findUnique({ where: { email: req.body.email } });
if (existing) {
  throw new ConflictError({
    message: 'Email already registered',
    conflictField: 'email',
    conflictValue: req.body.email,
    existingResourceId: existing.id,
    resolution: 'Use a different email or try logging in'
  });
}

// Response format
const errorResponse: ConflictErrorResponse = {
  success: false,
  error: {
    code: 'RESOURCE_CONFLICT',
    message: 'Email already registered',
    conflictField: 'email',
    conflictValue: 'user@example.com',
    resolution: 'Use a different email or try logging in',
    timestamp: new Date().toISOString(),
    requestId: req.id
  }
};
```
**Action:** Implement 409 conflict error with field context

---

## GAP-156 ⏳ OPEN
**Priority:** P0  
**Category:** Error Response  
**Requirement:** 422 Unprocessable Entity with quota details  
**Decision:** Include quota information, usage, and upgrade options  
**Implementation:**
```typescript
// Type definitions
interface QuotaExceededErrorResponse {
  success: false;
  error: {
    code: 'QUOTA_EXCEEDED';
    message: string;
    quotaType: 'call_minutes' | 'team_members' | 'phone_numbers' | 'storage' | 'knowledge_items';
    quota: {
      limit: number;
      used: number;
      remaining: number;
      unit?: string;
    };
    currentPlan: string;
    upgradeOptions?: Array<{
      plan: string;
      newLimit: number;
      price: number;
    }>;
    timestamp: string;
    requestId: string;
  };
}

// Error class
class QuotaExceededError extends Error {
  public statusCode = 422;
  public code = 'QUOTA_EXCEEDED';
  public quotaType: string;
  public quota: { limit: number; used: number; remaining: number; unit?: string };
  public currentPlan: string;
  public upgradeOptions?: Array<{ plan: string; newLimit: number; price: number }>;
  
  constructor(options: {
    message: string;
    quotaType: string;
    quota: { limit: number; used: number; remaining: number; unit?: string };
    currentPlan: string;
    upgradeOptions?: Array<{ plan: string; newLimit: number; price: number }>;
  }) {
    super(options.message);
    Object.assign(this, options);
    this.name = 'QuotaExceededError';
  }
}

// Usage
if (org.usedMinutes >= org.callMinutesQuota) {
  throw new QuotaExceededError({
    message: 'Call minutes quota exceeded',
    quotaType: 'call_minutes',
    quota: {
      limit: org.callMinutesQuota,
      used: org.usedMinutes,
      remaining: 0,
      unit: 'minutes'
    },
    currentPlan: org.plan,
    upgradeOptions: [
      { plan: 'PROFESSIONAL', newLimit: 1000, price: 199 },
      { plan: 'ENTERPRISE', newLimit: 5000, price: 499 }
    ]
  });
}

// Response format
const errorResponse: QuotaExceededErrorResponse = {
  success: false,
  error: {
    code: 'QUOTA_EXCEEDED',
    message: 'Call minutes quota exceeded',
    quotaType: 'call_minutes',
    quota: {
      limit: 300,
      used: 300,
      remaining: 0,
      unit: 'minutes'
    },
    currentPlan: 'STARTER',
    upgradeOptions: [
      { plan: 'PROFESSIONAL', newLimit: 1000, price: 199 }
    ],
    timestamp: new Date().toISOString(),
    requestId: req.id
  }
};
```
**Action:** Implement 422 quota exceeded error with upgrade info

---

## GAP-157 ✅ PARTIALLY CLOSED
**Priority:** P0  
**Category:** Error Response  
**Requirement:** 429 Rate Limit with retry info  
**Decision:** Already implemented in rate limiter, verify completeness  
**Status:** Rate limiter includes limit, remaining, reset, retryAfter  
**Action:** Verify all rate-limited endpoints use consistent format
```typescript
// Already implemented in rate-limiter.ts
// Verify this format is used everywhere:
const errorResponse = {
  success: false,
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests',
    retryAfter: 3600, // seconds
    limit: 1000,
    remaining: 0,
    reset: 1640188800, // Unix timestamp
    timestamp: new Date().toISOString(),
    requestId: req.id
  }
};

// Headers already set by rate limiter:
// X-RateLimit-Limit: 1000
// X-RateLimit-Remaining: 0
// X-RateLimit-Reset: 1640188800
// Retry-After: 3600
```

---

## GAP-158 ⏳ OPEN
**Priority:** P1  
**Category:** Error Response  
**Requirement:** 503 Service Unavailable with maintenance info  
**Decision:** Include maintenance window, estimated downtime, retry after  
**Implementation:**
```typescript
// Type definitions
interface ServiceUnavailableErrorResponse {
  success: false;
  error: {
    code: 'SERVICE_MAINTENANCE' | 'SERVICE_OVERLOADED' | 'DEPENDENCY_UNAVAILABLE';
    message: string;
    maintenanceWindow?: {
      start: string;
      end: string;
    };
    estimatedDowntime?: string;
    affectedServices?: string[];
    retryAfter: number; // seconds
    statusPageUrl?: string;
    timestamp: string;
    requestId: string;
  };
}

// Error class
class ServiceUnavailableError extends Error {
  public statusCode = 503;
  public code: 'SERVICE_MAINTENANCE' | 'SERVICE_OVERLOADED' | 'DEPENDENCY_UNAVAILABLE';
  public retryAfter: number;
  public maintenanceWindow?: { start: string; end: string };
  public estimatedDowntime?: string;
  
  constructor(options: {
    code: 'SERVICE_MAINTENANCE' | 'SERVICE_OVERLOADED' | 'DEPENDENCY_UNAVAILABLE';
    message: string;
    retryAfter: number;
    maintenanceWindow?: { start: string; end: string };
    estimatedDowntime?: string;
  }) {
    super(options.message);
    Object.assign(this, options);
    this.name = 'ServiceUnavailableError';
  }
}

// Maintenance mode middleware
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true';
const MAINTENANCE_START = process.env.MAINTENANCE_START;
const MAINTENANCE_END = process.env.MAINTENANCE_END;

function maintenanceModeMiddleware(req: Request, res: Response, next: NextFunction) {
  if (MAINTENANCE_MODE) {
    throw new ServiceUnavailableError({
      code: 'SERVICE_MAINTENANCE',
      message: 'System is under scheduled maintenance',
      retryAfter: 1800, // 30 minutes
      maintenanceWindow: {
        start: MAINTENANCE_START,
        end: MAINTENANCE_END
      },
      estimatedDowntime: '30 minutes'
    });
  }
  next();
}

// Response format
const errorResponse: ServiceUnavailableErrorResponse = {
  success: false,
  error: {
    code: 'SERVICE_MAINTENANCE',
    message: 'System is under scheduled maintenance',
    maintenanceWindow: {
      start: '2024-12-22T02:00:00Z',
      end: '2024-12-22T02:30:00Z'
    },
    estimatedDowntime: '30 minutes',
    retryAfter: 1800,
    statusPageUrl: 'https://status.callcenterai.uz',
    timestamp: new Date().toISOString(),
    requestId: req.id
  }
};
```
**Action:** Implement 503 maintenance mode error

---

### CATEGORY 2: ERROR HANDLING MIDDLEWARE

## GAP-417 ⏳ OPEN
**Priority:** P0  
**Category:** Error Tracking  
**Requirement:** Error tracking with Sentry integration  
**Decision:** Capture all errors, group by type, include user context  
**Implementation:**
```typescript
import * as Sentry from '@sentry/node';

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
});

// Request handler (must be first)
app.use(Sentry.Handlers.requestHandler());

// Error handler (must be after routes)
app.use(Sentry.Handlers.errorHandler());

// Custom error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Set user context
  if (req.user) {
    Sentry.setUser({
      id: req.user.id,
      email: req.user.email,
      username: req.user.name,
      organizationId: req.user.organizationId,
      role: req.user.role
    });
  }
  
  // Set request context
  Sentry.setContext('request', {
    url: req.url,
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body
  });
  
  // Capture exception
  Sentry.captureException(err);
  
  // Format error response
  const errorResponse = formatErrorResponse(err, req);
  
  res.status(errorResponse.statusCode).json(errorResponse.body);
});

function formatErrorResponse(err: any, req: Request) {
  const requestId = req.id || crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  // Known error types
  if (err instanceof ValidationError) {
    return {
      statusCode: 400,
      body: {
        success: false,
        error: {
          code: err.code,
          message: err.message,
          details: err.details,
          timestamp,
          requestId
        }
      }
    };
  }
  
  if (err instanceof UnauthorizedError) {
    return {
      statusCode: 401,
      body: {
        success: false,
        error: {
          code: err.code,
          message: err.message,
          timestamp,
          requestId
        }
      }
    };
  }
  
  // ... handle other error types ...
  
  // Unknown error - log and return generic message
  console.error('Unhandled error:', err);
  
  return {
    statusCode: 500,
    body: {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production' 
          ? 'An unexpected error occurred' 
          : err.message,
        timestamp,
        requestId
      }
    }
  };
}
```
**Action:** Implement Sentry error tracking

---

## FRONTEND ERROR STATES (30+ gaps)

### GAP-214 to GAP-226: Onboarding Error States (13 gaps)
**Implementation:** React components with error state handling

```typescript
// Email verification states
const EmailVerification = () => {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error' | 'rate_limited'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number>(0);
  
  const sendVerification = async () => {
    setState('loading');
    
    try {
      await api.post('/auth/resend-verification', { email });
      setState('success');
    } catch (err) {
      if (err.response?.status === 429) {
        setState('rate_limited');
        setRetryAfter(err.response.data.error.retryAfter);
      } else {
        setState('error');
        setError(err.response?.data?.error?.message || 'Failed to send email');
      }
    }
  };
  
  return (
    <>
      {state === 'loading' && <LoadingState />}
      {state === 'success' && <SuccessState />}
      {state === 'error' && <ErrorState error={error} onRetry={sendVerification} />}
      {state === 'rate_limited' && <RateLimitState retryAfter={retryAfter} />}
    </>
  );
};
```

---

## SUMMARY TABLE

| Category | Gaps | Closed | Open | Priority |
|----------|------|--------|------|----------|
| **API Error Response Formats** | 8 | 1 | 7 | P0 |
| **Error Tracking & Middleware** | 6 | 0 | 6 | P0-P1 |
| **Frontend Error States** | 34 | 0 | 34 | P1-P2 |
| **TOTAL** | **48** | **1** | **47** | - |

---

## NEXT STEP

**47 error handling gaps need implementation.**

**Should I:**
1. **Continue documenting** remaining frontend error states (34 gaps)
2. **Start implementing** P0 API error formats (7 gaps)
3. **Create error utilities** - Base error classes and middleware first
4. **Your direction** - Specify priority

Please specify how to proceed.

