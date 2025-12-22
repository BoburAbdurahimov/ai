# Supabase Setup Guide

Complete step-by-step guide to set up Supabase for your backup management system.

---

## 📋 Prerequisites

- Supabase account (free tier works)
- Project created in Supabase Dashboard
- Basic SQL knowledge (optional)

---

## 🚀 Quick Setup (10 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in / Sign up
3. Click "New Project"
4. Fill in:
   - Name: `backup-management`
   - Database Password: (generate strong password)
   - Region: (choose closest to you)
5. Click "Create new project" (takes ~2 minutes)

### Step 2: Run Database Migrations

**Option A: Supabase Dashboard (Recommended)**

1. Go to your project → **SQL Editor**
2. Click "New Query"
3. Copy contents of `migrations/002_backup_management_tables.sql`
4. Paste and click **"Run"**
5. Wait for "Success" message
6. Repeat for `migrations/003_row_level_security.sql`

**Option B: Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 3: Get API Keys

1. Go to **Settings** → **API**
2. Copy the following:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_KEY` ⚠️ **Secret!**

### Step 4: Configure Environment

Update `dashboard/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click "Create a new bucket"
3. Bucket name: `backups`
4. Public bucket: **NO** (keep private)
5. Click "Create bucket"

### Step 6: Verify Setup

```bash
cd dashboard
npm run dev
```

Visit http://localhost:3000 and check:
- ✅ No Supabase connection errors in console
- ✅ Can create backups (saves to database)
- ✅ Can list backups (reads from database)

---

## 🗄️ Database Schema Overview

### Tables Created

| Table | Purpose | Records |
|-------|---------|---------|
| `backups` | Backup metadata | All backups |
| `restore_operations` | Restore tracking | All restores |
| `backup_schedules` | Cron schedules | Active schedules |
| `audit_logs` | Audit trail | All actions |
| `storage_metadata` | File tracking | Uploaded files |
| `system_settings` | Config | Key-value pairs |

### Views Created

| View | Purpose |
|------|---------|
| `backup_stats` | Daily statistics |
| `recent_activity` | Last 100 operations |

---

## 🔐 Authentication Setup

### Create Admin User

**Option A: Supabase Dashboard**

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Email: `admin@yourcompany.com`
4. Password: (generate strong password)
5. Click "Create user"
6. Click on user → **User Metadata** → Add:
   ```json
   {
     "role": "admin"
   }
   ```

**Option B: SQL**

```sql
-- In SQL Editor
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
) VALUES (
  'admin@yourcompany.com',
  crypt('your-secure-password', gen_salt('bf')),
  NOW(),
  '{"role": "admin"}'::jsonb
);
```

### Create Regular User

Same process, but set `role` to `user` in metadata:

```json
{
  "role": "user"
}
```

---

## 📦 Storage Configuration

### Bucket Policies (Already Applied)

The migration creates these policies automatically:
- ✅ Users can only upload to their own folder
- ✅ Users can only access their own files
- ✅ Admins can access all files
- ✅ Signed URLs for downloads

### Test Storage

```bash
# In Node.js/API route
import { uploadBackupFile } from '@/lib/supabase/storage';

const result = await uploadBackupFile(
  '/path/to/backup.tar.gz',
  'test-backup.tar.gz',
  {
    userId: 'user-uuid',
    backupId: 'backup-uuid',
  }
);

console.log('Uploaded:', result.path);
```

---

## 🔒 Row Level Security (RLS)

### How It Works

RLS is **enabled** on all tables. Users can only:
- ✅ View their own backups
- ✅ Create backups
- ✅ Update their own backups
- ✅ View their own restore operations
- ✅ View their own audit logs

Admins can:
- ✅ View all data
- ✅ Update all data
- ✅ Delete data

### Test RLS

```sql
-- Login as regular user (via Supabase Auth)
SELECT * FROM backups;
-- Returns only user's backups

-- Login as admin
SELECT * FROM backups;
-- Returns ALL backups
```

### Bypass RLS (Service Role)

The `SUPABASE_SERVICE_KEY` bypasses RLS. Use it for:
- ✅ Server-side operations
- ✅ Background jobs
- ✅ Admin operations

**Never expose service key to client!**

---

## 📊 Verify Tables

Run this in SQL Editor to check:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'backups',
  'restore_operations',
  'backup_schedules',
  'audit_logs',
  'storage_metadata',
  'system_settings'
);

-- Should return 6 rows

-- Check views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';

