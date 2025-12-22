# Validation Gaps - Complete List

**Purpose:** All validation-related gaps across categories  
**Status:** Most input validations ✅ CLOSED, business logic validations ⏳ OPEN

---

## VALIDATION STATUS OVERVIEW

**Total Validation Gaps:** 68  
**Closed:** 45 (66%) - Zod schemas implemented  
**Open:** 23 (34%) - Business logic validations needed

---

## ✅ CLOSED: INPUT VALIDATIONS (45 gaps)

### Implemented via Zod Schemas
**Files:** `auth.schemas.ts`, `api.schemas.ts`  
**Status:** All basic input validations complete

**Authentication:**
- GAP-001 ✅ Email max length: 254 chars
- GAP-002 ✅ Disposable email blocking
- GAP-003 ✅ Corporate email for Enterprise
- GAP-004 ✅ Email normalization
- GAP-005 ✅ Password min 8 chars
- GAP-006 ✅ Password max 72 chars
- GAP-007 ✅ Common password blocking
- GAP-008 ✅ Password history check
- GAP-009 ✅ Pwned password check
- GAP-010 ✅ Name length 2-100 chars
- GAP-011 ✅ Name Unicode support
- GAP-012 ✅ Org name reserved check

**API Endpoints (33 schemas):**
- GAP-106 to GAP-150 ✅ All endpoint validations in schemas:
  - Signup, login, password reset
  - User management (invite, update, delete)
  - Calls (list, get, notes, tags, update)
  - AI config (update, test)
  - Knowledge base (create, update, delete, bulk import)
  - Phone numbers (add, update, delete)
  - Analytics (overview, calls, AI performance, export)
  - Integrations (create, update)

**Pagination:**
- GAP-165 ✅ Max page size: 100

---

## ⏳ OPEN: BUSINESS LOGIC VALIDATIONS (23 gaps)

### CATEGORY 1: AUTHORIZATION VALIDATIONS (5 gaps)

## GAP-036 ⏳ OPEN
**Priority:** P0  
**Type:** Business Logic Validation  
**Requirement:** Minimum 1 OWNER per organization enforcement  
**Decision:** Before role change/user removal, validate: `SELECT COUNT(*) FROM users WHERE role='OWNER' AND organizationId=:orgId AND isActive=true` must be >= 1 after change  
**Implementation Location:** PATCH /users/:userId endpoint  
**Validation Logic:**
```typescript
async function validateMinimumOwners(orgId: string, userIdToChange: string, newRole: Role): Promise<void> {
  const ownerCount = await db.user.count({
    where: {
      organizationId: orgId,
      role: 'OWNER',
      isActive: true,
      isDeleted: false
    }
  });
  
  const currentUser = await db.user.findUnique({ where: { id: userIdToChange } });
  
  // If changing OWNER to non-OWNER and only 1 OWNER exists
  if (currentUser.role === 'OWNER' && newRole !== 'OWNER' && ownerCount === 1) {
    throw new ValidationError('Cannot remove last OWNER. Assign another OWNER first.');
  }
}
```
**Action:** Implement in user role change endpoint

---

## GAP-038 ⏳ OPEN
**Priority:** P0  
**Type:** Business Logic Validation  
**Requirement:** Organization deletion - no active calls check  
**Decision:** Before org deletion, validate: `SELECT COUNT(*) FROM calls WHERE status='ACTIVE' AND organizationId=:orgId` must be 0  
**Implementation Location:** DELETE /organization endpoint  
**Validation Logic:**
```typescript
async function validateNoActiveCalls(orgId: string): Promise<void> {
  const activeCallCount = await db.call.count({
    where: {
      organizationId: orgId,
      status: 'ACTIVE'
    }
  });
  
  if (activeCallCount > 0) {
    throw new ValidationError(
      `Cannot delete organization with ${activeCallCount} active call(s). Wait for calls to complete.`
    );
  }
}
```
**Action:** Implement in organization deletion endpoint

---

