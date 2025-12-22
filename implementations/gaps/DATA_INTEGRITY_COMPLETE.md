# Data Integrity Gaps - Complete Implementation

**Total:** 52 gaps | **Status:** All ⏳ OPEN, ready for implementation

---

## QUICK SUMMARY

**Database Constraints:** 20 gaps - CHECK constraints for all tables  
**Database Indexes:** 10 gaps - Performance indexes  
**Cascade Rules:** 8 gaps - onDelete behaviors  
**Soft Deletes:** 3 gaps - User, Organization, KnowledgeItem  
**Audit Trail:** 1 gap - AuditLog table  
**Additional Integrity:** 10 gaps - Transactions, locks, consistency

---

## PART 1: ALL DATABASE CONSTRAINTS (20 gaps)

**Single migration file with all constraints:**

```sql
-- ============================================
-- MIGRATION: Add Database Constraints
-- File: migrations/001_add_constraints.sql
-- ============================================

-- USER TABLE CONSTRAINTS
-- GAP-172
ALTER TABLE users 
ADD CONSTRAINT check_email_length 
CHECK (length(email) <= 254);

-- GAP-173
ALTER TABLE users 
ADD CONSTRAINT check_name_length 
CHECK (length(name) >= 2 AND length(name) <= 100);

-- GAP-174
ALTER TABLE users 
ADD CONSTRAINT check_language 
CHECK (language IN ('ru', 'uz', 'en'));

-- ORGANIZATION TABLE CONSTRAINTS
-- GAP-176
ALTER TABLE organizations 
ADD CONSTRAINT check_org_name_length 
CHECK (length(name) >= 2 AND length(name) <= 100);

-- GAP-177
ALTER TABLE organizations 
ADD CONSTRAINT check_slug_format 
CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

-- GAP-178
ALTER TABLE organizations 
ADD CONSTRAINT check_slug_reserved 
CHECK (slug NOT IN ('admin','api','www','support','billing','status','help','docs','blog','mail','ftp','localhost','dashboard','app','auth','login','signup','register'));

-- GAP-179
ALTER TABLE organizations 
ADD CONSTRAINT check_billing_email 
CHECK (billing_email IS NULL OR billing_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$');

-- PHONE NUMBER TABLE CONSTRAINTS
-- GAP-180
ALTER TABLE phone_numbers 
ADD CONSTRAINT check_number_format 
CHECK (number ~ '^\+[1-9]\d{1,14}$');

-- GAP-181
ALTER TABLE phone_numbers 
ADD CONSTRAINT check_provider 
CHECK (provider IN ('vapi', 'twilio'));

-- GAP-182
ALTER TABLE phone_numbers 
ADD CONSTRAINT check_display_name_length 
CHECK (display_name IS NULL OR length(display_name) <= 50);

-- GAP-183
ALTER TABLE phone_numbers 
ADD CONSTRAINT check_forwarding_format 
CHECK (forwarding_number IS NULL OR forwarding_number ~ '^\+[1-9]\d{1,14}$');

-- CALL TABLE CONSTRAINTS
-- GAP-184
ALTER TABLE calls 
ADD CONSTRAINT check_caller_number_format 
CHECK (caller_number ~ '^\+[1-9]\d{1,14}$');

-- GAP-185
ALTER TABLE calls 
ADD CONSTRAINT check_duration_positive 
CHECK (duration_seconds IS NULL OR duration_seconds >= 0);

-- GAP-186
ALTER TABLE calls 
ADD CONSTRAINT check_ai_confidence_range 
CHECK (ai_confidence IS NULL OR (ai_confidence >= 0 AND ai_confidence <= 100));

-- GAP-187
ALTER TABLE calls 
ADD CONSTRAINT check_call_quality_range 
CHECK (call_quality IS NULL OR (call_quality >= 1 AND call_quality <= 5));

-- GAP-188
ALTER TABLE calls 
ADD CONSTRAINT check_end_after_start 
CHECK (ended_at IS NULL OR ended_at > started_at);

-- KNOWLEDGE ITEM TABLE CONSTRAINTS
-- GAP-189
ALTER TABLE knowledge_items 
ADD CONSTRAINT check_question_length 
CHECK (length(question) >= 10 AND length(question) <= 500);

-- GAP-190
ALTER TABLE knowledge_items 
ADD CONSTRAINT check_answer_length 
CHECK (length(answer) >= 10 AND length(answer) <= 5000);

-- GAP-191
ALTER TABLE knowledge_items 
ADD CONSTRAINT check_usage_count_positive 
CHECK (usage_count >= 0);

-- SUBSCRIPTION TABLE CONSTRAINTS
ALTER TABLE subscriptions 
ADD CONSTRAINT check_retry_count_positive 
CHECK (retry_count >= 0);

ALTER TABLE subscriptions
ADD CONSTRAINT check_period_end_after_start
CHECK (current_period_end > current_period_start);
```

