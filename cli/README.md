# Rovo Dev CLI

Command-line interface for managing the AI Call Center MVP project.

## 📁 Structure

```
cli/
├── index.js                 # Main CLI entry point
├── commands/                # Command implementations
│   ├── backup.js           # Backup command
│   ├── restore.js          # Restore command (with --restore flag)
│   ├── status.js           # Status check command
│   └── init.js             # Initialization command
└── modules/                 # Reusable modules
    ├── database.js         # Database backup/restore
    ├── config.js           # Configuration backup/restore
    ├── deployment.js       # Deployment state management
    ├── services.js         # External services health checks
    └── backup-manager.js   # Backup file management
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run any command
npm run cli <command> [options]

# Or use shortcuts
npm run status
npm run backup
npm run restore
```

## 📚 Commands

### `rovodev backup`
Creates a complete backup of your project state including:
- Database (calls and call_events tables)
- Configuration files (.env, vercel.json, package.json)
- Deployment state (Vercel deployments and env vars)

### `rovodev restore` (⭐ Main Feature)
Restores your project from a backup. This is the **--restore flag** functionality:
- Interactive backup selection
- Validation before restore
- Partial restore options (db-only, config-only)
- Force mode for automation

### `rovodev status`
Checks system health:
- Database connectivity
- Configuration completeness
- Deployment status
- External services (Supabase, Yandex, LLM, n8n)

### `rovodev init`
Initializes project configuration:
- Interactive setup wizard
- Quick setup from template
- Environment-specific configurations

## 🔧 Key Features

### ✅ Comprehensive Backup
- **Database**: Full export of all tables with data
- **Configuration**: Environment variables and config files
- **Deployment**: Vercel deployment state and metadata
- **Compression**: Optional tar.gz compression
- **Metadata**: Timestamp, version, and component tracking

### ✅ Smart Restore
- **Interactive Selection**: Choose from available backups
- **Validation**: Pre-restore backup integrity checks
- **Safety**: Confirmation prompts (bypass with --force)
- **Partial Restore**: Restore only specific components
- **Rollback Support**: Creates backups of existing files before restore

### ✅ Health Monitoring
- **Database Status**: Connection, table counts, last update
- **Configuration**: Missing variables detection
- **Deployment**: Health endpoint checks, deployment info
- **Services**: External service connectivity tests
- **Multiple Formats**: Human-readable or JSON output

### ✅ Easy Initialization
- **Wizard Mode**: Step-by-step interactive setup
- **Templates**: Pre-configured environment templates
- **Quick Mode**: Copy .env.example and customize
- **Validation**: Checks for required credentials

## 🎯 The --restore Flag Functionality

The core restoration feature is accessed via:

```bash
# Interactive restore (recommended)
npm run restore

# Direct restore from path
npm run restore -- --input ./backups/backup_2025-12-22_14-30-00

# List available backups
npm run restore -- --list

# Restore with options
npm run restore -- --input <path> --db-only --force
```

### Restore Process Flow:
1. **Selection**: Choose backup (interactive or via --input)
2. **Validation**: Verify backup integrity and completeness
3. **Information**: Display backup details (date, components, size)
4. **Confirmation**: Safety prompt (skip with --force)
5. **Execution**: Restore components (database, config, deployment)
6. **Summary**: Show results and next steps

## 📦 Dependencies

- `commander`: CLI framework for argument parsing
- `chalk`: Terminal string styling
- `ora`: Elegant terminal spinners
- `inquirer`: Interactive command-line prompts
- `@supabase/supabase-js`: Database operations
- `axios`: HTTP requests for service checks
- `dotenv`: Environment variable management

## 🔐 Environment Variables

Required for full functionality:

```env
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Optional (for specific features)
YANDEX_API_KEY=your-key
OPENAI_API_KEY=your-key
N8N_WEBHOOK_BASE_URL=https://your-n8n.com
```

## 🛡️ Error Handling

All commands include:
- Input validation
- Graceful error handling
- Helpful error messages
- Stack traces in verbose mode
- Non-zero exit codes on failure

## 📊 Output Formats

### Human-Readable (Default)
```
📊 Rovo Dev CLI - System Status

✓ Database: Connected
✓ Configuration: Complete
✓ Deployment: running
✓ Services: All operational (4/4)

✅ Status check completed!
```

### JSON (for Scripts)
```bash
npm run status -- --json
```

```json
{
  "database": {
    "connected": true,
    "tables": 2,
    "totalRecords": 1247
  },
  "config": {
    "complete": true,
    "missing": []
  }
}
```

## 🧪 Testing

The CLI has been tested with:
- Help command display
- Command parsing
- Option handling
- Error scenarios
- Environment validation

## 📝 Documentation

- **Full Guide**: [docs/CLI_GUIDE.md](../docs/CLI_GUIDE.md)
- **Usage Examples**: [USAGE_EXAMPLES.md](../USAGE_EXAMPLES.md)
- **Quick Reference**: [README_CLI.md](../README_CLI.md)

## 🔧 Development

### Adding New Commands

1. Create command file in `cli/commands/`
2. Implement command function
3. Register in `cli/index.js`
4. Add documentation

Example:
```javascript
// cli/commands/my-command.js
async function myCommand(options) {
  console.log('Executing my command...');
  // Implementation
}

module.exports = myCommand;
```

```javascript
// cli/index.js
const myCommand = require('./commands/my-command');

program
  .command('my-command')
  .description('Description of my command')
  .action(myCommand);
```

### Adding New Modules

Create reusable functionality in `cli/modules/`:

```javascript
// cli/modules/my-module.js
async function myFunction() {
  // Implementation
}

module.exports = {
  myFunction
};
```

## 🚀 Production Usage

### Cron Job for Automated Backups
```bash
0 2 * * * cd /path/to/project && node cli/index.js backup --compress
```

### CI/CD Integration
```yaml
- name: Backup before deploy
  run: npm run backup -- --compress

- name: Deploy
  run: npm run deploy

- name: Verify deployment
  run: npm run status
```

### Monitoring Integration
```bash
npm run status -- --json | jq '.database.connected' | grep -q true || alert
```

## ⚠️ Important Notes

1. **Backups contain sensitive data** - Store securely
2. **Test restores regularly** - Verify backup integrity
3. **Backup before deployments** - Always have rollback option
4. **Monitor disk space** - Backups can grow large
5. **Use --force carefully** - Bypasses safety prompts

## 🤝 Contributing

When adding features:
1. Follow existing code structure
2. Add error handling
3. Update documentation
4. Test thoroughly

## 📄 License

MIT - Same as parent project

---

Built with ❤️ for the AI Call Center MVP project
