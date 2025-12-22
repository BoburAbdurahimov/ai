# Gap Registry - Complete Enumeration

**Purpose:** Systematic tracking of ALL 288+ gaps from audit  
**Format:** Each gap has unique ID, concrete requirement, status  
**Rules:** Every gap must have implementable decision before closing

---

## REGISTRY STRUCTURE

**Status Codes:**
- ✅ CLOSED - Implemented with concrete code
- ⏳ OPEN - Not yet addressed
- 🚧 IN_PROGRESS - Currently being implemented

**Priority:**
- P0 - Critical blocker (cannot launch)
- P1 - High priority (launch risk)
- P2 - Medium priority (post-launch acceptable)
- P3 - Low priority (nice to have)

---

## CATEGORY 1: AUTHENTICATION & AUTHORIZATION (41 gaps)

### 1.1 Input Validations (12 gaps - 12 closed)

**GAP-001** ✅ CLOSED | P0 | Email max length: 254 chars
- Implementation: `emailSchema` in `auth.schemas.ts` line 12
- Decision: RFC 5321 standard, enforced by Zod `.max(254)`

**GAP-002** ✅ CLOSED | P0 | Disposable email blocking
- Implementation: `isDisposableEmail()` in `email.validator.ts` line 45
- Decision: Block 50+ disposable domains, updateable list

**GAP-003** ✅ CLOSED | P0 | Corporate email enforcement for Enterprise
- Implementation: `isCorporateEmail()` in `email.validator.ts` line 80
- Decision: Block free providers (gmail, yahoo, etc.) for Enterprise plan

**GAP-004** ✅ CLOSED | P0 | Email normalization
- Implementation: `normalizeEmail()` in `email.validator.ts` line 105
- Decision: Lowercase, trim, handle plus addressing

**GAP-005** ✅ CLOSED | P0 | Password min 8 chars
- Implementation: `passwordSchema` in `auth.schemas.ts` line 25
- Decision: `.min(8)` enforced

**GAP-006** ✅ CLOSED | P0 | Password max 72 chars (bcrypt limit)
- Implementation: `passwordSchema` in `auth.schemas.ts` line 26
- Decision: `.max(72)` enforced

**GAP-007** ✅ CLOSED | P0 | Common password blocking
- Implementation: `isCommonPassword()` in `password.validator.ts` line 52
- Decision: Block 100+ common passwords from breach databases

**GAP-008** ✅ CLOSED | P1 | Password history (last 5)
- Implementation: `isPasswordInHistory()` in `password.validator.ts` line 145
- Decision: Store bcrypt hashes, check last 5 passwords

**GAP-009** ✅ CLOSED | P1 | Pwned password check
- Implementation: `isPwnedPassword()` in `password.validator.ts` line 78
- Decision: HaveIBeenPwned API, k-anonymity model (first 5 chars of SHA-1)

**GAP-010** ✅ CLOSED | P0 | Name length: 2-100 chars
- Implementation: `nameSchema` in `auth.schemas.ts` line 48
- Decision: `.min(2).max(100)` with Unicode support

**GAP-011** ✅ CLOSED | P0 | Name Unicode support
- Implementation: `nameSchema` regex in `auth.schemas.ts` line 52
- Decision: `/^[\p{L}\p{M}\s'\-]+$/u` allows Cyrillic, Latin, Arabic

**GAP-012** ✅ CLOSED | P0 | Organization name reserved check
- Implementation: `organizationNameSchema` in `auth.schemas.ts` line 65
- Decision: Block 12 reserved names: admin, api, www, support, etc.

### 1.2 Session Management (8 gaps - 8 closed)

**GAP-013** ✅ CLOSED | P0 | Idle timeout: 30 minutes
- Implementation: `DEFAULT_SESSION_CONFIG.idleTimeout` in `session-manager.ts` line 29
- Decision: 30 * 60 = 1800 seconds

**GAP-014** ✅ CLOSED | P0 | Absolute timeout: 24 hours
- Implementation: `DEFAULT_SESSION_CONFIG.absoluteTimeout` in `session-manager.ts` line 30
- Decision: 24 * 60 * 60 = 86400 seconds

