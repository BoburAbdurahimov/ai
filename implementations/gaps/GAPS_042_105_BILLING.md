# Gaps 042-105: Billing & Subscriptions

**Total:** 64 gaps | **Closed:** 0 | **Open:** 64

---

## 2.1 PAYMENT FLOW DETAILS (13 gaps)

## GAP-042 ⏳ OPEN
**Priority:** P0  
**Category:** Payment Flow  
**Requirement:** Checkout idempotency key handling  
**Decision:** Redis lock: `SET checkout:lock:{orgId} 1 EX 1800 NX` before creating Stripe session  
**Implementation:** Middleware checks lock, returns 409 if exists  
**Action:** Create checkout lock middleware in `/api/billing/checkout`

## GAP-043 ⏳ OPEN
**Priority:** P1  
**Category:** Payment Flow  
**Requirement:** Checkout timeout: 30 minutes  
**Decision:** Stripe checkout session expires_at = now() + 1800 seconds  
**Implementation:** Set in `stripe.checkout.sessions.create({ expires_at: ... })`  
**Action:** Configure Stripe session expiry

## GAP-044 ⏳ OPEN
**Priority:** P2  
**Category:** Payment Flow  
**Requirement:** Abandoned checkout cleanup: 1 hour  
**Decision:** Cron job deletes checkout sessions WHERE createdAt < now() - interval '1 hour' AND status='pending'  
**Implementation:** Daily cron at `/api/cron/cleanup-checkouts.js`  
**Action:** Create checkout cleanup cron

## GAP-045 ⏳ OPEN
**Priority:** P0  
**Category:** Payment Flow  
**Requirement:** Prevent duplicate checkouts  
**Decision:** Check Redis lock before allowing new checkout, return 409 "Checkout already in progress"  
**Implementation:** Same middleware as GAP-042  
**Action:** Enforce lock check in POST /billing/checkout

## GAP-046 ⏳ OPEN
**Priority:** P0  
**Category:** Payment Failure  
**Requirement:** Payment retry schedule: Day 3, 7, 14  
**Decision:** Stripe webhook `invoice.payment_failed` triggers retry schedule: attempt on day 3, 7, 14 after failure  
**Implementation:** Webhook handler schedules retries  
**Action:** Create Stripe webhook handler for payment failures

## GAP-047 ⏳ OPEN
**Priority:** P0  
**Category:** Payment Failure  
**Requirement:** Max retries: 3 attempts  
**Decision:** Track retryCount in subscriptions table, cancel subscription if retryCount >= 3  
**Implementation:** Add retryCount field to Subscription model, increment on each retry  
**Action:** Implement retry counter

## GAP-048 ⏳ OPEN
**Priority:** P1  
**Category:** Payment Failure  
**Requirement:** Dunning emails: Day 1, 3, 7, 14  
**Decision:** Email templates for each day, cron checks failed payments and sends appropriate email  
**Implementation:** 4 email templates + cron job checks payment_failed_at  
**Action:** Create dunning email system

## GAP-049 ⏳ OPEN
**Priority:** P0  
**Category:** Payment Failure  
**Requirement:** Grace period: 7 days  
**Decision:** Allow normal access if (now < payment_failed_at + interval '7 days'), after 7 days apply service degradation  
**Implementation:** Check in auth middleware  
**Action:** Implement grace period check

## GAP-050 ⏳ OPEN
**Priority:** P0  
**Category:** Payment Failure  
**Requirement:** Service degradation: Read-only mode after 7 days  
**Decision:** Block write operations (POST, PATCH, DELETE) if in grace period expired, return 402 Payment Required  
**Implementation:** Middleware checks subscription status and payment_failed_at  
**Action:** Implement read-only mode enforcement

## GAP-051 ⏳ OPEN
**Priority:** P0  
**Category:** Payment Failure  
**Requirement:** Auto-cancel: Day 14  
**Decision:** Cron job: UPDATE subscriptions SET status='CANCELED', canceledAt=now() WHERE payment_failed_at < now() - interval '14 days'  
**Implementation:** Daily cron  
**Action:** Create auto-cancellation cron

