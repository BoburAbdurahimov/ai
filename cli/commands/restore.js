/**
 * Restore Command - Restore project state from backup
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { restoreDatabase } = require('../modules/database');
const { restoreConfig } = require('../modules/config');
const { restoreDeployment } = require('../modules/deployment');
const { listBackups, validateBackup } = require('../modules/backup-manager');

async function restoreCommand(options) {
  console.log(chalk.blue.bold('\n🔄 Rovo Dev CLI - Restore\n'));

  try {
    // List backups if requested
    if (options.list) {
      await showBackupList();
      return;
    }

    // Validate input path
    if (!options.input) {
      const backups = await listBackups();
      
      if (backups.length === 0) {
        console.log(chalk.yellow('⚠️  No backups found.'));
        console.log(chalk.gray('Run: rovodev backup to create a backup first.\n'));
        return;
      }

      // Interactive backup selection
      const { selectedBackup } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedBackup',
          message: 'Select a backup to restore:',
          choices: backups.map(b => ({
            name: `${b.name} (${b.date}) - ${b.size}`,
            value: b.path
          }))
        }
      ]);

      options.input = selectedBackup;
    }

    // Validate backup
    const spinner = ora('Validating backup...').start();
    const backupInfo = await validateBackup(options.input);
    
    if (!backupInfo.valid) {
      spinner.fail(chalk.red('Invalid backup file'));
      console.log(chalk.gray(`Reason: ${backupInfo.error}\n`));
      return;
    }
    
    spinner.succeed(chalk.green('Backup validated'));

    // Show backup information
    console.log(chalk.gray('\nBackup Information:'));
    console.log(chalk.gray(`  Date: ${backupInfo.timestamp}`));
    console.log(chalk.gray(`  Version: ${backupInfo.version}`));
    console.log(chalk.gray(`  Components: ${backupInfo.components.join(', ')}`));
    
    if (backupInfo.database) {
      console.log(chalk.gray(`  Database: ${backupInfo.database.tables} tables, ${backupInfo.database.records} records`));
    }

    // Confirmation prompt (unless --force)
    if (!options.force) {
      console.log(chalk.yellow('\n⚠️  Warning: This will overwrite existing data!'));
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Are you sure you want to restore from this backup?',
          default: false
        }
      ]);

      if (!confirm) {
        console.log(chalk.gray('Restore cancelled.\n'));
        return;
      }
    }

    // Perform restore
    console.log(chalk.blue('\n📦 Starting restore process...\n'));

    const results = {
      database: null,
      config: null,
      deployment: null
    };

    // Restore database
    if (!options.configOnly && backupInfo.components.includes('database')) {
      const dbSpinner = ora('Restoring database...').start();
      try {
        results.database = await restoreDatabase(path.join(options.input, 'database.json'));
        dbSpinner.succeed(chalk.green(`Database restored (${results.database.tablesRestored} tables, ${results.database.recordsRestored} records)`));
      } catch (error) {
        dbSpinner.fail(chalk.red('Database restore failed'));
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Restore configuration
    if (!options.dbOnly && backupInfo.components.includes('config')) {
      const configSpinner = ora('Restoring configuration...').start();
      try {
        results.config = await restoreConfig(path.join(options.input, 'config.json'));
        configSpinner.succeed(chalk.green(`Configuration restored (${results.config.filesRestored} files)`));
      } catch (error) {
        configSpinner.fail(chalk.red('Configuration restore failed'));
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Restore deployment state
    if (!options.dbOnly && !options.configOnly && backupInfo.components.includes('deployment')) {
      const deploySpinner = ora('Restoring deployment state...').start();
      try {
        results.deployment = await restoreDeployment(path.join(options.input, 'deployment.json'));
        deploySpinner.succeed(chalk.green('Deployment state restored'));
      } catch (error) {
        deploySpinner.fail(chalk.red('Deployment restore failed'));
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Summary
    console.log(chalk.green.bold('\n✅ Restore completed!\n'));
    
    // Show next steps
    console.log(chalk.blue('Next steps:'));
    console.log(chalk.gray('  1. Verify database integrity: npm run cli status --verbose'));
    console.log(chalk.gray('  2. Test API endpoints: curl https://your-app.vercel.app/api/health'));
    console.log(chalk.gray('  3. Redeploy if needed: npm run deploy\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Restore failed:'), error.message);
    console.error(chalk.gray(error.stack));
    process.exit(1);
  }
}

async function showBackupList() {
  console.log(chalk.blue('Available backups:\n'));
  
  const backups = await listBackups();
  
  if (backups.length === 0) {
    console.log(chalk.gray('  No backups found.\n'));
    return;
  }

  backups.forEach((backup, index) => {
    console.log(chalk.white(`  ${index + 1}. ${backup.name}`));
    console.log(chalk.gray(`     Date: ${backup.date}`));
    console.log(chalk.gray(`     Size: ${backup.size}`));
    console.log(chalk.gray(`     Path: ${backup.path}`));
    console.log();
  });
}

module.exports = restoreCommand;
