# Backup Management Dashboard - Architecture Proposal

## Overview

Build a web dashboard that provides visual backup management while leveraging the existing CLI infrastructure for backend operations.

---

## Architecture Stack

### Frontend (Next.js/React)
```
dashboard/
├── pages/
│   ├── index.tsx                 # Dashboard home
│   ├── backups/
│   │   ├── index.tsx            # Backups list view
│   │   ├── [id].tsx             # Backup details
│   │   └── restore.tsx          # Restore wizard
│   └── api/                     # Next.js API routes
│       ├── backups/
│       │   ├── list.ts          # GET /api/backups/list
│       │   ├── create.ts        # POST /api/backups/create
│       │   ├── [id]/restore.ts  # POST /api/backups/[id]/restore
│       │   └── [id]/details.ts  # GET /api/backups/[id]/details
│       └── status/
│           └── health.ts        # GET /api/status/health
├── components/
│   ├── BackupList.tsx           # Backup cards/table
│   ├── RestoreWizard.tsx        # Step-by-step restore
│   ├── StatusWidget.tsx         # System health widget
│   └── BackupScheduler.tsx      # Schedule management
└── lib/
    ├── cli-wrapper.ts           # Wrapper for CLI commands
    └── api-client.ts            # Frontend API client
```

### Backend Strategy (Hybrid)

**Option A: CLI-as-a-Service** (Recommended for MVP)
```
Web Dashboard → Next.js API Routes → CLI Commands → Supabase/Vercel
```

**Option B: Shared Module Architecture** (Better long-term)
```
Web Dashboard → Next.js API Routes → Shared Modules → Supabase/Vercel
CLI Tool      ────────────────────→ Shared Modules → Supabase/Vercel
```

### Database Schema Extension

Add to `supabase/schema.sql`:

```sql
-- Backup metadata table
CREATE TABLE IF NOT EXISTS backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255), -- user email/id
  backup_type VARCHAR(20) CHECK (backup_type IN ('full', 'database', 'config', 'scheduled')),
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  size_bytes BIGINT,
  components JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  compressed BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_backups_created_at ON backups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backups_status ON backups(status);

-- Restore operations log
CREATE TABLE IF NOT EXISTS restore_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_id UUID REFERENCES backups(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  initiated_by VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
  restore_type VARCHAR(20) CHECK (restore_type IN ('full', 'database', 'config')),
  result JSONB DEFAULT '{}'::jsonb,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_restore_operations_backup_id ON restore_operations(backup_id);
CREATE INDEX IF NOT EXISTS idx_restore_operations_started_at ON restore_operations(started_at DESC);

-- Scheduled backups
CREATE TABLE IF NOT EXISTS backup_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  cron_expression VARCHAR(100) NOT NULL,
  backup_type VARCHAR(20) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  compress BOOLEAN DEFAULT TRUE,
  retention_days INTEGER DEFAULT 30,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## UI/UX Design Specification

### 1. Dashboard Home Page

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 AI Call Center - Backup Management                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  System Status                                    🟢 Healthy │
│  ┌──────────────┬──────────────┬──────────────┬──────────┐ │
│  │ Database     │ Configuration│ Deployment   │ Services │ │
│  │ 🟢 Connected │ 🟢 Complete  │ 🟢 Running   │ 🟢 4/4   │ │
│  │ 1,247 records│ All vars set │ Vercel       │ All OK   │ │
│  └──────────────┴──────────────┴──────────────┴──────────┘ │
│                                                              │
│  Quick Actions                                               │
│  [📦 Create Backup]  [🔄 View Backups]  [⚙️ Schedule]       │
│                                                              │
│  Recent Backups                          [View All →]        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📦 backup_2025-12-22_14-30-00        2.45 MB        │   │
│  │    Full backup • 2 hours ago                        │   │
│  │    [View] [Restore] [Download]                      │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ 📦 backup_2025-12-22_02-00-00        2.38 MB        │   │
│  │    Scheduled • 14 hours ago                         │   │
│  │    [View] [Restore] [Download]                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Scheduled Backups                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🕐 Daily Backup (2:00 AM) • Next: 10 hours          │   │
│  │ 🕐 Pre-Deploy Backup • Manual trigger only          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2. Backups List Page

**Features:**
- Filterable table/grid view
- Sort by date, size, type
- Bulk actions (delete, download)
- Search by date range
- Visual indicators for backup health

```typescript
// Backup card component
interface BackupCardProps {
  id: string;
  name: string;
  createdAt: Date;
  size: string;
  type: 'full' | 'database' | 'config';
  status: 'completed' | 'failed';
  components: string[];
}
```

### 3. Restore Wizard (Step-by-step)

**Step 1: Select Backup**
```
Select a backup to restore
┌─────────────────────────────────────────┐
│ ○ backup_2025-12-22_14-30-00           │
│   Full backup • 2.45 MB • 2 hours ago   │
├─────────────────────────────────────────┤
│ ○ backup_2025-12-22_02-00-00           │
│   Scheduled • 2.38 MB • 14 hours ago    │
└─────────────────────────────────────────┘
[Cancel] [Next →]
```

**Step 2: Choose Components**
```
What do you want to restore?
☑ Database (1,247 records)
☑ Configuration (3 files)
☑ Deployment state

[← Back] [Next →]
```

**Step 3: Confirmation**
```
⚠️ Warning: This will overwrite existing data

Review your restore:
• Backup: backup_2025-12-22_14-30-00
• Created: 2 hours ago (Dec 22, 2025 2:30 PM)
• Components: Database, Configuration, Deployment
• Records to restore: 1,247

☑ I understand this action cannot be undone

