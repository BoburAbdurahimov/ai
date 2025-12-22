# Operational Gaps Audit - Part 2: API & Data Models

**Date:** December 22, 2025  
**Audit Focus:** API Endpoints, Data Models, Integrity

---

## 🌐 API ENDPOINT GAPS

### 1. Input Validation - MISSING PER ENDPOINT

#### POST /auth/signup
- ❌ Email: max 254, disposable check, normalization
- ❌ Password: 8-72 chars, complexity check, pwned check
- ❌ Name: 2-100 chars, unicode support
- ❌ OrganizationName: 2-100 chars, reserved names check
- ❌ Industry: enum validation (list not defined)

#### POST /auth/login
- ❌ Email: format validation
- ❌ Password: length validation only
- ❌ Rate limit: 5 attempts per 15 min
- ❌ CAPTCHA: after 3 failed attempts

#### PATCH /users/me
- ❌ Name: 2-100 chars
- ❌ Language: enum ["ru", "uz", "en"]
- ❌ Notification preferences: schema validation
- ❌ Avatar: file type (jpg, png, webp), max size 2MB

#### POST /users (Invite)
- ❌ Email: uniqueness check within org
- ❌ Role: enum validation
- ❌ Quota check: team member limit
- ❌ Duplicate invitation prevention

#### GET /calls
- ❌ Page: min 1, max 1000
- ❌ Limit: min 1, max 100, default 20
- ❌ Date range: max 90 days span
- ❌ Search: min 3 chars, max 50 chars
- ❌ Invalid filter combinations

#### POST /calls/:id/notes
- ❌ Content: min 1, max 5000 chars
- ❌ Call ownership validation
- ❌ Call must be completed

#### POST /calls/:id/tags
- ❌ Tag name: max 50 chars each
- ❌ Max tags per call: 10
- ❌ Tag whitelist/blacklist
- ❌ Duplicate tag prevention

#### PATCH /ai/config
- ❌ assistantName: 2-50 chars
- ❌ greetingMessage: 10-500 chars
- ❌ closingMessage: 10-500 chars
- ❌ tone: enum ["professional", "friendly", "formal"]
- ❌ transferRules: JSON schema validation

#### POST /knowledge
- ❌ Question: 10-500 chars
- ❌ Answer: 10-5000 chars
- ❌ Category: max 50 chars
- ❌ Duplicate question detection
- ❌ Max knowledge items: 1000 (Starter), 5000 (Pro), Unlimited (Enterprise)

#### POST /phone-numbers
- ❌ Number format: E.164 validation
- ❌ Country code: supported countries list
- ❌ Quota check: phone number limit
- ❌ Provider availability check
- ❌ Duplicate number prevention

### 2. Error Handling - INCONSISTENT

**Missing Error Responses:**

- ❌ **400 Validation Error** - Needs specific field errors
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input",
      "details": [
        {"field": "email", "message": "Email already exists"},
        {"field": "password", "message": "Password too weak"}
      ]
    }
  }
  ```

- ❌ **401 Unauthorized** - Token expired vs invalid vs missing
  ```json
  {
    "error": {
      "code": "TOKEN_EXPIRED",
      "message": "Authentication token has expired"
    }
  }
  ```

- ❌ **403 Forbidden** - Specific permission missing
  ```json
  {
    "error": {
      "code": "INSUFFICIENT_PERMISSIONS",
      "message": "You need ADMIN role to perform this action",
      "requiredRole": "ADMIN",
      "currentRole": "OPERATOR"
    }
  }
  ```

- ❌ **404 Not Found** - Resource type unclear
  ```json
  {
    "error": {
      "code": "RESOURCE_NOT_FOUND",
      "message": "Call not found",
      "resourceType": "call",
      "resourceId": "call_123"
    }
  }
  ```

- ❌ **409 Conflict** - Specific conflict reason
  ```json
  {
    "error": {
      "code": "RESOURCE_CONFLICT",
      "message": "Email already registered",
      "conflictField": "email"
    }
  }
  ```

- ❌ **422 Unprocessable Entity** - Business logic failures
  ```json
  {
    "error": {
      "code": "QUOTA_EXCEEDED",
      "message": "Call minutes quota exceeded",
      "quota": {
        "limit": 1000,
        "used": 1000,
        "remaining": 0
      }
    }
  }
  ```

- ❌ **429 Rate Limit** - Retry information missing
  ```json
  {
    "error": {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Too many requests",
      "retryAfter": 3600,
      "limit": 1000,
      "remaining": 0,
      "reset": 1640188800
    }
  }
  ```

- ❌ **503 Service Unavailable** - Maintenance mode
  ```json
  {
    "error": {
      "code": "SERVICE_MAINTENANCE",
      "message": "System is under maintenance",
      "estimatedDowntime": "30 minutes",
      "retryAfter": 1800
    }
  }
  ```

### 3. Response Headers - MISSING

**Standard Headers:**
- ❌ `X-Request-ID` - For tracing/debugging
- ❌ `X-RateLimit-Limit` - Total requests allowed
- ❌ `X-RateLimit-Remaining` - Requests remaining
- ❌ `X-RateLimit-Reset` - Unix timestamp of reset
- ❌ `Retry-After` - Seconds to wait (429, 503)
- ❌ `X-Response-Time` - Server processing time (ms)

### 4. Pagination - INCOMPLETE

**Missing Standards:**
- ❌ Cursor-based pagination for large datasets
- ❌ Total count optional (performance impact)
- ❌ Max page size enforcement (100)
- ❌ Links to first/last/next/prev pages
- ❌ Consistent pagination structure

**Recommended Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1247,
    "pages": 63,
    "hasNext": true,
    "hasPrev": false
  },
  "links": {
    "first": "/calls?page=1&limit=20",
    "next": "/calls?page=2&limit=20",
    "last": "/calls?page=63&limit=20"
  }
}
```

