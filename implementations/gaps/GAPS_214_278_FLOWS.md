# Gaps 214-278: User Flows & Frontend States

**Total:** 65 gaps | **Closed:** 0 | **Open:** 65

---

## 4.1 ONBOARDING FLOW STATES (13 gaps)

## GAP-214 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Email verification - Loading state  
**Decision:** Display: "Sending verification email..." with spinner during API call  
**Implementation:** React component state: `isLoading` with loading UI  
**Action:** Create email verification loading state

## GAP-215 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Email verification - Success state  
**Decision:** Display: "Email sent! Check your inbox at user@example.com" with check icon  
**Implementation:** Success state with email display  
**Action:** Create email verification success state

## GAP-216 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Email verification - Error state  
**Decision:** Display: "Failed to send email. Please try again" with retry button  
**Implementation:** Error state with retry action  
**Action:** Create email verification error state

## GAP-217 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Email verification - Rate limit state  
**Decision:** Display: "Too many requests. Please wait {countdown} seconds" with disabled button  
**Implementation:** Countdown timer from Retry-After header  
**Action:** Create rate limit countdown component

## GAP-218 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Email verification - Already verified state  
**Decision:** Redirect to dashboard with message: "Email already verified"  
**Implementation:** Check verification status, redirect if true  
**Action:** Implement already-verified redirect

## GAP-219 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Email verification - Expired token state  
**Decision:** Display: "This verification link has expired. Request a new one?" with button  
**Implementation:** Detect TOKEN_EXPIRED error, show resend option  
**Action:** Create expired token UI

## GAP-220 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Email verification - Invalid token state  
**Decision:** Display: "This verification link is invalid. Please contact support." with support link  
**Implementation:** Detect TOKEN_INVALID error  
**Action:** Create invalid token UI

## GAP-221 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend State  
**Requirement:** Onboarding - Progress indicator  
**Decision:** Display: "Step 2 of 4" progress bar at top of page  
**Implementation:** Multi-step form component with step tracking  
**Action:** Create progress indicator component

## GAP-222 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend State  
**Requirement:** Onboarding - Can skip steps: No, mandatory  
**Decision:** Disable "Skip" button, require completion of each step  
**Implementation:** Validation prevents advancing without completion  
**Action:** Enforce mandatory steps

## GAP-223 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend State  
**Requirement:** Onboarding - Can go back: Yes, data saved  
**Decision:** "Back" button enabled, form data persisted in localStorage or state  
**Implementation:** Save form data on step change  
**Action:** Implement step navigation with data persistence

## GAP-224 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend State  
**Requirement:** Onboarding - Incomplete: Resume from last step  
**Decision:** On return, redirect to last incomplete step with saved data  
**Implementation:** Track completion in DB, load on page load  
**Action:** Implement onboarding resume

## GAP-225 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend State  
**Requirement:** Onboarding - Timeout: 24 hours, then restart  
**Decision:** If onboarding_started_at > 24 hours ago, clear data and restart from step 1  
**Implementation:** Check timestamp, clear if expired  
**Action:** Implement onboarding timeout

## GAP-226 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend State  
**Requirement:** Onboarding - Exit confirmation  
**Decision:** Show modal: "You'll lose your progress. Are you sure?" on navigate away  
**Implementation:** beforeunload event or route guard  
**Action:** Create exit confirmation dialog

---

## 4.2 PAYMENT FLOW STATES (12 gaps)

## GAP-227 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend State  
**Requirement:** Checkout - Loading state  
**Decision:** Display: "Processing payment..." with spinner, disable form  
**Implementation:** Loading overlay during Stripe checkout  
**Action:** Create payment loading state

## GAP-228 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend State  
**Requirement:** Checkout - Success state  
**Decision:** Redirect to dashboard + show toast: "Payment successful! Welcome to {plan}"  
**Implementation:** Success redirect + confirmation email  
**Action:** Create payment success flow

## GAP-229 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend State  
**Requirement:** Checkout - Card declined: Insufficient funds  
**Decision:** Display: "Your card was declined due to insufficient funds. Please use another card."  
**Implementation:** Parse Stripe error code, show specific message  
**Action:** Implement card declined UI (insufficient funds)

## GAP-230 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend State  
**Requirement:** Checkout - Card declined: Expired card  
**Decision:** Display: "Your card has expired. Please use a different card."  
**Implementation:** Parse Stripe error  
**Action:** Implement expired card UI