## GAP-052 ⏳ OPEN
**Priority:** P2  
**Category:** Payment Methods  
**Requirement:** Card expiry check: 30 days before  
**Decision:** Cron checks Stripe card.exp_month/exp_year, email warning if expiring within 30 days  
**Implementation:** Daily cron + email template  
**Action:** Create card expiry warning system

## GAP-053 ⏳ OPEN
**Priority:** P1  
**Category:** Payment Methods  
**Requirement:** Multiple cards: Yes, max 3  
**Decision:** Check `stripe.customers.listSources().data.length`, reject if >= 3  
**Implementation:** Validation in POST /billing/payment-methods  
**Action:** Enforce max 3 payment methods

## GAP-054 ⏳ OPEN
**Priority:** P1  
**Category:** Payment Methods  
**Requirement:** Default card: Required  
**Decision:** `stripe.customers.update({ default_source: cardId })` must always be set, cannot delete default without setting new default  
**Implementation:** Validation in DELETE /billing/payment-methods/:id  
**Action:** Enforce default payment method requirement

---

## 2.2 SUBSCRIPTION CHANGES (15 gaps)

## GAP-055 ⏳ OPEN
**Priority:** P0  
**Category:** Upgrade  
**Requirement:** Proration: Per-day calculation  
**Decision:** Stripe handles automatically with `proration_behavior: 'always_invoice'`  
**Implementation:** Set in `stripe.subscriptions.update()`  
**Action:** Configure proration in upgrade endpoint

## GAP-056 ⏳ OPEN
**Priority:** P0  
**Category:** Upgrade  
**Requirement:** Effective: Immediate  
**Decision:** Stripe applies changes immediately on `subscriptions.update()`  
**Implementation:** Call Stripe API synchronously, return success  
**Action:** Implement POST /billing/subscription/upgrade

## GAP-057 ⏳ OPEN
**Priority:** P0  
**Category:** Upgrade  
**Requirement:** Feature unlock: Immediate  
**Decision:** After Stripe confirms, reload user session to pick up new plan permissions  
**Implementation:** Return new subscription in response, frontend refreshes  
**Action:** Ensure permission checks use latest subscription

## GAP-058 ⏳ OPEN
**Priority:** P0  
**Category:** Upgrade  
**Requirement:** Quota increase: Immediate  
**Decision:** After upgrade webhook, UPDATE organizations SET callMinutesQuota=:newLimit, teamMembersQuota=:newLimit WHERE id=:orgId  
**Implementation:** Webhook handler updates quotas  
**Action:** Implement quota update in upgrade webhook

## GAP-059 ⏳ OPEN
**Priority:** P0  
**Category:** Downgrade  
**Requirement:** Effective: End of billing period  
**Decision:** `stripe.subscriptions.update({ proration_behavior: 'none', billing_cycle_anchor: 'unchanged' })` schedules change for period end  
**Implementation:** Use Stripe schedule parameter  
**Action:** Implement POST /billing/subscription/downgrade with scheduling

## GAP-060 ⏳ OPEN
**Priority:** P0  
**Category:** Downgrade  
**Requirement:** Feature lock: At period end  
**Decision:** Check `subscription.plan` AND `subscription.current_period_end > now()` - if downgrade scheduled, show warning but allow until period end  
**Implementation:** Permission middleware checks scheduled changes  
**Action:** Implement scheduled downgrade awareness

## GAP-061 ⏳ OPEN
**Priority:** P1  
**Category:** Downgrade  
**Requirement:** Data over quota: Read-only, no deletion  
**Decision:** If (usedMinutes > quotaMinutes), block new calls but allow viewing history  
**Implementation:** Check quota before call creation, return 422 if exceeded  
**Action:** Implement quota enforcement without data deletion

## GAP-062 ⏳ OPEN
**Priority:** P1  
**Category:** Downgrade  
**Requirement:** Warning: 7 days before effective  
**Decision:** Cron checks scheduled downgrades, email if current_period_end < now() + interval '7 days'  
**Implementation:** Daily cron + email template  
**Action:** Create downgrade warning email

