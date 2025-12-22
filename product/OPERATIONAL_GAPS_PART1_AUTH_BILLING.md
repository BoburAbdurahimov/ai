# Operational Gaps Audit - Part 1: Auth & Billing

**Date:** December 22, 2025  
**Audit Focus:** Authentication, Authorization, Billing & Subscriptions

---

## 🔐 AUTHENTICATION & AUTHORIZATION GAPS

### 1. Input Validations - MISSING

**Email:**
- ❌ Max length: 254 chars (RFC 5321)
- ❌ Disposable email blocking list
- ❌ Corporate email enforcement (Enterprise)
- ❌ Normalization: lowercase, trim
- ❌ Plus addressing: user+tag@domain.com

**Password:**
- ✅ Min 8 chars (specified)
- ❌ Max 72 chars (bcrypt limit)
- ❌ Common password blocklist
- ❌ Password history (last 5)
- ❌ Pwned password API check
- ❌ Complexity rules unclear

**Names (User/Org):**
- ❌ Length: 2-100 chars
- ❌ Unicode support (Cyrillic, Latin)
- ❌ Special chars policy
- ❌ Profanity filter
- ❌ Reserved names list (admin, api, www)

### 2. Session Management - MISSING

- ❌ Idle timeout: 30 minutes
- ❌ Absolute timeout: 24 hours
- ❌ Concurrent sessions: 5 max
- ❌ Invalidate on password change
- ❌ "Remember me": 30 days
- ❌ Session storage: Redis vs JWT
- ❌ Session hijacking protection
- ❌ Force logout all devices

### 3. Rate Limiting - PARTIAL

**Login:**
- ❌ Max attempts: 5
- ❌ Lockout duration: 15 min
- ❌ Exponential backoff
- ❌ CAPTCHA trigger: 3 attempts
- ❌ Per-IP vs per-account

**Password Reset:**
- ❌ Max requests/hour: 3
- ❌ Token expiry: 1 hour
- ❌ Token single-use enforcement
- ❌ Email on successful reset

**Email Verification:**
- ✅ Max resends: 5/hour (specified)
- ✅ Cooldown: 60 seconds (specified)
- ❌ Token expiry: 24 hours
- ❌ Auto-delete unverified accounts: 7 days

**API Rate Limits:**
- ✅ Authenticated: 1000/hour (specified)
- ✅ Unauthenticated: 100/hour (specified)
- ❌ Per-endpoint limits
- ❌ Burst allowance
- ❌ Rate limit headers (X-RateLimit-*)

### 4. Authorization Edge Cases - MISSING

**Role Changes:**
- ❌ Session invalidation on downgrade?
- ❌ Can OWNER demote self?
- ❌ Minimum 1 OWNER per org
- ❌ Permission inheritance rules
- ❌ Pending role changes (effective date?)

**Organization Deletion:**
- ❌ Permission: OWNER only
- ❌ User handling: soft delete + 30 day retention
- ❌ Active calls: graceful termination
- ❌ Data retention: 30 days before purge
- ❌ Export before delete: required
- ❌ Confirmation: type org name

**User Deactivation:**
- ❌ Can reactivate? Yes
- ❌ Data preservation: full
- ❌ Assigned calls: transfer or unassign
- ❌ Scheduled reports: pause
- ❌ Session invalidation: immediate

### 5. Permission Matrix - MISSING

| Action | OWNER | ADMIN | MANAGER | OPERATOR | VIEWER |
|--------|-------|-------|---------|----------|--------|
| **Organization** |
| Delete org | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update org settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| View org settings | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Billing** |
| Update payment | ✅ | ❌ | ❌ | ❌ | ❌ |
| View invoices | ✅ | ✅ | ❌ | ❌ | ❌ |
| Change plan | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Users** |
| Invite users | ✅ | ✅ | ✅ | ❌ | ❌ |
| Remove users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Change roles | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Calls** |
| View all calls | ✅ | ✅ | ✅ | ❌ | ✅ |
| View own calls | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add notes | ✅ | ✅ | ✅ | ✅ | ❌ |
| Delete calls | ✅ | ✅ | ❌ | ❌ | ❌ |
| **AI Config** |
| Update AI config | ✅ | ✅ | ❌ | ❌ | ❌ |
| View AI config | ✅ | ✅ | ✅ | ✅ | ✅ |
| Test AI | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Phone Numbers** |
| Add numbers | ✅ | ✅ | ❌ | ❌ | ❌ |
| Remove numbers | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update routing | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Analytics** |
| View analytics | ✅ | ✅ | ✅ | ❌ | ✅ |
| Export reports | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 💳 BILLING & SUBSCRIPTION GAPS

