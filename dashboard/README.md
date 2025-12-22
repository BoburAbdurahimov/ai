# Backup Management Dashboard

Modern web dashboard for managing AI Call Center MVP backups.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd dashboard
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your settings:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# CLI Path (adjust to your setup)
CLI_PATH=/absolute/path/to/ai-call-center-mvp/cli/index.js
BACKUP_DIR=/absolute/path/to/ai-call-center-mvp/backups
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
dashboard/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Dashboard home
│   ├── backups/
│   │   ├── page.tsx         # Backups list
│   │   └── [id]/page.tsx    # Backup details
│   ├── status/page.tsx      # System status
│   └── api/                 # API routes
│       ├── backups/
│       │   ├── list/
│       │   ├── create/
│       │   └── [id]/
│       │       ├── restore/
│       │       └── details/
│       └── status/health/
├── components/              # React components
│   ├── ui/                 # Base UI components
│   ├── StatusWidget.tsx    # System health widget
│   ├── BackupList.tsx      # Backup list component
│   ├── RestoreDialog.tsx   # Restore wizard
│   └── CreateBackupButton.tsx
├── lib/
│   ├── cli-wrapper.ts      # CLI command wrapper
│   └── utils.ts            # Utility functions
└── package.json
```

## 🎨 Features

### ✅ Dashboard Home
- Real-time system health monitoring
- Quick stats overview
- Recent backups list
- One-click backup creation

### ✅ Backups Management
- List all available backups
- View backup details
- Download backups
- Delete old backups

### ✅ Restore Wizard
- Multi-step restore process
- Component selection (database, config, deployment)
- Safety confirmations
- Progress tracking
- Success reporting

### ✅ System Status
- Database health check
- Configuration validation
- Deployment status
- External services monitoring

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/backups/list` | GET | List all backups |
| `/api/backups/create` | POST | Create new backup |
| `/api/backups/[id]/restore` | POST | Restore from backup |
| `/api/backups/[id]/details` | GET | Get backup details |
| `/api/status/health` | GET | System health check |

## 🎯 Usage Examples

### Create Backup via API

```bash
curl -X POST http://localhost:3000/api/backups/create \
  -H "Content-Type: application/json" \
  -d '{"type": "full", "compress": true}'
```

### List Backups

```bash
curl http://localhost:3000/api/backups/list
```

### Restore Backup

```bash
curl -X POST http://localhost:3000/api/backups/backup_2025-12-22_14-30-00/restore \
  -H "Content-Type: application/json" \
  -d '{"components": ["database", "config"], "force": true}'
```

### Check System Status

```bash
curl http://localhost:3000/api/status/health?verbose=true
```

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Vercel

Set these in Vercel Dashboard → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `CLI_PATH` (adjust for production)
- `BACKUP_DIR` (use Vercel Blob or S3)

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: "hsl(221.2 83.2% 53.3%)", // Your brand color
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

## 🐛 Troubleshooting

### CLI Commands Not Working

1. Check `CLI_PATH` in `.env.local`
2. Ensure CLI is executable: `chmod +x ../cli/index.js`
3. Test CLI directly: `node ../cli/index.js status`

### Backups Not Listing

1. Check `BACKUP_DIR` path
2. Verify backups exist: `ls -la ../backups`
3. Check API logs in terminal

### API Errors

1. Check Next.js terminal for errors
2. Verify environment variables are set
3. Check browser console (F12)

## 📝 Development Notes

### Adding New Features

1. **New API Route**: Create in `app/api/[feature]/route.ts`
2. **New Page**: Create in `app/[page]/page.tsx`
3. **New Component**: Create in `components/[Component].tsx`

### Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎓 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [CLI Documentation](../docs/CLI_GUIDE.md)

## 🤝 Support

For issues or questions:
- Check [Troubleshooting](#-troubleshooting)
- Review CLI logs
- Check browser console
- Verify environment variables

---

Built with ❤️ for AI Call Center MVP
