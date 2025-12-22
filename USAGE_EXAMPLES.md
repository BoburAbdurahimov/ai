# Rovo Dev CLI - Usage Examples

Real-world examples of using the CLI for common tasks.

---

## 🚀 Getting Started

### First Time Setup

```bash
# Install dependencies
npm install

# Initialize your project
npm run cli init

# Check everything is configured
npm run status -- --verbose
```

---

## 💾 Backup Scenarios

### 1. Daily Backup (Recommended)

Create a compressed backup every day:

```bash
# Simple daily backup
npm run backup

# With compression for storage efficiency
npm run backup -- --compress

# To a specific location
npm run backup -- --output /path/to/backups --compress
```

### 2. Pre-Deployment Backup

Always backup before deploying changes:

```bash
# Create backup
npm run backup -- --output ./pre-deploy-backups --compress

# Deploy your changes
npm run deploy

# If something goes wrong, restore:
npm run restore -- --input ./pre-deploy-backups/backup_2025-12-22_14-30-00
```

### 3. Database-Only Backup

Quick backup of just the database (useful for frequent snapshots):

```bash
npm run backup -- --db-only
```

### 4. Configuration Backup

Backup just your configuration files:

```bash
npm run backup -- --config-only --output ./config-backups
```

---

## 🔄 Restore Scenarios

### 1. List Available Backups

See all available backups:

```bash
npm run restore -- --list
```

Output:
```
Available backups:

  1. backup_2025-12-22_14-30-00
     Date: 12/22/2025, 2:30:00 PM
     Size: 2.45 MB
     Path: ./backups/backup_2025-12-22_14-30-00

  2. backup_2025-12-21_14-30-00
     Date: 12/21/2025, 2:30:00 PM
     Size: 2.12 MB
     Path: ./backups/backup_2025-12-21_14-30-00
```

### 2. Interactive Restore

Choose from available backups interactively:

```bash
npm run restore
```

The CLI will:
1. Show available backups
2. Let you select one
3. Display backup information
4. Ask for confirmation
5. Restore the data

### 3. Direct Restore

Restore from a specific backup path:

```bash
npm run restore -- --input ./backups/backup_2025-12-22_14-30-00
```

### 4. Forced Restore (No Confirmation)

Useful for automated scripts:

```bash
npm run restore -- --input ./backups/backup_2025-12-22_14-30-00 --force
```

### 5. Partial Restore

Restore only specific components:

```bash
# Restore only database
npm run restore -- --db-only --input ./backups/backup_2025-12-22_14-30-00

# Restore only configuration
npm run restore -- --config-only --input ./backups/backup_2025-12-22_14-30-00
```

---

## 📊 Status Monitoring

### 1. Quick Health Check

```bash
npm run status
```

Output:
```
📊 Rovo Dev CLI - System Status

✓ Database: Connected
✓ Configuration: Complete
✓ Deployment: running
✓ Services: All operational (4/4)

✅ Status check completed!
```

### 2. Detailed Status

```bash
npm run status -- --verbose
```

Output:
```
📊 Rovo Dev CLI - System Status

✓ Database: Connected
  Tables: 2
  Total Records: 1,247
  Last Update: 2025-12-22T14:30:00Z

⚠ Configuration: 2 missing variables
  Missing: VAPI_API_KEY, OPERATOR_PHONE_NUMBER

✓ Deployment: running
  URL: https://your-app.vercel.app
  Last Deploy: 2025-12-22T10:00:00Z

⚠ Services: 3/4 operational
  ✓ Supabase: Connected
  ✓ Yandex: Reachable
  ✓ OpenAI: Connected
  ✗ n8n: Service unavailable

✅ Status check completed!
```

### 3. JSON Output for Scripts

```bash
npm run status -- --json > system-status.json
```

Use in monitoring scripts:

```bash
#!/bin/bash
STATUS=$(npm run status -- --json)
if echo "$STATUS" | jq -e '.database.connected == false' > /dev/null; then
  echo "Database is down!"
  # Send alert
fi
```

---

## 🛠️ Initialization Scenarios

### 1. Interactive Setup Wizard

```bash
npm run cli init --interactive
```

This will guide you through:
- Project name
- Environment selection
- Supabase setup
- LLM provider configuration
- Yandex SpeechKit setup

### 2. Quick Setup

Copy `.env.example` to `.env`:

```bash
npm run cli init --no-interactive
```

Then manually edit `.env` with your credentials.

### 3. Template-Based Setup

```bash
# Development environment
npm run cli init -- --template development

# Production environment
npm run cli init -- --template production
```

---

## 🔧 Advanced Workflows

### Automated Daily Backups

Create a cron job:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * cd /path/to/ai-call-center-mvp && /usr/bin/node cli/index.js backup --compress
```

### Backup Rotation Script

Keep only the last 7 backups:

```bash
#!/bin/bash
# save as scripts/rotate-backups.sh

cd /path/to/ai-call-center-mvp/backups
echo "Current backups: $(ls -1 | wc -l)"

# Keep only 7 most recent backups
ls -t | tail -n +8 | xargs -r rm -rf