[← Back] [Restore Now]
```

**Step 4: Progress**
```
Restoring backup...

✓ Validating backup
✓ Restoring database (1,247 records)
⏳ Restoring configuration...
⏸ Restoring deployment state

[Cancel Restore]
```

**Step 5: Success**
```
✅ Restore completed successfully!

Summary:
• Database: 1,247 records restored
• Configuration: 3 files restored
• Deployment: State updated

Next steps:
1. Verify data integrity
2. Test critical functionality
3. Monitor system status

[View System Status] [Done]
```

### 4. Backup Details Page

```
Backup: backup_2025-12-22_14-30-00

Overview
• Created: Dec 22, 2025 at 2:30 PM (2 hours ago)
• Size: 2.45 MB (compressed)
• Type: Full backup
• Created by: admin@example.com
• Status: ✓ Completed

Components
┌──────────────┬──────────┬──────────────┐
│ Database     │ 2.1 MB   │ 1,247 records│
│ Configuration│ 0.35 MB  │ 3 files      │
│ Deployment   │ 0.05 MB  │ Metadata     │
└──────────────┴──────────┴──────────────┘

Database Tables
• calls: 1,145 records
• call_events: 102 records

Configuration Files
• .env (REDACTED)
• vercel.json
• package.json

Actions
[🔄 Restore This Backup] [📥 Download] [🗑️ Delete]

Restore History
• Last restored: Never
• Total restores: 0
```

---

## API Endpoints Design

### GET `/api/backups/list`
```typescript
interface BackupListResponse {
  backups: Array<{
    id: string;
    name: string;
    path: string;
    createdAt: string;
    size: number;
    sizeFormatted: string;
    type: 'full' | 'database' | 'config';
    status: 'completed' | 'failed';
    components: string[];
    metadata: {
      tables?: number;
      records?: number;
      files?: number;
    };
  }>;
  total: number;
}
```

### POST `/api/backups/create`
```typescript
interface CreateBackupRequest {
  type: 'full' | 'database' | 'config';
  compress?: boolean;
  name?: string;
}

interface CreateBackupResponse {
  id: string;
  status: 'in_progress' | 'completed';
  path: string;
  jobId?: string; // For async operations
}
```

### POST `/api/backups/[id]/restore`
```typescript
interface RestoreRequest {
  components: Array<'database' | 'config' | 'deployment'>;
  force?: boolean;
}

interface RestoreResponse {
  operationId: string;
  status: 'in_progress';
  estimatedTime: number; // seconds
}
```

### GET `/api/backups/[id]/restore/status`
```typescript
interface RestoreStatusResponse {
  operationId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: {
    current: number;
    total: number;
    step: string;
  };
  result?: {
    tablesRestored?: number;
    recordsRestored?: number;
    filesRestored?: number;
  };
  error?: string;
}
```

### GET `/api/status/health`
```typescript
interface HealthResponse {
  database: {
    connected: boolean;
    tables: number;
    records: number;
    lastUpdate: string;
  };
  config: {
    complete: boolean;
    missing: string[];
  };
  deployment: {
    healthy: boolean;
    status: string;
    url: string;
  };
  services: {
    [key: string]: {
      status: 'ok' | 'error';
      message: string;
    };
  };
}
```

---

## Implementation Approach

### Phase 1: Foundation (Week 1)
1. Set up Next.js project with TypeScript
2. Create database schema extensions
3. Build CLI wrapper library
4. Implement basic API routes

### Phase 2: Core Features (Week 2)
1. Dashboard home page with system status
2. Backups list view
3. Backup creation UI
4. Basic restore functionality

### Phase 3: Advanced Features (Week 3)
1. Multi-step restore wizard
2. Real-time progress tracking (WebSockets/SSE)
3. Backup scheduling UI
4. Search and filtering

### Phase 4: Polish (Week 4)
1. Error handling and edge cases
2. Responsive design
3. Loading states and animations
4. Documentation

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand or React Query
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Server-Sent Events (SSE) for progress

### Backend
- **API**: Next.js API Routes
- **Database**: Supabase (existing)
- **File Storage**: Vercel Blob or S3
- **Background Jobs**: Vercel Cron or Bull Queue
- **CLI Integration**: Child process wrapper

### DevOps
- **Deployment**: Vercel
- **Monitoring**: Sentry
- **Analytics**: PostHog or Vercel Analytics

---

## Security Considerations

1. **Authentication**: Clerk or NextAuth.js
2. **Authorization**: RBAC (admin-only access)
3. **API Security**: Rate limiting, CSRF tokens
4. **File Security**: Signed URLs for downloads
5. **Audit Logging**: All backup/restore operations

---

## Cost Optimization

### CLI Operations (Serverless Functions)
- Backup/restore as long-running functions
- Consider moving to dedicated service if >10min

### Storage
- Implement retention policies
- Auto-delete old backups
- Compress backups by default

### Database
- Pagination for large result sets
- Efficient queries with proper indexes

---

## Future Enhancements

1. **Point-in-Time Recovery**: Restore to specific timestamp
2. **Incremental Backups**: Only backup changes
3. **Backup Testing**: Automated restore validation
4. **Multi-Region**: Geographic redundancy
5. **Backup Comparison**: Diff between backups
6. **Notifications**: Email/Slack on backup completion
7. **Metrics Dashboard**: Backup trends, success rates
8. **Export Options**: CSV, JSON export of backup metadata

---

## Success Metrics

- **Reliability**: 99.9% backup success rate
- **Performance**: <30s for backup creation
- **User Experience**: <5 clicks to restore
- **Adoption**: 80% of users use dashboard vs CLI

---

This architecture provides a solid foundation while keeping the CLI as the powerful admin tool it is.