## GAP-209 ⏳ OPEN
**Priority:** P0  
**Type:** Business Logic Validation  
**Requirement:** Phone number deletion - no active calls check  
**Decision:** Before phone number deletion, validate: `SELECT COUNT(*) FROM calls WHERE status='ACTIVE' AND phoneNumberId=:id` must be 0  
**Implementation Location:** DELETE /phone-numbers/:id endpoint  
**Validation Logic:**
```typescript
async function validateNoActiveCallsOnNumber(phoneNumberId: string): Promise<void> {
  const activeCallCount = await db.call.count({
    where: {
      phoneNumberId,
      status: 'ACTIVE'
    }
  });
  
  if (activeCallCount > 0) {
    throw new ValidationError(
      `Cannot delete phone number with ${activeCallCount} active call(s). Wait for calls to complete.`
    );
  }
}
```
**Action:** Implement in phone number deletion endpoint

---

## GAP-247 ⏳ OPEN
**Priority:** P0  
**Type:** Business Logic Validation (Frontend + Backend)  
**Requirement:** Remove user - can't remove last OWNER  
**Decision:** Same as GAP-036, validate before user removal  
**Implementation Location:** DELETE /users/:userId endpoint  
**Validation Logic:** Same as GAP-036  
**Action:** Implement in user removal endpoint

---

## GAP-248 ⏳ OPEN
**Priority:** P1  
**Type:** Business Logic Validation (Warning)  
**Requirement:** Remove user - active calls warning  
**Decision:** Query active calls, show warning if count > 0, allow override  
**Implementation Location:** DELETE /users/:userId endpoint  
**Validation Logic:**
```typescript
async function checkActiveCallsForUser(userId: string): Promise<{ hasActiveCalls: boolean; count: number }> {
  const activeCallCount = await db.call.count({
    where: {
      handledByUserId: userId,
      status: 'ACTIVE'
    }
  });
  
  return {
    hasActiveCalls: activeCallCount > 0,
    count: activeCallCount
  };
}

// In endpoint:
const activeCallsCheck = await checkActiveCallsForUser(userId);
if (activeCallsCheck.hasActiveCalls && !req.body.forceRemove) {
  return res.status(409).json({
    error: {
      code: 'ACTIVE_CALLS_WARNING',
      message: `User is handling ${activeCallsCheck.count} active calls. Remove anyway?`,
      requiresConfirmation: true
    }
  });
}
```
**Action:** Implement active calls check with override

---

### CATEGORY 2: QUOTA VALIDATIONS (8 gaps)

## GAP-070 ⏳ OPEN
**Priority:** P0  
**Type:** Quota Validation  
**Requirement:** Call minutes quota - block if exceeded  
**Decision:** Before call creation, validate: `organization.usedMinutes < organization.quotaMinutes`  
**Implementation Location:** POST /calls webhook (call initiation)  
**Validation Logic:**
```typescript
async function validateCallMinutesQuota(orgId: string): Promise<void> {
  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { usedMinutes: true, callMinutesQuota: true }
  });
  
  if (org.usedMinutes >= org.callMinutesQuota) {
    throw new QuotaExceededError({
      code: 'CALL_MINUTES_QUOTA_EXCEEDED',
      message: 'Call minutes quota exceeded',
      quota: {
        limit: org.callMinutesQuota,
        used: org.usedMinutes,
        remaining: 0
      }
    });
  }
}
```
**Action:** Implement in call initiation webhook

---

## GAP-241 ⏳ OPEN
**Priority:** P0  
**Type:** Quota Validation  
**Requirement:** Invite user - quota exceeded  
**Decision:** Before invite, validate: `teamMemberCount < teamMembersQuota`  
**Implementation Location:** POST /users (invite) endpoint  
**Validation Logic:**
```typescript
async function validateTeamMemberQuota(orgId: string): Promise<void> {
  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { teamMembersQuota: true }
  });
  
  const currentCount = await db.user.count({
    where: {
      organizationId: orgId,
      isActive: true,
      isDeleted: false
    }
  });
  
  if (currentCount >= org.teamMembersQuota) {
    throw new QuotaExceededError({
      code: 'TEAM_MEMBER_QUOTA_EXCEEDED',
      message: `Team member limit reached (${org.teamMembersQuota}). Upgrade to add more users.`,
      quota: {
        limit: org.teamMembersQuota,
        used: currentCount,
        remaining: 0
      }
    });
  }
}
```
**Action:** Implement in user invitation endpoint

---