-- Should include backup_stats and recent_activity

-- Check storage bucket
SELECT * FROM storage.buckets WHERE name = 'backups';

-- Should return 1 row
```

---

## 🧪 Test Queries

### Insert Test Backup

```sql
INSERT INTO backups (
  backup_name,
  backup_path,
  backup_type,
  status,
  size_bytes,
  compressed,
  components,
  metadata
) VALUES (
  'test_backup_2025-12-22',
  '/backups/test',
  'full',
  'completed',
  2560000,
  true,
  '["database", "config"]'::jsonb,
  '{"tables": 2, "records": 100}'::jsonb
);
```

### Query Statistics

```sql
-- View backup stats
SELECT * FROM backup_stats 
ORDER BY backup_date DESC 
LIMIT 7;

-- View recent activity
SELECT * FROM recent_activity 
LIMIT 10;
```

### Test RLS Policies

```sql
-- Create test user backup (replace with real user ID)
INSERT INTO backups (
  backup_name,
  backup_path,
  backup_type,
  status,
  created_by
) VALUES (
  'user_backup_test',
  '/backups/user',
  'database',
  'completed',
  'user-uuid-here'
);

-- Query as that user (set JWT)
-- Will only see backups where created_by = user's ID
```

---

## 🔧 Troubleshooting

### Issue: "relation does not exist"

**Cause:** Migrations not run

**Fix:**
1. Go to SQL Editor
2. Run `002_backup_management_tables.sql`
3. Then `003_row_level_security.sql`

### Issue: "permission denied for table"

**Cause:** RLS blocking access

**Fix:**
- Make sure you're authenticated
- Check user has correct role in metadata
- Admins: Check `is_admin()` function works

**Test:**
```sql
SELECT is_admin(auth.uid());
-- Should return true for admins
```

### Issue: "bucket 'backups' does not exist"

**Cause:** Storage bucket not created

**Fix:**
1. Go to Storage in dashboard
2. Create bucket named `backups`
3. Set to private

Or run:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('backups', 'backups', false)
ON CONFLICT (id) DO NOTHING;
```

### Issue: Can't upload files

**Cause:** Storage policies not set

**Fix:**
Re-run `003_row_level_security.sql` which includes storage policies.

### Issue: Service key not working

**Cause:** Wrong key or expired

**Fix:**
1. Go to Settings → API
2. Copy **service_role** key (not anon key!)
3. Verify in `.env.local`
4. Restart dev server

---

## 📈 Monitoring

### Database Stats

```sql
-- Table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Row counts
SELECT
  tablename,
  n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
```

### Storage Usage

```sql
-- Storage metadata summary
SELECT
  bucket_name,
  COUNT(*) as file_count,
  pg_size_pretty(SUM(size_bytes)) as total_size
FROM storage_metadata
GROUP BY bucket_name;
```

### Recent Activity

```sql
-- Last 24 hours
SELECT * FROM recent_activity
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

## 🔄 Migration Rollback

If you need to rollback:

```sql
-- Drop tables (in order due to foreign keys)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS storage_metadata CASCADE;
DROP TABLE IF EXISTS restore_operations CASCADE;
DROP TABLE IF EXISTS backup_schedules CASCADE;
DROP TABLE IF EXISTS backups CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- Drop views
DROP VIEW IF EXISTS backup_stats;
DROP VIEW IF EXISTS recent_activity;

-- Drop functions
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS owns_resource(UUID, UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS calculate_restore_duration();
DROP FUNCTION IF EXISTS log_audit_event();

-- Remove storage bucket
DELETE FROM storage.buckets WHERE name = 'backups';
```

---

## 🎯 Next Steps

After setup:

1. ✅ **Test authentication** - Create users, test login
2. ✅ **Create test backup** - Use dashboard UI
3. ✅ **Upload to storage** - Test file upload
4. ✅ **Check RLS** - Verify users see only their data
5. ✅ **Review audit logs** - Check tracking works
6. ✅ **Set up schedules** - Create automated backups

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/functions.html)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## ✅ Setup Checklist

- [ ] Supabase project created
- [ ] Migrations executed (002 + 003)
- [ ] API keys added to `.env.local`
- [ ] Storage bucket created
- [ ] Admin user created
- [ ] Test backup created
- [ ] RLS verified working
- [ ] Storage upload tested
- [ ] No errors in console

---

**Your Supabase is ready!** 🎉

Next: Deploy dashboard and start creating backups with persistent storage!
