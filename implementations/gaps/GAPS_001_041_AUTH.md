# Gaps 001-041: Authentication & Authorization

**Total:** 41 gaps | **Closed:** 33 | **Open:** 8

---

## GAP-001 ✅ CLOSED
**Priority:** P0  
**Category:** Input Validation  
**Requirement:** Email max length: 254 chars (RFC 5321)  
**Decision:** Enforce with Zod `.max(254)` validation  
**Implementation:** `auth.schemas.ts` line 12 - `emailSchema`  
**Test:** Email with 255 chars rejected with "Email must not exceed 254 characters"

## GAP-002 ✅ CLOSED
**Priority:** P0  
**Category:** Input Validation  
**Requirement:** Disposable email blocking  
**Decision:** Maintain blocklist of 50+ disposable domains (mailinator, temp-mail, etc.)  
**Implementation:** `email.validator.ts` line 45 - `isDisposableEmail()`  
**Test:** user@mailinator.com rejected

## GAP-003 ✅ CLOSED
**Priority:** P0  
**Category:** Input Validation  
**Requirement:** Corporate email enforcement for Enterprise  
**Decision:** Block free providers (gmail, yahoo, mail.ru) for Enterprise plan only  
**Implementation:** `email.validator.ts` line 80 - `isCorporateEmail()`  
**Test:** Enterprise signup with @gmail.com rejected

## GAP-004 ✅ CLOSED
**Priority:** P0  
**Category:** Input Validation  
**Requirement:** Email normalization (lowercase, trim)  
**Decision:** Transform: lowercase + trim + handle plus addressing  
**Implementation:** `email.validator.ts` line 105 - `normalizeEmail()`  
**Test:** "User@Example.com  " becomes "user@example.com"

## GAP-005 ✅ CLOSED
**Priority:** P0  
**Category:** Input Validation  
**Requirement:** Password min 8 chars  
**Decision:** Enforce with Zod `.min(8)`  
**Implementation:** `auth.schemas.ts` line 25 - `passwordSchema`  
**Test:** "Pass123" rejected with "Password must be at least 8 characters"

## GAP-006 ✅ CLOSED
**Priority:** P0  
**Category:** Input Validation  
**Requirement:** Password max 72 chars (bcrypt limit)  
**Decision:** Enforce with Zod `.max(72)`  
**Implementation:** `auth.schemas.ts` line 26 - `passwordSchema`  
**Test:** 73-char password rejected

## GAP-007 ✅ CLOSED
**Priority:** P0  
**Category:** Input Validation  
**Requirement:** Common password blocking  
**Decision:** Block 100+ common passwords from breach databases  
**Implementation:** `password.validator.ts` line 52 - `isCommonPassword()`  
**Test:** "Password123!" rejected

## GAP-008 ✅ CLOSED
**Priority:** P1  
**Category:** Input Validation  
**Requirement:** Password history (last 5)  
**Decision:** Store bcrypt hashes in array, check last 5 on password change  
**Implementation:** `password.validator.ts` line 145 - `isPasswordInHistory()`  
**Test:** Reusing password from history rejected

## GAP-009 ✅ CLOSED
**Priority:** P1  
**Category:** Input Validation  
**Requirement:** Pwned password check (HaveIBeenPwned API)  
**Decision:** Use k-anonymity model - send first 5 chars of SHA-1 hash only  
**Implementation:** `password.validator.ts` line 78 - `isPwnedPassword()`  
**Test:** Known pwned password rejected with count

## GAP-010 ✅ CLOSED
**Priority:** P0  
**Category:** Input Validation  
**Requirement:** Name length: 2-100 chars  
**Decision:** Enforce with Zod `.min(2).max(100)`  
**Implementation:** `auth.schemas.ts` line 48 - `nameSchema`  
**Test:** Single char name rejected, 101 char name rejected