## GAP-272 ⏳ OPEN
**Priority:** P0  
**Type:** Quota Validation  
**Requirement:** Add knowledge - quota check  
**Decision:** Before knowledge creation, validate: `knowledgeItemCount < knowledgeQuota`  
**Implementation Location:** POST /knowledge endpoint  
**Validation Logic:**
```typescript
async function validateKnowledgeQuota(orgId: string, plan: string): Promise<void> {
  const quotaByPlan = {
    STARTER: 1000,
    PROFESSIONAL: 5000,
    ENTERPRISE: Infinity
  };
  
  const quota = quotaByPlan[plan];
  
  if (quota === Infinity) return; // Enterprise has unlimited
  
  const currentCount = await db.knowledgeItem.count({
    where: {
      organizationId: orgId,
      isActive: true,
      isDeleted: false
    }
  });
  
  if (currentCount >= quota) {
    throw new QuotaExceededError({
      code: 'KNOWLEDGE_QUOTA_EXCEEDED',
      message: `Knowledge item limit reached (${quota}). Upgrade to add more.`,
      quota: {
        limit: quota,
        used: currentCount,
        remaining: 0
      }
    });
  }
}
```
**Action:** Implement in knowledge creation endpoint

---

## GAP-275 ⏳ OPEN
**Priority:** P2  
**Type:** Validation  
**Requirement:** Bulk import - max 100 items  
**Decision:** Validate CSV row count <= 100  
**Implementation Location:** POST /knowledge/bulk-import endpoint  
**Validation Logic:**
```typescript
function validateBulkImportSize(items: any[]): void {
  if (items.length > 100) {
    throw new ValidationError({
      code: 'BULK_IMPORT_TOO_LARGE',
      message: `Bulk import limited to 100 items. You provided ${items.length}.`,
      maxItems: 100,
      providedItems: items.length
    });
  }
}
```
**Action:** Implement in bulk import endpoint

---

## GAP-276 ⏳ OPEN
**Priority:** P2  
**Type:** Validation  
**Requirement:** Bulk import - validation errors before saving  
**Decision:** Validate all rows, return errors, don't save if any errors  
**Implementation Location:** POST /knowledge/bulk-import endpoint  
**Validation Logic:**
```typescript
async function validateBulkImportItems(
  items: Array<{ question: string; answer: string; category: string }>,
  schema: z.ZodSchema
): Promise<{ valid: boolean; errors: Array<{ row: number; field: string; message: string }> }> {
  const errors = [];
  
  for (let i = 0; i < items.length; i++) {
    const result = schema.safeParse(items[i]);
    if (!result.success) {
      result.error.errors.forEach(err => {
        errors.push({
          row: i + 1,
          field: err.path.join('.'),
          message: err.message
        });
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// In endpoint:
const validation = await validateBulkImportItems(csvData, createKnowledgeSchema);
if (!validation.valid) {
  return res.status(400).json({
    error: {
      code: 'BULK_IMPORT_VALIDATION_FAILED',
      message: `${validation.errors.length} validation errors found`,
      errors: validation.errors
    }
  });
}
```
**Action:** Implement validation preview

---

## GAP-069 ⏳ OPEN
**Priority:** P0  
**Type:** Quota Validation  
**Requirement:** Downgrade - user selection if over limit  
**Decision:** If `currentUsers > newPlanLimit`, require selection of users to deactivate  
**Implementation Location:** PATCH /billing/subscription/downgrade endpoint  
**Validation Logic:**
```typescript
async function validateDowngradeUserSelection(
  orgId: string,
  newPlanLimit: number,
  selectedUserIds?: string[]
): Promise<void> {
  const currentUserCount = await db.user.count({
    where: {
      organizationId: orgId,
      isActive: true,
      isDeleted: false
    }
  });
  
  if (currentUserCount <= newPlanLimit) {
    return; // No action needed
  }
  
  const excessCount = currentUserCount - newPlanLimit;
  
  if (!selectedUserIds || selectedUserIds.length !== excessCount) {
    throw new ValidationError({
      code: 'USER_SELECTION_REQUIRED',
      message: `You must select ${excessCount} user(s) to deactivate`,
      currentUsers: currentUserCount,
      newLimit: newPlanLimit,
      requiredSelections: excessCount
    });
  }
  
  // Validate selected users exist and aren't OWNERs
  const selectedUsers = await db.user.findMany({
    where: { id: { in: selectedUserIds } }
  });
  
  const ownerSelected = selectedUsers.some(u => u.role === 'OWNER');
  if (ownerSelected) {
    throw new ValidationError('Cannot deactivate OWNER users during downgrade');
  }
}
```
**Action:** Implement user selection validation

