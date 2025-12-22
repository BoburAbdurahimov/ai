# Implementation Checklist - Operational Gaps Remediation

**Purpose:** Actionable checklist for engineers to fix identified gaps  
**Format:** Copy to your project management tool (Jira, Linear, etc.)

---

## 🔐 Authentication & Authorization

### Input Validations
- [ ] **Email validation**
  - [ ] Max length: 254 chars (RFC 5321)
  - [ ] Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - [ ] Normalize: lowercase, trim whitespace
  - [ ] Block disposable emails (use library: `disposable-email-domains`)
  - [ ] Corporate email check for Enterprise plans
  - [ ] Test: Valid, invalid, edge cases

- [ ] **Password validation**
  - [ ] Min: 8 chars, Max: 72 chars (bcrypt limit)
  - [ ] Require: 1 uppercase, 1 lowercase, 1 number
  - [ ] Optional: 1 special character
  - [ ] Check against common passwords (library: `common-password-checker`)
  - [ ] Integrate HaveIBeenPwned API
  - [ ] Test: Weak passwords rejected

- [ ] **Name validation**
  - [ ] Length: 2-100 chars
  - [ ] Allow: Unicode (Cyrillic, Latin, Arabic)
  - [ ] Allow: Apostrophes, hyphens, spaces
  - [ ] Sanitize: XSS prevention
  - [ ] Test: International names

- [ ] **Organization name validation**
  - [ ] Length: 2-100 chars
  - [ ] Generate slug: lowercase, replace spaces with hyphens
  - [ ] Reserved names: ['admin', 'api', 'www', 'support', 'billing', 'status']
  - [ ] Uniqueness check
  - [ ] Test: Reserved names rejected

### Session Management
- [ ] **Session configuration**
  - [ ] Idle timeout: 30 minutes
  - [ ] Absolute timeout: 24 hours
  - [ ] Storage: Redis with TTL
  - [ ] Session ID: cryptographically random (32 bytes)
  - [ ] Test: Session expiry works

- [ ] **Concurrent sessions**
  - [ ] Max sessions per user: 5
  - [ ] Track: sessionId, device, IP, userAgent
  - [ ] UI: "Active devices" page
  - [ ] Feature: "Logout all devices"
  - [ ] Test: 6th login invalidates oldest

- [ ] **Session security**
  - [ ] Invalidate on password change
  - [ ] Invalidate on role change (downgrade)
  - [ ] HttpOnly cookies
  - [ ] Secure flag (HTTPS only)
  - [ ] SameSite: Strict or Lax
  - [ ] Test: Session hijacking prevented

### Rate Limiting
- [ ] **Login rate limit**
  - [ ] Max: 5 attempts per 15 minutes (per account + per IP)
  - [ ] Lockout: 15 minutes
  - [ ] Progressive delays: 1s, 2s, 4s, 8s
  - [ ] CAPTCHA: After 3 failed attempts
  - [ ] Storage: Redis with expiry
  - [ ] Test: Brute force blocked

- [ ] **Password reset rate limit**
  - [ ] Max: 3 requests per hour (per email)
  - [ ] Token expiry: 1 hour
  - [ ] Token: Single-use only
  - [ ] Email notification: On successful reset
  - [ ] Test: Excessive requests blocked

- [ ] **Email verification rate limit**
  - [ ] Max resends: 5 per hour
  - [ ] Cooldown: 60 seconds between resends
  - [ ] Token expiry: 24 hours
  - [ ] Auto-delete: Unverified accounts after 7 days
  - [ ] Test: Spam prevention works

- [ ] **API rate limits**
  - [ ] Global: 1000 req/hour (authenticated), 100 req/hour (unauth)
  - [ ] Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
  - [ ] Response: 429 with Retry-After header
  - [ ] Storage: Redis with sliding window
  - [ ] Test: Rate limit headers correct

### Permission Matrix
- [ ] **Implement RBAC**
  - [ ] Roles: OWNER, ADMIN, MANAGER, OPERATOR, VIEWER
  - [ ] Middleware: `requireRole(['ADMIN', 'OWNER'])`
  - [ ] Database: Add role enum to User model
  - [ ] Test: Each role's permissions

- [ ] **Permission enforcement**
  - [ ] Organization settings: OWNER, ADMIN
  - [ ] Billing: OWNER only
  - [ ] User management: OWNER, ADMIN, MANAGER
  - [ ] AI config: OWNER, ADMIN
  - [ ] View calls: All roles (own calls for OPERATOR)
  - [ ] Add notes: All except VIEWER
  - [ ] Test: 403 for unauthorized actions

