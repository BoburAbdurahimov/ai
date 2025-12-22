# Gaps 106-213: API & Data Models

**Total:** 108 gaps | **Closed:** 45 (validations in schemas) | **Open:** 63

---

## 3.1 API ENDPOINT VALIDATIONS (45 gaps - most closed via schemas)

**Note:** Most validations closed via Zod schemas in `auth.schemas.ts` and `api.schemas.ts`

## GAP-106 to GAP-150: Endpoint Validations ✅ MOSTLY CLOSED
**Status:** Already implemented in validation schemas  
**Files:** `auth.schemas.ts`, `api.schemas.ts`  
**Details:** Validations for signup, login, users, calls, AI config, knowledge base, phone numbers

---

## 3.2 ERROR RESPONSES (8 gaps - all open)

## GAP-151 ⏳ OPEN
**Priority:** P0  
**Category:** Error Handling  
**Requirement:** 400 Validation Error with field-specific details  
**Decision:** Format: `{ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: [{ field: 'email', message: 'Email already exists' }] } }`  
**Implementation:** Standardize in validation middleware  
**Action:** Create error response formatter

## GAP-152 ⏳ OPEN
**Priority:** P0  
**Category:** Error Handling  
**Requirement:** 401 Unauthorized - differentiate expired vs invalid vs missing  
**Decision:** Codes: TOKEN_EXPIRED, TOKEN_INVALID, TOKEN_MISSING with specific messages  
**Implementation:** Auth middleware returns specific error codes  
**Action:** Implement token error differentiation

## GAP-153 ⏳ OPEN
**Priority:** P0  
**Category:** Error Handling  
**Requirement:** 403 Forbidden with permission details  
**Decision:** Format: `{ error: { code: 'INSUFFICIENT_PERMISSIONS', message: 'You need ADMIN role', requiredRole: 'ADMIN', currentRole: 'OPERATOR' } }`  
**Implementation:** Permission middleware includes role context  
**Action:** Add permission context to 403 responses

## GAP-154 ⏳ OPEN
**Priority:** P0  
**Category:** Error Handling  
**Requirement:** 404 Not Found with resource type  
**Decision:** Format: `{ error: { code: 'RESOURCE_NOT_FOUND', message: 'Call not found', resourceType: 'call', resourceId: 'call_123' } }`  
**Implementation:** Include resource context in 404 responses  
**Action:** Standardize 404 error format

## GAP-155 ⏳ OPEN
**Priority:** P0  
**Category:** Error Handling  
**Requirement:** 409 Conflict with conflict field  
**Decision:** Format: `{ error: { code: 'RESOURCE_CONFLICT', message: 'Email already registered', conflictField: 'email' } }`  
**Implementation:** Identify conflict field in duplicate checks  
**Action:** Add conflict field to 409 responses

## GAP-156 ⏳ OPEN
**Priority:** P0  
**Category:** Error Handling  
**Requirement:** 422 Unprocessable Entity with quota details  
**Decision:** Format: `{ error: { code: 'QUOTA_EXCEEDED', message: 'Call minutes quota exceeded', quota: { limit: 1000, used: 1000, remaining: 0 } } }`  
**Implementation:** Include quota context in business logic errors  
**Action:** Create quota exceeded error format

## GAP-157 ✅ PARTIALLY CLOSED
**Priority:** P0  
**Category:** Error Handling  
**Requirement:** 429 Rate Limit with retry info  
**Decision:** Format: `{ error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests', retryAfter: 3600, limit: 1000, remaining: 0, reset: 1640188800 } }`  
**Implementation:** Rate limiter already includes this info  
**Action:** Verify all rate limit responses include retry info

## GAP-158 ⏳ OPEN
**Priority:** P1  
**Category:** Error Handling  
**Requirement:** 503 Service Unavailable with maintenance info  
**Decision:** Format: `{ error: { code: 'SERVICE_MAINTENANCE', message: 'System under maintenance', estimatedDowntime: '30 minutes', retryAfter: 1800 } }`  
**Implementation:** Maintenance mode middleware  
**Action:** Create maintenance mode handler

