# Backend Architecture Documentation

Complete guide to the backend system architecture, API design, and implementation.

---

## 📐 Architecture Overview

### System Layers

```
┌─────────────────────────────────────────┐
│         Frontend (React/Next.js)        │
└─────────────┬───────────────────────────┘
              │ HTTP/REST
              ▼
┌─────────────────────────────────────────┐
│      API Layer (Next.js Routes)         │
│  • Rate Limiting                        │
│  • Authentication                       │
│  • Validation                           │
│  • Error Handling                       │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│       Business Logic Layer              │
│  • CLI Wrapper                          │
│  • Cache Management                     │
│  • Job Scheduling                       │
│  • Webhooks                             │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         Data/Service Layer              │
│  • CLI Commands                         │
│  • Supabase Database                    │
│  • File System                          │
│  • External Services                    │
└─────────────────────────────────────────┘
```

---

## 🛠️ Middleware System

### 1. Rate Limiting (`lib/middleware/rate-limit.ts`)

**Purpose:** Prevent API abuse and ensure fair usage

**Implementation:**
```typescript
import { limiters } from '@/lib/middleware/rate-limit';

// In API route
await limiters.default.check(10, clientId); // 10 req/min
```

**Limiters Available:**
- `default` - 10 requests per minute (standard operations)
- `strict` - 3 requests per minute (expensive operations like backup/restore)
- `lenient` - 60 requests per minute (read-only operations)

**How It Works:**
- Uses LRU Cache with TTL
- Tracks requests by client IP
- Returns 429 when limit exceeded
- Automatic cleanup of expired entries

### 2. Authentication (`lib/middleware/auth.ts`)

**Purpose:** Verify user identity and permissions

**Current State:** Mock implementation ready for integration

**Integration Points:**
```typescript
// Option 1: Clerk
import { auth } from '@clerk/nextjs';

// Option 2: NextAuth
import { getServerSession } from 'next-auth';

// Option 3: Custom API Key
const apiKey = request.headers.get('x-api-key');
```

**Permissions System:**
```typescript
const permissions = [
  'backup:create',
  'backup:restore',
  'backup:delete',
  'system:status',
];
```

### 3. Error Handling (`lib/middleware/error-handler.ts`)

**Purpose:** Centralized, consistent error responses

**Error Classes:**
- `ApiError` - Base error (custom status code)
- `ValidationError` - 400 Bad Request
- `UnauthorizedError` - 401 Unauthorized
- `ForbiddenError` - 403 Forbidden
- `NotFoundError` - 404 Not Found
- `RateLimitError` - 429 Too Many Requests

**Usage:**
```typescript
import { asyncHandler, ValidationError } from '@/lib/middleware/error-handler';

export const POST = asyncHandler(async (request) => {
  if (!data.name) {
    throw new ValidationError('Name is required');
  }
  // ... your logic
});
```

**Error Response Format:**
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "fields": {
    "name": "Name is required"
  }
}
```

---

## 📝 Logging System (`lib/logger.ts`)

### Features

- **Structured Logging** - JSON format for easy parsing
- **Multiple Levels** - debug, info, warn, error
- **Contextual Data** - Add metadata to logs
- **Color-Coded** - Terminal output with colors
- **Production Ready** - Integrates with logging services

### Usage

```typescript
import { logger } from '@/lib/logger';

// Basic logging
logger.info('User logged in');
logger.error('Database connection failed', error);

// With context
logger.info('Backup created', {
  backupId: 'backup_123',
  size: '2.5MB',
  duration: '15s',
});

// Specialized loggers
logger.api('GET', '/api/backups', 200, 150);
logger.backup('created', 'backup_123', { records: 1247 });
logger.restore('backup_123', 'completed', { tablesRestored: 2 });
```

### Log Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| `debug` | Development debugging | Variable values, flow control |
| `info` | Normal operations | User actions, system events |
| `warn` | Potential issues | Deprecated features, fallbacks |
| `error` | Failures | Exceptions, failed operations |

---

## 💾 Caching System (`lib/cache.ts`)

### Features

- **In-Memory Cache** - Fast access
- **TTL Support** - Automatic expiration
- **LRU Eviction** - Manages memory usage
- **Cache-Aside Pattern** - `getOrSet` helper

### Pre-configured Caches

```typescript
import { caches, cacheKeys } from '@/lib/cache';

// Short cache (1 minute) - frequently changing data
await caches.short.getOrSet(
  cacheKeys.backupList(),
  async () => await listBackups()
);