## GAP-063 ⏳ OPEN
**Priority:** P1  
**Category:** Cancellation  
**Requirement:** When: End of billing period (default) or immediate  
**Decision:** `stripe.subscriptions.cancel({ at_period_end: true })` for default, `{ at_period_end: false }` for immediate  
**Implementation:** POST /billing/subscription/cancel with `immediate` boolean parameter  
**Action:** Implement cancellation with timing option

## GAP-064 ⏳ OPEN
**Priority:** P1  
**Category:** Cancellation  
**Requirement:** Data retention: 90 days  
**Decision:** Soft delete: UPDATE organizations SET isDeleted=true, deletedAt=now(); cron hard deletes after 90 days  
**Implementation:** Soft delete on cancel + cleanup cron  
**Action:** Implement 90-day retention on cancellation

## GAP-065 ⏳ OPEN
**Priority:** P1  
**Category:** Cancellation  
**Requirement:** Reactivation: Within 90 days, full restore  
**Decision:** If (now < deletedAt + interval '90 days'), allow: UPDATE organizations SET isDeleted=false, restore Stripe subscription  
**Implementation:** POST /billing/subscription/reactivate checks deletion date  
**Action:** Implement reactivation with data restore

## GAP-066 ⏳ OPEN
**Priority:** P2  
**Category:** Cancellation  
**Requirement:** Survey: Required for feedback  
**Decision:** UI modal with dropdown reasons (too expensive, missing features, etc.) + textarea, required before cancel button enabled  
**Implementation:** Frontend form, save to cancellation_reasons table  
**Action:** Create cancellation survey component

## GAP-067 ⏳ OPEN
**Priority:** P2  
**Category:** Cancellation  
**Requirement:** Win-back: Discount offer after 30 days  
**Decision:** Cron checks canceled subscriptions, email 20% discount code if canceledAt < now() - interval '30 days' AND not reactivated  
**Implementation:** Monthly cron + promotional email  
**Action:** Create win-back campaign

## GAP-068 ⏳ OPEN
**Priority:** P0  
**Category:** Upgrade  
**Requirement:** Mid-period upgrade: Immediate quota increase  
**Decision:** Same as GAP-058, quotas update immediately on upgrade  
**Implementation:** Covered by upgrade webhook  
**Action:** No separate implementation needed

## GAP-069 ⏳ OPEN
**Priority:** P0  
**Category:** Downgrade  
**Requirement:** User handling: Select users to deactivate if over limit  
**Decision:** If (currentUsers > newLimit), UI shows user list with checkboxes, require selection of (currentUsers - newLimit) users to deactivate  
**Implementation:** Frontend component + backend batch deactivation  
**Action:** Create user selection modal for downgrades

---

## 2.3 QUOTA MANAGEMENT (15 gaps)

## GAP-070 ⏳ OPEN
**Priority:** P0  
**Category:** Quota  
**Requirement:** Call minutes overage: Block new calls  
**Decision:** Before call creation, SELECT usedMinutes, quotaMinutes FROM organizations WHERE id=:orgId; if (usedMinutes >= quotaMinutes) return 422 "Call minutes quota exceeded"  
**Implementation:** Middleware in POST /calls (or call webhook handler)  
**Action:** Implement quota check before call initiation

## GAP-071 ⏳ OPEN
**Priority:** P1  
**Category:** Quota  
**Requirement:** Overage pricing: $0.15/min after limit  
**Decision:** Track overageMinutes = MAX(0, usedMinutes - quotaMinutes); charge $0.15 * overageMinutes at end of billing period  
**Implementation:** Billing calculation cron + Stripe invoice item  
**Action:** Implement overage billing (Phase 2 feature)

## GAP-072 ⏳ OPEN
**Priority:** P1  
**Category:** Quota  
**Requirement:** Warnings: 80%, 90%, 100%  
**Decision:** Email sent when (usedMinutes / quotaMinutes) crosses 0.8, 0.9, 1.0 thresholds (send once per threshold per period)  
**Implementation:** Check after each call completes, track warning_sent flags  
**Action:** Create quota warning email system

