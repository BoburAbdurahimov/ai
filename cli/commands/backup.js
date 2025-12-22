/**
 * Backup Command - Create backup of project state
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { backupDatabase } = require('../modules/database');
const { backupConfig } = require('../modules/config');
const { backupDeployment } = require('../modules/deployment');
const { createBackupArchive } = require('../modules/backup-manager');

async function backupCommand(options) {
  console.log(chalk.blue.bold('\n💾 Rovo Dev CLI - Backup\n'));

  try {
    // Create output directory
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                     new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
    const backupDir = path.join(options.output, `backup_${timestamp}`);
    
    const spinner = ora('Creating backup directory...').start();
    await fs.mkdir(backupDir, { recursive: true });
    spinner.succeed(chalk.green('Backup directory created'));

    const results = {
      database: null,
      config: null,
      deployment: null
    };

    // Backup database
    if (!options.configOnly) {
      const dbSpinner = ora('Backing up database...').start();
      try {
        results.database = await backupDatabase(path.join(backupDir, 'database.json'));
        dbSpinner.succeed(chalk.green(`Database backed up (${results.database.tables} tables, ${results.database.records} records)`));
      } catch (error) {
        dbSpinner.fail(chalk.red('Database backup failed'));
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Backup configuration
    if (!options.dbOnly) {
      const configSpinner = ora('Backing up configuration...').start();
      try {
        results.config = await backupConfig(path.join(backupDir, 'config.json'));
        configSpinner.succeed(chalk.green(`Configuration backed up (${results.config.files} files)`));
      } catch (error) {
        configSpinner.fail(chalk.red('Configuration backup failed'));
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Backup deployment state
    if (!options.dbOnly && !options.configOnly) {
      const deploySpinner = ora('Backing up deployment state...').start();
      try {
        results.deployment = await backupDeployment(path.join(backupDir, 'deployment.json'));
        deploySpinner.succeed(chalk.green('Deployment state backed up'));
      } catch (error) {
        deploySpinner.fail(chalk.red('Deployment backup failed'));
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Create metadata file
    const metadata = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      components: [],
      results
    };

    if (results.database) metadata.components.push('database');
    if (results.config) metadata.components.push('config');
    if (results.deployment) metadata.components.push('deployment');

    await fs.writeFile(
      path.join(backupDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Compress if requested
    if (options.compress) {
      const compressSpinner = ora('Compressing backup...').start();
      try {
        const archivePath = await createBackupArchive(backupDir);
        compressSpinner.succeed(chalk.green(`Backup compressed: ${archivePath}`));
      } catch (error) {
        compressSpinner.fail(chalk.red('Compression failed'));
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Summary
    console.log(chalk.green.bold('\n✅ Backup completed!\n'));
    console.log(chalk.gray(`Backup location: ${backupDir}\n`));
    
    console.log(chalk.blue('To restore from this backup:'));
    console.log(chalk.gray(`  rovodev restore --input ${backupDir}\n`));

  } catch (error) {
    console.error(chalk.red('\n❌ Backup failed:'), error.message);
    console.error(chalk.gray(error.stack));
    process.exit(1);
  }
}

module.exports = backupCommand;
