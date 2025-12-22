# Dashboard Deployment Guide

Complete guide for deploying the Backup Management Dashboard to production.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] CLI accessible from dashboard
- [ ] Backups directory configured
- [ ] Supabase database set up
- [ ] Test locally first (`npm run dev`)
- [ ] Build succeeds (`npm run build`)

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Pros:** Instant deployment, serverless, free tier, great DX
**Cons:** Function execution limits (10s default, 60s on Pro)

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Deploy

```bash
cd dashboard
vercel --prod
```

#### Step 4: Set Environment Variables

Via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy: `vercel --prod`

Via CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
vercel env add CLI_PATH
vercel env add BACKUP_DIR
```

#### Step 5: Configure Function Timeout (Pro Plan)

In `vercel.json` (root of dashboard):

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

### Option 2: Docker Container

**Pros:** Self-hosted, full control, no execution limits
**Cons:** More setup, server management required

#### Create Dockerfile

```dockerfile
# dashboard/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Build and Run

```bash
# Build
docker build -t backup-dashboard .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e SUPABASE_SERVICE_KEY=your-key \
  -e CLI_PATH=/app/cli/index.js \
  -e BACKUP_DIR=/app/backups \
  backup-dashboard
```

### Option 3: VPS (DigitalOcean, Linode, etc.)

**Pros:** Full control, dedicated resources
**Cons:** Server management, no auto-scaling

#### Setup

```bash
# SSH into server
ssh user@your-server

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone your-repo
cd dashboard
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "dashboard" -- start
pm2 save
pm2 startup
```

## 🔒 Production Considerations

### 1. Storage for Backups

**Problem:** Vercel doesn't have persistent file storage

**Solutions:**

#### A. Vercel Blob Storage

```typescript
// lib/storage.ts
import { put, del, list } from '@vercel/blob';

export async function uploadBackup(file: File) {
  const blob = await put(`backups/${file.name}`, file, {
    access: 'public',
  });
  return blob.url;
}
```

#### B. AWS S3

```bash
npm install @aws-sdk/client-s3
```

```typescript
// lib/s3-storage.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(key: string, body: Buffer) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: body,
  }));
}
```

#### C. Google Cloud Storage

```bash
npm install @google-cloud/storage
```

### 2. CLI Execution in Serverless

**Problem:** CLI needs to be accessible in serverless functions

**Solutions:**

#### A. Bundle CLI with Dashboard

```typescript
// Copy CLI to dashboard during build
// package.json
{
  "scripts": {
    "prebuild": "cp -r ../cli ./cli-bundle",
    "build": "next build"
  }
}
```

#### B. API-First Approach (Recommended)

Refactor CLI modules into shared libraries:

```
shared/
├── database.ts
├── config.ts
└── deployment.ts

cli/
└── index.ts (imports from shared)

dashboard/
└── lib/ (imports from shared)
```

### 3. Authentication

Add authentication for production:

```bash
npm install @clerk/nextjs
```

```typescript
// middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### 4. Rate Limiting

Prevent abuse:

```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function checkRateLimit(identifier: string) {
  const count = rateLimit.get(identifier) || 0;
  if (count > 10) {
    return false;
  }
  rateLimit.set(identifier, count + 1);
  return true;
}
```

### 5. Error Monitoring

Add Sentry:

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 🎯 Production Checklist

- [ ] Environment variables secured
- [ ] Authentication enabled
- [ ] Rate limiting implemented
- [ ] Error monitoring (Sentry)
- [ ] Backup storage configured (S3/Blob)
- [ ] HTTPS enabled
- [ ] Database backups automated
- [ ] Monitoring alerts set up
- [ ] Performance optimized
- [ ] Security headers configured

## 📊 Monitoring

### Vercel Analytics

Enable in Vercel Dashboard → Analytics

### Custom Monitoring

```typescript
// lib/monitoring.ts
export function trackBackupCreated(backupId: string) {
  fetch('/api/analytics/track', {
    method: 'POST',
    body: JSON.stringify({
      event: 'backup_created',
      properties: { backupId }
    })
  });
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Dashboard

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd dashboard && npm ci
      
      - name: Build
        run: cd dashboard && npm run build
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🚨 Troubleshooting

### Deployment Fails

1. Check build logs: `vercel logs`
2. Verify environment variables
3. Test build locally: `npm run build`

### Functions Timeout

1. Upgrade to Vercel Pro for 60s timeout
2. Or split into smaller operations
3. Or use background jobs

### Storage Issues

1. Use Vercel Blob or S3
2. Don't store in `/tmp` (ephemeral)
3. Implement cleanup cron jobs

## 📝 Post-Deployment

1. **Test all features** in production
2. **Monitor error rates** (Sentry)
3. **Check performance** (Vercel Analytics)
4. **Verify backups** are being created
5. **Test restore** process
6. **Set up alerts** for failures

---

Need help? Check the [main README](./README.md) or [troubleshooting guide](../docs/troubleshooting.md).