## GAP-073 ⏳ OPEN
**Priority:** P0  
**Category:** Quota  
**Requirement:** Reset: Start of billing period  
**Decision:** Stripe webhook `invoice.payment_succeeded` triggers: UPDATE organizations SET usedMinutes=0, usedStorage=0 WHERE id=:orgId  
**Implementation:** Reset in billing period webhook  
**Action:** Implement quota reset on period start

## GAP-074 ⏳ OPEN
**Priority:** P1  
**Category:** Quota  
**Requirement:** Rollover: No  
**Decision:** Do not carry over unused minutes, always reset to 0 at period start (confirmed in GAP-073)  
**Implementation:** No rollover logic needed  
**Action:** Documented decision, no implementation

## GAP-075 ⏳ OPEN
**Priority:** P0  
**Category:** Quota  
**Requirement:** Team members downgrade: Select users to deactivate  
**Decision:** Same as GAP-069  
**Implementation:** Covered by GAP-069  
**Action:** No separate implementation needed

## GAP-076 ⏳ OPEN
**Priority:** P1  
**Category:** Quota  
**Requirement:** Team members notification: 7 days before enforcement  
**Decision:** Email affected users 7 days before scheduled downgrade: "Your access will be deactivated on [date] due to plan change"  
**Implementation:** Cron checks scheduled downgrades + email  
**Action:** Create user deactivation warning email

## GAP-077 ⏳ OPEN
**Priority:** P2  
**Category:** Quota  
**Requirement:** Auto-deactivation: Last joined first (LIFO)  
**Decision:** If no manual selection, query: SELECT id FROM users WHERE organizationId=:orgId AND role NOT IN ('OWNER','ADMIN') ORDER BY createdAt DESC LIMIT :excessCount  
**Implementation:** Auto-select logic in downgrade handler  
**Action:** Implement LIFO auto-deactivation

## GAP-078 ⏳ OPEN
**Priority:** P1  
**Category:** Quota  
**Requirement:** Phone numbers additional cost: $5/month per number  
**Decision:** Count: SELECT COUNT(*) FROM phone_numbers WHERE organizationId=:orgId; if (count > planLimit), charge $5 * (count - planLimit) monthly  
**Implementation:** Billing calculation + Stripe subscription item  
**Action:** Implement phone number overage billing

## GAP-079 ⏳ OPEN
**Priority:** P1  
**Category:** Quota  
**Requirement:** Number release: Immediate deletion  
**Decision:** DELETE FROM phone_numbers WHERE id=:id immediately, release number with provider  
**Implementation:** DELETE /phone-numbers/:id calls provider API  
**Action:** Implement phone number deletion

## GAP-080 ⏳ OPEN
**Priority:** P2  
**Category:** Quota  
**Requirement:** Number porting: 5-7 business days timeline  
**Decision:** UI displays "Porting in progress, ETA 5-7 business days" status, update when provider confirms completion  
**Implementation:** Porting status tracking in phone_numbers table  
**Action:** Create porting status flow

## GAP-081 ⏳ OPEN
**Priority:** P2  
**Category:** Quota  
**Requirement:** Porting fee: $10 one-time  
**Decision:** Charge $10 via Stripe invoice item when porting initiated  
**Implementation:** Create invoice item on POST /phone-numbers/port  
**Action:** Implement porting fee charge

## GAP-082 ⏳ OPEN
**Priority:** P0  
**Category:** Quota  
**Requirement:** Storage limits: 5GB/25GB/100GB per plan  
**Decision:** Plan limits: STARTER=5GB, PROFESSIONAL=25GB, ENTERPRISE=100GB  
**Implementation:** Add storageQuota to plan configuration  
**Action:** Define storage quotas in plan config

## GAP-083 ⏳ OPEN
**Priority:** P1  
**Category:** Quota  
**Requirement:** Storage overage pricing: $0.10/GB/month  
**Decision:** Calculate: overageGB = MAX(0, usedStorageGB - quotaGB); charge $0.10 * overageGB monthly  
**Implementation:** Storage calculation + billing  
**Action:** Implement storage overage billing