- [ ] **Edge cases**
  - [ ] Can't remove last OWNER
  - [ ] OWNER can demote self (with confirmation)
  - [ ] Role change invalidates sessions (if downgrade)
  - [ ] Audit log: Record all role changes
  - [ ] Test: Edge cases handled

---

## 💳 Billing & Subscriptions

### Payment Flows
- [ ] **Checkout**
  - [ ] Idempotency: Lock on organizationId during checkout
  - [ ] Timeout: Abandon session after 30 minutes
  - [ ] Stripe integration: Use checkout.session.completed webhook
  - [ ] Test: Duplicate checkout prevented

- [ ] **Payment failures**
  - [ ] Retry schedule: Day 3, 7, 14 after failure
  - [ ] Max retries: 3 attempts
  - [ ] Dunning emails: Day 1, 3, 7, 14
  - [ ] Grace period: 7 days before suspension
  - [ ] Service degradation: Read-only mode after 7 days
  - [ ] Auto-cancel: Day 14 if still failing
  - [ ] Test: Retry logic works

- [ ] **Payment methods**
  - [ ] Support: Multiple cards (max 3)
  - [ ] Default card: Required
  - [ ] Expiry warning: Email 30 days before card expires
  - [ ] Update: Allow during active subscription
  - [ ] Test: Card update flow

### Subscription Changes
- [ ] **Upgrades**
  - [ ] Proration: Per-day calculation
  - [ ] Effective: Immediate
  - [ ] Charge: Prorated amount immediately
  - [ ] Quota: Increase immediately
  - [ ] Email: Confirmation with new limits
  - [ ] Test: Proration calculation correct

- [ ] **Downgrades**
  - [ ] Effective: End of current billing period
  - [ ] Warning: 7 days before effective date
  - [ ] Feature lock: At period end
  - [ ] Data: Read-only if over quota (no deletion)
  - [ ] Refund: None (downgrade at period end)
  - [ ] Test: Downgrade delayed to period end

- [ ] **Cancellation**
  - [ ] Options: End of period (default) or immediate
  - [ ] Data retention: 90 days
  - [ ] Reactivation: Within 90 days, full restore
  - [ ] Survey: Collect feedback
  - [ ] Win-back: Discount offer after 30 days
  - [ ] Test: Data restored on reactivation

### Quota Management
- [ ] **Call minutes**
  - [ ] Limits: 300/1000/5000 per plan
  - [ ] Overage: Block new calls + show upgrade prompt
  - [ ] Overage pricing: $0.15/min (optional)
  - [ ] Warnings: Email at 80%, 90%, 100%
  - [ ] Reset: Start of billing period
  - [ ] UI: Progress bar on dashboard
  - [ ] Test: Calls blocked at limit

- [ ] **Team members**
  - [ ] Limits: 3/10/50 per plan
  - [ ] Downgrade: Manual user selection (or last joined first)
  - [ ] Warning: 7 days before enforcement
  - [ ] Notification: Email to affected users
  - [ ] Test: User selection flow

- [ ] **Phone numbers**
  - [ ] Limits: 1/3/10 per plan
  - [ ] Additional cost: $5/month per extra number
  - [ ] Release: Immediate deletion
  - [ ] Porting: 5-7 business days, $10 fee
  - [ ] Test: Add number flow

- [ ] **Storage (recordings)**
  - [ ] Limits: 5GB/25GB/100GB per plan
  - [ ] Overage: $0.10/GB/month
  - [ ] Retention: 90 days / 1 year / 2 years
  - [ ] Auto-delete: After retention period
  - [ ] Warning: Email at 85%, 95%
  - [ ] Test: Auto-deletion works

### Tax & Invoicing
- [ ] **Tax configuration**
  - [ ] Uzbekistan VAT: 12%
  - [ ] Display: Inclusive in price
  - [ ] Tax-exempt: Support with documentation upload
  - [ ] Test: Tax calculation correct

- [ ] **Invoice generation**
  - [ ] Timing: Immediately after payment
  - [ ] Format: PDF via email
  - [ ] Numbering: INV-{YYYY}-{ORG_ID}-{SEQUENCE}
  - [ ] Content: Line items, tax, total
  - [ ] Storage: Accessible in dashboard
  - [ ] Test: Invoice download works

---

## 🌐 API Endpoints