---

## GAP-061 ⏳ OPEN
**Priority:** P1  
**Type:** Quota Validation (Read-only enforcement)  
**Requirement:** Data over quota - read-only, no deletion  
**Decision:** If `usedMinutes > quotaMinutes`, block POST/PATCH/DELETE on calls, allow GET  
**Implementation Location:** Middleware for call endpoints  
**Validation Logic:**
```typescript
async function enforceReadOnlyIfOverQuota(req: Request, res: Response, next: NextFunction): Promise<void> {
  const writeOperations = ['POST', 'PATCH', 'PUT', 'DELETE'];
  
  if (!writeOperations.includes(req.method)) {
    return next(); // Allow reads
  }
  
  const org = await db.organization.findUnique({
    where: { id: req.user.organizationId },
    select: { usedMinutes: true, callMinutesQuota: true }
  });
  
  if (org.usedMinutes > org.callMinutesQuota) {
    return res.status(422).json({
      error: {
        code: 'QUOTA_EXCEEDED_READ_ONLY',
        message: 'Organization is over quota. Upgrade plan to create new calls.',
        quota: {
          limit: org.callMinutesQuota,
          used: org.usedMinutes,
          remaining: 0
        }
      }
    });
  }
  
  next();
}
```
**Action:** Implement read-only mode middleware

---

## GAP-281 ⏳ OPEN
**Priority:** P0  
**Type:** Business Hours Validation  
**Requirement:** After-hours check  
**Decision:** Validate current time within business hours for phone number  
**Implementation Location:** Call webhook (call initiation)  
**Validation Logic:**
```typescript
function isWithinBusinessHours(phoneNumber: PhoneNumber): boolean {
  const now = new Date();
  const dayOfWeek = now.toLocaleLowerCase('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  
  const businessHours = phoneNumber.businessHours?.[dayOfWeek];
  
  if (!businessHours) {
    return false; // No hours defined for this day = closed
  }
  
  return currentTime >= businessHours.open && currentTime <= businessHours.close;
}

// In webhook:
const phoneNumber = await getPhoneNumber(incomingNumber);
if (!isWithinBusinessHours(phoneNumber)) {
  // Route to voicemail or forward
  handleAfterHours(phoneNumber.afterHoursAction);
  return;
}
```
**Action:** Implement business hours check

---

### CATEGORY 3: DUPLICATE & UNIQUENESS VALIDATIONS (5 gaps)

## GAP-239 ⏳ OPEN
**Priority:** P1  
**Type:** Duplicate Validation  
**Requirement:** Invite user - already exists  
**Decision:** Check if email already member of organization  
**Implementation Location:** POST /users (invite) endpoint  
**Validation Logic:**
```typescript
async function validateUserNotDuplicate(email: string, orgId: string): Promise<void> {
  const existing = await db.user.findFirst({
    where: {
      email,
      organizationId: orgId,
      isDeleted: false
    }
  });
  
  if (existing) {
    throw new ConflictError({
      code: 'USER_ALREADY_EXISTS',
      message: `${email} is already a member of this organization`,
      conflictField: 'email'
    });
  }
}
```
**Action:** Implement duplicate user check

---

## GAP-240 ⏳ OPEN
**Priority:** P1  
**Type:** Duplicate Validation  
**Requirement:** Invite user - already invited (pending)  
**Decision:** Check if pending invitation exists for email  
**Implementation Location:** POST /users (invite) endpoint  
**Validation Logic:**
```typescript
async function validateNoPendingInvitation(email: string, orgId: string): Promise<void> {
  const pendingInvite = await db.invitation.findFirst({
    where: {
      email,
      organizationId: orgId,
      status: 'PENDING',
      expiresAt: { gt: new Date() }
    }
  });
  
  if (pendingInvite) {
    const daysUntilExpiry = Math.ceil(
      (pendingInvite.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    throw new ConflictError({
      code: 'INVITATION_ALREADY_SENT',
      message: `An invitation has already been sent to ${email}. Expires in ${daysUntilExpiry} days.`,
      conflictField: 'email',
      expiresAt: pendingInvite.expiresAt
    });
  }
}
```
**Action:** Implement pending invitation check

