#!/usr/bin/env node

/**
 * Rovo Dev CLI - AI Call Center MVP Management Tool
 * 
 * Commands:
 * - backup: Create backup of database, configs, and deployment state
 * - restore: Restore from backup
 * - status: Check system status
 * - init: Initialize project configuration
 */

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const backupCommand = require('./commands/backup');
const restoreCommand = require('./commands/restore');
const statusCommand = require('./commands/status');
const initCommand = require('./commands/init');

const program = new Command();

program
  .name('rovodev')
  .description('Rovo Dev CLI - AI Call Center MVP Management Tool')
  .version('1.0.0');

// Backup command
program
  .command('backup')
  .description('Create a backup of database, configs, and deployment state')
  .option('-o, --output <path>', 'Output directory for backup', './backups')
  .option('--db-only', 'Backup database only')
  .option('--config-only', 'Backup configuration only')
  .option('--compress', 'Compress backup files', false)
  .action(backupCommand);

// Restore command
program
  .command('restore')
  .description('Restore from a backup')
  .option('-i, --input <path>', 'Path to backup file or directory')
  .option('--db-only', 'Restore database only')
  .option('--config-only', 'Restore configuration only')
  .option('--force', 'Skip confirmation prompts', false)
  .option('--list', 'List available backups')
  .action(restoreCommand);

// Status command
program
  .command('status')
  .description('Check system status and health')
  .option('--verbose', 'Show detailed status information', false)
  .option('--json', 'Output in JSON format', false)
  .action(statusCommand);

// Init command
program
  .command('init')
  .description('Initialize project configuration')
  .option('--interactive', 'Interactive setup wizard', true)
  .option('--template <name>', 'Use configuration template')
  .action(initCommand);

// Error handling
program.configureOutput({
  outputError: (str, write) => write(chalk.red(str))
});

// Parse arguments
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
