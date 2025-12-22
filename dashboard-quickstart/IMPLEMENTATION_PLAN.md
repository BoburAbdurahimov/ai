# Dashboard Implementation Plan

Quick-start guide for building the Backup Management Dashboard.

## Phase 1: Setup (Day 1)

### Step 1: Create Next.js Project
```bash
npx create-next-app@latest dashboard --typescript --tailwind --app
cd dashboard
npm install @supabase/supabase-js axios date-fns
npm install -D @types/node
```

### Step 2: Project Structure
```
dashboard/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # Dashboard home
│   ├── backups/
│   │   ├── page.tsx            # Backups list
│   │   └── [id]/page.tsx       # Backup details
│   └── api/
│       ├── backups/
│       │   ├── list/route.ts
│       │   ├── create/route.ts
│       │   └── [id]/
│       │       ├── restore/route.ts
│       │       └── details/route.ts
│       └── status/
│           └── health/route.ts
├── components/
│   ├── BackupCard.tsx
│   ├── RestoreWizard.tsx
│   ├── StatusWidget.tsx
│   └── ui/                      # shadcn components
├── lib/
│   ├── cli-wrapper.ts           # Wrap existing CLI
│   ├── supabase.ts
│   └── utils.ts
└── types/
    └── index.ts                 # TypeScript definitions
```

### Step 3: Environment Setup
```env
# .env.local
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Path to CLI
CLI_PATH=/path/to/cli/index.js
BACKUP_DIR=/path/to/backups
```

## Phase 2: Backend API (Days 2-3)

### CLI Wrapper Library
Create `lib/cli-wrapper.ts` to execute CLI commands from API routes.

### Database Schema
Add backup tracking tables to Supabase (see DASHBOARD_ARCHITECTURE.md).

### API Routes
Implement REST endpoints for:
- List backups
- Create backup
- Restore backup
- Get status

## Phase 3: Frontend UI (Days 4-6)

### Install UI Components
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog table badge
```

### Build Pages
1. Dashboard home with status widgets
2. Backups list with table/grid view
3. Backup details page
4. Restore wizard (multi-step)

## Phase 4: Integration & Testing (Day 7)

### Integration
- Connect frontend to API routes
- Test CLI wrapper execution
- Implement error handling

### Testing
- Manual testing of all flows
- Error scenarios
- Performance testing

## Quick Implementation Tips

1. **Reuse CLI Logic**: Don't rewrite - wrap the existing CLI
2. **Start Simple**: Build basic list/create first, add wizard later
3. **Use shadcn/ui**: Pre-built components speed up development
4. **Real-time Later**: Start with polling, add SSE/WebSockets if needed
5. **Authentication Later**: Focus on functionality first

## Next Steps

See detailed code examples in the next files I'll create.