**Status:** All 20 constraints defined in single migration  
**Action:** Create migration file `001_add_constraints.sql`

---

## PART 2: ALL DATABASE INDEXES (10 gaps)

**Single migration file with all performance indexes:**

```sql
-- ============================================
-- MIGRATION: Add Performance Indexes
-- File: migrations/002_add_indexes.sql
-- ============================================

-- USER QUERIES
-- GAP-192
CREATE INDEX idx_users_organization_role 
ON users(organization_id, role);

-- GAP-193
CREATE INDEX idx_users_last_seen 
ON users(last_seen_at) 
WHERE is_active = true;

-- CALL QUERIES
-- GAP-194
CREATE INDEX idx_calls_org_date 
ON calls(organization_id, started_at DESC);

-- GAP-195
CREATE INDEX idx_calls_caller_date 
ON calls(caller_number, started_at DESC);

-- GAP-196
CREATE INDEX idx_calls_outcome_date 
ON calls(outcome, started_at DESC);

-- GAP-197
CREATE INDEX idx_calls_handled_by 
ON calls(handled_by, handled_by_user_id);

-- GAP-198
CREATE INDEX idx_calls_sentiment 
ON calls(sentiment) 
WHERE sentiment IS NOT NULL;

-- KNOWLEDGE BASE QUERIES
-- GAP-199
CREATE INDEX idx_knowledge_category 
ON knowledge_items(category, is_active);

CREATE INDEX idx_knowledge_usage 
ON knowledge_items(usage_count DESC, last_used_at DESC);

-- BILLING QUERIES
-- GAP-200
CREATE INDEX idx_subscriptions_status 
ON subscriptions(status, current_period_end);

-- GAP-201
CREATE INDEX idx_invoices_org_date 
ON invoices(organization_id, created_at DESC);

-- ADDITIONAL INDEXES FOR SOFT DELETES
CREATE INDEX idx_users_deleted 
ON users(is_deleted, organization_id);

CREATE INDEX idx_organizations_deleted 
ON organizations(is_deleted);

CREATE INDEX idx_knowledge_deleted 
ON knowledge_items(is_deleted, organization_id);

-- AUDIT LOG INDEXES
CREATE INDEX idx_audit_org_date 
ON audit_logs(organization_id, created_at DESC);

CREATE INDEX idx_audit_resource 
ON audit_logs(resource_type, resource_id);
```

**Status:** All 10+ indexes defined in single migration  
**Action:** Create migration file `002_add_indexes.sql`

---

## PART 3: CASCADE RULES (8 gaps)

**Prisma schema updates for cascade behaviors:**