// Medium cache (5 minutes) - relatively stable data
await caches.medium.getOrSet(
  cacheKeys.systemStatus(),
  async () => await getStatus()
);

// Long cache (1 hour) - rarely changing data
await caches.long.getOrSet(
  'config',
  async () => await getConfig()
);
```

### Cache Keys

```typescript
cacheKeys.backupList()           // 'backups:list'
cacheKeys.backupDetails(id)      // 'backup:123'
cacheKeys.systemStatus()         // 'system:status'
cacheKeys.stats()                // 'system:stats'
```

### Cache Invalidation

```typescript
// Invalidate after creating backup
cache.delete(cacheKeys.backupList());
cache.delete(cacheKeys.stats());

// Clear all
cache.clear();
```

---

## 🔄 Background Jobs (`lib/jobs/backup-scheduler.ts`)

### Scheduler Features

- **Cron-based** - Familiar scheduling syntax
- **Job Management** - Start, stop, list jobs
- **Error Handling** - Automatic retry and logging
- **Persistent State** - Tracks last/next run times

### Default Jobs

**Daily Backup** (2 AM)
```typescript
{
  id: 'daily-backup',
  cron: '0 2 * * *',
  handler: async () => {
    await createBackup({ compress: true });
  }
}
```

**Weekly Database Backup** (Sunday 3 AM)
```typescript
{
  id: 'weekly-db-backup',
  cron: '0 3 * * 0',
  handler: async () => {
    await createBackup({ dbOnly: true, compress: true });
  }
}
```

### Usage

```typescript
import { scheduler, initializeDefaultJobs } from '@/lib/jobs/backup-scheduler';

// Initialize default jobs
initializeDefaultJobs();

// Add custom job
scheduler.addJob({
  id: 'hourly-status-check',
  name: 'Hourly Status Check',
  cron: '0 * * * *',
  enabled: true,
  handler: async () => {
    const status = await getStatus();
    if (!status.database.connected) {
      await sendAlert('Database disconnected!');
    }
  },
});

// Manage jobs
scheduler.startJob('daily-backup');
scheduler.stopJob('daily-backup');
scheduler.removeJob('daily-backup');
scheduler.listJobs();
```

---

## 🔌 Webhooks (`app/api/webhooks/`)

### Backup Complete Webhook

**Endpoint:** `POST /api/webhooks/backup-complete`

**Purpose:** Receive notifications when backups complete

**Security:**
```typescript
// Verify webhook signature
const signature = request.headers.get('x-webhook-signature');
if (signature !== process.env.WEBHOOK_SECRET) {
  throw new UnauthorizedError();
}
```

**Payload:**
```json
{
  "backupId": "backup_2025-12-22_14-30-00",
  "status": "completed",
  "metadata": {
    "tables": 2,
    "records": 1247,
    "duration": "15s"
  }
}
```

**Actions Triggered:**
- Send notifications (Email, Slack, Discord)
- Update statistics
- Cleanup old backups
- Log event

### Integration Examples

**Slack Notification:**
```typescript
await fetch(process.env.SLACK_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: `✅ Backup completed: ${backupId}`,
    attachments: [{
      color: 'good',
      fields: [
        { title: 'Tables', value: metadata.tables },
        { title: 'Records', value: metadata.records },
      ]
    }]
  })
});
```

**Discord Notification:**
```typescript
await fetch(process.env.DISCORD_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    embeds: [{
      title: '✅ Backup Completed',
      description: `Backup ${backupId} completed successfully`,
      color: 0x00ff00,
      fields: [
        { name: 'Tables', value: metadata.tables.toString() },
        { name: 'Records', value: metadata.records.toString() },
      ],
      timestamp: new Date().toISOString(),
    }]
  })
});
```

---

## ✅ Input Validation (`lib/validators.ts`)

### Validators Available

**Backup Type:**
```typescript
validateBackupType(type); // 'full' | 'database' | 'config'
```

**Backup ID:**
```typescript
validateBackupId(id); // Checks format and prevents path traversal
```

**Components:**
```typescript
validateComponents(['database', 'config']); // Validates restore components
```

**Cron Expression:**
```typescript
validateCron('0 2 * * *'); // Validates cron syntax
```

**Pagination:**
```typescript
const { page, limit } = validatePagination({ page: '1', limit: '10' });
```

**Email:**
```typescript
validateEmail('user@example.com'); // Returns lowercased email
```

**Retention Days:**
```typescript
validateRetentionDays(30); // 1-365 days
```

### Security Features

- **Path Traversal Prevention** - Blocks `../` and `/`
- **Format Validation** - Regex patterns for IDs
- **Type Checking** - Ensures correct data types
- **Range Validation** - Min/max constraints
- **Sanitization** - Removes dangerous characters

---

## 📡 API Routes

### Backup Management

| Endpoint | Method | Description | Rate Limit |
|----------|--------|-------------|------------|
| `/api/backups/list` | GET | List all backups | 60/min |
| `/api/backups/create` | POST | Create new backup | 3/min |
| `/api/backups/[id]/restore` | POST | Restore from backup | 3/min |
| `/api/backups/[id]/details` | GET | Get backup details | 60/min |
| `/api/backups/stats` | GET | Backup statistics | 60/min |
| `/api/backups/schedule` | GET/POST/PUT/DELETE | Manage schedules | 10/min |

### System Monitoring

| Endpoint | Method | Description | Rate Limit |
|----------|--------|-------------|------------|
| `/api/status/health` | GET | System health check | 60/min |

### Webhooks

| Endpoint | Method | Description | Rate Limit |
|----------|--------|-------------|------------|
| `/api/webhooks/backup-complete` | POST | Backup completion | None |

---

## 🔒 Security Best Practices

### Implemented

✅ **Rate Limiting** - Prevents brute force and abuse  
✅ **Input Validation** - Prevents injection attacks  
✅ **Error Handling** - No sensitive info leaked  
✅ **Logging** - Audit trail of all operations  
✅ **Path Sanitization** - Prevents directory traversal  

### Ready to Add

🔜 **Authentication** - Clerk/NextAuth integration ready  
🔜 **API Keys** - Header-based authentication  
🔜 **CORS** - Cross-origin request control  
🔜 **HTTPS Only** - Force secure connections  
🔜 **Encryption** - At-rest backup encryption  

---

## 🚀 Performance Optimization

### Implemented

✅ **Caching** - Reduces redundant CLI calls  
✅ **Rate Limiting** - Protects server resources  
✅ **Async Operations** - Non-blocking I/O  
✅ **Error Boundaries** - Prevents cascade failures  

### Recommendations

📊 **Database Connection Pooling**  
📊 **CDN for Static Assets**  
📊 **Compression** (gzip/brotli)  
📊 **Background Job Queue** (Bull/BullMQ)  
📊 **Horizontal Scaling** (Vercel auto-scales)  

---

## 📊 Monitoring & Observability

### Logging Integration Points

```typescript
// Sentry (Error Tracking)
import * as Sentry from '@sentry/nextjs';
Sentry.captureException(error);

