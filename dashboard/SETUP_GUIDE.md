# Dashboard Setup Guide

Complete step-by-step guide to get the dashboard running.

---

## 📋 Prerequisites

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **CLI tool** already set up (in parent directory)
- **Supabase account** with database configured
- **Terminal/Command line** access

---

## 🚀 Installation Steps

### Step 1: Navigate to Dashboard Directory

```bash
cd dashboard
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 300+ packages in 30s
```

**If you see any errors**, try:
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Step 3: Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# CLI Configuration (IMPORTANT: Use absolute paths)
CLI_PATH=/Users/yourname/projects/ai-call-center-mvp/cli/index.js
BACKUP_DIR=/Users/yourname/projects/ai-call-center-mvp/backups
```

**💡 Pro Tips:**
- Use `pwd` (Mac/Linux) or `cd` (Windows) to get absolute path
- Don't use relative paths like `../cli` - they won't work in production
- Test your CLI path: `node /path/to/cli/index.js --help`

### Step 4: Verify Setup

Test that everything is configured correctly:

```bash
# Test 1: Check if CLI is accessible
node $CLI_PATH --help

# Test 2: Check if backup directory exists
ls -la $BACKUP_DIR
```

**Expected output:**
```
Usage: rovodev [options] [command]
...
```

### Step 5: Run Development Server

```bash
npm run dev
```

**Expected output:**
```
   ▲ Next.js 14.2.0
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 2.5s
```

### Step 6: Open in Browser

Visit: **http://localhost:3000**

You should see:
- ✅ Dashboard home page
- ✅ System status widgets
- ✅ Recent backups section
- ✅ "Create Backup" button

---

## 🧪 Testing the Dashboard

### Test 1: System Status

1. Navigate to http://localhost:3000
2. Check **System Health** section
3. All 4 cards should show status

**Expected:**
- 🟢 Overall Status: Healthy (if CLI is working)
- 🟢 Database: Connected (if Supabase configured)
- 🟢 Configuration: Complete (if env vars set)
- Status updates automatically every 30 seconds

### Test 2: Create Backup

1. Click **"Create Backup"** button
2. Wait 5-30 seconds
3. Should see success alert with backup name

**Expected:**
```
Backup created successfully!

Name: backup_2025-12-22_17-30-00
Records: 1247
```

### Test 3: List Backups

1. Navigate to http://localhost:3000/backups
2. Should see all available backups
3. Each backup shows: name, date, size, actions

### Test 4: Restore Wizard

1. Click **"Restore"** on any backup
2. Multi-step wizard should open
3. Step through: Confirm → Select Components → Review → Restore

**Expected:**
- Step 1: Backup information displayed
- Step 2: Checkboxes for database/config/deployment
- Step 3: Warning message + confirmation
- Step 4: Success message with summary

### Test 5: Backup Details

1. Click **"Details"** on any backup
2. Should see detailed information page
3. Overview, components, database tables

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "CLI_PATH not found"

**Error:**
```
Error: spawn ENOENT
```

**Solution:**
1. Check `.env.local` has absolute path
2. Verify CLI exists: `ls -la /path/to/cli/index.js`
3. Make CLI executable: `chmod +x ../cli/index.js`

**Test:**
```bash
node $(cat .env.local | grep CLI_PATH | cut -d'=' -f2) --help
```

### Issue: "Failed to fetch status"

**Error:**
```
Failed to load system status
```

**Solution:**
1. Check Supabase credentials in `.env.local`
2. Verify CLI is working: `node ../cli/index.js status`
3. Check browser console (F12) for detailed errors

### Issue: Port 3000 already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
npm run dev -- -p 3001
```

### Issue: Backups not listing

**Possible causes:**
1. BACKUP_DIR path incorrect
2. No backups exist yet
3. CLI not accessible

**Solution:**
```bash
# Check backup directory
ls -la $(cat .env.local | grep BACKUP_DIR | cut -d'=' -f2)

# Create a test backup
cd ..
npm run backup

# Refresh dashboard
```

### Issue: Tailwind styles not loading

**Symptoms:**
- Unstyled components
- No colors/spacing
- Plain HTML appearance

**Solution:**
```bash
# Ensure Tailwind is installed
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate

# Restart dev server
npm run dev
```

### Issue: TypeScript errors

**Solution:**
```bash
# Regenerate TypeScript config
npx tsc --init

# Or ignore TypeScript errors during dev
# (add to next.config.js)
typescript: {
  ignoreBuildErrors: true,
}
```

---

## 📁 Folder Structure Explained