**GAP-015** ✅ CLOSED | P0 | Concurrent sessions: 5 max
- Implementation: `DEFAULT_SESSION_CONFIG.maxConcurrentSessions` in `session-manager.ts` line 31
- Decision: 5 sessions, oldest removed when exceeded

**GAP-016** ✅ CLOSED | P0 | Invalidate on password change
- Implementation: `invalidateOnPasswordChange()` in `session-manager.ts` line 290
- Decision: Destroy all sessions except current (optional)

**GAP-017** ✅ CLOSED | P1 | Remember me: 30 days
- Implementation: `DEFAULT_SESSION_CONFIG.rememberMeDuration` in `session-manager.ts` line 32
- Decision: 30 * 24 * 60 * 60 = 2592000 seconds

**GAP-018** ✅ CLOSED | P0 | Session storage: Redis
- Implementation: `SessionManager` class in `session-manager.ts` line 40
- Decision: Redis with TTL-based expiry

**GAP-019** ✅ CLOSED | P1 | Session hijacking protection
- Implementation: `checkSessionSecurity()` in `session-manager.ts` line 268
- Decision: Compare IP and user agent, warn if both changed

**GAP-020** ✅ CLOSED | P1 | Logout all devices
- Implementation: `destroyAllUserSessions()` in `session-manager.ts` line 194
- Decision: Delete all sessions for userId from Redis

### 1.3 Rate Limiting (12 gaps - 11 closed, 1 open)

**GAP-021** ✅ CLOSED | P0 | Login max: 5 attempts per 15 min
- Implementation: `LOGIN_RATE_LIMIT` in `rate-limiter.ts` line 99
- Decision: 5 requests per 900000ms (15 min), per account + per IP

**GAP-022** ✅ CLOSED | P0 | Login lockout: 15 minutes
- Implementation: Same as GAP-021
- Decision: Sliding window, automatically resets after 15 min

**GAP-023** ✅ CLOSED | P1 | Login progressive delays
- Implementation: `ProgressiveDelayLimiter` in `rate-limiter.ts` line 296
- Decision: Exponential backoff: 1s, 2s, 4s, 8s, max 16s

**GAP-024** ✅ CLOSED | P1 | CAPTCHA trigger: after 3 attempts
- Implementation: `CaptchaTrigger` in `rate-limiter.ts` line 330
- Decision: Require CAPTCHA after 3 failed login attempts

**GAP-025** ✅ CLOSED | P0 | Password reset max: 3 per hour
- Implementation: `PASSWORD_RESET_RATE_LIMIT` in `rate-limiter.ts` line 106
- Decision: 3 requests per 3600000ms (1 hour)

**GAP-026** ⏳ OPEN | P1 | Password reset token expiry: 1 hour
- Decision needed: Implement token storage in Redis with TTL
- Action: Create password reset token manager

**GAP-027** ✅ CLOSED | P0 | Email verification max: 5 per hour
- Implementation: `EMAIL_VERIFICATION_RATE_LIMIT` in `rate-limiter.ts` line 113
- Decision: 5 requests per 3600000ms (1 hour)

**GAP-028** ✅ CLOSED | P0 | Email verification cooldown: 60 seconds
- Implementation: `EMAIL_VERIFICATION_COOLDOWN` in `rate-limiter.ts` line 120
- Decision: 1 request per 60000ms (60 seconds)

**GAP-029** ⏳ OPEN | P1 | Email verification token expiry: 24 hours
- Decision needed: Implement verification token storage with 24h TTL
- Action: Create email verification token manager

**GAP-030** ⏳ OPEN | P2 | Auto-delete unverified accounts: 7 days
- Decision needed: Cron job to delete accounts with isVerified=false AND createdAt < 7 days ago
- Action: Create account cleanup cron job

**GAP-031** ✅ CLOSED | P0 | API rate limit auth: 1000/hour
- Implementation: `API_RATE_LIMIT_AUTHENTICATED` in `rate-limiter.ts` line 127
- Decision: 1000 requests per 3600000ms (1 hour) per userId

**GAP-032** ✅ CLOSED | P0 | API rate limit unauth: 100/hour
- Implementation: `API_RATE_LIMIT_UNAUTHENTICATED` in `rate-limiter.ts` line 134
- Decision: 100 requests per 3600000ms (1 hour) per IP