## GAP-084 ⏳ OPEN
**Priority:** P1  
**Category:** Quota  
**Requirement:** Retention: 90 days (Starter), 1 year (Pro), 2 years (Enterprise)  
**Decision:** Daily cron: DELETE FROM recordings WHERE createdAt < now() - interval :retentionPeriod based on organization's plan  
**Implementation:** Retention-based deletion cron  
**Action:** Create recording cleanup cron with per-plan retention

---

## 2.4 REFUND POLICY (6 gaps)

## GAP-085 ⏳ OPEN
**Priority:** P1  
**Category:** Refund  
**Requirement:** Eligibility: 14 days from first charge  
**Decision:** Check: SELECT MIN(createdAt) FROM invoices WHERE organizationId=:orgId; if (now() - firstCharge <= interval '14 days') allow refund  
**Implementation:** Validation in POST /billing/refund  
**Action:** Implement 14-day eligibility check

## GAP-086 ⏳ OPEN
**Priority:** P1  
**Category:** Refund  
**Requirement:** Prorated refund: On mid-period cancellation  
**Decision:** Calculate: daysRemaining = (current_period_end - now()) / (24*60*60); refundAmount = amountPaid * (daysRemaining / daysTotal)  
**Implementation:** Proration calculation function  
**Action:** Implement refund proration calculator

## GAP-087 ⏳ OPEN
**Priority:** P2  
**Category:** Refund  
**Requirement:** Processing time: 5-10 business days  
**Decision:** Call `stripe.refunds.create()`, email user "Refund issued to [card], will appear in 5-10 business days"  
**Implementation:** Refund confirmation email  
**Action:** Add processing time to refund email

## GAP-088 ⏳ OPEN
**Priority:** P1  
**Category:** Refund  
**Requirement:** Method: Original payment method  
**Decision:** Stripe automatically refunds to original card via `stripe.refunds.create({ payment_intent: id })`  
**Implementation:** Use Stripe default behavior  
**Action:** No custom implementation needed

## GAP-089 ⏳ OPEN
**Priority:** P2  
**Category:** Refund  
**Requirement:** SLA credits: 10% credit per hour of downtime  
**Decision:** Manual admin process: calculate downtime hours * 10% * monthly_amount, issue credit via Stripe  
**Implementation:** Admin tool for SLA credit issuance  
**Action:** Create SLA credit system

## GAP-090 ⏳ OPEN
**Priority:** P1  
**Category:** Refund  
**Requirement:** No refund if ToS violation  
**Decision:** Check user.tosViolation flag before processing refund, reject with "Refunds not available for accounts with ToS violations"  
**Implementation:** Validation check in refund flow  
**Action:** Add ToS violation check to refund eligibility

---

## 2.5 TAX & INVOICING (7 gaps)

## GAP-091 ⏳ OPEN
**Priority:** P0  
**Category:** Tax  
**Requirement:** Uzbekistan VAT: 12%  
**Decision:** Tax rate = 0.12 for all UZ customers, configure in Stripe: `stripe.taxRates.create({ percentage: 12, country: 'UZ' })`  
**Implementation:** Apply tax rate to all UZ subscriptions  
**Action:** Configure Stripe tax rate for Uzbekistan

## GAP-092 ⏳ OPEN
**Priority:** P0  
**Category:** Tax  
**Requirement:** Display: Inclusive in price  
**Decision:** Show prices inclusive of tax, calculate: baseprice = displayPrice / 1.12; taxAmount = displayPrice - basePrice  
**Implementation:** Frontend pricing display + backend calculation  
**Action:** Update pricing to show tax-inclusive amounts

## GAP-093 ⏳ OPEN
**Priority:** P2  
**Category:** Tax  
**Requirement:** Tax-exempt orgs: Supported with documentation  
**Decision:** Allow tax exemption application, require document upload, admin approval sets taxExempt=true  
**Implementation:** Tax exemption application flow  
**Action:** Create tax exemption request system

## GAP-094 ⏳ OPEN
**Priority:** P0  
**Category:** Invoice  
**Requirement:** Generation: Immediately after payment  
**Decision:** Stripe webhook `invoice.payment_succeeded` triggers invoice creation in our DB + email to billingEmail  
**Implementation:** Webhook handler creates invoice record  
**Action:** Implement invoice generation webhook

