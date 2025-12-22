# Rovo Dev CLI - Quick Reference

Command-line tool for managing your AI Call Center MVP.

## Quick Start

```bash
# Install dependencies
npm install

# Check system status
npm run status

# Create a backup
npm run backup

# Restore from backup
npm run restore

# Initialize configuration
npm run cli init
```

## Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `backup` | Create full backup | `npm run backup` |
| `restore` | Restore from backup | `npm run restore` |
| `status` | Check system health | `npm run status` |
| `init` | Initialize project | `npm run cli init` |

## Common Use Cases

### Before Deployment
```bash
npm run backup -- --compress
npm run deploy
```

### After Issues
```bash
npm run restore -- --list
npm run restore -- --input ./backups/backup_2025-12-22_14-30-00
```

### Health Check
```bash
npm run status -- --verbose
```

## Full Documentation

See [docs/CLI_GUIDE.md](docs/CLI_GUIDE.md) for complete documentation.

## Options

### Backup Options
- `--output <path>` - Output directory
- `--db-only` - Database only
- `--config-only` - Config only
- `--compress` - Compress backup

### Restore Options
- `--input <path>` - Backup path
- `--db-only` - Database only
- `--config-only` - Config only
- `--force` - Skip confirmations
- `--list` - List backups

### Status Options
- `--verbose` - Detailed info
- `--json` - JSON output

## Examples

```bash
# Full backup with compression
npm run backup -- --compress

# List available backups
npm run restore -- --list

# Restore specific backup
npm run restore -- --input ./backups/backup_2025-12-22_14-30-00

# Detailed system status
npm run status -- --verbose --json

# Interactive setup
npm run cli init --interactive
```

## Troubleshooting

See [docs/CLI_GUIDE.md#troubleshooting](docs/CLI_GUIDE.md#troubleshooting) for common issues and solutions.