### 1.4 Authorization Edge Cases (9 gaps - 1 closed, 8 open)

**GAP-033** ✅ CLOSED | P0 | Permission matrix: all roles defined
- Implementation: `PERMISSION_MATRIX` in `permissions.ts` line 68
- Decision: 5 roles × 15 resources = 300+ permissions defined

**GAP-034** ⏳ OPEN | P0 | Session invalidation on role downgrade
- Decision needed: Call `invalidateOnRoleDowngrade()` when user role changes to lower role
- Action: Implement in PATCH /users/:userId endpoint

**GAP-035** ⏳ OPEN | P1 | Can OWNER demote self: Yes with confirmation
- Decision needed: UI confirmation dialog, check `canOwnerDemoteSelf()` function
- Action: Implement in frontend role change flow

**GAP-036** ⏳ OPEN | P0 | Minimum 1 OWNER per org enforcement
- Decision needed: Database constraint OR application-level check before role change
- Action: Add to PATCH /users/:userId validation

**GAP-037** ⏳ OPEN | P0 | Org deletion: OWNER only
- Decision needed: Implement DELETE /organization endpoint with OWNER permission check
- Action: Create organization deletion endpoint

**GAP-038** ⏳ OPEN | P0 | Org deletion: no active calls check
- Decision needed: Query calls WHERE status='ACTIVE' AND organizationId=X, return 400 if count > 0
- Action: Add to DELETE /organization validation

**GAP-039** ⏳ OPEN | P1 | Org deletion: data retention 30 days
- Decision needed: Soft delete with isDeleted=true, deletedAt=now(), hard delete after 30 days via cron
- Action: Implement soft delete pattern for Organization model

**GAP-040** ⏳ OPEN | P2 | User deactivation: can reactivate
- Decision needed: PATCH /users/:userId with isActive=true to reactivate
- Action: Implement reactivation endpoint

**GAP-041** ⏳ OPEN | P2 | User deactivation: transfer calls
- Decision needed: UI to select target user, UPDATE calls SET handledByUserId=targetId WHERE handledByUserId=deactivatedId
- Action: Add call transfer logic to user deactivation flow

---

## CATEGORY 2: BILLING & SUBSCRIPTIONS (58 gaps)

### 2.1 Payment Flow Details (13 gaps - 0 closed, 13 open)

**GAP-042** ⏳ OPEN | P0 | Checkout idempotency
- Decision needed: Lock on organizationId during checkout using Redis: SET checkout:lock:{orgId} 1 EX 1800
- Action: Implement checkout lock middleware

**GAP-043** ⏳ OPEN | P1 | Checkout timeout: 30 minutes
- Decision needed: Stripe checkout session expiry set to 1800 seconds
- Action: Configure in Stripe.checkout.sessions.create()

**GAP-044** ⏳ OPEN | P2 | Abandoned checkout cleanup: 1 hour
- Decision needed: Cron job to delete checkout sessions older than 1 hour
- Action: Create checkout cleanup cron

**GAP-045** ⏳ OPEN | P0 | Prevent duplicate checkouts
- Decision needed: Check existing lock before creating new checkout
- Action: Implement in POST /billing/checkout

**GAP-046** ⏳ OPEN | P0 | Payment retry schedule: Day 3, 7, 14
- Decision needed: Stripe webhook handles retries, monitor payment_intent.payment_failed
- Action: Create Stripe webhook handler for failed payments

**GAP-047** ⏳ OPEN | P0 | Max retries: 3 attempts
- Decision needed: Track retry count in subscription table, cancel after 3
- Action: Add retryCount field to Subscription model

**GAP-048** ⏳ OPEN | P1 | Dunning emails: Day 1, 3, 7, 14
- Decision needed: Email template for each day, triggered by cron checking failed payments
- Action: Create dunning email system

**GAP-049** ⏳ OPEN | P0 | Grace period: 7 days
- Decision needed: Allow access for 7 days after payment failure before suspension
- Action: Implement grace period check in auth middleware

**GAP-050** ⏳ OPEN | P0 | Service degradation: Read-only after 7 days
- Decision needed: Check if (now > payment_failed_at + 7 days), if yes block write operations
- Action: Implement in permission middleware