### 5. Idempotency - MISSING

**POST/PATCH/DELETE Operations:**
- ❌ `Idempotency-Key` header support
- ❌ Key storage: 24 hours
- ❌ Duplicate detection
- ❌ Response caching for duplicate requests

**Critical for:**
- Payment operations
- Call creation/updates
- User invitations
- Subscription changes

---

## 🗄️ DATA MODEL GAPS

### 1. Missing Constraints

#### User Table:
- ❌ email: CHECK length <= 254
- ❌ name: CHECK length >= 2 AND length <= 100
- ❌ language: CHECK IN ('ru', 'uz', 'en')
- ❌ Composite unique: (email, organizationId) for soft deletes

#### Organization Table:
- ❌ name: CHECK length >= 2 AND length <= 100
- ❌ slug: CHECK matches /^[a-z0-9-]+$/
- ❌ Reserved slug check: NOT IN ('admin', 'api', 'www', ...)
- ❌ Billing email validation

#### PhoneNumber Table:
- ❌ number: CHECK E.164 format /^\+[1-9]\d{1,14}$/
- ❌ provider: CHECK IN ('vapi', 'twilio')
- ❌ displayName: CHECK length <= 50
- ❌ forwardingNumber: CHECK E.164 format if not null

#### Call Table:
- ❌ callerNumber: CHECK E.164 format
- ❌ durationSeconds: CHECK >= 0
- ❌ aiConfidence: CHECK >= 0 AND <= 100
- ❌ callQuality: CHECK >= 1 AND <= 5
- ❌ endedAt: CHECK endedAt > startedAt

#### KnowledgeItem Table:
- ❌ question: CHECK length >= 10 AND length <= 500
- ❌ answer: CHECK length >= 10 AND length <= 5000
- ❌ category: CHECK length <= 50
- ❌ usageCount: CHECK >= 0

### 2. Missing Indexes

**Performance Indexes:**
```sql
-- User queries
CREATE INDEX idx_users_organization_role ON users(organizationId, role);
CREATE INDEX idx_users_last_seen ON users(lastSeenAt) WHERE isActive = true;

-- Call queries
CREATE INDEX idx_calls_org_date ON calls(organizationId, startedAt DESC);
CREATE INDEX idx_calls_caller_date ON calls(callerNumber, startedAt DESC);
CREATE INDEX idx_calls_outcome_date ON calls(outcome, startedAt DESC);
CREATE INDEX idx_calls_handled_by ON calls(handledBy, handledByUserId);

-- Analytics queries
CREATE INDEX idx_calls_sentiment ON calls(sentiment) WHERE sentiment IS NOT NULL;
CREATE INDEX idx_calls_intent ON calls(intentDetected) WHERE intentDetected IS NOT NULL;

-- Knowledge base
CREATE INDEX idx_knowledge_category ON knowledge_items(category, isActive);
CREATE INDEX idx_knowledge_usage ON knowledge_items(usageCount DESC, lastUsedAt DESC);

-- Billing
CREATE INDEX idx_subscriptions_status ON subscriptions(status, currentPeriodEnd);
CREATE INDEX idx_invoices_org_date ON invoices(organizationId, createdAt DESC);
```

### 3. Missing Cascade Rules

**OnDelete Behaviors:**
- ❌ Organization deleted → Users (CASCADE)
- ❌ Organization deleted → Calls (CASCADE or RESTRICT?)
- ❌ Organization deleted → PhoneNumbers (CASCADE)
- ❌ Organization deleted → Subscription (CASCADE)
- ❌ Organization deleted → KnowledgeItems (CASCADE)
- ❌ User deleted → Calls.handledByUserId (SET NULL)
- ❌ User deleted → CallNotes (CASCADE or keep with deleted user marker?)
- ❌ PhoneNumber deleted → Calls (RESTRICT if active calls)

**Recommendation:**
```prisma
model Organization {
  users         User[]        @relation(onDelete: Cascade)
  calls         Call[]        @relation(onDelete: Restrict) // Don't allow deletion with active calls
  phoneNumbers  PhoneNumber[] @relation(onDelete: Cascade)
  subscription  Subscription? @relation(onDelete: Cascade)
}

model User {
  handledCalls  Call[]     @relation("HandledByUser", onDelete: SetNull)
  notes         CallNote[] @relation(onDelete: Cascade)
}
```

### 4. Soft Delete Implementation - MISSING

**Required for:**
- Users (recovery, audit trail)
- Organizations (data retention)
- KnowledgeItems (restore accidentally deleted)

**Implementation:**
```prisma
model User {
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  deletedBy   String?   // userId who deleted
  
  @@index([isDeleted, organizationId])
}
```

**Queries must filter:**
```sql
WHERE isDeleted = false
```

### 5. Audit Trail - MISSING

**Change tracking for:**
- User role changes
- Organization settings changes
- AI configuration updates
- Subscription changes
- Payment method updates

**AuditLog Table:**
```prisma
model AuditLog {
  id             String   @id @default(cuid())
  organizationId String
  userId         String?
  
  action         String   // "user.role.changed"
  resourceType   String   // "user"
  resourceId     String   // "usr_123"
  
  before         Json?    // Old values
  after          Json?    // New values
  
  ipAddress      String?
  userAgent      String?
  
  createdAt      DateTime @default(now())
  
  @@index([organizationId, createdAt])
  @@index([resourceType, resourceId])
}
```

---