### Input Validation (per endpoint)
- [ ] **POST /auth/signup**
  - [ ] email: Required, format, unique, disposable check
  - [ ] password: Required, 8-72 chars, complexity
  - [ ] name: Required, 2-100 chars
  - [ ] organizationName: Required, 2-100 chars, reserved check
  - [ ] industry: Optional, enum validation
  - [ ] Test: All validation errors

- [ ] **PATCH /users/me**
  - [ ] name: 2-100 chars if provided
  - [ ] language: enum ['ru', 'uz', 'en']
  - [ ] notificationPrefs: JSON schema validation
  - [ ] avatar: file type (jpg, png, webp), max 2MB
  - [ ] Test: Invalid inputs rejected

- [ ] **POST /users** (Invite)
  - [ ] email: Required, format, unique within org
  - [ ] role: Required, enum validation
  - [ ] Quota check: Team member limit
  - [ ] Duplicate check: Pending invitation
  - [ ] Test: Quota enforcement

- [ ] **GET /calls**
  - [ ] page: min 1, max 1000, default 1
  - [ ] limit: min 1, max 100, default 20
  - [ ] startDate/endDate: ISO 8601, max 90 day span
  - [ ] search: min 3 chars, max 50 chars
  - [ ] Test: Invalid filters rejected

- [ ] **POST /calls/:id/notes**
  - [ ] content: Required, min 1, max 5000 chars
  - [ ] Call ownership: User has permission
  - [ ] Call status: Must be completed
  - [ ] Test: Permission check

- [ ] **PATCH /ai/config**
  - [ ] assistantName: 2-50 chars
  - [ ] greetingMessage: 10-500 chars
  - [ ] tone: enum ['professional', 'friendly', 'formal']
  - [ ] transferRules: JSON schema validation
  - [ ] Test: Schema validation

- [ ] **POST /knowledge**
  - [ ] question: Required, 10-500 chars
  - [ ] answer: Required, 10-5000 chars
  - [ ] category: max 50 chars
  - [ ] Duplicate detection: Similar question check
  - [ ] Quota: Per-plan limits (1000/5000/unlimited)
  - [ ] Test: Duplicate prevention

- [ ] **POST /phone-numbers**
  - [ ] number: Required, E.164 format validation
  - [ ] Country: Supported countries list
  - [ ] Quota check: Phone number limit
  - [ ] Provider check: Number availability
  - [ ] Test: E.164 validation