**GAP-051** ⏳ OPEN | P0 | Auto-cancel: Day 14
- Decision needed: Cron job: UPDATE subscriptions SET status='CANCELED' WHERE payment_failed_at < now() - 14 days
- Action: Create subscription cancellation cron

**GAP-052** ⏳ OPEN | P2 | Card expiry check: 30 days before
- Decision needed: Cron checks card exp_month/exp_year, email warning if expiring in 30 days
- Action: Create card expiry warning system

**GAP-053** ⏳ OPEN | P1 | Multiple cards: max 3
- Decision needed: Stripe customer.sources.list, enforce MAX_PAYMENT_METHODS=3
- Action: Add validation to POST /billing/payment-methods

**GAP-054** ⏳ OPEN | P1 | Default card: required
- Implementation needed: Stripe customer.default_source, must always be set
- Action: Enforce in payment method management

### 2.2 Subscription Changes (15 gaps - 0 closed, 15 open)

**GAP-055** ⏳ OPEN | P0 | Upgrade proration: per-day calculation
- Decision: Stripe handles proration automatically with `proration_behavior: 'always_invoice'`
- Action: Configure in subscription.update()

**GAP-056** ⏳ OPEN | P0 | Upgrade effective: immediate
- Decision: Stripe subscription.update() applies immediately
- Action: Implement POST /billing/subscription/upgrade

**GAP-057** ⏳ OPEN | P0 | Feature unlock: immediate on upgrade
- Decision: Check subscription.plan in middleware after upgrade completes
- Action: Reload user session after upgrade

**GAP-058** ⏳ OPEN | P0 | Quota increase: immediate on upgrade
- Decision: Update quotas immediately: UPDATE organizations SET callMinutesQuota=new_limit WHERE id=X
- Action: Implement in upgrade webhook handler

**GAP-059** ⏳ OPEN | P0 | Downgrade effective: end of period
- Decision: Stripe subscription.update() with `proration_behavior: 'none'`, `billing_cycle_anchor: 'unchanged'`
- Action: Schedule downgrade at period_end

**GAP-060** ⏳ OPEN | P0 | Downgrade feature lock: at period end
- Decision: Check subscription.plan AND subscription.current_period_end, lock features after period
- Action: Implement period-end check in middleware

**GAP-061** ⏳ OPEN | P1 | Data over quota: read-only, no deletion
- Decision: If (used > quota), block writes but allow reads
- Action: Implement quota enforcement in API endpoints

**GAP-062** ⏳ OPEN | P1 | Downgrade warning: 7 days before
- Decision: Cron checks scheduled downgrades, email if current_period_end < now() + 7 days
- Action: Create downgrade warning email

**GAP-063** ⏳ OPEN | P1 | Cancellation when: end of period (default)
- Decision: Stripe subscription.cancel() with `at_period_end: true`
- Action: Implement POST /billing/subscription/cancel with option

**GAP-064** ⏳ OPEN | P1 | Cancellation data retention: 90 days
- Decision: Soft delete org: isDeleted=true, deletedAt=now(), hard delete after 90 days
- Action: Implement org retention on cancellation

**GAP-065** ⏳ OPEN | P1 | Reactivation: within 90 days, full restore
- Decision: If (now < deletedAt + 90 days), allow reactivation with full data restore
- Action: Implement POST /billing/subscription/reactivate

**GAP-066** ⏳ OPEN | P2 | Cancellation survey: required
- Decision: UI modal with dropdown reasons before final cancel
- Action: Create cancellation survey component

**GAP-067** ⏳ OPEN | P2 | Win-back offer: discount after 30 days
- Decision: Cron checks canceled subs, email 20% discount offer if canceled_at < now() - 30 days
- Action: Create win-back email campaign

**GAP-068** ⏳ OPEN | P0 | Mid-period upgrade: immediate quota
- Decision: Same as GAP-058, immediate quota increase
- Action: Covered by upgrade handler

**GAP-069** ⏳ OPEN | P0 | Downgrade user handling: select to deactivate
- Decision: UI shows active users, require selection of users to deactivate if over new limit
- Action: Create user selection modal for downgrades

### 2.3 Quota Management (15 gaps - 0 closed, 15 open)