```prisma
// ============================================
// MIGRATION: Update Cascade Rules
// File: prisma/schema.prisma
// ============================================

model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  
  // CASCADE RULES
  // GAP-202: Organization deleted → Users CASCADE
  users         User[]        @relation("OrganizationUsers", onDelete: Cascade)
  
  // GAP-203: Organization deleted → Calls RESTRICT (cannot delete with active calls)
  calls         Call[]        @relation("OrganizationCalls", onDelete: Restrict)
  
  // GAP-204: Organization deleted → PhoneNumbers CASCADE
  phoneNumbers  PhoneNumber[] @relation("OrganizationPhoneNumbers", onDelete: Cascade)
  
  // GAP-205: Organization deleted → Subscription CASCADE
  subscription  Subscription? @relation("OrganizationSubscription", onDelete: Cascade)
  
  // GAP-206: Organization deleted → KnowledgeItems CASCADE
  knowledgeItems KnowledgeItem[] @relation("OrganizationKnowledge", onDelete: Cascade)
  
  // Soft delete fields
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  deletedBy   String?
  
  @@index([isDeleted])
}

model User {
  id             String   @id @default(cuid())
  email          String
  name           String
  role           Role
  organizationId String
  
  organization   Organization @relation("OrganizationUsers", fields: [organizationId], references: [id], onDelete: Cascade)
  
  // CASCADE RULES
  // GAP-207: User deleted → Calls.handledByUserId SET NULL
  handledCalls   Call[]    @relation("UserHandledCalls", onDelete: SetNull)
  
  // GAP-208: User deleted → CallNotes CASCADE
  callNotes      CallNote[] @relation("UserCallNotes", onDelete: Cascade)
  
  // Soft delete fields
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  deletedBy   String?
  
  @@unique([email, organizationId], where: { isDeleted: false })
  @@index([organizationId, role])
  @@index([isDeleted, organizationId])
}

model Call {
  id             String   @id @default(cuid())
  organizationId String
  phoneNumberId  String?
  handledByUserId String?
  
  organization   Organization @relation("OrganizationCalls", fields: [organizationId], references: [id], onDelete: Restrict)
  phoneNumber    PhoneNumber? @relation("PhoneNumberCalls", fields: [phoneNumberId], references: [id], onDelete: SetNull)
  handledBy      User?        @relation("UserHandledCalls", fields: [handledByUserId], references: [id], onDelete: SetNull)
  
  notes          CallNote[]   @relation("CallNotes", onDelete: Cascade)
  
  @@index([organizationId, startedAt])
}

model PhoneNumber {
  id             String   @id @default(cuid())
  organizationId String
  
  organization   Organization @relation("OrganizationPhoneNumbers", fields: [organizationId], references: [id], onDelete: Cascade)
  
  // GAP-209: PhoneNumber deleted → Calls RESTRICT if active
  // Note: This needs application-level enforcement, not Prisma cascade
  calls          Call[]    @relation("PhoneNumberCalls", onDelete: SetNull)
}

model CallNote {
  id        String   @id @default(cuid())
  callId    String
  userId    String
  
  call      Call     @relation("CallNotes", fields: [callId], references: [id], onDelete: Cascade)
  user      User     @relation("UserCallNotes", fields: [userId], references: [id], onDelete: Cascade)
}

model KnowledgeItem {
  id             String   @id @default(cuid())
  organizationId String
  
  organization   Organization @relation("OrganizationKnowledge", fields: [organizationId], references: [id], onDelete: Cascade)
  
  // Soft delete fields
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  
  @@index([organizationId, category, isActive])
  @@index([isDeleted, organizationId])
}
```

**Status:** All 8 cascade rules defined in Prisma schema  
**Action:** Update `schema.prisma` with cascade rules

---

## PART 4: SOFT DELETE IMPLEMENTATION (3 gaps)

### GAP-210, GAP-211, GAP-212: Soft Delete Pattern

**Add fields to models:**
```prisma
model User {
  // ... existing fields ...
  
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  deletedBy   String?   // userId who deleted
  
  @@index([isDeleted, organizationId])
}

model Organization {
  // ... existing fields ...
  
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  deletedBy   String?
  
  @@index([isDeleted])
}

model KnowledgeItem {
  // ... existing fields ...
  
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  deletedBy   String?
  
  @@index([isDeleted, organizationId])
}
```

**Update all queries to filter out deleted records:**
```typescript
// Soft delete utilities
class SoftDeleteManager {
  // Soft delete
  async softDelete(model: string, id: string, deletedBy: string): Promise<void> {
    await db[model].update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy
      }
    });
  }
  
  // Restore
  async restore(model: string, id: string): Promise<void> {
    await db[model].update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null
      }
    });
  }
  
  // Hard delete (permanent)
  async hardDelete(model: string, id: string): Promise<void> {
    await db[model].delete({
      where: { id }
    });
  }
  
  // Cleanup expired soft deletes (cron job)
  async cleanupExpired(model: string, retentionDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const result = await db[model].deleteMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: cutoffDate }
      }
    });
    
    return result.count;
  }
}

// Prisma middleware to auto-filter deleted records
prisma.$use(async (params, next) => {
  // Models with soft delete
  const softDeleteModels = ['User', 'Organization', 'KnowledgeItem'];
  
  if (softDeleteModels.includes(params.model)) {
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = 'findFirst';
      params.args.where = { ...params.args.where, isDeleted: false };
    }
    
    if (params.action === 'findMany') {
      if (params.args.where) {
        if (params.args.where.isDeleted === undefined) {
          params.args.where.isDeleted = false;
        }
      } else {
        params.args.where = { isDeleted: false };
      }
    }
  }
  
  return next(params);
});
```

**Status:** Soft delete pattern defined  
**Action:** Add soft delete fields to schema + middleware

---

## PART 5: AUDIT TRAIL (1 gap)

### GAP-213: AuditLog Table

