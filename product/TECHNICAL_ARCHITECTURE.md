# Technical Architecture - Full-Stack SaaS

Complete technical specification for scalable multi-tenant AI Call Center platform.

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Web App         │  │  Mobile App      │  │  Admin Panel     │ │
│  │  (Next.js 14)    │  │  (React Native)  │  │  (Next.js)       │ │
│  │  • Dashboard     │  │  • Operator View │  │  • System Mgmt   │ │
│  │  • Call History  │  │  • Live Calls    │  │  • Customer Mgmt │ │
│  │  • Analytics     │  │  • Notifications │  │  • Monitoring    │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│           │                     │                     │             │
│           └─────────────────────┴─────────────────────┘             │
│                                │                                     │
└────────────────────────────────┼─────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          CDN / EDGE LAYER                            │
│                    (Vercel Edge Network / Cloudflare)                │
│  • Static Assets Caching                                            │
│  • DDoS Protection                                                   │
│  • SSL/TLS Termination                                               │
│  • Geographic Load Balancing                                         │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / LOAD BALANCER                     │
│                         (Vercel / AWS ALB)                           │
│  • Rate Limiting                                                     │
│  • Request Routing                                                   │
│  • Authentication Check                                              │
│  • API Versioning                                                    │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐
│   REST API           │  │   GraphQL API        │  │   WebSocket     │
│   (Node.js/Express)  │  │   (Apollo Server)    │  │   Server        │
│                      │  │                      │  │                 │
│  • User Management   │  │  • Real-time Queries │  │  • Live Calls   │
│  • Call Operations   │  │  • Complex Data      │  │  • Notifications│
│  • AI Configuration  │  │  • Flexible Fetching │  │  • Updates      │
│  • Billing           │  │                      │  │                 │
└──────────┬───────────┘  └──────────┬───────────┘  └────────┬────────┘
           │                         │                        │
           └─────────────────────────┴────────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  Authentication     │  │  Authorization      │  │  Business Logic     │
│  (Clerk / Auth0)    │  │  (RBAC / ABAC)      │  │  Layer              │
│                     │  │                     │  │                     │
│  • JWT Tokens       │  │  • Role Check       │  │  • Call Handling    │
│  • Session Mgmt     │  │  • Permission Gate  │  │  • AI Orchestration │
│  • OAuth 2.0        │  │  • Tenant Isolation │  │  • Billing Logic    │
└─────────────────────┘  └─────────────────────┘  └──────────┬──────────┘
                                                              │
           ┌──────────────────────────────────────────────────┤
           │              │              │              │     │
           ▼              ▼              ▼              ▼     ▼
┌────────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   Database     │ │  Cache   │ │  Queue   │ │  Storage │ │  Search  │
│   (Supabase    │ │  (Redis) │ │(BullMQ)  │ │   (S3)   │ │(Algolia) │
│   PostgreSQL)  │ │          │ │          │ │          │ │          │
│                │ │          │ │          │ │          │ │          │
│ • Multi-tenant │ │ • Session│ │ • Jobs   │ │ • Audio  │ │ • Calls  │
│ • Row-level    │ │ • API    │ │ • Tasks  │ │ • Files  │ │ • FAQs   │
│   Security     │ │   Cache  │ │ • Events │ │ • Exports│ │ • Fast   │
└────────────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES LAYER                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Call Provider│  │   Yandex     │  │   LLM APIs   │             │
│  │ (Vapi/Twilio)│  │  SpeechKit   │  │  (OpenAI)    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Payments   │  │  Monitoring  │  │   n8n        │             │
│  │  (Stripe)    │  │  (Sentry)    │  │  (Workflows) │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Email      │  │  Analytics   │  │   SMS        │             │
│  │  (Resend)    │  │  (PostHog)   │  │  (Eskiz)     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technology Stack

### Frontend

**Web Application:**
```typescript
Framework:     Next.js 14 (App Router)
Language:      TypeScript 5.3
UI Library:    React 18
Styling:       Tailwind CSS 3.4
Components:    shadcn/ui + custom design system
State:         Zustand + React Query (TanStack Query)
Forms:         React Hook Form + Zod validation
Charts:        Recharts / Chart.js
Tables:        TanStack Table
Real-time:     Socket.IO client
```

**Mobile Application:**
```typescript
Framework:     React Native (Expo)
Language:      TypeScript
UI:            React Native Paper + custom components
Navigation:    React Navigation
State:         Zustand
API:           React Query
Push:          Expo Notifications
```

### Backend

**API Layer:**
```typescript
Runtime:       Node.js 20 LTS
Framework:     Express.js 4.18 (REST)
               Apollo Server 4.0 (GraphQL)
Language:      TypeScript 5.3
Validation:    Zod
Documentation: Swagger / OpenAPI 3.0
Testing:       Jest + Supertest
```

**Background Jobs:**
```typescript
Queue:         BullMQ (Redis-backed)
Scheduler:     node-cron
Workers:       Separate worker processes
```

### Database & Storage

**Primary Database:**
```sql
Database:      PostgreSQL 15 (via Supabase)
ORM:           Prisma 5.7
Migrations:    Prisma Migrate
Backups:       Daily automated (Supabase)
Replication:   Read replicas for analytics
```