## GAP-231 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend State  
**Requirement:** Checkout - Card declined: Invalid CVV  
**Decision:** Display: "The CVV code is incorrect. Please check and try again."  
**Implementation:** Parse Stripe error  
**Action:** Implement invalid CVV UI

## GAP-232 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend State  
**Requirement:** Checkout - Card declined: Card blocked  
**Decision:** Display: "Your card has been blocked by your bank. Please contact your bank or use another card."  
**Implementation:** Parse Stripe error  
**Action:** Implement card blocked UI

## GAP-233 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Checkout - Network timeout  
**Decision:** Display: "Payment status unknown. Please check your email for confirmation or contact support. Reference: {transactionId}"  
**Implementation:** Timeout handler with reference ID  
**Action:** Create timeout ambiguous state UI

## GAP-234 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend State  
**Requirement:** Checkout - Already subscribed  
**Decision:** Redirect to billing page + message: "You already have an active subscription"  
**Implementation:** Check subscription status before checkout  
**Action:** Prevent duplicate checkout UI

## GAP-235 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Checkout - Stripe down  
**Decision:** Display: "Payment system temporarily unavailable. Please try again in a few minutes."  
**Implementation:** Detect 503 from Stripe  
**Action:** Create payment service unavailable UI

## GAP-236 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend State  
**Requirement:** Payment failure recovery - Notification  
**Decision:** Dashboard banner: "⚠️ Payment failed. Update payment method" + email notification  
**Implementation:** Banner component on dashboard  
**Action:** Create payment failed banner

## GAP-237 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend State  
**Requirement:** Payment failure recovery - Grace period countdown  
**Decision:** Display: "Your account will be suspended in {days} days if payment is not resolved"  
**Implementation:** Calculate days remaining from payment_failed_at  
**Action:** Create grace period countdown

## GAP-238 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend State  
**Requirement:** Payment failure recovery - Suspended state  
**Decision:** Read-only mode: Show banner "Account suspended. Update payment to restore access" with prominent CTA  
**Implementation:** Block all write actions, show upgrade banner  
**Action:** Create suspended account UI

---

## 4.3 TEAM MANAGEMENT EDGE CASES (15 gaps)

## GAP-239 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Validation  
**Requirement:** Invite user - Already exists  
**Decision:** Show error: "user@example.com is already a member of this organization"  
**Implementation:** Check membership before invite  
**Action:** Implement duplicate member check

## GAP-240 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Invite user - Already invited (pending)  
**Decision:** Show error: "An invitation has already been sent to user@example.com. Expires in {days} days."  
**Implementation:** Check pending invitations  
**Action:** Implement pending invitation check

## GAP-241 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend Validation  
**Requirement:** Invite user - Quota exceeded  
**Decision:** Show error: "You've reached your team member limit ({limit}). Upgrade your plan to add more users."  
**Implementation:** Check quota before invite  
**Action:** Implement quota exceeded UI

## GAP-242 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Validation  
**Requirement:** Invite user - Invalid email real-time  
**Decision:** Show inline error as user types: "Invalid email format"  
**Implementation:** Real-time validation with debounce  
**Action:** Implement real-time email validation

## GAP-243 ⏳ OPEN
**Priority:** P2  
**Category:** Business Logic  
**Requirement:** Invite expiry: 7 days  
**Decision:** Invitations expire 7 days after creation, delete expired invitations daily  
**Implementation:** expires_at = now() + interval '7 days', cron cleanup  
**Action:** Implement invitation expiry

## GAP-244 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend Action  
**Requirement:** Resend invite: Available after 24 hours  
**Decision:** "Resend" button disabled for 24 hours after last send  
**Implementation:** Check last_sent_at, enable after 24h  
**Action:** Implement resend cooldown

## GAP-245 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend Action  
**Requirement:** Cancel invite: Before acceptance  
**Decision:** "Cancel" button on pending invitations, deletes invitation  
**Implementation:** DELETE /invitations/:id endpoint  
**Action:** Implement invitation cancellation

## GAP-246 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Confirmation  
**Requirement:** Remove user - Confirmation dialog  
**Decision:** Modal: "Remove {name} from organization? They will lose access immediately." [Cancel] [Remove]  
**Implementation:** Confirmation dialog component  
**Action:** Create user removal confirmation

## GAP-247 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend Validation  
**Requirement:** Remove user - Can't remove last OWNER  
**Decision:** Show error: "Cannot remove the last owner. Assign another owner first."  
**Implementation:** Check OWNER count before removal  
**Action:** Implement last owner check