---

## GAP-271 ⏳ OPEN
**Priority:** P1  
**Type:** Duplicate Detection (Warning)  
**Requirement:** Add knowledge - similar question warning  
**Decision:** Fuzzy search for similar questions, show warning but allow adding  
**Implementation Location:** POST /knowledge endpoint  
**Validation Logic:**
```typescript
async function findSimilarQuestions(
  question: string,
  orgId: string,
  threshold: number = 0.8
): Promise<Array<{ id: string; question: string; similarity: number }>> {
  // Using PostgreSQL trigram similarity
  const similar = await db.$queryRaw`
    SELECT id, question, 
           similarity(question, ${question}) as similarity
    FROM knowledge_items
    WHERE organization_id = ${orgId}
      AND is_active = true
      AND is_deleted = false
      AND similarity(question, ${question}) > ${threshold}
    ORDER BY similarity DESC
    LIMIT 5
  `;
  
  return similar;
}

// In endpoint:
const similarQuestions = await findSimilarQuestions(req.body.question, req.user.organizationId);
if (similarQuestions.length > 0 && !req.body.confirmDuplicate) {
  return res.status(409).json({
    error: {
      code: 'SIMILAR_QUESTION_FOUND',
      message: 'Similar question(s) found',
      similarQuestions: similarQuestions.map(q => ({
        question: q.question,
        similarity: Math.round(q.similarity * 100)
      })),
      requiresConfirmation: true
    }
  });
}
```
**Action:** Implement fuzzy duplicate detection

---

## GAP-105 ⏳ OPEN
**Priority:** P1  
**Type:** Uniqueness Validation  
**Requirement:** Multiple trials blocked by email/org  
**Decision:** Check if user/org has had trial in past year  
**Implementation Location:** POST /auth/signup (trial) endpoint  
**Validation Logic:**
```typescript
async function validateTrialEligibility(email: string): Promise<void> {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const previousTrial = await db.subscription.findFirst({
    where: {
      OR: [
        { user: { email } },
        { organization: { billingEmail: email } }
      ],
      status: { in: ['TRIALING', 'CANCELED'] },
      createdAt: { gt: oneYearAgo }
    }
  });
  
  if (previousTrial) {
    throw new ValidationError({
      code: 'TRIAL_NOT_ELIGIBLE',
      message: 'You have already used a trial. Please select a paid plan.',
      previousTrialDate: previousTrial.createdAt
    });
  }
}
```
**Action:** Implement trial uniqueness check

---

## GAP-085 ⏳ OPEN
**Priority:** P1  
**Type:** Eligibility Validation  
**Requirement:** Refund eligibility - 14 days from first charge  
**Decision:** Check if first invoice date within 14 days  
**Implementation Location:** POST /billing/refund endpoint  
**Validation Logic:**
```typescript
async function validateRefundEligibility(orgId: string): Promise<void> {
  const firstInvoice = await db.invoice.findFirst({
    where: { organizationId: orgId },
    orderBy: { createdAt: 'asc' }
  });
  
  if (!firstInvoice) {
    throw new ValidationError('No invoices found for this organization');
  }
  
  const daysSinceFirstCharge = Math.floor(
    (Date.now() - firstInvoice.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceFirstCharge > 14) {
    throw new ValidationError({
      code: 'REFUND_PERIOD_EXPIRED',
      message: `Refund window expired. First charge was ${daysSinceFirstCharge} days ago (14 day limit).`,
      firstChargeDate: firstInvoice.createdAt,
      daysElapsed: daysSinceFirstCharge
    });
  }
}
```
**Action:** Implement refund eligibility check

---

### CATEGORY 4: CONFIRMATION VALIDATIONS (5 gaps)