**Cache:**
```
Cache:         Redis 7.2 (Upstash)
Use Cases:     Session storage, API cache, rate limiting
TTL Strategy:  Varies by data type (5min - 24h)
```

**File Storage:**
```
Storage:       AWS S3 / Cloudflare R2
CDN:           CloudFront / Cloudflare
Use Cases:     Call recordings, exports, user uploads
Retention:     90 days (configurable per tenant)
```

**Search:**
```
Engine:        Algolia / Meilisearch
Indexes:       Calls, knowledge base, users
Update:        Real-time via webhooks
```

### Infrastructure

**Hosting:**
```
Frontend:      Vercel (Edge Network)
Backend API:   Vercel Serverless / Railway
Workers:       Railway / Render
Database:      Supabase (managed PostgreSQL)
```

**Monitoring:**
```
Errors:        Sentry
APM:           Vercel Analytics / Datadog
Logs:          Better Stack / Axiom
Uptime:        Better Uptime / UptimeRobot
```

**CI/CD:**
```
Version Control: GitHub
CI/CD:          GitHub Actions
Preview:        Vercel Preview Deployments
Testing:        Automated on PR
Deployment:     Auto-deploy on merge to main
```

---

## 🗄️ Database Schema (Prisma)

### Core Models

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// TENANT & USER MANAGEMENT
// ============================================

model Organization {
  id                String   @id @default(cuid())
  name              String
  slug              String   @unique
  logo              String?
  
  // Subscription
  plan              Plan     @default(STARTER)
  planStatus        PlanStatus @default(TRIALING)
  trialEndsAt       DateTime?
  subscriptionId    String?  @unique
  
  // Metadata
  industry          String?
  companySize       String?
  country           String   @default("UZ")
  timezone          String   @default("Asia/Tashkent")
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  users             User[]
  phoneNumbers      PhoneNumber[]
  calls             Call[]
  aiConfig          AIConfiguration?
  knowledgeBase     KnowledgeItem[]
  integrations      Integration[]
  
  @@index([slug])
  @@map("organizations")
}

model User {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String
  avatar            String?
  
  // Authentication (managed by Clerk/Auth0)
  authId            String   @unique
  
  // Organization
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  role              Role     @default(MEMBER)
  
  // Preferences
  language          String   @default("ru")
  notificationPrefs Json     @default("{}")
  
  // Status
  isActive          Boolean  @default(true)
  lastSeenAt        DateTime?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  handledCalls      Call[]   @relation("HandledByUser")
  notes             CallNote[]
  
  @@index([organizationId])
  @@index([authId])
  @@map("users")
}

enum Role {
  OWNER
  ADMIN
  MANAGER
  OPERATOR
  VIEWER
}

enum Plan {
  STARTER
  PROFESSIONAL
  BUSINESS
  ENTERPRISE
}

enum PlanStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  PAUSED
}

// ============================================
// PHONE NUMBERS
// ============================================

model PhoneNumber {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  number            String   @unique
  provider          String   // "vapi", "twilio"
  providerId        String
  
  // Configuration
  displayName       String?
  country           String   @default("UZ")
  isActive          Boolean  @default(true)
  
  // Routing
  forwardingNumber  String?
  businessHours     Json     // { monday: { open: "09:00", close: "18:00" }, ... }
  afterHoursAction  String   @default("voicemail") // "voicemail", "forward", "message"
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  calls             Call[]
  
  @@index([organizationId])
  @@map("phone_numbers")
}

// ============================================
// CALLS
// ============================================

model Call {
  id                String   @id @default(cuid())
  
  // Organization
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  // Call identifiers
  callId            String   @unique
  externalCallId    String?  // From call provider
  
  // Phone numbers
  phoneNumberId     String
  phoneNumber       PhoneNumber @relation(fields: [phoneNumberId], references: [id])
  callerNumber      String
  
  // Call metadata
  direction         CallDirection @default(INBOUND)
  status            CallStatus @default(ACTIVE)
  
  // Language & handling
  language          String?  // "RU", "UZ"
  handledBy         HandledBy
  handledByUserId   String?
  handledByUser     User?    @relation("HandledByUser", fields: [handledByUserId], references: [id])
  
  // Outcome
  outcome           CallOutcome?
  outcomeDetails    String?
  
  // Timing
  startedAt         DateTime @default(now())
  endedAt           DateTime?
  durationSeconds   Int?
  
  // Media
  recordingUrl      String?
  recordingDuration Int?
  
  // Conversation
  transcript        Json?    // Array of messages
  
  // AI metrics
  aiConfidence      Float?   // 0-100
  sentiment         String?  // "positive", "neutral", "negative"
  intentDetected    String?
  topics            String[] // ["booking", "pricing", "support"]
  
  // Quality
  callQuality       Int?     // 1-5 stars
  customerFeedback  String?
  
  // Analytics
  transferredAt     DateTime?
  transferReason    String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  events            CallEvent[]
  notes             CallNote[]
  tags              CallTag[]
  
  @@index([organizationId])
  @@index([callId])
  @@index([callerNumber])
  @@index([startedAt])
  @@index([handledBy])
  @@index([outcome])
  @@map("calls")
}