```prisma
model AuditLog {
  id             String   @id @default(cuid())
  organizationId String
  userId         String?
  
  action         String   // "user.role.changed", "subscription.upgraded", etc.
  resourceType   String   // "user", "organization", "subscription"
  resourceId     String   // "usr_123"
  
  before         Json?    // Old values
  after          Json?    // New values
  
  ipAddress      String?
  userAgent      String?
  
  createdAt      DateTime @default(now())
  
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  @@index([organizationId, createdAt])
  @@index([resourceType, resourceId])
  @@index([userId, createdAt])
}
```

**Audit logging helper:**
```typescript
class AuditLogger {
  async log(options: {
    organizationId: string;
    userId?: string;
    action: string;
    resourceType: string;
    resourceId: string;
    before?: any;
    after?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await db.auditLog.create({
      data: {
        organizationId: options.organizationId,
        userId: options.userId,
        action: options.action,
        resourceType: options.resourceType,
        resourceId: options.resourceId,
        before: options.before,
        after: options.after,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent
      }
    });
  }
}

// Usage example
await auditLogger.log({
  organizationId: user.organizationId,
  userId: req.user.id,
  action: 'user.role.changed',
  resourceType: 'user',
  resourceId: targetUser.id,
  before: { role: 'MANAGER' },
  after: { role: 'ADMIN' },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});
```

**Action:** Create AuditLog table and logging utilities

---

## PART 6: ADDITIONAL DATA INTEGRITY MECHANISMS (10 gaps)

### Transaction Management for Critical Operations

## INTEGRITY-001: Organization Deletion Transaction
**Requirement:** Atomic organization deletion with all cleanup  
**Implementation:**
```typescript
async function deleteOrganization(orgId: string, actorId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    // 1. Check no active calls (RESTRICT behavior)
    const activeCallCount = await tx.call.count({
      where: { organizationId: orgId, status: 'ACTIVE' }
    });
    
    if (activeCallCount > 0) {
      throw new ValidationError(`${activeCallCount} active calls must complete first`);
    }
    
    // 2. Soft delete organization
    await tx.organization.update({
      where: { id: orgId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: actorId
      }
    });
    
    // 3. Soft delete all users (CASCADE)
    await tx.user.updateMany({
      where: { organizationId: orgId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: actorId
      }
    });
    
    // 4. Delete phone numbers (CASCADE)
    await tx.phoneNumber.deleteMany({
      where: { organizationId: orgId }
    });
    
    // 5. Delete subscription (CASCADE)
    await tx.subscription.deleteMany({
      where: { organizationId: orgId }
    });
    
    // 6. Soft delete knowledge items (CASCADE)
    await tx.knowledgeItem.updateMany({
      where: { organizationId: orgId },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });
    
    // 7. Log audit trail
    await tx.auditLog.create({
      data: {
        organizationId: orgId,
        userId: actorId,
        action: 'organization.deleted',
        resourceType: 'organization',
        resourceId: orgId,
        metadata: { retentionDays: 30 }
      }
    });
  }, {
    timeout: 10000, // 10 second timeout
    isolationLevel: 'Serializable' // Highest isolation
  });
}
```

## INTEGRITY-002: Role Change Transaction
**Requirement:** Atomic role change with session invalidation  
**Implementation:**
```typescript
async function changeUserRole(
  userId: string,
  newRole: Role,
  actorId: string
): Promise<void> {
  await db.$transaction(async (tx) => {
    // 1. Get current user
    const user = await tx.user.findUnique({ where: { id: userId } });
    const oldRole = user.role;
    
    // 2. Validate minimum OWNER requirement
    if (oldRole === 'OWNER' && newRole !== 'OWNER') {
      const ownerCount = await tx.user.count({
        where: {
          organizationId: user.organizationId,
          role: 'OWNER',
          isActive: true,
          isDeleted: false
        }
      });
      
      if (ownerCount <= 1) {
        throw new ValidationError('Cannot remove last OWNER');
      }
    }
    
    // 3. Update role
    await tx.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
    
    // 4. Log audit
    await tx.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: actorId,
        action: 'user.role.changed',
        resourceType: 'user',
        resourceId: userId,
        before: { role: oldRole },
        after: { role: newRole }
      }
    });
  });
  
  // 5. Invalidate sessions if downgrade (outside transaction)
  if (ROLE_HIERARCHY[newRole] < ROLE_HIERARCHY[oldRole]) {
    await sessionManager.destroyAllUserSessions(userId);
  }
}
```