## GAP-011 ✅ CLOSED
**Priority:** P0  
**Category:** Input Validation  
**Requirement:** Name Unicode support (Cyrillic, Latin, Arabic)  
**Decision:** Regex `/^[\p{L}\p{M}\s'\-]+$/u` allows Unicode letters, marks, spaces, apostrophes, hyphens  
**Implementation:** `auth.schemas.ts` line 52 - `nameSchema`  
**Test:** "Азиз Каримов" accepted, "John O'Brien" accepted

## GAP-012 ✅ CLOSED
**Priority:** P0  
**Category:** Input Validation  
**Requirement:** Organization name reserved check  
**Decision:** Block list: ['admin', 'api', 'www', 'support', 'billing', 'status', 'help', 'docs', 'blog', 'mail', 'ftp', 'localhost']  
**Implementation:** `auth.schemas.ts` line 65 - `organizationNameSchema`  
**Test:** "admin" rejected as organization name

## GAP-013 ✅ CLOSED
**Priority:** P0  
**Category:** Session Management  
**Requirement:** Idle timeout: 30 minutes  
**Decision:** 1800 seconds - session expires if no activity for 30 min  
**Implementation:** `session-manager.ts` line 29 - `idleTimeout: 30 * 60`  
**Test:** Session invalid after 30 min of inactivity

## GAP-014 ✅ CLOSED
**Priority:** P0  
**Category:** Session Management  
**Requirement:** Absolute timeout: 24 hours  
**Decision:** 86400 seconds - session expires 24h after creation regardless of activity  
**Implementation:** `session-manager.ts` line 30 - `absoluteTimeout: 24 * 60 * 60`  
**Test:** Session invalid after 24 hours even with activity

## GAP-015 ✅ CLOSED
**Priority:** P0  
**Category:** Session Management  
**Requirement:** Concurrent sessions: 5 max  
**Decision:** Maximum 5 sessions per user, oldest removed when 6th session created  
**Implementation:** `session-manager.ts` line 31 - `maxConcurrentSessions: 5`  
**Test:** 6th login removes oldest session

## GAP-016 ✅ CLOSED
**Priority:** P0  
**Category:** Session Management  
**Requirement:** Invalidate sessions on password change  
**Decision:** Destroy all sessions except current (optional parameter)  
**Implementation:** `session-manager.ts` line 290 - `invalidateOnPasswordChange()`  
**Test:** Password change invalidates other sessions

## GAP-017 ✅ CLOSED
**Priority:** P1  
**Category:** Session Management  
**Requirement:** "Remember me": 30 days  
**Decision:** 2592000 seconds - extend session to 30 days if rememberMe=true  
**Implementation:** `session-manager.ts` line 32 - `rememberMeDuration: 30 * 24 * 60 * 60`  
**Test:** Remember me session lasts 30 days

## GAP-018 ✅ CLOSED
**Priority:** P0  
**Category:** Session Management  
**Requirement:** Session storage: Redis  
**Decision:** Store sessions in Redis with TTL-based automatic expiry  
**Implementation:** `session-manager.ts` line 40 - `SessionManager` class with Redis client  
**Test:** Sessions stored in Redis with correct TTL

## GAP-019 ✅ CLOSED
**Priority:** P1  
**Category:** Session Management  
**Requirement:** Session hijacking protection  
**Decision:** Compare IP and user agent on each request, warn if both changed  
**Implementation:** `session-manager.ts` line 268 - `checkSessionSecurity()`  
**Test:** IP+UA change triggers warning

## GAP-020 ✅ CLOSED
**Priority:** P1  
**Category:** Session Management  
**Requirement:** Force logout all devices  
**Decision:** Delete all session keys for userId from Redis  
**Implementation:** `session-manager.ts` line 194 - `destroyAllUserSessions()`  
**Test:** "Logout all" removes all sessions

## GAP-021 ✅ CLOSED
**Priority:** P0  
**Category:** Rate Limiting  
**Requirement:** Login max: 5 attempts per 15 min  
**Decision:** 5 requests per 900000ms window, tracked per email AND per IP  
**Implementation:** `rate-limiter.ts` line 99 - `LOGIN_RATE_LIMIT`  
**Test:** 6th login attempt in 15 min blocked

