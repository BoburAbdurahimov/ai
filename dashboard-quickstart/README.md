# Dashboard Quick Start Guide

This folder contains everything you need to build a web dashboard for the Rovo Dev CLI backup system.

## 📁 Files in This Folder

1. **IMPLEMENTATION_PLAN.md** - Step-by-step implementation guide
2. **cli-wrapper.ts** - TypeScript wrapper for CLI commands
3. **api-route-examples.ts** - Next.js API routes
4. **react-components.tsx** - React/UI components
5. **README.md** - This file

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest dashboard --typescript --tailwind --app --src-dir
cd dashboard
```

### Step 2: Install Dependencies

```bash
npm install @supabase/supabase-js axios date-fns
npm install lucide-react class-variance-authority clsx tailwind-merge
```

### Step 3: Install shadcn/ui

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog table badge checkbox alert
```

### Step 4: Copy Files

```bash
# Create lib directory
mkdir -p src/lib

# Copy the CLI wrapper
cp ../dashboard-quickstart/cli-wrapper.ts src/lib/

# Copy API routes
mkdir -p src/app/api/backups/{list,create,[id]/{restore,details}}
mkdir -p src/app/api/status/health

# Copy React components
mkdir -p src/components
# (Copy component code from react-components.tsx)
```

### Step 5: Configure Environment

```env
# .env.local
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
CLI_PATH=/path/to/cli/index.js
BACKUP_DIR=/path/to/backups
```

### Step 6: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your dashboard!

## 🎯 What You Get

### Dashboard Features
- ✅ Real-time system status (Database, Config, Deployment, Services)
- ✅ List all backups with metadata
- ✅ Create new backups (full, database-only, config-only)
- ✅ Multi-step restore wizard with confirmations
- ✅ Backup details view
- ✅ Responsive design

### API Endpoints
- `GET /api/backups/list` - List all backups
- `POST /api/backups/create` - Create new backup
- `POST /api/backups/[id]/restore` - Restore from backup
- `GET /api/backups/[id]/details` - Get backup details
- `GET /api/status/health` - System health check

## 🏗️ Architecture

```
Next.js Dashboard
    ↓
API Routes (Next.js)
    ↓
CLI Wrapper (lib/cli-wrapper.ts)
    ↓
Existing CLI (cli/index.js)
    ↓
Supabase Database + Vercel Deployment
```

**Key Insight**: The dashboard wraps your existing CLI - no code duplication!

## 📊 File Structure After Setup

```
dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard home
│   │   ├── backups/
│   │   │   └── page.tsx               # Backups list
│   │   └── api/
│   │       ├── backups/
│   │       │   ├── list/route.ts
│   │       │   ├── create/route.ts
│   │       │   └── [id]/
│   │       │       ├── restore/route.ts
│   │       │       └── details/route.ts
│   │       └── status/
│   │           └── health/route.ts
│   ├── components/
│   │   ├── ui/                        # shadcn components
│   │   ├── StatusWidget.tsx
│   │   ├── BackupList.tsx
│   │   ├── RestoreWizard.tsx
│   │   └── CreateBackupButton.tsx
│   └── lib/
│       ├── cli-wrapper.ts             # CLI command wrapper
│       └── utils.ts
├── .env.local
└── package.json
```

## 🎨 Customization

### Change Colors/Theme

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {...},
      // Your brand colors
    }
  }
}
```

### Add Authentication

Install Clerk or NextAuth:

```bash
npm install @clerk/nextjs
# or
npm install next-auth
```

Add middleware in `middleware.ts`:

```typescript
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/']
});
```

### Add Real-Time Updates

Use Server-Sent Events (SSE) for live progress:

```typescript
// app/api/backups/[id]/restore/stream/route.ts
export async function GET(request: Request) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Execute restore with streaming
  executeWithStream(
    'restore',
    (data) => writer.write(`data: ${data}\n\n`),
    (error) => writer.write(`error: ${error}\n\n`),
    () => writer.close()
  );

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    }
  });
}
```

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables

Set in Vercel Dashboard:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `CLI_PATH` (adjust for production)
- `BACKUP_DIR` (use Vercel Blob or S3)

### Production Considerations

1. **Storage**: Move backups to Vercel Blob or S3
2. **Long Operations**: Use background jobs for backups/restores
3. **Authentication**: Add proper auth (Clerk/NextAuth)
4. **Rate Limiting**: Implement API rate limits
5. **Monitoring**: Add error tracking (Sentry)

## 🐛 Troubleshooting

### CLI not found
```bash
# Check CLI_PATH in .env.local
echo $CLI_PATH
ls -la $CLI_PATH
```

### API routes fail
```bash
# Check Next.js logs
npm run dev
# View browser console for errors
```

### Backups not listing
```bash
# Test CLI directly
node cli/index.js restore --list
```

## 📚 Next Steps

1. **Add Authentication** - Secure your dashboard
2. **Implement Scheduling** - Automated backup cron jobs
3. **Add Notifications** - Email/Slack alerts
4. **Build Analytics** - Backup trends and metrics
5. **Mobile Responsive** - Test on mobile devices

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 💡 Tips

- Start with the basic dashboard (Step 1-6)
- Test each API endpoint individually
- Use Chrome DevTools Network tab for debugging
- Keep CLI as source of truth - don't duplicate logic

## 🤝 Support

Questions? Check:
1. `/docs/CLI_GUIDE.md` - CLI documentation
2. `/docs/DASHBOARD_ARCHITECTURE.md` - Full architecture
3. This README for quick reference

---

**Remember**: The dashboard is just a UI wrapper around your powerful CLI. The CLI does all the heavy lifting!