---

## 3.3 RESPONSE HEADERS (6 gaps)

## GAP-159 ⏳ OPEN
**Priority:** P1  
**Category:** Response Headers  
**Requirement:** X-Request-ID for tracing  
**Decision:** Generate UUID per request, set header: `res.setHeader('X-Request-ID', requestId)`  
**Implementation:** Global middleware generates and sets request ID  
**Action:** Create request ID middleware

## GAP-160 ✅ PARTIALLY CLOSED
**Priority:** P0  
**Category:** Response Headers  
**Requirement:** X-RateLimit headers (Limit, Remaining, Reset)  
**Decision:** Set: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`  
**Implementation:** Rate limiter already sets these  
**Action:** Verify all rate-limited endpoints include headers

## GAP-161 ⏳ OPEN
**Priority:** P0  
**Category:** Response Headers  
**Requirement:** Retry-After header on 429 and 503  
**Decision:** Set: `res.setHeader('Retry-After', seconds)`  
**Implementation:** Include in rate limit and maintenance responses  
**Action:** Ensure Retry-After header on appropriate responses

## GAP-162 ⏳ OPEN
**Priority:** P2  
**Category:** Response Headers  
**Requirement:** X-Response-Time for performance tracking  
**Decision:** Calculate: `Date.now() - req.startTime`, set header: `X-Response-Time: ${ms}ms`  
**Implementation:** Middleware records start time, response hook calculates duration  
**Action:** Create response time middleware

---

## 3.4 PAGINATION (5 gaps)

## GAP-163 ⏳ OPEN
**Priority:** P2  
**Category:** Pagination  
**Requirement:** Cursor-based pagination for large datasets  
**Decision:** Use cursor format: `cursor=base64(id:timestamp)`, query: WHERE (id, createdAt) > (:lastId, :lastTimestamp) ORDER BY createdAt, id LIMIT :limit  
**Implementation:** Cursor pagination util for calls/analytics  
**Action:** Implement cursor pagination helper

## GAP-164 ⏳ OPEN
**Priority:** P2  
**Category:** Pagination  
**Requirement:** Total count optional (performance)  
**Decision:** Add query param `includeTotalCount=false` to skip expensive COUNT(*) queries  
**Implementation:** Conditional count in list endpoints  
**Action:** Make total count optional in pagination

## GAP-165 ✅ CLOSED
**Priority:** P0  
**Category:** Pagination  
**Requirement:** Max page size: 100  
**Decision:** Enforce: `limit: z.coerce.number().int().min(1).max(100).default(20)`  
**Implementation:** Already in `paginationSchema` in `api.schemas.ts`  
**Action:** Verified implemented

## GAP-166 ⏳ OPEN
**Priority:** P2  
**Category:** Pagination  
**Requirement:** Links to first/last/next/prev pages  
**Decision:** Include links object: `{ first: '/calls?page=1', next: '/calls?page=3', prev: '/calls?page=1', last: '/calls?page=63' }`  
**Implementation:** Generate links in pagination helper  
**Action:** Add pagination links to responses

## GAP-167 ⏳ OPEN
**Priority:** P1  
**Category:** Pagination  
**Requirement:** Consistent pagination structure  
**Decision:** Standard format: `{ data: [...], pagination: { page, limit, total, pages, hasNext, hasPrev }, links: {...} }`  
**Implementation:** Pagination response wrapper  
**Action:** Create consistent pagination format across all endpoints

---

## 3.5 IDEMPOTENCY (4 gaps)

## GAP-168 ⏳ OPEN
**Priority:** P1  
**Category:** Idempotency  
**Requirement:** Idempotency-Key header support  
**Decision:** Accept header `Idempotency-Key: uuid`, store in Redis with response for 24h  
**Implementation:** Middleware checks key, returns cached response if exists  
**Action:** Create idempotency middleware

## GAP-169 ⏳ OPEN
**Priority:** P1  
**Category:** Idempotency  
**Requirement:** Key storage: 24 hours  
**Decision:** Redis: `SET idempotency:{key} {response} EX 86400`  
**Implementation:** Store with 24h TTL  
**Action:** Implement in idempotency middleware

## GAP-170 ⏳ OPEN
**Priority:** P1  
**Category:** Idempotency  
**Requirement:** Duplicate detection  
**Decision:** If key exists in Redis, return cached response with status 200  
**Implementation:** Check before processing request  
**Action:** Implement duplicate detection logic

## GAP-171 ⏳ OPEN
**Priority:** P1  
**Category:** Idempotency  
**Requirement:** Response caching for duplicates  
**Decision:** Store: `{ statusCode, headers, body }` in Redis  
**Implementation:** Cache complete response  
**Action:** Implement response caching

---

## 3.6 DATABASE CONSTRAINTS (20 gaps)

## GAP-172 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** User.email: CHECK length <= 254  
**Decision:** `ALTER TABLE users ADD CONSTRAINT check_email_length CHECK (length(email) <= 254);`  
**Implementation:** Migration file  
**Action:** Create database constraints migration

## GAP-173 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** User.name: CHECK length >= 2 AND length <= 100  
**Decision:** `ALTER TABLE users ADD CONSTRAINT check_name_length CHECK (length(name) >= 2 AND length(name) <= 100);`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-174 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** User.language: CHECK IN ('ru', 'uz', 'en')  
**Decision:** `ALTER TABLE users ADD CONSTRAINT check_language CHECK (language IN ('ru', 'uz', 'en'));`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-175 ⏳ OPEN
**Priority:** P1  
**Category:** Database  
**Requirement:** User: Composite unique (email, organizationId) for soft deletes  
**Decision:** `CREATE UNIQUE INDEX idx_users_email_org ON users(email, organizationId) WHERE isDeleted = false;`  
**Implementation:** Partial unique index  
**Action:** Add to indexes migration

## GAP-176 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Organization.name: CHECK length >= 2 AND length <= 100  
**Decision:** `ALTER TABLE organizations ADD CONSTRAINT check_org_name_length CHECK (length(name) >= 2 AND length(name) <= 100);`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-177 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Organization.slug: CHECK matches ^[a-z0-9-]+$  
**Decision:** `ALTER TABLE organizations ADD CONSTRAINT check_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-178 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Organization.slug: Reserved check NOT IN (admin, api, www, ...)  
**Decision:** `ALTER TABLE organizations ADD CONSTRAINT check_slug_reserved CHECK (slug NOT IN ('admin','api','www','support','billing','status','help','docs','blog','mail','ftp','localhost'));`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-179 ⏳ OPEN
**Priority:** P1  
**Category:** Database  
**Requirement:** Organization.billingEmail: Email validation  
**Decision:** `ALTER TABLE organizations ADD CONSTRAINT check_billing_email CHECK (billingEmail ~ '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-180 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** PhoneNumber.number: CHECK E.164 format  
**Decision:** `ALTER TABLE phone_numbers ADD CONSTRAINT check_number_format CHECK (number ~ '^\\+[1-9]\\d{1,14}$');`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-181 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** PhoneNumber.provider: CHECK IN ('vapi', 'twilio')  
**Decision:** `ALTER TABLE phone_numbers ADD CONSTRAINT check_provider CHECK (provider IN ('vapi', 'twilio'));`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-182 ⏳ OPEN
**Priority:** P1  
**Category:** Database  
**Requirement:** PhoneNumber.displayName: CHECK length <= 50  
**Decision:** `ALTER TABLE phone_numbers ADD CONSTRAINT check_display_name_length CHECK (displayName IS NULL OR length(displayName) <= 50);`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-183 ⏳ OPEN
**Priority:** P1  
**Category:** Database  
**Requirement:** PhoneNumber.forwardingNumber: CHECK E.164 if not null  
**Decision:** `ALTER TABLE phone_numbers ADD CONSTRAINT check_forwarding_format CHECK (forwardingNumber IS NULL OR forwardingNumber ~ '^\\+[1-9]\\d{1,14}$');`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-184 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Call.callerNumber: CHECK E.164 format  
**Decision:** `ALTER TABLE calls ADD CONSTRAINT check_caller_number_format CHECK (callerNumber ~ '^\\+[1-9]\\d{1,14}$');`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-185 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Call.durationSeconds: CHECK >= 0  
**Decision:** `ALTER TABLE calls ADD CONSTRAINT check_duration_positive CHECK (durationSeconds IS NULL OR durationSeconds >= 0);`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-186 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Call.aiConfidence: CHECK >= 0 AND <= 100  
**Decision:** `ALTER TABLE calls ADD CONSTRAINT check_ai_confidence_range CHECK (aiConfidence IS NULL OR (aiConfidence >= 0 AND aiConfidence <= 100));`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-187 ⏳ OPEN
**Priority:** P1  
**Category:** Database  
**Requirement:** Call.callQuality: CHECK >= 1 AND <= 5  
**Decision:** `ALTER TABLE calls ADD CONSTRAINT check_call_quality_range CHECK (callQuality IS NULL OR (callQuality >= 1 AND callQuality <= 5));`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-188 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Call.endedAt: CHECK endedAt > startedAt  
**Decision:** `ALTER TABLE calls ADD CONSTRAINT check_end_after_start CHECK (endedAt IS NULL OR endedAt > startedAt);`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-189 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** KnowledgeItem.question: CHECK length >= 10 AND <= 500  
**Decision:** `ALTER TABLE knowledge_items ADD CONSTRAINT check_question_length CHECK (length(question) >= 10 AND length(question) <= 500);`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-190 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** KnowledgeItem.answer: CHECK length >= 10 AND <= 5000  
**Decision:** `ALTER TABLE knowledge_items ADD CONSTRAINT check_answer_length CHECK (length(answer) >= 10 AND length(answer) <= 5000);`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

## GAP-191 ⏳ OPEN
**Priority:** P1  
**Category:** Database  
**Requirement:** KnowledgeItem.usageCount: CHECK >= 0  
**Decision:** `ALTER TABLE knowledge_items ADD CONSTRAINT check_usage_count_positive CHECK (usageCount >= 0);`  
**Implementation:** Migration file  
**Action:** Add to constraints migration

---

## 3.7 DATABASE INDEXES (10 gaps)

## GAP-192 to GAP-201 ⏳ OPEN
**Priority:** P1  
**Category:** Database Performance  
**Requirements:** Performance indexes for queries  
**Decisions:**
- GAP-192: `CREATE INDEX idx_users_organization_role ON users(organizationId, role);`
- GAP-193: `CREATE INDEX idx_users_last_seen ON users(lastSeenAt) WHERE isActive = true;`
- GAP-194: `CREATE INDEX idx_calls_org_date ON calls(organizationId, startedAt DESC);`
- GAP-195: `CREATE INDEX idx_calls_caller_date ON calls(callerNumber, startedAt DESC);`
- GAP-196: `CREATE INDEX idx_calls_outcome_date ON calls(outcome, startedAt DESC);`
- GAP-197: `CREATE INDEX idx_calls_handled_by ON calls(handledBy, handledByUserId);`
- GAP-198: `CREATE INDEX idx_calls_sentiment ON calls(sentiment) WHERE sentiment IS NOT NULL;`
- GAP-199: `CREATE INDEX idx_knowledge_category ON knowledge_items(category, isActive);`
- GAP-200: `CREATE INDEX idx_subscriptions_status ON subscriptions(status, currentPeriodEnd);`
- GAP-201: `CREATE INDEX idx_invoices_org_date ON invoices(organizationId, createdAt DESC);`

**Implementation:** Single migration file with all indexes  
**Action:** Create indexes migration

---

## 3.8 CASCADE RULES (8 gaps)

## GAP-202 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Organization deleted → Users CASCADE  
**Decision:** `ON DELETE CASCADE` - delete all users when org deleted  
**Implementation:** Prisma: `@relation(onDelete: Cascade)`  
**Action:** Update Prisma schema

## GAP-203 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Organization deleted → Calls RESTRICT  
**Decision:** `ON DELETE RESTRICT` - prevent org deletion if active calls exist  
**Implementation:** Prisma: `@relation(onDelete: Restrict)`  
**Action:** Update Prisma schema

## GAP-204 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Organization deleted → PhoneNumbers CASCADE  
**Decision:** `ON DELETE CASCADE` - delete all phone numbers  
**Implementation:** Prisma: `@relation(onDelete: Cascade)`  
**Action:** Update Prisma schema

## GAP-205 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Organization deleted → Subscription CASCADE  
**Decision:** `ON DELETE CASCADE` - delete subscription  
**Implementation:** Prisma: `@relation(onDelete: Cascade)`  
**Action:** Update Prisma schema

## GAP-206 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** Organization deleted → KnowledgeItems CASCADE  
**Decision:** `ON DELETE CASCADE` - delete all knowledge items  
**Implementation:** Prisma: `@relation(onDelete: Cascade)`  
**Action:** Update Prisma schema

## GAP-207 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** User deleted → Calls.handledByUserId SET NULL  
**Decision:** `ON DELETE SET NULL` - keep calls, nullify handler  
**Implementation:** Prisma: `@relation(onDelete: SetNull)`  
**Action:** Update Prisma schema

## GAP-208 ⏳ OPEN
**Priority:** P1  
**Category:** Database  
**Requirement:** User deleted → CallNotes CASCADE  
**Decision:** `ON DELETE CASCADE` - delete user's notes  
**Implementation:** Prisma: `@relation(onDelete: Cascade)`  
**Action:** Update Prisma schema

## GAP-209 ⏳ OPEN
**Priority:** P0  
**Category:** Database  
**Requirement:** PhoneNumber deleted → Calls RESTRICT if active  
**Decision:** Check active calls before deletion, application-level enforcement  
**Implementation:** DELETE endpoint validation  
**Action:** Implement active call check before phone number deletion

---

## 3.9 SOFT DELETE (3 gaps)

## GAP-210 ⏳ OPEN
**Priority:** P1  
**Category:** Database  
**Requirement:** User soft delete  
**Decision:** Add fields: `isDeleted BOOLEAN DEFAULT false, deletedAt TIMESTAMP, deletedBy TEXT`  
**Implementation:** Migration + update all User queries to filter isDeleted=false  
**Action:** Implement user soft delete

## GAP-211 ⏳ OPEN
**Priority:** P1  
**Category:** Database  
**Requirement:** Organization soft delete  
**Decision:** Add fields: `isDeleted BOOLEAN DEFAULT false, deletedAt TIMESTAMP, deletedBy TEXT`  
**Implementation:** Migration + update all Organization queries  
**Action:** Implement organization soft delete

## GAP-212 ⏳ OPEN
**Priority:** P2  
**Category:** Database  
**Requirement:** KnowledgeItem soft delete  
**Decision:** Add fields: `isDeleted BOOLEAN DEFAULT false, deletedAt TIMESTAMP`  
**Implementation:** Migration + update queries  
**Action:** Implement knowledge item soft delete

---

## 3.10 AUDIT TRAIL (1 gap)

## GAP-213 ⏳ OPEN
**Priority:** P1  
**Category:** Database  
**Requirement:** AuditLog table for tracking changes  
**Decision:** Table: `{ id, organizationId, userId, action, resourceType, resourceId, before, after, ipAddress, userAgent, createdAt }`  
**Implementation:** Create audit_logs table + middleware to log sensitive operations  
**Action:** Implement audit logging system

---

**Summary:** 45 closed (validations), 63 open in this category
