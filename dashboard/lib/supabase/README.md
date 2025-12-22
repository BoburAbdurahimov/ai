
# Supabase Integration

Complete Supabase integration with PostgreSQL, Auth, and Storage.

---

## 📁 Files

### Core
- `client.ts` - Supabase client configuration + TypeScript types
- `database.ts` - Database service layer (CRUD operations)
- `storage.ts` - Storage service for backup files
- `auth.ts` - Authentication helpers

---

## 🗄️ Database Schema

### Tables

**backups**
- Tracks all backup operations
- Metadata: size, type, components, timing
- User tracking: created_by
- Auto-expiration: expires_at, auto_delete

**restore_operations**
- Tracks restore operations
- Results: tables/records/files restored
- Duration tracking
- Error logging

**backup_schedules**
- Cron-based schedules
- Retention policies
- Last/next run tracking
- Failure counting

**audit_logs**
- Immutable audit trail
- User actions tracked
- IP and user agent
- Old/new values for updates

**storage_metadata**
- File tracking in Supabase Storage
- Checksums (MD5, SHA256)
- Access tracking
- Size information

**system_settings**
- Key-value configuration
- System-wide settings
- Update tracking

### Views

**backup_stats**
- Daily statistics by type
- Success/failure counts
- Average duration
- Total size

**recent_activity**
- Last 100 operations
- Combined backup + restore
- User email included

---

## 🔐 Row Level Security (RLS)

### Enabled on All Tables
- ✅ Users can only see their own data
- ✅ Admins can see everything
- ✅ Audit logs are immutable
- ✅ System settings readable by all

### Storage Policies
- ✅ Users upload to their own folder (`userId/backupId/file`)
- ✅ Users can only access their own files
- ✅ Admins can access all files
- ✅ Signed URLs for secure downloads

---

## 🚀 Usage Examples

### Database Operations

```typescript
import { createBackupRecord, listBackups, getUserBackupSummary } from '@/lib/supabase/database';

// Create backup record
const backup = await createBackupRecord({
  backup_name: 'backup_2025-12-22_15-00-00',
  backup_path: '/path/to/backup',
  backup_type: 'full',
  status: 'completed',
  size_bytes: 2560000,
  compressed: true,
  components: ['database', 'config'],
  metadata: { tables: 2, records: 1247 },
  created_by: userId,
});

// List user's backups
const { data, count } = await listBackups({
  userId: 'user-uuid',
  type: 'full',
  limit: 10,
});

// Get summary
const summary = await getUserBackupSummary(userId);
console.log(`Total: ${summary.total}, Size: ${summary.total_size_bytes}`);
```

### Storage Operations

```typescript
import { uploadBackupFile, downloadBackupFile, getSignedUrl } from '@/lib/supabase/storage';

// Upload file
const result = await uploadBackupFile(
  '/local/path/backup.tar.gz',
  'backup_2025-12-22.tar.gz',
  {
    userId: 'user-uuid',
    backupId: 'backup-uuid',
    contentType: 'application/gzip',
  }
);

console.log('Uploaded:', result.path);
console.log('MD5:', result.metadata.md5);

// Get signed URL for download
const { url } = await getSignedUrl(result.path, 3600); // 1 hour
console.log('Download URL:', url);

// Download file
const { data } = await downloadBackupFile(result.path);
// data is a Blob
```

### Authentication

```typescript
import { getAuthUser, requireAuth, requireAdmin, hasPermission } from '@/lib/supabase/auth';

// In API route
export const GET = asyncHandler(async (request: NextRequest) => {
  // Get user (optional)
  const user = await getAuthUser(request);
  
  // Require authentication
  const user = await requireAuth(request);
  
  // Require admin
  const admin = await requireAdmin(request);
  
  // Check permission
  if (!hasPermission(user, 'backup:create')) {
    throw new ForbiddenError();
  }
  
  // ... your logic
});
```

### User Management