```
dashboard/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Homepage (Dashboard)
│   ├── layout.tsx         # Root layout (nav, styles)
│   ├── globals.css        # Global CSS (Tailwind)
│   ├── backups/           # Backups section
│   │   ├── page.tsx       # List all backups
│   │   └── [id]/          # Dynamic route
│   │       └── page.tsx   # Backup details
│   ├── status/            # Status section
│   │   └── page.tsx       # System status page
│   └── api/               # API Routes (Backend)
│       ├── backups/
│       │   ├── list/route.ts       # GET /api/backups/list
│       │   ├── create/route.ts     # POST /api/backups/create
│       │   └── [id]/
│       │       ├── restore/route.ts   # POST /api/backups/[id]/restore
│       │       └── details/route.ts   # GET /api/backups/[id]/details
│       └── status/
│           └── health/route.ts    # GET /api/status/health
├── components/            # React Components
│   ├── ui/               # Base UI components
│   │   ├── button.tsx    # Button component
│   │   ├── card.tsx      # Card component
│   │   ├── badge.tsx     # Badge component
│   │   └── dialog.tsx    # Dialog/Modal component
│   ├── StatusWidget.tsx  # System health widget
│   ├── BackupList.tsx    # Backup list component
│   ├── RestoreDialog.tsx # Restore wizard
│   └── CreateBackupButton.tsx
├── lib/                  # Utilities & Helpers
│   ├── cli-wrapper.ts   # Wraps CLI commands
│   └── utils.ts         # Utility functions
├── .env.local           # Environment variables (YOU CREATE THIS)
├── .env.local.example   # Example env file
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.ts   # Tailwind config
├── postcss.config.js    # PostCSS config
└── next.config.js       # Next.js config
```

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(221.2 83.2% 53.3%)", // Your brand color
      }
    }
  }
}
```

### Change Navbar

Edit `app/layout.tsx`:

```tsx
<nav className="border-b bg-white/50 backdrop-blur-sm">
  <div className="container mx-auto px-4 py-4">
    {/* Your custom nav */}
  </div>
</nav>
```

### Add Your Logo

```tsx
// app/layout.tsx
<div className="flex items-center space-x-2">
  <img src="/logo.png" alt="Logo" className="w-8 h-8" />
  <h1 className="text-xl font-bold">Your Brand</h1>
</div>
```

---

## 🚀 Building for Production

### Step 1: Test Build Locally

```bash
npm run build
```

**Expected output:**
```
   ▲ Next.js 14.2.0

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    1.2 kB        100 kB
├ ○ /backups                            1.5 kB        101 kB
├ ○ /status                             1.8 kB        102 kB
└ ƒ /api/backups/[id]/restore          0 kB          80 kB
```

### Step 2: Test Production Build

```bash
npm run start
```

Visit http://localhost:3000 and test all features.

### Step 3: Deploy

See `DEPLOYMENT.md` for:
- Vercel deployment
- Docker deployment
- VPS deployment

---

## 📊 Performance Optimization

### Enable Image Optimization

```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image 
  src="/logo.png" 
  width={32} 
  height={32} 
  alt="Logo" 
/>
```

### Add Loading States

Already implemented in components:
- Skeleton loaders while fetching
- Spinners for actions
- Progress indicators

### Enable Caching

API routes automatically cached by Next.js.

To customize:

```typescript
// app/api/backups/list/route.ts
export const revalidate = 60; // Cache for 60 seconds
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change all default secrets
- [ ] Use strong Supabase service key
- [ ] Enable HTTPS only
- [ ] Add authentication (Clerk/NextAuth)
- [ ] Implement rate limiting
- [ ] Add CORS headers
- [ ] Validate all inputs
- [ ] Sanitize file paths
- [ ] Enable error monitoring (Sentry)
- [ ] Set up backup encryption

---

## 📝 Development Workflow

### Making Changes

1. **Edit component**: Modify `.tsx` file
2. **See changes**: Auto-reload in browser
3. **Test**: Verify functionality
4. **Build**: `npm run build` to check for errors
5. **Commit**: Git commit changes
6. **Deploy**: Push to production

### Adding New Features

1. **Create component**: `components/MyComponent.tsx`
2. **Create page**: `app/my-page/page.tsx`
3. **Add API route**: `app/api/my-feature/route.ts`
4. **Update navigation**: Edit `app/layout.tsx`
5. **Test thoroughly**
6. **Deploy**

---

## 🎓 Learning Resources

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Tutorial](https://nextjs.org/learn)
- [API Routes Guide](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React + TypeScript](https://react-typescript-cheatsheet.netlify.app/)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/components)

---

## ✅ Success Checklist

After setup, you should be able to:

- [ ] Visit dashboard at http://localhost:3000
- [ ] See system status (all green)
- [ ] View list of backups
- [ ] Create a new backup via UI
- [ ] Open restore wizard
- [ ] View backup details page
- [ ] Check system status page
- [ ] All features work without errors

---

## 🆘 Getting Help

### Still Having Issues?

1. **Check logs**: Look at terminal output
2. **Browser console**: Press F12, check Console tab
3. **Test CLI**: Run `node ../cli/index.js status`
4. **Verify env vars**: Double-check `.env.local`
5. **Restart**: Close terminal, restart dev server

### Common Commands

```bash
# Clear everything and start fresh
rm -rf node_modules package-lock.json .next
npm install
npm run dev

# Check if CLI works
node ../cli/index.js --help
node ../cli/index.js status

# Test API directly
curl http://localhost:3000/api/status/health
curl http://localhost:3000/api/backups/list

# Build and check for errors
npm run build
```

---

## 🎉 You're Ready!

Once you see the dashboard running:

1. ✅ Create your first backup via UI
2. ✅ Test the restore wizard
3. ✅ Explore all pages
4. ✅ Read `DEPLOYMENT.md` for production
5. ✅ Customize colors/branding
6. ✅ Deploy to Vercel!

**Welcome to your backup management dashboard!** 🚀