enum CallDirection {
  INBOUND
  OUTBOUND
}

enum CallStatus {
  RINGING
  ACTIVE
  COMPLETED
  FAILED
  MISSED
  CANCELED
}

enum HandledBy {
  AI
  HUMAN
  HYBRID
}

enum CallOutcome {
  INFO
  BOOKING
  TRANSFER
  MISSED
  VOICEMAIL
  COMPLAINT
  OTHER
}

model CallEvent {
  id                String   @id @default(cuid())
  callId            String
  call              Call     @relation(fields: [callId], references: [id], onDelete: Cascade)
  
  eventType         String   // "start", "dtmf", "speech", "transfer", "end"
  eventData         Json
  
  timestamp         DateTime @default(now())
  
  @@index([callId])
  @@index([timestamp])
  @@map("call_events")
}

model CallNote {
  id                String   @id @default(cuid())
  callId            String
  call              Call     @relation(fields: [callId], references: [id], onDelete: Cascade)
  
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  
  content           String
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([callId])
  @@map("call_notes")
}

model CallTag {
  id                String   @id @default(cuid())
  callId            String
  call              Call     @relation(fields: [callId], references: [id], onDelete: Cascade)
  
  tag               String
  
  createdAt         DateTime @default(now())
  
  @@index([callId])
  @@index([tag])
  @@map("call_tags")
}

// ============================================
// AI CONFIGURATION
// ============================================

model AIConfiguration {
  id                String   @id @default(cuid())
  organizationId    String   @unique
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  // Personality
  assistantName     String   @default("Ассистент")
  tone              String   @default("professional")
  speakingStyle     String   @default("balanced")
  
  // Messages
  greetingMessage   String
  closingMessage    String
  
  // Transfer rules
  transferRules     Json     // Confidence threshold, duration, etc.
  transferDestination String?
  
  // Safety
  safetyRules       Json     // Forbidden topics, required disclaimers
  
  // Performance
  enableSentiment   Boolean  @default(true)
  enableIntent      Boolean  @default(true)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@map("ai_configurations")
}

model KnowledgeItem {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  category          String
  question          String
  answer            String
  
  // Alternatives
  questionVariations String[]
  
  // Usage
  usageCount        Int      @default(0)
  lastUsedAt        DateTime?
  
  // Priority
  isPriority        Boolean  @default(false)
  requiresFollowup  Boolean  @default(false)
  
  isActive          Boolean  @default(true)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([organizationId])
  @@index([category])
  @@fulltext([question, answer])
  @@map("knowledge_items")
}

// ============================================
// BILLING
// ============================================

model Subscription {
  id                String   @id @default(cuid())
  organizationId    String   @unique
  
  stripeSubscriptionId String? @unique
  stripeCustomerId  String?
  
  plan              Plan
  status            PlanStatus
  
  currentPeriodStart DateTime
  currentPeriodEnd  DateTime
  cancelAtPeriodEnd Boolean  @default(false)
  canceledAt        DateTime?
  
  trialStart        DateTime?
  trialEnd          DateTime?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@map("subscriptions")
}

model Invoice {
  id                String   @id @default(cuid())
  organizationId    String
  
  stripeInvoiceId   String   @unique
  
  amount            Int      // in cents
  currency          String   @default("USD")
  status            String
  
  invoiceUrl        String?
  invoicePdf        String?
  
  periodStart       DateTime
  periodEnd         DateTime
  dueDate           DateTime?
  paidAt            DateTime?
  
  createdAt         DateTime @default(now())
  
  @@index([organizationId])
  @@map("invoices")
}

model UsageRecord {
  id                String   @id @default(cuid())
  organizationId    String
  
  metricType        String   // "minutes", "calls", "sms"
  quantity          Int
  
  date              DateTime
  
  createdAt         DateTime @default(now())
  
  @@index([organizationId, date])
  @@map("usage_records")
}

// ============================================
// INTEGRATIONS
// ============================================

model Integration {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  type              String   // "bitrix24", "whatsapp", "telegram", "webhook"
  name              String
  
  config            Json     // Integration-specific configuration
  credentials       Json     // Encrypted credentials
  
  isActive          Boolean  @default(true)
  lastSyncAt        DateTime?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([organizationId])
  @@map("integrations")
}

// ============================================
// ANALYTICS
// ============================================

model DailyStats {
  id                String   @id @default(cuid())
  organizationId    String
  date              DateTime @db.Date
  
  totalCalls        Int
  aiHandledCalls    Int
  humanTransfers    Int
  bookings          Int
  missedCalls       Int
  
  russianCalls      Int
  uzbekCalls        Int
  
  totalMinutes      Int
  avgDuration       Int
  
  avgSatisfaction   Float?
  
  createdAt         DateTime @default(now())
  
  @@unique([organizationId, date])
  @@index([organizationId])
  @@index([date])
  @@map("daily_stats")
}
```

---

This provides the complete database schema. Next, I'll create the API specifications!