echo "After rotation: $(ls -1 | wc -l)"
```

### Pre-Deployment Checklist Script

```bash
#!/bin/bash
# save as scripts/pre-deploy.sh

echo "🔍 Running pre-deployment checks..."

# Check system status
npm run status -- --verbose
if [ $? -ne 0 ]; then
  echo "❌ Status check failed. Fix issues before deploying."
  exit 1
fi

# Create backup
echo "💾 Creating backup..."
npm run backup -- --compress
if [ $? -ne 0 ]; then
  echo "❌ Backup failed. Aborting deployment."
  exit 1
fi

echo "✅ Pre-deployment checks passed!"
echo "Ready to deploy: npm run deploy"
```

### Disaster Recovery Procedure

```bash
#!/bin/bash
# save as scripts/disaster-recovery.sh

echo "🚨 Starting disaster recovery..."

# List available backups
echo "Available backups:"
npm run restore -- --list

# Prompt for backup selection
read -p "Enter backup directory name: " BACKUP_DIR

# Restore
npm run restore -- --input "./backups/$BACKUP_DIR" --force

# Verify
npm run status -- --verbose

echo "✅ Recovery complete. Please verify manually."
```

---

## 🔐 Production Best Practices

### 1. Secure Backup Storage

```bash
# Create encrypted backup
npm run backup -- --compress
gpg --symmetric ./backups/backup_2025-12-22_14-30-00.tar.gz

# Upload to secure storage
aws s3 cp ./backups/backup_2025-12-22_14-30-00.tar.gz.gpg \
  s3://my-secure-bucket/backups/
```

### 2. Monitoring Integration

```bash
# Health check endpoint for monitoring tools
curl -f https://your-app.vercel.app/api/health || \
  npm run status -- --json | \
  curl -X POST -H "Content-Type: application/json" \
  -d @- https://your-monitoring-service.com/alert
```

### 3. Backup Verification

```bash
# Weekly: Restore to staging and verify
npm run restore -- --input ./backups/latest --force
npm run status -- --verbose
# Run integration tests
npm test
```

---

## 📱 Integration Examples

### GitHub Actions Workflow

```yaml
# .github/workflows/daily-backup.yml
name: Daily Backup

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Create backup
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
        run: npm run backup -- --compress
      
      - name: Upload backup
        uses: actions/upload-artifact@v3
        with:
          name: backup-${{ github.run_number }}
          path: backups/
          retention-days: 30
```

### Docker Integration

```dockerfile
# Add to your Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install

# Make CLI available
RUN npm link

# Run backup on container start
CMD ["rovodev", "backup", "--compress"]
```

### Slack Notifications

```bash
#!/bin/bash
# Post-backup notification

WEBHOOK_URL="your-slack-webhook-url"
BACKUP_STATUS=$(npm run backup -- --compress 2>&1)

curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"Backup completed\n\`\`\`$BACKUP_STATUS\`\`\`\"}" \
  $WEBHOOK_URL
```

---

## 🐛 Troubleshooting Workflows

### Debug Configuration Issues

```bash
# Check what's missing
npm run status -- --verbose

# Reset configuration
mv .env .env.backup
npm run cli init

# Compare configurations
diff .env.backup .env
```

### Recover from Failed Deployment

```bash
# List backups
npm run restore -- --list

# Restore last known good state
npm run restore -- --input ./backups/backup_2025-12-22_14-30-00

# Verify
npm run status -- --verbose

# Redeploy
npm run deploy
```

### Test Backup Integrity

```bash
# Create test backup
npm run backup -- --output ./test-backup

# Try to restore (with validation)
npm run restore -- --input ./test-backup/backup_2025-12-22_14-30-00

# If successful, backup is valid
rm -rf ./test-backup
```

---

## 📝 Quick Reference

```bash
# Initialize
npm run cli init

# Status check
npm run status
npm run status -- --verbose
npm run status -- --json

# Backup
npm run backup
npm run backup -- --compress
npm run backup -- --db-only
npm run backup -- --config-only

# Restore
npm run restore
npm run restore -- --list
npm run restore -- --input <path>
npm run restore -- --db-only
npm run restore -- --force

# Help
npm run cli -- --help
npm run cli backup -- --help
npm run cli restore -- --help
npm run cli status -- --help
```

---

## 🎯 Common Task Checklist

### Daily Operations
- [ ] Run `npm run status` to check system health
- [ ] Review any warnings or errors
- [ ] Create backup if making changes

### Weekly Operations
- [ ] Run `npm run backup -- --compress`
- [ ] Verify backup integrity
- [ ] Clean up old backups (keep last 7-30)
- [ ] Review system logs

### Before Deployment
- [ ] Run `npm run status -- --verbose`
- [ ] Create backup: `npm run backup -- --compress`
- [ ] Note the backup location
- [ ] Deploy changes
- [ ] Verify deployment: `npm run status`

### After Issues
- [ ] Run `npm run restore -- --list`
- [ ] Select appropriate backup
- [ ] Restore: `npm run restore -- --input <path>`
- [ ] Verify: `npm run status -- --verbose`
- [ ] Test functionality

---

For more details, see [docs/CLI_GUIDE.md](docs/CLI_GUIDE.md)
