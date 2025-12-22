# Rovo Dev CLI Guide

Complete guide for using the Rovo Dev CLI tool to manage your AI Call Center MVP.

---

## Table of Contents

- [Installation](#installation)
- [Commands](#commands)
  - [backup](#backup)
  - [restore](#restore)
  - [status](#status)
  - [init](#init)
- [Usage Examples](#usage-examples)
- [Backup Structure](#backup-structure)
- [Troubleshooting](#troubleshooting)

---

## Installation

### Install Dependencies

```bash
npm install
```

### Make CLI Executable (Optional)

```bash
npm link
```

After linking, you can use `rovodev` command globally. Otherwise, use `npm run cli` or `node cli/index.js`.

---

## Commands

### backup

Create a backup of your database, configuration, and deployment state.

**Usage:**
```bash
rovodev backup [options]
```

**Options:**
- `-o, --output <path>` - Output directory for backup (default: `./backups`)
- `--db-only` - Backup database only
- `--config-only` - Backup configuration only
- `--compress` - Compress backup files

**Examples:**
```bash
# Full backup
rovodev backup

# Backup to specific directory
rovodev backup --output ./my-backups

# Database only with compression
rovodev backup --db-only --compress

# Configuration only
rovodev backup --config-only
```

**What Gets Backed Up:**
- **Database**: All data from `calls` and `call_events` tables
- **Configuration**: `.env`, `vercel.json`, `package.json` files
- **Deployment**: Vercel deployment state and environment variables

---

### restore

Restore your project from a backup.

**Usage:**
```bash
rovodev restore [options]
```

**Options:**
- `-i, --input <path>` - Path to backup file or directory
- `--db-only` - Restore database only
- `--config-only` - Restore configuration only
- `--force` - Skip confirmation prompts
- `--list` - List available backups

**Examples:**
```bash
# Interactive restore (choose from available backups)
rovodev restore

# List available backups
rovodev restore --list

# Restore from specific backup
rovodev restore --input ./backups/backup_2025-12-22_14-30-00

# Restore database only without confirmation
rovodev restore --input ./backups/backup_2025-12-22_14-30-00 --db-only --force

# Restore configuration only
rovodev restore --input ./backups/backup_2025-12-22_14-30-00 --config-only
```

**⚠️ Warning:**
Restore operations will overwrite existing data. Always confirm you're restoring the correct backup.

---

### status

Check the health and status of your system components.

**Usage:**
```bash
rovodev status [options]
```

**Options:**
- `--verbose` - Show detailed status information
- `--json` - Output in JSON format

**Examples:**
```bash
# Basic status check
rovodev status

# Detailed status
rovodev status --verbose

# JSON output for scripting
rovodev status --json
```

**What Gets Checked:**
- **Database**: Supabase connection and table statistics
- **Configuration**: Required environment variables
- **Deployment**: Vercel deployment health
- **Services**: External services (Yandex, LLM, n8n)

**Sample Output:**
```
📊 Rovo Dev CLI - System Status

✓ Database: Connected
  Tables: 2
  Total Records: 1,247
  Last Update: 2025-12-22T14:30:00Z

✓ Configuration: Complete

✓ Deployment: running
  URL: https://your-app.vercel.app
  Last Deploy: 2025-12-22T10:00:00Z

✓ Services: All operational (4/4)
  ✓ Supabase: Connected
  ✓ Yandex: Reachable
  ✓ OpenAI: Connected
  ✓ n8n: Reachable

✅ Status check completed!
```

---

### init

Initialize project configuration interactively or from a template.

**Usage:**
```bash
rovodev init [options]
```

**Options:**
- `--interactive` - Interactive setup wizard (default: true)
- `--template <name>` - Use configuration template

**Examples:**
```bash
# Interactive setup wizard
rovodev init

# Quick setup (copy .env.example)
rovodev init --no-interactive

# Use development template
rovodev init --template development

# Use production template
rovodev init --template production
```

**Interactive Wizard:**
The wizard will guide you through:
1. Project name
2. Environment (development/staging/production)
3. Supabase credentials
4. LLM provider selection and API key
5. Yandex SpeechKit configuration

---

## Usage Examples

### Daily Backup Routine

Create a daily backup with compression:
```bash
rovodev backup --compress
```

### Pre-Deployment Backup

Before deploying changes:
```bash
rovodev backup --output ./pre-deploy-backups
npm run deploy
```

### Health Check in CI/CD

```bash
rovodev status --json > status.json
```

### Disaster Recovery

```bash
# List available backups
rovodev restore --list

# Restore from the latest backup
rovodev restore --input ./backups/backup_2025-12-22_14-30-00

# Verify restoration
rovodev status --verbose
```

### Partial Restore

Restore only configuration after accidental .env deletion:
```bash
rovodev restore --config-only --input ./backups/backup_2025-12-22_14-30-00
```

---

## Backup Structure

Each backup creates a timestamped directory with the following structure:

```
backups/
└── backup_2025-12-22_14-30-00/
    ├── metadata.json          # Backup metadata
    ├── database.json          # Database export
    ├── config.json            # Configuration files
    └── deployment.json        # Deployment state
```

### metadata.json

```json
{
  "timestamp": "2025-12-22T14:30:00.000Z",
  "version": "1.0.0",
  "components": ["database", "config", "deployment"],
  "results": {
    "database": {
      "tables": 2,
      "records": 1247
    },
    "config": {
      "files": 3
    },
    "deployment": {
      "platform": "vercel",
      "deploymentsFound": 5
    }
  }
}
```

---

## Troubleshooting

### "Supabase client not initialized"

**Problem**: Missing Supabase credentials in environment.

**Solution**:
```bash
# Check environment variables
rovodev status --verbose

# Reinitialize configuration
rovodev init
```

### "Could not fetch Vercel deployment info"

**Problem**: Vercel CLI not installed or not logged in.

**Solution**:
```bash
npm install -g vercel
vercel login
```

### Restore fails with "Invalid backup file"

**Problem**: Corrupted or incomplete backup.

**Solution**:
```bash
# Validate the backup
rovodev restore --list

# Check backup directory structure manually
ls -la ./backups/backup_2025-12-22_14-30-00/
```

### "Permission denied" errors

**Problem**: CLI script not executable.

**Solution**:
```bash
chmod +x cli/index.js
```

Or use npm scripts:
```bash
npm run cli status
npm run backup
npm run restore
```

---

## Advanced Usage

### Automated Backups with Cron

Add to crontab for daily backups at 2 AM:
```bash
0 2 * * * cd /path/to/project && /usr/bin/node cli/index.js backup --compress
```

### Backup Rotation Script

```bash
#!/bin/bash
# Keep only last 7 backups
cd backups
ls -t | tail -n +8 | xargs rm -rf
```

### Remote Backup Storage

```bash
# Backup and sync to S3
rovodev backup --compress
aws s3 sync ./backups s3://my-bucket/call-center-backups/
```

### Integration with CI/CD

**.github/workflows/backup.yml**:
```yaml
name: Daily Backup
on:
  schedule:
    - cron: '0 2 * * *'
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run backup -- --compress
      - uses: actions/upload-artifact@v2
        with:
          name: backup
          path: backups/
```

---

## Best Practices

1. **Regular Backups**: Schedule daily backups, especially before deployments
2. **Test Restores**: Periodically test restore process in staging environment
3. **Secure Storage**: Store backups in secure, off-site location
4. **Retention Policy**: Keep backups for at least 30 days
5. **Monitor Status**: Run `rovodev status` regularly to catch issues early
6. **Document Changes**: Note significant changes in backup metadata

---

## Support

For issues or questions:
- Check `docs/troubleshooting.md`
- Run `rovodev --help` for command syntax
- Use `--verbose` flag for detailed error messages

---

## Version History

- **v1.0.0** (2025-12-22): Initial release
  - Backup/restore for database, config, and deployment
  - System status checking
  - Interactive initialization wizard