// Datadog (APM)
import tracer from 'dd-trace';
tracer.trace('backup.create', () => {});

// LogRocket (Session Replay)
import LogRocket from 'logrocket';
LogRocket.track('BackupCreated', { backupId });
```

### Metrics to Track

- **API Response Times** - Target < 200ms
- **Backup Success Rate** - Target > 99%
- **Cache Hit Ratio** - Target > 70%
- **Error Rate** - Target < 1%
- **Job Success Rate** - Target > 99.5%

---

## 🧪 Testing Recommendations

### Unit Tests
```typescript
// Test validators
describe('validateBackupType', () => {
  it('should accept valid types', () => {
    expect(validateBackupType('full')).toBe('full');
  });
  
  it('should reject invalid types', () => {
    expect(() => validateBackupType('invalid')).toThrow();
  });
});
```

### Integration Tests
```typescript
// Test API routes
describe('POST /api/backups/create', () => {
  it('should create backup', async () => {
    const res = await fetch('/api/backups/create', {
      method: 'POST',
      body: JSON.stringify({ type: 'full' }),
    });
    expect(res.status).toBe(200);
  });
});
```

### Load Tests
```bash
# Apache Bench
ab -n 1000 -c 10 http://localhost:3000/api/status/health

# Artillery
artillery quick --count 10 --num 100 http://localhost:3000/api/backups/list
```

---

## 📚 Next Steps

### Phase 1: Production Hardening
- [ ] Add authentication (Clerk/NextAuth)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CDN
- [ ] Enable compression

### Phase 2: Advanced Features
- [ ] Implement email notifications
- [ ] Add Slack/Discord integration
- [ ] Build analytics dashboard
- [ ] Add backup comparison

### Phase 3: Enterprise Features
- [ ] Multi-tenancy support
- [ ] RBAC (Role-Based Access Control)
- [ ] Audit logs
- [ ] Compliance reports

---

For API usage examples, see `API_EXAMPLES.md`  
For deployment guide, see `DEPLOYMENT.md`