## GAP-248 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Warning  
**Requirement:** Remove user - Active calls warning  
**Decision:** Modal: "⚠️ {name} is currently handling {count} active calls. Remove anyway?" [Cancel] [Remove Anyway]  
**Implementation:** Check active calls, show warning  
**Action:** Create active calls warning

## GAP-249 ⏳ OPEN
**Priority:** P1  
**Category:** Business Logic  
**Requirement:** Remove user - Data preservation  
**Decision:** Keep call notes/tags, display author as "Deleted User" in UI  
**Implementation:** Soft delete user, nullify handledByUserId  
**Action:** Implement data preservation on removal

## GAP-250 ⏳ OPEN
**Priority:** P2  
**Category:** Business Logic  
**Requirement:** Remove user - Undo: 30-day grace period  
**Decision:** Soft delete, allow restoration within 30 days, hard delete after  
**Implementation:** isDeleted flag + cleanup cron  
**Action:** Implement user restoration feature

## GAP-251 ⏳ OPEN
**Priority:** P1  
**Category:** Business Logic  
**Requirement:** Remove user - Notification  
**Decision:** Email user: "You have been removed from {org_name} by {admin_name}"  
**Implementation:** Send email on removal  
**Action:** Create user removal email

## GAP-252 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Confirmation  
**Requirement:** Role change - Confirmation  
**Decision:** Modal: "Change {name}'s role from {oldRole} to {newRole}?" [Cancel] [Confirm]  
**Implementation:** Confirmation dialog  
**Action:** Create role change confirmation

## GAP-253 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Confirmation  
**Requirement:** Role change - Self-demotion extra confirmation  
**Decision:** Modal: "⚠️ You are demoting yourself from OWNER to {role}. You will lose administrative access. Are you sure?" [Cancel] [I Understand, Proceed]  
**Implementation:** Extra confirmation for self-demotion  
**Action:** Create self-demotion warning

---

## 4.4 CALL HANDLING FLOWS (11 gaps)

## GAP-254 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Real-time  
**Requirement:** Active call - Live status indicator  
**Decision:** Pulsing green dot + "Active Call" badge on call card  
**Implementation:** WebSocket updates, animated dot CSS  
**Action:** Create live call indicator

## GAP-255 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Real-time  
**Requirement:** Active call - Real-time transcript  
**Decision:** WebSocket stream displays transcript as it's generated  
**Implementation:** WebSocket connection with transcript updates  
**Action:** Create real-time transcript component

## GAP-256 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Permission  
**Requirement:** Active call - Transfer button (MANAGER+ only)  
**Decision:** Show "Transfer" button only if user role >= MANAGER  
**Implementation:** Permission check in UI  
**Action:** Implement permission-based transfer button

## GAP-257 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Confirmation  
**Requirement:** Active call - Transfer confirmation  
**Decision:** Modal: "Transfer call to +998901234567?" [Cancel] [Transfer]  
**Implementation:** Confirmation with target number  
**Action:** Create transfer confirmation dialog

## GAP-258 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Active call - Transfer failure  
**Decision:** Toast: "Transfer failed. AI will continue handling the call."  
**Implementation:** Error handling for transfer API  
**Action:** Create transfer failure notification

## GAP-259 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend Indicator  
**Requirement:** Active call - Call quality indicator  
**Decision:** Signal strength bars (green/yellow/red) based on MOS score  
**Implementation:** Real-time quality metrics display  
**Action:** Create call quality indicator

## GAP-260 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Indicator  
**Requirement:** Active call - Recording indicator  
**Decision:** Red dot + "Recording" text visible during call  
**Implementation:** Show when call status = 'ACTIVE'  
**Action:** Create recording indicator

## GAP-261 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Call end - Processing state  
**Decision:** Display: "Transcribing call..." with progress indicator  
**Implementation:** Show while status = 'PROCESSING'  
**Action:** Create call processing state

## GAP-262 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend State  
**Requirement:** Call end - Transcription failure  
**Decision:** Display: "⚠️ Transcription failed. Audio recording is available."  
**Implementation:** Show warning icon, enable audio playback  
**Action:** Create transcription failed state

## GAP-263 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Real-time  
**Requirement:** Missed call - Notification  
**Decision:** Push notification + dashboard badge: "Missed call from +998901234567"  
**Implementation:** Real-time notification system  
**Action:** Create missed call notification