```typescript
import { createUser, updateUserRole, listUsers } from '@/lib/supabase/auth';

// Create admin user
const admin = await createUser(
  'admin@example.com',
  'secure-password',
  'admin',
  { name: 'Admin User' }
);

// Promote user to admin
await updateUserRole(userId, 'admin');

// List all users
const users = await listUsers(1, 50);
```

---

## 🔧 Migration

### Run Migrations

```bash
# Using Supabase CLI
supabase db push

# Or execute SQL manually in Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Run migrations/002_backup_management_tables.sql
# 3. Run migrations/003_row_level_security.sql
```

### Migration Files

1. `001_initial_schema.sql` - Original calls tables (already exists)
2. `002_backup_management_tables.sql` - Backup tables, views, functions
3. `003_row_level_security.sql` - RLS policies + storage bucket

---

## 🔒 Security Features

### Row Level Security
- ✅ Users isolated by default
- ✅ Admin role checks
- ✅ Immutable audit logs
- ✅ Secure file access

### Storage Security
- ✅ Signed URLs (time-limited)
- ✅ User-specific folders
- ✅ Checksum verification
- ✅ Access tracking

### Authentication
- ✅ JWT-based auth
- ✅ Role-based access (admin/user)
- ✅ Password reset links
- ✅ Magic links (passwordless)
- ✅ Email verification
- ✅ User banning

---

## 📊 Analytics

### Backup Statistics

```typescript
import { getBackupStats, getRecentActivity } from '@/lib/supabase/database';

// Get daily stats
const stats = await getBackupStats({
  startDate: '2025-12-01',
  endDate: '2025-12-31',
});

stats.forEach(day => {
  console.log(`${day.backup_date}: ${day.total_backups} backups (${day.successful_backups} successful)`);
});

// Get recent activity
const activity = await getRecentActivity(50);
```

### Storage Usage

```typescript
import { getUserStorageUsage } from '@/lib/supabase/storage';

const { usage } = await getUserStorageUsage(userId);
console.log(`Files: ${usage.files}, Size: ${usage.bytes / 1024 / 1024} MB`);
```

---

## 🧹 Cleanup

### Automatic Cleanup

```typescript
import { cleanupExpiredBackups } from '@/lib/supabase/storage';

// Run daily via cron
const { deleted } = await cleanupExpiredBackups();
console.log(`Deleted ${deleted} expired backups`);
```

### Set Expiration

```typescript
import { updateBackupRecord } from '@/lib/supabase/database';

// Set backup to expire in 30 days
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 30);

await updateBackupRecord(backupId, {
  expires_at: expiresAt.toISOString(),
  auto_delete: true,
});
```

---

## 🎯 Best Practices

### 1. Always Use Service Layer
```typescript
// ✅ Good - use service layer
import { createBackupRecord } from '@/lib/supabase/database';
const backup = await createBackupRecord(data);

// ❌ Bad - direct Supabase client
import { supabaseAdmin } from '@/lib/supabase/client';
const { data } = await supabaseAdmin.from('backups').insert(data);
```

### 2. Handle Errors Properly
```typescript
try {
  const backup = await createBackupRecord(data);
} catch (error) {
  logger.error('Failed to create backup record', error);
  throw new ApiError(500, 'Database error');
}
```

### 3. Use TypeScript Types
```typescript
import type { Database } from '@/lib/supabase/client';

type BackupRow = Database['public']['Tables']['backups']['Row'];
```

### 4. Verify Checksums
```typescript
const result = await uploadBackupFile(path, name, options);

// Later, when downloading, verify:
const downloaded = await downloadBackupFile(result.path);
const hash = createHash('md5').update(downloaded).digest('hex');

if (hash !== result.metadata.md5) {
  throw new Error('Checksum mismatch - file corrupted!');
}
```

---

## 📝 Environment Variables

Required in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...  # Secret - server-side only
```

---

## 🔗 Related

- [Supabase Docs](https://supabase.com/docs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [Auth Guide](https://supabase.com/docs/guides/auth)

---

**Complete PostgreSQL + Auth + Storage integration ready!** ✅