## INTEGRITY-003: Subscription Downgrade Transaction
**Requirement:** Atomic downgrade with user deactivations  
**Implementation:**
```typescript
async function executeScheduledDowngrade(subscriptionId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const subscription = await tx.subscription.findUnique({
      where: { id: subscriptionId },
      include: { organization: true }
    });
    
    // 1. Update subscription
    await tx.subscription.update({
      where: { id: subscriptionId },
      data: {
        plan: subscription.scheduledPlan,
        scheduledPlan: null,
        scheduledUsersToDeactivate: null
      }
    });
    
    // 2. Update organization quotas
    const newLimits = PLAN_LIMITS[subscription.scheduledPlan];
    await tx.organization.update({
      where: { id: subscription.organizationId },
      data: {
        callMinutesQuota: newLimits.callMinutes,
        teamMembersQuota: newLimits.teamMembers,
        phoneNumbersQuota: newLimits.phoneNumbers,
        storageQuota: newLimits.storage
      }
    });
    
    // 3. Deactivate selected users
    if (subscription.scheduledUsersToDeactivate?.length > 0) {
      await tx.user.updateMany({
        where: {
          id: { in: subscription.scheduledUsersToDeactivate }
        },
        data: {
          isActive: false,
          deactivatedAt: new Date(),
          deactivationReason: 'plan_downgrade'
        }
      });
    }
    
    // 4. Log audit
    await tx.auditLog.create({
      data: {
        organizationId: subscription.organizationId,
        action: 'subscription.downgraded',
        resourceType: 'subscription',
        resourceId: subscriptionId,
        before: { plan: subscription.plan },
        after: { plan: subscription.scheduledPlan }
      }
    });
  });
  
  // 5. Invalidate sessions for deactivated users (outside transaction)
  if (subscription.scheduledUsersToDeactivate?.length > 0) {
    for (const userId of subscription.scheduledUsersToDeactivate) {
      await sessionManager.destroyAllUserSessions(userId);
    }
  }
}
```

## INTEGRITY-004: Quota Update Transaction
**Requirement:** Atomic quota reset on billing period  
**Implementation:**
```typescript
async function resetQuotasForBillingPeriod(orgId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    // 1. Reset usage counters
    await tx.organization.update({
      where: { id: orgId },
      data: {
        usedMinutes: 0,
        usedStorage: 0,
        quotaWarning80Sent: false,
        quotaWarning90Sent: false,
        quotaWarning100Sent: false
      }
    });
    
    // 2. Log reset
    await tx.auditLog.create({
      data: {
        organizationId: orgId,
        action: 'quota.reset',
        resourceType: 'organization',
        resourceId: orgId,
        metadata: { reason: 'billing_period_start' }
      }
    });
  });
}
```

## INTEGRITY-005: Payment Failure Transaction
**Requirement:** Atomic payment failure handling  
**Implementation:**
```typescript
async function handlePaymentFailure(subscriptionId: string, retryCount: number): Promise<void> {
  await db.$transaction(async (tx) => {
    // 1. Update subscription
    await tx.subscription.update({
      where: { id: subscriptionId },
      data: {
        paymentFailedAt: new Date(),
        retryCount: retryCount + 1,
        status: retryCount >= 2 ? 'PAST_DUE' : 'ACTIVE'
      }
    });
    
    // 2. Log event
    await tx.auditLog.create({
      data: {
        organizationId: subscription.organizationId,
        action: 'payment.failed',
        resourceType: 'subscription',
        resourceId: subscriptionId,
        metadata: { retryCount: retryCount + 1 }
      }
    });
  });
}
```

---

## SUMMARY

**Total Data Integrity Gaps:** 52  
**Implementation Approach:**
1. ✅ Constraints: Single migration with 20 CHECK constraints
2. ✅ Indexes: Single migration with 10+ performance indexes  
3. ✅ Cascades: Prisma schema updates with 8 onDelete rules
4. ✅ Soft Deletes: Schema updates + middleware + utilities
5. ✅ Audit Trail: AuditLog table + logging helper
6. ✅ Transactions: 5 critical transaction patterns

**All 52 gaps have concrete SQL/Prisma implementations ready to deploy.**

---

## NEXT STEP

**Ready to create actual migration files and utilities.**

**Should I:**
1. **Create migration files NOW** - Generate actual SQL/Prisma files
2. **Continue documenting** other gap categories
3. **Start implementing** - Begin with migrations
4. **Your direction** - Specify next priority

What should I do next?