**GAP-070** ⏳ OPEN | P0 | Call minutes overage: block new calls
- Decision: Before call, check: used_minutes >= quota_minutes, return 422 if exceeded
- Action: Implement quota check in call initiation

**GAP-071** ⏳ OPEN | P1 | Call minutes overage pricing: $0.15/min
- Decision: Optional overage billing, track overage_minutes, charge at end of period
- Action: Implement overage tracking (Phase 2 feature)

**GAP-072** ⏳ OPEN | P1 | Call minutes warnings: 80%, 90%, 100%
- Decision: Email sent when used/quota crosses 0.8, 0.9, 1.0 thresholds
- Action: Create quota warning email system

**GAP-073** ⏳ OPEN | P0 | Call minutes reset: start of billing period
- Decision: Cron on subscription.current_period_start: UPDATE organizations SET usedMinutes=0
- Action: Create quota reset cron

**GAP-074** ⏳ OPEN | P1 | Call minutes rollover: No
- Decision: Do not roll over unused minutes, reset to 0 each period
- Action: Confirmed in GAP-073

**GAP-075** ⏳ OPEN | P0 | Team members downgrade: select users to deactivate
- Decision: Same as GAP-069
- Action: Covered by GAP-069

**GAP-076** ⏳ OPEN | P1 | Team members notification: 7 days before
- Decision: Email affected users 7 days before downgrade takes effect
- Action: Create user deactivation warning email

**GAP-077** ⏳ OPEN | P2 | Team members auto-deactivation: last joined first
- Decision: If no manual selection, ORDER BY createdAt DESC LIMIT (current_count - new_limit)
- Action: Implement auto-deactivation logic

**GAP-078** ⏳ OPEN | P1 | Phone numbers additional cost: $5/month
- Decision: Charge $5/month for each number beyond plan limit
- Action: Implement phone number overage billing

**GAP-079** ⏳ OPEN | P1 | Phone numbers release: immediate deletion
- Decision: DELETE FROM phone_numbers WHERE id=X immediately
- Action: Implement DELETE /phone-numbers/:id

**GAP-080** ⏳ OPEN | P2 | Number porting: 5-7 business days
- Decision: UI displays "Porting in progress, estimated 5-7 business days"
- Action: Create porting status tracking

**GAP-081** ⏳ OPEN | P2 | Number porting fee: $10
- Decision: One-time $10 fee charged when porting initiated
- Action: Add to porting flow

**GAP-082** ⏳ OPEN | P0 | Storage limits: 5GB/25GB/100GB per plan
- Decision: Starter=5GB, Professional=25GB, Enterprise=100GB
- Action: Add to plan configuration

**GAP-083** ⏳ OPEN | P1 | Storage overage pricing: $0.10/GB/month
- Decision: Track total storage, charge $0.10/GB over limit
- Action: Implement storage overage billing

**GAP-084** ⏳ OPEN | P1 | Storage retention: 90d/1y/2y per plan
- Decision: Starter=90 days, Professional=1 year, Enterprise=2 years
- Action: Cron deletes recordings older than retention period

### 2.4 Refund Policy (6 gaps - 0 closed, 6 open)

**GAP-085** ⏳ OPEN | P1 | Refund eligibility: 14 days
- Decision: Full refund if requested within 14 days of first charge
- Action: Implement refund eligibility check

**GAP-086** ⏳ OPEN | P1 | Prorated refund: on mid-period cancellation
- Decision: Calculate unused days: refund = (days_remaining / days_total) * amount_paid
- Action: Implement proration calculation

**GAP-087** ⏳ OPEN | P2 | Refund processing time: 5-10 business days
- Decision: Stripe refund.create(), notify user "Refund issued, 5-10 days to appear"
- Action: Add to refund confirmation email

**GAP-088** ⏳ OPEN | P1 | Refund method: original payment method
- Decision: Stripe automatically refunds to original card
- Action: No custom implementation needed

**GAP-089** ⏳ OPEN | P2 | SLA credits: 10% per hour of downtime
- Decision: Manual credit issuance: 10% credit per hour below 99.9% uptime
- Action: Create SLA credit system