## GAP-095 ⏳ OPEN
**Priority:** P1  
**Category:** Invoice  
**Requirement:** Format: PDF via email  
**Decision:** Generate PDF with invoice details (org name, items, tax, total) using library (e.g., pdfkit), attach to email  
**Implementation:** PDF generator + email with attachment  
**Action:** Implement PDF invoice generator

## GAP-096 ⏳ OPEN
**Priority:** P1  
**Category:** Invoice  
**Requirement:** Numbering: INV-{YYYY}-{ORG_ID}-{SEQUENCE}  
**Decision:** Format: `INV-${year}-${orgId.slice(0,8)}-${sequence.padStart(3,'0')}` e.g., INV-2024-org_abc1-001  
**Implementation:** Invoice number generator function  
**Action:** Implement invoice numbering system

## GAP-097 ⏳ OPEN
**Priority:** P1  
**Category:** Invoice  
**Requirement:** Receipt: Auto-email within 24 hours  
**Decision:** Same as invoice (GAP-094), email immediately after payment success  
**Implementation:** Covered by invoice email  
**Action:** No separate implementation needed

---

## 2.6 TRIAL MANAGEMENT (8 gaps)

## GAP-098 ⏳ OPEN
**Priority:** P1  
**Category:** Trial  
**Requirement:** Duration: 14 days  
**Decision:** Set trial_end = now() + (14 * 24 * 60 * 60) when creating subscription  
**Implementation:** Stripe subscription.create({ trial_period_days: 14 })  
**Action:** Configure 14-day trial period

## GAP-099 ⏳ OPEN
**Priority:** P1  
**Category:** Trial  
**Requirement:** Plan: Professional features  
**Decision:** Trial users get plan='PROFESSIONAL' with status='TRIALING'  
**Implementation:** Set plan on trial signup  
**Action:** Configure trial to use Professional plan

## GAP-100 ⏳ OPEN
**Priority:** P1  
**Category:** Trial  
**Requirement:** Card required: Yes, but not charged  
**Decision:** Stripe collects payment method during trial signup but doesn't charge until trial_end  
**Implementation:** Use Stripe trial_period_days with payment method collection  
**Action:** Enforce payment method collection for trials

## GAP-101 ⏳ OPEN
**Priority:** P1  
**Category:** Trial  
**Requirement:** Limits: Same as Professional  
**Decision:** Trial quotas = Professional quotas (1000 minutes, 10 team members, 3 phone numbers, 25GB storage)  
**Implementation:** Apply Professional limits during trial  
**Action:** Use Professional plan limits for trials

## GAP-102 ⏳ OPEN
**Priority:** P2  
**Category:** Trial  
**Requirement:** Reminders: Day 7, 13, 14  
**Decision:** Daily cron checks trial_end, sends email if trial_end in (7 days, 2 days, 1 day): "Your trial ends in X days"  
**Implementation:** Cron + 3 email templates  
**Action:** Create trial reminder email system

## GAP-103 ⏳ OPEN
**Priority:** P1  
**Category:** Trial  
**Requirement:** Auto-conversion: To selected plan at trial end  
**Decision:** Stripe automatically converts trial to paid subscription on trial_end using stored payment method  
**Implementation:** Use Stripe default behavior  
**Action:** No custom implementation needed

## GAP-104 ⏳ OPEN
**Priority:** P2  
**Category:** Trial  
**Requirement:** Extension: Case-by-case, max 7 days  
**Decision:** Admin tool: UPDATE subscriptions SET trial_end = trial_end + interval '7 days' WHERE id=:subId (manual approval)  
**Implementation:** Admin trial extension interface  
**Action:** Create admin trial extension tool

## GAP-105 ⏳ OPEN
**Priority:** P1  
**Category:** Trial  
**Requirement:** Multiple trials: Blocked by email/org  
**Decision:** Check: SELECT COUNT(*) FROM subscriptions WHERE (email=:email OR organizationId=:orgId) AND status='TRIALING' OR (status='CANCELED' AND createdAt > now() - interval '1 year'); reject if > 0  
**Implementation:** Validation in trial signup  
**Action:** Implement trial uniqueness check

---

**Summary:** 0 closed, 64 open in this category