### Error Response Standards
- [ ] **400 Validation Error**
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input",
      "details": [
        {"field": "email", "message": "Email already exists"}
      ]
    }
  }
  ```

- [ ] **401 Unauthorized**
  - [ ] TOKEN_EXPIRED: Token has expired
  - [ ] TOKEN_INVALID: Token is invalid
  - [ ] TOKEN_MISSING: No token provided
  - [ ] Test: Each error type

- [ ] **403 Forbidden**
  ```json
  {
    "error": {
      "code": "INSUFFICIENT_PERMISSIONS",
      "message": "You need ADMIN role",
      "requiredRole": "ADMIN",
      "currentRole": "OPERATOR"
    }
  }
  ```

- [ ] **404 Not Found**
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

- [ ] **422 Unprocessable Entity**
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

- [ ] **429 Rate Limit**
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

### Response Headers
- [ ] **Standard headers (all responses)**
  - [ ] X-Request-ID: Unique per request (for tracing)
  - [ ] X-Response-Time: Processing time in ms
  - [ ] Content-Type: application/json
  - [ ] Test: Headers present

- [ ] **Rate limit headers**
  - [ ] X-RateLimit-Limit: Total allowed
  - [ ] X-RateLimit-Remaining: Remaining requests
  - [ ] X-RateLimit-Reset: Unix timestamp of reset
  - [ ] Retry-After: Seconds to wait (on 429)
  - [ ] Test: Values accurate

### Idempotency
- [ ] **Idempotency-Key header**
  - [ ] Support on: POST, PATCH, DELETE
  - [ ] Storage: Redis, 24-hour TTL
  - [ ] Duplicate detection: Return cached response
  - [ ] Critical for: Payments, invitations, subscription changes
  - [ ] Test: Duplicate requests return same result

---

## 🗄️ Database

### Constraints
- [ ] **Add CHECK constraints**
  ```sql
  -- User
  ALTER TABLE users ADD CONSTRAINT check_email_length 
    CHECK (length(email) <= 254);
  ALTER TABLE users ADD CONSTRAINT check_name_length 
    CHECK (length(name) >= 2 AND length(name) <= 100);
  ALTER TABLE users ADD CONSTRAINT check_language 
    CHECK (language IN ('ru', 'uz', 'en'));
  
  -- PhoneNumber
  ALTER TABLE phone_numbers ADD CONSTRAINT check_number_format 
    CHECK (number ~ '^\+[1-9]\d{1,14}$');
  
  -- Call
  ALTER TABLE calls ADD CONSTRAINT check_duration 
    CHECK (duration_seconds >= 0);
  ALTER TABLE calls ADD CONSTRAINT check_ai_confidence 
    CHECK (ai_confidence >= 0 AND ai_confidence <= 100);
  ALTER TABLE calls ADD CONSTRAINT check_call_quality 
    CHECK (call_quality >= 1 AND call_quality <= 5);
  ALTER TABLE calls ADD CONSTRAINT check_end_after_start 
    CHECK (ended_at > started_at);
  
  -- KnowledgeItem
  ALTER TABLE knowledge_items ADD CONSTRAINT check_question_length 
    CHECK (length(question) >= 10 AND length(question) <= 500);
  ALTER TABLE knowledge_items ADD CONSTRAINT check_answer_length 
    CHECK (length(answer) >= 10 AND length(answer) <= 5000);
  ```

- [ ] **Test: Invalid data rejected by database**

### Indexes
- [ ] **Add performance indexes**
  ```sql
  -- User queries
  CREATE INDEX idx_users_org_role ON users(organization_id, role);
  CREATE INDEX idx_users_last_seen ON users(last_seen_at) 
    WHERE is_active = true;
  
  -- Call queries
  CREATE INDEX idx_calls_org_date ON calls(organization_id, started_at DESC);
  CREATE INDEX idx_calls_caller_date ON calls(caller_number, started_at DESC);
  CREATE INDEX idx_calls_outcome_date ON calls(outcome, started_at DESC);
  CREATE INDEX idx_calls_handled_by ON calls(handled_by, handled_by_user_id);
  CREATE INDEX idx_calls_sentiment ON calls(sentiment) 
    WHERE sentiment IS NOT NULL;
  
  -- Knowledge base
  CREATE INDEX idx_knowledge_category ON knowledge_items(category, is_active);
  CREATE INDEX idx_knowledge_usage 
    ON knowledge_items(usage_count DESC, last_used_at DESC);
  
  -- Billing
  CREATE INDEX idx_subscriptions_status 
    ON subscriptions(status, current_period_end);
  CREATE INDEX idx_invoices_org_date 
    ON invoices(organization_id, created_at DESC);
  ```

- [ ] **Test: Query performance improved**

### Cascade Rules
- [ ] **Define onDelete behavior**
  ```prisma
  model Organization {
    users         User[]        @relation(onDelete: Cascade)
    calls         Call[]        @relation(onDelete: Restrict)
    phoneNumbers  PhoneNumber[] @relation(onDelete: Cascade)
    subscription  Subscription? @relation(onDelete: Cascade)
    knowledge     KnowledgeItem[] @relation(onDelete: Cascade)
  }
  
  model User {
    handledCalls  Call[]     @relation("HandledByUser", onDelete: SetNull)
    notes         CallNote[] @relation(onDelete: Cascade)
  }
  ```

- [ ] **Test: Cascade behavior correct**

### Soft Deletes
- [ ] **Add soft delete fields**
  ```prisma
  model User {
    isDeleted   Boolean   @default(false)
    deletedAt   DateTime?
    deletedBy   String?
    
    @@index([isDeleted, organizationId])
  }
  
  model Organization {
    isDeleted   Boolean   @default(false)
    deletedAt   DateTime?
    deletedBy   String?
  }
  
  model KnowledgeItem {
    isDeleted   Boolean   @default(false)
    deletedAt   DateTime?
  }
  ```

- [ ] **Update queries: WHERE isDeleted = false**
- [ ] **Test: Soft delete and restore**

### Audit Trail
- [ ] **Create AuditLog table**
  ```prisma
  model AuditLog {
    id             String   @id @default(cuid())
    organizationId String
    userId         String?
    
    action         String   // "user.role.changed"
    resourceType   String   // "user"
    resourceId     String   // "usr_123"
    
    before         Json?
    after          Json?
    
    ipAddress      String?
    userAgent      String?
    
    createdAt      DateTime @default(now())
    
    @@index([organizationId, createdAt])
    @@index([resourceType, resourceId])
  }
  ```

- [ ] **Log: Role changes, org settings, AI config, subscriptions**
- [ ] **Test: Audit log populated**

---

## 🤖 AI & Call Processing

### Timeouts & Retries
- [ ] **Speech-to-Text (Yandex)**
  - [ ] Timeout: 10 seconds per request
  - [ ] Retry: Exponential backoff (1s, 2s, 4s)
  - [ ] Max retries: 3 attempts
  - [ ] Fallback: Skip segment, continue call
  - [ ] Rate limit: 100 req/sec (API limit)
  - [ ] Test: Timeout and retry logic

- [ ] **Text-to-Speech (Yandex)**
  - [ ] Timeout: 5 seconds per request
  - [ ] Retry: 2 attempts
  - [ ] Fallback: Pre-recorded messages
  - [ ] Cache: Common phrases (Redis)
  - [ ] Test: Fallback messages work

- [ ] **LLM (OpenAI/Yandex GPT)**
  - [ ] Timeout: 15 seconds per request
  - [ ] Token limit: 4096 tokens (context + response)
  - [ ] Context window: Last 10 messages
  - [ ] Retry: 2 attempts with backoff
  - [ ] Rate limit: 60 req/min
  - [ ] Fallback: Switch to Yandex if OpenAI fails
  - [ ] Cost tracking: Log token usage per call
  - [ ] Budget limit: Alert if >$100/day
  - [ ] Test: Fallback and cost tracking

### Call Quality
- [ ] **Real-time monitoring**
  - [ ] Audio quality: MOS score >3.5
  - [ ] Latency: <300ms end-to-end
  - [ ] Jitter: <30ms
  - [ ] Packet loss: <1%
  - [ ] Poor quality action: Notify user, offer callback
  - [ ] Test: Quality alerts work

- [ ] **AI performance**
  - [ ] Confidence tracking: Per-response scoring
  - [ ] Low confidence: <50% triggers transfer
  - [ ] Stuck detection: Same response 3x = transfer
  - [ ] Sentiment tracking: Negative trend = alert
  - [ ] Transfer time: <5 seconds to human
  - [ ] Test: Auto-transfer triggers

### Recording & Storage
- [ ] **Recording**
  - [ ] Format: MP3, 64 kbps
  - [ ] Start delay: 3 seconds for announcement
  - [ ] Announcement: "This call is being recorded"
  - [ ] Upload: S3/Supabase Storage
  - [ ] Timeout: 60 seconds for upload
  - [ ] Retry: 3 attempts with backoff
  - [ ] Test: Upload retry logic

- [ ] **Storage management**
  - [ ] Encryption: AES-256 at rest
  - [ ] Access: Signed URLs, 1-hour expiry
  - [ ] Retention: 90d/1y/2y per plan
  - [ ] Auto-delete: Daily cron job
  - [ ] Test: Auto-deletion works

### Webhooks
- [ ] **Outgoing webhooks**
  - [ ] Signature: HMAC-SHA256 with secret
  - [ ] Timeout: 10 seconds
  - [ ] Retry: Exponential backoff (1m, 5m, 15m, 1h)
  - [ ] Max retries: 5 attempts
  - [ ] Failure notification: Email after 5 failures
  - [ ] Headers: X-Webhook-ID, X-Webhook-Signature
  - [ ] Test: Retry logic

- [ ] **Incoming webhooks**
  - [ ] Signature verification: Required
  - [ ] IP whitelist: Provider IP ranges
  - [ ] Idempotency: Check duplicate events
  - [ ] Processing timeout: 5 seconds
  - [ ] Async processing: Queue for long operations
  - [ ] Test: Signature verification

---

## 📊 Monitoring & Operations

### Logging
- [ ] **Structured logging**
  ```javascript
  logger.error('STT timeout', {
    requestId: req.id,
    userId: user.id,
    organizationId: user.organizationId,
    action: 'call.transcribe',
    duration: 10234,
    error: 'Timeout after 10s'
  });
  ```

- [ ] **Log levels**
  - [ ] ERROR: System errors, API failures
  - [ ] WARN: Low confidence, quota warnings
  - [ ] INFO: User actions, API requests
  - [ ] DEBUG: Detailed flow (dev only)
  - [ ] Test: Log output correct

- [ ] **Log retention**
  - [ ] Production: 30 days hot, 1 year archive
  - [ ] Staging: 7 days
  - [ ] Development: 3 days
  - [ ] Audit logs: 2 years
  - [ ] Test: Retention policy enforced

### Metrics & Alerts
- [ ] **System metrics**
  - [ ] API response time: p50, p95, p99
  - [ ] API error rate: 5xx per minute
  - [ ] Database query time: Slow queries >100ms
  - [ ] Cache hit rate: Redis/memory
  - [ ] Queue depth: Pending jobs
  - [ ] Test: Metrics collected

- [ ] **Business metrics**
  - [ ] Active calls: Real-time count
  - [ ] AI confidence: Average per hour
  - [ ] Transfer rate: % transferred
  - [ ] Call duration: Average per org
  - [ ] Test: Business metrics accurate

- [ ] **Critical alerts (PagerDuty)**
  - [ ] API down: >50% error rate for 2 min
  - [ ] Database down: Connection failures
  - [ ] Payment processor down: Stripe failures
  - [ ] STT/TTS down: Yandex failures
  - [ ] Test: Alerts fire correctly

- [ ] **Warning alerts (Email/Slack)**
  - [ ] Slow API: p95 >1000ms for 10 min
  - [ ] Quota near limit: Org at 90%
  - [ ] Failed payment: Retry required
  - [ ] Low AI confidence: <60% avg for 1 hour
  - [ ] Test: Warning alerts work

### CI/CD Pipeline
- [ ] **Continuous Integration**
  - [ ] Lint: ESLint, Prettier
  - [ ] Type check: TypeScript
  - [ ] Unit tests: Jest, >80% coverage
  - [ ] Integration tests
  - [ ] Build: Next.js, Node
  - [ ] Security scan: Snyk
  - [ ] Test: Pipeline runs on every push

- [ ] **Continuous Deployment**
  - [ ] Staging: Auto-deploy on main branch
  - [ ] Production: Manual approval
  - [ ] Blue-green: Zero downtime
  - [ ] Health checks: Before routing traffic
  - [ ] Rollback: One-click revert
  - [ ] Test: Deployment process

### Disaster Recovery
- [ ] **Backup strategy**
  - [ ] Frequency: Daily automated
  - [ ] Retention: 7 daily, 4 weekly, 12 monthly
  - [ ] Testing: Monthly restore test
  - [ ] Location: Off-site (different region)
  - [ ] Encryption: AES-256
  - [ ] Point-in-time: 7 days
  - [ ] Test: Restore from backup

- [ ] **Recovery procedures**
  - [ ] RTO: 4 hours
  - [ ] RPO: 1 hour
  - [ ] Document: Step-by-step runbook
  - [ ] Test: Annual disaster recovery drill

---

## 📜 Compliance

### GDPR (if EU customers)
- [ ] **Data rights**
  - [ ] Right to access: Export within 30 days
  - [ ] Right to deletion: Permanent delete within 30 days
  - [ ] Right to portability: JSON export
  - [ ] Consent management: Opt-in for cookies
  - [ ] Test: Export and delete flows

### Uzbekistan Compliance
- [ ] **Call recording**
  - [ ] Announcement: "This call is being recorded"
  - [ ] No opt-out: Legal requirement
  - [ ] Consent: Implicit by continuing call
  - [ ] Test: Announcement played

### Security
- [ ] **SOC 2 preparation**
  - [ ] Access controls: RBAC implemented
  - [ ] Encryption: At rest and in transit
  - [ ] Backups: Tested regularly
  - [ ] Incident response: Documented
  - [ ] Test: Security audit ready

---

## ✅ Final Checklist

Before production launch:

### Security ✓
- [ ] All input validations implemented
- [ ] Permission matrix enforced
- [ ] Rate limiting on auth endpoints
- [ ] Session management secure
- [ ] Audit logging enabled

### Reliability ✓
- [ ] All timeouts configured
- [ ] Retry logic with backoff
- [ ] Fallback strategies
- [ ] Error handling complete
- [ ] Database backups tested

### Operations ✓
- [ ] Monitoring dashboards
- [ ] Alerting rules configured
- [ ] CI/CD pipeline working
- [ ] Disaster recovery plan
- [ ] Incident response procedures

### User Experience ✓
- [ ] All loading states
- [ ] Clear error messages
- [ ] Edge cases handled
- [ ] Help documentation

### Compliance ✓
- [ ] GDPR compliance (if needed)
- [ ] Call recording consent
- [ ] Privacy policy published
- [ ] Terms of service

---

**Done? Great! Now schedule a security audit and penetration test before launch. 🚀**