## GAP-264 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend Action  
**Requirement:** Missed call - Auto-callback  
**Decision:** "Call Back" button on missed call, initiates outbound call  
**Implementation:** Optional feature, initiates callback  
**Action:** Create callback functionality

---

## 4.5 AI CONFIGURATION (6 gaps)

## GAP-265 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Validation  
**Requirement:** AI config - Preview before saving  
**Decision:** "Test AI" button sends sample message, shows AI response in modal  
**Implementation:** Test endpoint with current config  
**Action:** Create AI config preview

## GAP-266 ⏳ OPEN
**Priority:** P2  
**Category:** Business Logic  
**Requirement:** AI config - Rollback: Keep last 5 versions  
**Decision:** Store config versions in ai_config_history table, allow rollback to previous 5  
**Implementation:** Version tracking + rollback UI  
**Action:** Implement config version history

## GAP-267 ⏳ OPEN
**Priority:** P2  
**Category:** Business Logic  
**Requirement:** AI config - Effective time: Immediate or scheduled  
**Decision:** Radio buttons: "Apply now" or "Schedule for [date/time]"  
**Implementation:** effective_at timestamp field  
**Action:** Implement scheduled config changes

## GAP-268 ⏳ OPEN
**Priority:** P2  
**Category:** Business Logic  
**Requirement:** AI config - Testing period: Try 24h then revert  
**Decision:** "Trial mode" checkbox: auto-revert to previous config after 24h if not confirmed  
**Implementation:** Scheduled revert job  
**Action:** Implement trial mode for config changes

## GAP-269 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Validation  
**Requirement:** Transfer rules - Confidence threshold: 0-100, default 70  
**Decision:** Slider input: 0-100 with tooltip, default value 70  
**Implementation:** Range input with validation  
**Action:** Create confidence threshold slider

## GAP-270 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Action  
**Requirement:** Transfer rules - Test transfer simulation  
**Decision:** "Test Transfer" button simulates transfer without live call  
**Implementation:** Mock transfer test endpoint  
**Action:** Create transfer simulation feature

---

## 4.6 KNOWLEDGE BASE EDGE CASES (8 gaps)

## GAP-271 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Warning  
**Requirement:** Add knowledge - Duplicate detection  
**Decision:** Show warning: "⚠️ Similar question found: '{similar_question}'. Add anyway?"  
**Implementation:** Fuzzy search on question field  
**Action:** Implement duplicate question detection

## GAP-272 ⏳ OPEN
**Priority:** P0  
**Category:** Frontend Validation  
**Requirement:** Add knowledge - Quota check  
**Decision:** Check: if (count >= quota) show "Quota exceeded. Upgrade to add more items."  
**Implementation:** Check quota before allowing creation  
**Action:** Implement knowledge quota enforcement

## GAP-273 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend Enhancement  
**Requirement:** Add knowledge - Category autocomplete  
**Decision:** Dropdown suggests existing categories as user types  
**Implementation:** Autocomplete with existing categories  
**Action:** Create category autocomplete

## GAP-274 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend Feature  
**Requirement:** Add knowledge - Answer formatting: Markdown support  
**Decision:** Rich text editor with markdown preview for answer field  
**Implementation:** Markdown editor component  
**Action:** Implement markdown editor for answers

## GAP-275 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend Feature  
**Requirement:** Add knowledge - Bulk import: CSV (100 max)  
**Decision:** CSV upload: question,answer,category (max 100 rows), show validation errors before import  
**Implementation:** CSV parser + bulk create endpoint  
**Action:** Create CSV import feature

## GAP-276 ⏳ OPEN
**Priority:** P2  
**Category:** Frontend Validation  
**Requirement:** Bulk import - Validation: Show errors before saving  
**Decision:** Parse CSV, show errors table: row #, field, error message, allow fix or proceed  
**Implementation:** CSV validation preview  
**Action:** Create import preview with errors

## GAP-277 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Confirmation  
**Requirement:** Delete knowledge - Confirmation with usage  
**Decision:** Modal: "Delete this Q&A? Used {count} times in conversations." [Cancel] [Delete]  
**Implementation:** Show usage count in confirmation  
**Action:** Create delete confirmation with usage stats

## GAP-278 ⏳ OPEN
**Priority:** P1  
**Category:** Frontend Warning  
**Requirement:** Delete knowledge - Impact warning  
**Decision:** Warning text: "⚠️ The AI will no longer be able to answer this question after deletion."  
**Implementation:** Display impact message  
**Action:** Add impact warning to delete dialog

---

**Summary:** 0 closed, 65 open in this category