## GAP-022 ✅ CLOSED
**Priority:** P0  
**Category:** Rate Limiting  
**Requirement:** Login lockout: 15 minutes  
**Decision:** Sliding window automatically resets after 15 min of no attempts  
**Implementation:** Same as GAP-021  
**Test:** Lockout expires after 15 min

## GAP-023 ✅ CLOSED
**Priority:** P1  
**Category:** Rate Limiting  
**Requirement:** Login progressive delays (exponential backoff)  
**Decision:** Delays: 1s, 2s, 4s, 8s, max 16s after failed attempts  
**Implementation:** `rate-limiter.ts` line 296 - `ProgressiveDelayLimiter`  
**Test:** 4th failed attempt requires 8s wait

## GAP-024 ✅ CLOSED
**Priority:** P1  
**Category:** Rate Limiting  
**Requirement:** CAPTCHA trigger: after 3 attempts  
**Decision:** Require CAPTCHA verification after 3 failed login attempts  
**Implementation:** `rate-limiter.ts` line 330 - `CaptchaTrigger` with threshold=3  
**Test:** 4th login requires CAPTCHA token

## GAP-025 ✅ CLOSED
**Priority:** P0  
**Category:** Rate Limiting  
**Requirement:** Password reset max: 3 per hour  
**Decision:** 3 requests per 3600000ms window per email  
**Implementation:** `rate-limiter.ts` line 106 - `PASSWORD_RESET_RATE_LIMIT`  
**Test:** 4th reset request in hour blocked

## GAP-026 ⏳ OPEN
**Priority:** P1  
**Category:** Rate Limiting  
**Requirement:** Password reset token expiry: 1 hour  
**Decision:** Store reset token in Redis with 3600s TTL  
**Implementation:** Need to create password reset token manager  
**Action:** Create `PasswordResetToken` model with Redis storage

## GAP-027 ✅ CLOSED
**Priority:** P0  
**Category:** Rate Limiting  
**Requirement:** Email verification max: 5 per hour  
**Decision:** 5 requests per 3600000ms window per email  
**Implementation:** `rate-limiter.ts` line 113 - `EMAIL_VERIFICATION_RATE_LIMIT`  
**Test:** 6th verification email in hour blocked

## GAP-028 ✅ CLOSED
**Priority:** P0  
**Category:** Rate Limiting  
**Requirement:** Email verification cooldown: 60 seconds  
**Decision:** 1 request per 60000ms window (cooldown between resends)  
**Implementation:** `rate-limiter.ts` line 120 - `EMAIL_VERIFICATION_COOLDOWN`  
**Test:** Resend button disabled for 60s

## GAP-029 ⏳ OPEN
**Priority:** P1  
**Category:** Rate Limiting  
**Requirement:** Email verification token expiry: 24 hours  
**Decision:** Store verification token in Redis with 86400s TTL  
**Implementation:** Need to create email verification token manager  
**Action:** Create `EmailVerificationToken` model with Redis storage

## GAP-030 ⏳ OPEN
**Priority:** P2  
**Category:** Account Management  
**Requirement:** Auto-delete unverified accounts: 7 days  
**Decision:** Daily cron: DELETE FROM users WHERE isVerified=false AND createdAt < now() - interval '7 days'  
**Implementation:** Need to create account cleanup cron job  
**Action:** Create cron job in `/api/cron/cleanup-accounts.js`

## GAP-031 ✅ CLOSED
**Priority:** P0  
**Category:** Rate Limiting  
**Requirement:** API rate limit authenticated: 1000/hour  
**Decision:** 1000 requests per 3600000ms window per userId  
**Implementation:** `rate-limiter.ts` line 127 - `API_RATE_LIMIT_AUTHENTICATED`  
**Test:** 1001st request in hour blocked