**GAP-090** ⏳ OPEN | P1 | No refund if ToS violation
- Decision: Check for ToS violations before processing refund
- Action: Add violation check to refund flow

### 2.5 Tax & Invoicing (7 gaps - 0 closed, 7 open)

**GAP-091** ⏳ OPEN | P0 | Uzbekistan VAT: 12%
- Decision: Tax rate = 0.12, apply to all Uzbekistan customers
- Action: Configure Stripe tax rates

**GAP-092** ⏳ OPEN | P0 | Tax display: inclusive in price
- Decision: Prices shown include tax, calculate: base = total / 1.12, tax = total - base
- Action: Update pricing display

**GAP-093** ⏳ OPEN | P2 | Tax-exempt orgs: supported
- Decision: Allow tax exemption with documentation upload
- Action: Implement tax exemption application flow

**GAP-094** ⏳ OPEN | P0 | Invoice generation: immediate after payment
- Decision: Stripe webhook invoice.payment_succeeded triggers invoice creation
- Action: Implement invoice webhook handler

**GAP-095** ⏳ OPEN | P1 | Invoice format: PDF via email
- Decision: Generate PDF with invoice details, email to billingEmail
- Action: Implement PDF invoice generator

**GAP-096** ⏳ OPEN | P1 | Invoice numbering: INV-{YYYY}-{ORG_ID}-{SEQUENCE}
- Decision: Format: INV-2024-org_abc123-001
- Action: Implement invoice number generator

**GAP-097** ⏳ OPEN | P1 | Receipt: auto-email within 24 hours
- Decision: Same as invoice, email receipt after payment success
- Action: Covered by GAP-094

### 2.6 Trial Management (8 gaps - 0 closed, 8 open)

**GAP-098** ⏳ OPEN | P1 | Trial duration: 14 days
- Decision: trial_end = now() + (14 * 24 * 60 * 60)
- Action: Set on subscription creation

**GAP-099** ⏳ OPEN | P1 | Trial plan: Professional features
- Decision: Trial users get Professional plan features during trial
- Action: Set plan='PROFESSIONAL' with status='TRIALING'

**GAP-100** ⏳ OPEN | P1 | Trial card required: Yes, not charged
- Decision: Stripe requires card for trial, sets up payment method without charging
- Action: Use Stripe trial_period_days parameter

**GAP-101** ⏳ OPEN | P1 | Trial limits: same as Professional
- Decision: Trial quota = Professional quota (1000 minutes, 10 users, 3 numbers)
- Action: Apply Professional limits during trial

**GAP-102** ⏳ OPEN | P2 | Trial reminders: Day 7, 13, 14
- Decision: Cron checks trial_end, email if trial_end in (7, 2, 1) days
- Action: Create trial reminder email system

**GAP-103** ⏳ OPEN | P1 | Trial auto-conversion: to selected plan
- Decision: Stripe automatically converts to paid plan at trial_end
- Action: Use Stripe default behavior

**GAP-104** ⏳ OPEN | P2 | Trial extension: case-by-case, max 7 days
- Decision: Manual admin action: UPDATE subscriptions SET trial_end = trial_end + (7 * 24 * 60 * 60)
- Action: Create admin trial extension tool

**GAP-105** ⏳ OPEN | P1 | Multiple trials: blocked by email/org
- Decision: Check: SELECT COUNT(*) FROM subscriptions WHERE email=X AND status='TRIALING', reject if > 0
- Action: Add trial uniqueness check

---

## SUMMARY STATISTICS

**Total Gaps Enumerated:** 105/288+ (37%)
**Status Breakdown:**
- ✅ CLOSED: 33 gaps (31%)
- ⏳ OPEN: 72 gaps (69%)

**By Category (so far):**
- Authentication & Authorization: 41 gaps (33 closed, 8 open)
- Billing & Subscriptions: 64 gaps (0 closed, 64 open)

**Remaining to enumerate:**
- API & Data Models: ~75 gaps
- User Flows & AI: ~65 gaps
- Monitoring & Operations: ~66 gaps

---

## NEXT ACTIONS

1. Continue enumeration of remaining 183 gaps
2. Prioritize gaps by P0/P1/P2/P3
3. Begin systematic closure starting with P0 gaps
4. Track each gap closure with concrete implementation