## GAP-035 ⏳ OPEN
**Priority:** P1  
**Type:** Confirmation Validation  
**Requirement:** OWNER self-demotion requires confirmation  
**Decision:** Require explicit confirmation flag when OWNER demotes self  
**Implementation Location:** PATCH /users/:userId (role change) endpoint  
**Validation Logic:**
```typescript
async function validateSelfDemotion(
  actorId: string,
  targetId: string,
  currentRole: Role,
  newRole: Role,
  confirmed: boolean
): Promise<void> {
  const isSelfDemotion = actorId === targetId && currentRole === 'OWNER' && newRole !== 'OWNER';
  
  if (!isSelfDemotion) return;
  
  if (!confirmed) {
    throw new ValidationError({
      code: 'SELF_DEMOTION_CONFIRMATION_REQUIRED',
      message: 'You are demoting yourself from OWNER. This action requires confirmation.',
      requiresConfirmation: true,
      warning: 'You will lose administrative access to the organization.'
    });
  }
}
```
**Action:** Implement self-demotion confirmation

---

## GAP-090 ⏳ OPEN
**Priority:** P1  
**Type:** Eligibility Validation  
**Requirement:** No refund if ToS violation  
**Decision:** Check user.tosViolation flag before processing refund  
**Implementation Location:** POST /billing/refund endpoint  
**Validation Logic:**
```typescript
async function validateNoTosViolation(orgId: string): Promise<void> {
  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { tosViolation: true, tosViolationReason: true }
  });
  
  if (org.tosViolation) {
    throw new ValidationError({
      code: 'REFUND_NOT_AVAILABLE',
      message: 'Refunds are not available for accounts with Terms of Service violations.',
      reason: org.tosViolationReason
    });
  }
}
```
**Action:** Implement ToS violation check

---

## GAP-065 ⏳ OPEN
**Priority:** P1  
**Type:** Time-based Validation  
**Requirement:** Reactivation within 90 days  
**Decision:** Check if now < deletedAt + 90 days  
**Implementation Location:** POST /billing/subscription/reactivate endpoint  
**Validation Logic:**
```typescript
async function validateReactivationEligibility(orgId: string): Promise<void> {
  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { isDeleted: true, deletedAt: true }
  });
  
  if (!org.isDeleted) {
    throw new ValidationError('Organization is not deleted');
  }
  
  const daysSinceDeletion = Math.floor(
    (Date.now() - org.deletedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceDeletion > 90) {
    throw new ValidationError({
      code: 'REACTIVATION_PERIOD_EXPIRED',
      message: `Reactivation window expired. Deleted ${daysSinceDeletion} days ago (90 day limit).`,
      deletedAt: org.deletedAt,
      daysElapsed: daysSinceDeletion
    });
  }
}
```
**Action:** Implement reactivation eligibility check

---

## GAP-243 ⏳ OPEN
**Priority:** P2  
**Type:** Time-based Validation  
**Requirement:** Invitation expiry - 7 days  
**Decision:** Store expires_at = now() + 7 days, validate on acceptance  
**Implementation Location:** POST /invitations/accept endpoint  
**Validation Logic:**
```typescript
async function validateInvitationNotExpired(token: string): Promise<void> {
  const invitation = await db.invitation.findUnique({
    where: { token }
  });
  
  if (!invitation) {
    throw new ValidationError({
      code: 'INVITATION_NOT_FOUND',
      message: 'Invalid invitation link'
    });
  }
  
  if (new Date() > invitation.expiresAt) {
    throw new ValidationError({
      code: 'INVITATION_EXPIRED',
      message: 'This invitation has expired. Please request a new one.',
      expiredAt: invitation.expiresAt
    });
  }
}
```
**Action:** Implement invitation expiry validation

---

## SUMMARY

**Total Validation Gaps:** 68  
- ✅ **Closed:** 45 (Input validations via Zod schemas)
- ⏳ **Open:** 23 (Business logic validations)

**Open Validations by Type:**
- Authorization: 5 gaps (minimum OWNER, active calls)
- Quota: 8 gaps (call minutes, team members, knowledge, storage)
- Duplicate/Uniqueness: 5 gaps (user invite, knowledge, trial)
- Confirmation: 5 gaps (self-demotion, refund, reactivation)

**Priority:**
- P0 (Critical): 10 gaps
- P1 (High): 11 gaps
- P2 (Medium): 2 gaps

---

## NEXT STEP

All 23 business logic validations need implementation.

**Should I:**
1. **Start implementing** - Begin with P0 validation gaps (10 gaps)
2. **Create validation utility library** - Shared validation functions first
3. **Something else** - Your direction

Please specify how to proceed with validation gap closure.