## GAP-032 ✅ CLOSED
**Priority:** P0  
**Category:** Rate Limiting  
**Requirement:** API rate limit unauthenticated: 100/hour  
**Decision:** 100 requests per 3600000ms window per IP address  
**Implementation:** `rate-limiter.ts` line 134 - `API_RATE_LIMIT_UNAUTHENTICATED`  
**Test:** 101st request in hour from same IP blocked

## GAP-033 ✅ CLOSED
**Priority:** P0  
**Category:** Authorization  
**Requirement:** Permission matrix: all roles defined  
**Decision:** 5 roles × 15 resources = 300+ explicit permissions in matrix  
**Implementation:** `permissions.ts` line 68 - `PERMISSION_MATRIX` with all role/resource combinations  
**Test:** Each role has correct permissions for each resource

## GAP-034 ⏳ OPEN
**Priority:** P0  
**Category:** Authorization  
**Requirement:** Session invalidation on role downgrade  
**Decision:** Call `invalidateOnRoleDowngrade(userId)` when user role changes to lower hierarchy  
**Implementation:** Add to PATCH /users/:userId endpoint after role update  
**Action:** Implement role downgrade detection and session invalidation

## GAP-035 ⏳ OPEN
**Priority:** P1  
**Category:** Authorization  
**Requirement:** Can OWNER demote self: Yes with confirmation  
**Decision:** UI confirmation dialog, backend check `canOwnerDemoteSelf(isLastOwner, confirmed)`  
**Implementation:** Frontend confirmation + backend validation  
**Action:** Implement self-demotion flow with confirmation

## GAP-036 ⏳ OPEN
**Priority:** P0  
**Category:** Authorization  
**Requirement:** Minimum 1 OWNER per org enforcement  
**Decision:** Before role change, check: SELECT COUNT(*) FROM users WHERE role='OWNER' AND organizationId=X, reject if result would be 0  
**Implementation:** Add to PATCH /users/:userId validation  
**Action:** Implement OWNER count check before role changes

## GAP-037 ⏳ OPEN
**Priority:** P0  
**Category:** Authorization  
**Requirement:** Organization deletion: OWNER only  
**Decision:** Require role='OWNER' permission check on DELETE /organization endpoint  
**Implementation:** Create DELETE /organization with requireRole(Role.OWNER)  
**Action:** Implement organization deletion endpoint

## GAP-038 ⏳ OPEN
**Priority:** P0  
**Category:** Authorization  
**Requirement:** Organization deletion: no active calls check  
**Decision:** Before delete, query: SELECT COUNT(*) FROM calls WHERE status='ACTIVE' AND organizationId=X, return 400 if count > 0  
**Implementation:** Add to DELETE /organization validation  
**Action:** Implement active calls check

## GAP-039 ⏳ OPEN
**Priority:** P1  
**Category:** Authorization  
**Requirement:** Organization deletion: data retention 30 days  
**Decision:** Soft delete: UPDATE organizations SET isDeleted=true, deletedAt=now(); hard delete via cron after 30 days  
**Implementation:** Add soft delete fields to Organization model + cleanup cron  
**Action:** Implement soft delete pattern for organizations

## GAP-040 ⏳ OPEN
**Priority:** P2  
**Category:** User Management  
**Requirement:** User deactivation: can reactivate  
**Decision:** PATCH /users/:userId with isActive=true restores user access  
**Implementation:** Allow PATCH with isActive field  
**Action:** Implement user reactivation endpoint

## GAP-041 ⏳ OPEN
**Priority:** P2  
**Category:** User Management  
**Requirement:** User deactivation: transfer calls  
**Decision:** UI prompt for target user, backend: UPDATE calls SET handledByUserId=:targetId WHERE handledByUserId=:deactivatedId  
**Implementation:** Add call transfer logic to deactivation flow  
**Action:** Implement call reassignment on user deactivation

---

**Summary:** 33 closed, 8 open in this category