### 1. Payment Flow Details - MISSING

**Checkout:**
- ❌ Idempotency key: Stripe handles, but need client retry logic
- ❌ Checkout timeout: 30 minutes
- ❌ Abandoned session cleanup: 1 hour
- ❌ Prevent duplicate checkouts: lock on organizationId

**Payment Failures:**
- ❌ Retry schedule: Day 3, 7, 14
- ❌ Max retries: 3 attempts
- ❌ Dunning emails: Day 1, 3, 7, 14
- ❌ Grace period: 7 days
- ❌ Service degradation: Read-only mode after 7 days
- ❌ Auto-cancel: Day 14

**Payment Methods:**
- ❌ Card expiry check: 30 days before
- ❌ Multiple cards: Yes, max 3
- ❌ Default card: Required
- ❌ Update during active subscription: Allowed
- ❌ Backup card: Optional, recommended

### 2. Subscription Changes - MISSING

**Upgrades:**
- ❌ Proration: Per-day calculation
- ❌ Effective: Immediate
- ❌ Feature unlock: Immediate
- ❌ Quota increase: Immediate
- ❌ Billing: Prorated charge immediately

**Downgrades:**
- ❌ Effective: End of billing period
- ❌ Feature lock: At period end
- ❌ Data over quota: Read-only, no deletion
- ❌ Refund: None (downgrade at period end)
- ❌ Warning: 7 days before effective

**Cancellation:**
- ❌ When: End of billing period (default) or immediate
- ❌ Data retention: 90 days
- ❌ Reactivation: Within 90 days, full restore
- ❌ Survey: Required for feedback
- ❌ Win-back: Discount offer after 30 days

### 3. Quota Management - PARTIAL

**Call Minutes:**
- ✅ Limits: 300/1000/5000 (specified)
- ❌ Overage: Block new calls
- ❌ Overage pricing: $0.15/min after limit
- ❌ Warnings: 80%, 90%, 100%
- ❌ Reset: Start of billing period
- ❌ Rollover: No
- ❌ Mid-period upgrade: Immediate quota increase

**Team Members:**
- ✅ Limits: 3/10/50 (specified)
- ❌ Downgrade handling: Select users to deactivate
- ❌ Notification: 7 days before enforcement
- ❌ Auto-deactivation: Last joined first
- ❌ Manual selection: Yes, required

**Phone Numbers:**
- ✅ Limits: 1/3/10 (specified)
- ❌ Additional cost: $5/month per number
- ❌ Release policy: Immediate deletion
- ❌ Number porting: 5-7 business days
- ❌ Porting fee: $10 per number

**Storage (Recordings):**
- ❌ Limits: Not specified! (recommend: 5GB/25GB/100GB)
- ❌ Overage: Block recording or pay-per-GB
- ❌ Pricing: $0.10/GB/month overage
- ❌ Retention: 90 days (Starter), 1 year (Pro), 2 years (Enterprise)
- ❌ Auto-delete: After retention period

### 4. Refund Policy - MISSING

- ❌ Eligibility: 14 days from first charge
- ❌ Prorated refund: Yes, for cancellations mid-period
- ❌ Processing time: 5-10 business days
- ❌ Method: Original payment method
- ❌ SLA credits: 10% credit per hour of downtime
- ❌ Conditions: No refund if ToS violation

### 5. Tax & Invoicing - MISSING

- ❌ Uzbekistan VAT: 12% (as of 2024)
- ❌ Tax display: Inclusive in price
- ❌ Tax-exempt orgs: Supported with documentation
- ❌ Invoice generation: Immediately after payment
- ❌ Invoice format: PDF via email
- ❌ Invoice numbering: INV-{YYYY}-{ORG_ID}-{SEQUENCE}
- ❌ Receipt: Auto-email within 24 hours

### 6. Trial Management - MISSING

- ❌ Trial duration: 14 days
- ❌ Trial plan: Professional features
- ❌ Card required: Yes, but not charged
- ❌ Trial limits: Same as Professional
- ❌ Trial reminders: Day 7, 13, 14
- ❌ Auto-conversion: Yes, to selected plan
- ❌ Trial extension: Case-by-case, max 7 days
- ❌ Multiple trials: Blocked by email/org

---

